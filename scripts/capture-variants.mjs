import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function captureMobile(pageClient, url, outputPath, options = {}) {
  const { theme = 'dark' } = options;
  console.log(`[Mobile] Navigating to ${url} (theme: ${theme})...`);
  await pageClient.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }]
  });
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await pageClient.send('Page.navigate', { url });

  // Wait up to 15s for React hydration and content rendering
  for (let i = 0; i < 30; i++) {
    const res = await pageClient.send('Runtime.evaluate', {
      expression: `
        (function() {
          const body = document.body;
          if (!body) return false;
          const text = body.innerText || '';
          const hasCard = !!document.querySelector('[class*="rounded-hero"], section.bg-card, form');
          const hasContent = text.includes('Overview') || text.includes('Sign') || text.includes('Log') || text.includes('Password') || text.includes('Internet');
          return hasCard && hasContent;
        })()
      `,
      returnByValue: true
    });
    if (res && res.result && res.result.value) {
      await sleep(1000);
      break;
    }
    await sleep(500);
  }

  await pageClient.send('Runtime.evaluate', {
    expression: `
      (function() {
        if ('${theme}' === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      })()
    `
  });
  await sleep(500);

  const result = await pageClient.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });

  const buffer = Buffer.from(result.data, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[Mobile] Saved: ${outputPath} (${buffer.length} bytes)`);
}

async function captureClip(pageClient, url, selector, outputPath, options = {}) {
  const { theme = 'dark', padding = 20 } = options;
  console.log(`[Clip] Navigating to ${url} (theme: ${theme})...`);
  await pageClient.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }]
  });
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
    mobile: false
  });
  await pageClient.send('Page.navigate', { url });

  // Wait up to 15s for element to exist and content to render
  let found = false;
  for (let i = 0; i < 30; i++) {
    const res = await pageClient.send('Runtime.evaluate', {
      expression: `
        (function() {
          const body = document.body;
          if (!body) return false;
          const text = body.innerText || '';
          const hasCard = !!document.querySelector('${selector}');
          const hasContent = text.includes('Overview') || text.includes('Sign') || text.includes('Log') || text.includes('Password') || text.includes('Internet');
          return hasCard && hasContent;
        })()
      `,
      returnByValue: true
    });
    if (res && res.result && res.result.value) {
      found = true;
      await sleep(1000);
      break;
    }
    await sleep(500);
  }

  if (!found) {
    console.error(`Selector ${selector} not found for ${url} after 15s wait!`);
    return;
  }

  await pageClient.send('Runtime.evaluate', {
    expression: `
      (function() {
        if ('${theme}' === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      })()
    `
  });
  await sleep(500);

  // Get bounding box of the element with padding
  const boxEval = await pageClient.send('Runtime.evaluate', {
    expression: `
      (function() {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.max(0, rect.x - ${padding}),
          y: Math.max(0, rect.y - ${padding}),
          width: rect.width + (${padding} * 2),
          height: rect.height + (${padding} * 2)
        };
      })()
    `,
    returnByValue: true
  });

  const box = boxEval.result.value;
  if (!box) {
    console.error(`Selector ${selector} not found for ${url}!`);
    return;
  }

  const result = await pageClient.send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      scale: 1
    }
  });

  const buffer = Buffer.from(result.data, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[Clip] Saved: ${outputPath} (${buffer.length} bytes, box: ${Math.round(box.width)}x${Math.round(box.height)})`);
}

async function main() {
  const outDir = path.resolve('public', 'screenshots');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--ignore-certificate-errors',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  try {
    let version = null;
    for (let i = 0; i < 20; i++) {
      try {
        version = await getJson('http://127.0.0.1:9222/json/version');
        if (version) break;
      } catch (e) {
        await sleep(200);
      }
    }

    const client = new CDPClient(version.webSocketDebuggerUrl);
    await client.connect();

    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const targetWsUrl = `ws://127.0.0.1:9222/devtools/page/${targetId}`;
    const pageClient = new CDPClient(targetWsUrl);
    await pageClient.connect();

    await pageClient.send('Page.enable');
    await pageClient.send('Runtime.enable');

    // Selector targeting the primary card container (section on overview, div on login)
    const cardSelector = '[class*="rounded-hero"], section.bg-card, div.bg-card, main > :first-child';

    // 1. Mobile captures (dark + light)
    await captureMobile(pageClient, 'https://192.168.224.1/', path.join(outDir, 'rm551e-overview-mobile.png'), { theme: 'dark' });
    await captureMobile(pageClient, 'https://192.168.224.1/', path.join(outDir, 'rm551e-overview-mobile-light.png'), { theme: 'light' });
    await captureMobile(pageClient, 'https://192.168.225.1/', path.join(outDir, 'rm520n-overview-mobile.png'), { theme: 'dark' });
    await captureMobile(pageClient, 'https://192.168.225.1/', path.join(outDir, 'rm520n-overview-mobile-light.png'), { theme: 'light' });

    // 2. Focused card crops (dark mode - standard)
    await captureClip(pageClient, 'https://192.168.224.1/', cardSelector, path.join(outDir, 'rm551e-overview-card.png'), { theme: 'dark' });
    await captureClip(pageClient, 'https://192.168.225.1/', cardSelector, path.join(outDir, 'rm520n-overview-card.png'), { theme: 'dark' });
    await captureClip(pageClient, 'https://192.168.224.1/login/', cardSelector, path.join(outDir, 'rm551e-login-card.png'), { theme: 'dark' });
    await captureClip(pageClient, 'https://192.168.225.1/login/', cardSelector, path.join(outDir, 'rm520n-login-card.png'), { theme: 'dark' });

    // 3. Focused card crops (light mode - for print & light docs)
    await captureClip(pageClient, 'https://192.168.224.1/', cardSelector, path.join(outDir, 'rm551e-overview-card-light.png'), { theme: 'light' });
    await captureClip(pageClient, 'https://192.168.225.1/', cardSelector, path.join(outDir, 'rm520n-overview-card-light.png'), { theme: 'light' });
    await captureClip(pageClient, 'https://192.168.224.1/login/', cardSelector, path.join(outDir, 'rm551e-login-card-light.png'), { theme: 'light' });
    await captureClip(pageClient, 'https://192.168.225.1/login/', cardSelector, path.join(outDir, 'rm520n-login-card-light.png'), { theme: 'light' });

    pageClient.close();
    client.close();
    console.log('Mobile & card captures finished successfully.');
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
