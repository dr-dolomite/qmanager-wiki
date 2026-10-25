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

async function captureTarget(pageClient, url, outputPath, options = {}) {
  const { theme = 'dark', delay = 4000, deviceScaleFactor = 2 } = options;
  console.log(`[Capture] Navigating to ${url} (theme: ${theme})...`);

  // Emulate media features (dark / light mode)
  await pageClient.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }]
  });

  // Emulate device metrics (1920x1080, 2x retina)
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor,
    mobile: false
  });

  await pageClient.send('Page.navigate', { url });

  // Wait up to 15s for React hydration and content rendering
  for (let i = 0; i < 30; i++) {
    const check = await pageClient.send('Runtime.evaluate', {
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
    if (check && check.result && check.result.value) {
      await sleep(1000); // Allow gauge animations and DOM settling
      break;
    }
    await sleep(500);
  }

  // Toggle theme button if DOM theme needs matching, and blur any focused inputs
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

  // Take screenshot
  const result = await pageClient.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });

  const buffer = Buffer.from(result.data, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[Capture] Saved: ${outputPath} (${buffer.length} bytes)`);
}

async function main() {
  const outDir = path.resolve('public', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

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
    await pageClient.send('DOM.enable');

    const tasks = [
      // RM551E-GL (192.168.224.1)
      {
        url: 'https://192.168.224.1/',
        file: 'rm551e-overview-dark.png',
        theme: 'dark'
      },
      {
        url: 'https://192.168.224.1/',
        file: 'rm551e-overview-light.png',
        theme: 'light'
      },
      {
        url: 'https://192.168.224.1/login/',
        file: 'rm551e-login-dark.png',
        theme: 'dark'
      },
      {
        url: 'https://192.168.224.1/login/',
        file: 'rm551e-login-light.png',
        theme: 'light'
      },
      // RM520N (192.168.225.1)
      {
        url: 'https://192.168.225.1/',
        file: 'rm520n-overview-dark.png',
        theme: 'dark'
      },
      {
        url: 'https://192.168.225.1/',
        file: 'rm520n-overview-light.png',
        theme: 'light'
      },
      {
        url: 'https://192.168.225.1/login/',
        file: 'rm520n-login-dark.png',
        theme: 'dark'
      },
      {
        url: 'https://192.168.225.1/login/',
        file: 'rm520n-login-light.png',
        theme: 'light'
      }
    ];

    for (const task of tasks) {
      const dest = path.join(outDir, task.file);
      await captureTarget(pageClient, task.url, dest, { theme: task.theme });
    }

    pageClient.close();
    client.close();
    console.log('All screenshots captured successfully.');
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
