export interface DocArticle {
  slug: string;
  category: string;
  title: string;
  description: string;
  edition: "universal" | "openwrt" | "rm520n";
  badge?: string;
  readTime: string;
  updatedAt: string;
  toc: { id: string; title: string; level: number }[];
  content: string;
}

export interface DocCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  articles: DocArticle[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started & Installation",
    iconName: "Rocket",
    description: "Hardware compatibility, prerequisites, and automated one-line setup for OpenWRT and Qualcomm X5*/X6* modems (RM520N, RG501).",
    articles: [
      {
        slug: "introduction",
        category: "getting-started",
        title: "Introduction & Architecture Overview",
        description: "What is QManager? A modern, custom web GUI and control suite for Quectel cellular modems.",
        edition: "universal",
        badge: "Overview",
        readTime: "4 min read",
        updatedAt: "2026-10-23",
        toc: [
          { id: "what-is-qmanager", title: "What is QManager?", level: 2 },
          { id: "the-two-flavors", title: "The Two Hardware Architectures: RM551E vs RM520N & X5*/X6*", level: 2 },
          { id: "core-capabilities", title: "Core Capabilities", level: 2 },
          { id: "design-philosophy", title: "Design Philosophy: Colour on the Data", level: 2 },
          { id: "community-heritage-acknowledgments", title: "Community Heritage & Acknowledgments", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 },
          { id: "next-steps", title: "Next Steps", level: 2 }
        ],
        content: `
# Introduction & Architecture Overview

**QManager** is an instrument-grade, custom web GUI and management suite built specifically for Qualcomm Snapdragon-based Quectel cellular modems (such as the RM551E-GL, RM520N-GL, RM521F, RG501, RM502, and RM500Q-GL). Rebuilt from the ground up as the modern successor to SimpleAdmin, it provides deep cellular diagnostic capabilities, automated watchdog recovery, carrier configuration, and high-frequency live telemetry directly on the device.

---

## What is QManager?

Unlike traditional generic router interfaces that treat cellular modems as black-box USB modems, QManager communicates directly with Quectel's cellular baseband firmware via high-speed serialized AT command channels, QMI multiplexing, and direct kernel sysfs hooks.

It gives network engineers, home lab enthusiasts, and field technicians the exact same level of insight and control normally reserved for proprietary diagnostic software like Qualcomm QXDM or Quectel QNavigator—accessible from any browser without installing desktop software.

> [!NOTE]
> QManager is light by design. It runs on the modem itself, so there is nothing to install on your computer, and it uses very little memory or processing power.
>
> Under the hood, the interface is a set of pre-built web pages served by the modem's small built-in web server (\`uhttpd\` on the RM551E, \`lighttpd\` on the RM520N-GL). Settings changes are handled by simple shell scripts.

---

## The Two Hardware Architectures: RM551E vs RM520N & X5*/X6*

QManager is engineered across two primary hardware architectures to match the modem generation:

- **RM551E Series (Snapdragon X75)**: The Quectel RM551E runs a dedicated on-board custom OpenWRT baseband environment. It executes shell CGI scripts and serves its web GUI via \`uhttpd\` directly inside the modem.
- **RM520N & Qualcomm X5&#42;/X6&#42; Lineup (Snapdragon X62/X65 & X55)**: The \`QManager-RM520N\` build runs native on-modem Qualcomm Linux (Kernel 5.4 Poky/LE) using \`lighttpd\` and \`systemd\`. While named after the RM520N-GL reference platform, it is architecturally compatible with modern **Qualcomm Snapdragon X5&#42; or X6&#42; modems** running on-modem Linux. It has been battle-tested on the **RM520N-GL** reference platform and hardware-probed on the **RG501Q-EU**; feedback and testing from users on other models (such as RM521F, RM502, and RM500Q) are welcomed!
- **Qualcomm Snapdragon Ecosystem Rule**: Engineered for modern Qualcomm Snapdragon 5G modems (X75, X62/X65, X55). Older Qualcomm Snapdragon X20/X24 modems (such as EM120K and EM160R) are unvalidated and untested by the developer. Non-Qualcomm chipsets (ASR, Unisoc, MediaTek like RG500U, EC200, EG25) lack Qualcomm diagnostic hooks and are not supported.

| Feature / Aspect | RM551E Series (Custom OpenWRT) | RM520N Series (Native Linux) |
|---|---|---|
| **Baseband Processor** | Qualcomm Snapdragon X75 | Qualcomm Snapdragon X62 / X65 (SDXLEMUR) |
| **Execution Environment** | Custom On-Modem OpenWRT | On-Modem Poky Linux (ARMv7l SDXLEMUR, Kernel 5.4) |
| **Physical Setup** | Standalone modem in an M.2-to-Ethernet board, plugged into any router's WAN port | Standalone modem in an RGMII/Ethernet breakout board, plugged into any router's WAN port |
| **HTTP Web Server** | Embedded \`uhttpd\` | Entware \`lighttpd\` running on modem |
| **Process Supervision** | \`procd\` services | \`systemd\` unit files |
| **Network Control** | OpenWRT \`uci\` and \`netifd\` | Direct \`sysfs\`, \`iproute2\`, and \`iptables\` mangling |
| **Primary Repository** | \`dr-dolomite/QManager\` | \`dr-dolomite/QManager-RM520N\` |

### The Same App on Both Modems

![QManager RM551E dashboard](/screenshots/features/rm551e-dashboard-light.webp "RM551E on custom OpenWRT, at 192.168.224.1.")
![QManager RM520N dashboard](/screenshots/features/rm520n-dashboard-light.webp "RM520N-GL on native Linux, at 192.168.225.1.")

---

## Core Capabilities

- **Real-Time 4x4 MIMO Signal Diagnostics**: View live RSRP, RSRQ, SINR, and RSSI per antenna port with 30-minute historical telemetry graphs.
- **Precision Band & Tower Locking**: Lock your connection to specific LTE or 5G NR frequency bands, or lock directly to a physical cell tower (PCI / EARFCN / ARFCN) with automated safety unlocking.
- **4-Tier Watchdog Resilience**: Multi-stage auto-recovery pipeline: network interface reset (\`ifup\`) → radio toggle (\`CFUN=0/1\`) → dual SIM failover → full system reboot with token-bucket rate limiting.
- **Network Mangling & Bypassing**: Built-in IPv4 TTL and IPv6 Hop Limit mangling (\`iptables\` / \`nftables\`) to bypass carrier mobile hotspot throttling.
- **Carrier Aggregation (CA) Breakdown**: Real-time display of Primary Carrier (PCC) and Secondary Component Carriers (SCC1–SCC3) with aggregated downlink/uplink channel bandwidth.
- **Embedded AT Terminal**: Safe, serialized interactive AT command console with history and auto-complete.
- **Integrated VPN & Remote Access**: One-click setup for Tailscale and Netbird mesh VPNs to monitor your modem remotely behind CGNAT without public IPs.

---

## Design Philosophy: Colour on the Data

QManager follows a strict **instrument console** aesthetic:
- **Colour belongs to data, not furniture**: The interface utilizes an ultra-deep navy ground (\`oklch(0.120 0.008 258)\`), dark slate cards (\`oklch(0.170 0.009 258)\`), and sharp blue accents (\`oklch(0.605 0.200 262)\`).
- **Hue carries semantic meaning**: Blue signifies NR/5G and user action; Violet represents 4G LTE; Rose denotes downlink; Cyan denotes uplink; and explicit Green/Yellow/Red scales represent signal quality.
- **Zero bloat**: No heavy client frameworks or large external dependencies on the modem.

---

## Community Heritage & Acknowledgments

QManager stands on the shoulders of dedicated researchers and engineers in the open-source cellular modem community. We gratefully acknowledge their foundational tooling, reverse engineering, and documentation:

- **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))**: Creator of the [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki), [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit), and [QuecDeploy](https://github.com/iamromulan/quecdeploy). Cameron's reverse engineering of Quectel RGMII setups, Multi-PDP context routing (\`AT+QMAP="mpdn_rule"\`), Qflash/EDL test-point unbricking procedures, Realtek RTL8125 PCIe stability patches, and T-Mobile CA EFS combos established the modern open-source standard for standalone Quectel deployments.
- **Nate Carlson**: Author of early RGMII documentation, carrier board pinout mapping, and foundational AT terminal bridging techniques over virtual PTYs (\`socat-at-bridge\`).
- **aesthernr**: Created the first version of **SimpleAdmin**, building a UI on top of Nate Carlson's work. It targeted the RM520N primarily.
- **rbflurry**: Applied the first patches that made SimpleAdmin usable. That work became the base for the fork that was developed into **SimpleAdmin 2**, released as part of Cameron's toolkit and the version most people know, whose architecture inspired QManager's clean-slate redesign.
- **WuTang Clan**: Early testers and supporters of this project.
- **carp4**: Reverse engineer responsible for solving the mathematical challenge/response algorithm behind Quectel's \`AT+QADBKEY?\` challenge, creating the open-source \`qadbkey-unlock\` utility.

---

## Screens in QManager

![QManager RM551E Support screen](/screenshots/features/rm551e-support-light.webp "RM551E: Report a bug, ask the community or support the project.")

![QManager RM520N Support screen](/screenshots/features/rm520n-support-light.webp "RM520N: Support links to bug reports, the community, and ways to support the project.")

## Next Steps

1. Check [Hardware Compatibility](/docs/getting-started/hardware-compatibility/) to verify your modem chipset and standalone Ethernet board, then plug it into any router's WAN port.
2. Put the modem in standalone Ethernet mode by following [Preparing the Modem: Standalone Ethernet (PHY) Mode](/docs/getting-started/modem-ethernet-mode/).
3. Follow the [RM551E Series Installation](/docs/getting-started/installation-openwrt/) or [RM520N & Qualcomm X5*/X6* Installation](/docs/getting-started/installation-rm520n/) guide to deploy QManager in under 2 minutes.
4. Learn how to configure your APN and optimize signal reception in [Signal & Cellular Operations](/docs/cellular/live-signal/).
`
      },
      {
        slug: "hardware-compatibility",
        category: "getting-started",
        title: "Supported Hardware & Modems",
        description: "Comprehensive compatibility list for Quectel 5G/LTE modules, chipsets, and standalone 5G-to-Ethernet boards that work with any router's WAN port.",
        edition: "universal",
        badge: "Hardware",
        readTime: "5 min read",
        updatedAt: "2026-10-20",
        toc: [
          { id: "supported-quectel-modems", title: "Supported Quectel Modems", level: 2 },
          { id: "modem-editions-comparison", title: "Firmware & Architecture Details", level: 2 },
          { id: "router-pairing-ethernet-boards", title: "Router Compatibility & Standalone Ethernet Boards", level: 2 },
          { id: "specialty-hardware-cross-flashing", title: "Specialty Modems & Cross-Flashing (FM190W, RM550V, RM521F)", level: 2 },
          { id: "rtl8125-stability-fixes", title: "Realtek RTL8125 PHY Stability Fixes (EEE & ASPM)", level: 2 },
          { id: "minimum-system-requirements", title: "Minimum System Requirements", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Supported Hardware & Modems

QManager is designed to communicate with Quectel IoT cellular modules over standard AT and QMI interfaces. Below is the hardware validation matrix.

![QManager RM551E About device screen](/screenshots/features/rm551e-about-device-light.webp "RM551E: Modem model, firmware, 3GPP release and every address the device uses.")

---

## Supported Quectel Modems

> [!NOTE]
> **Qualcomm Snapdragon Ecosystem Requirement & Hardware Validation Tiers**:
> QManager is engineered for Qualcomm Snapdragon 5G-era Quectel modems across the **X75** (RM551E), **X62/X65** (RM520N, RM521F), and **X55** (RG501, RM502, RM500Q) generations.
> 
> **Validation Tiers & Support Classification:**
> - **Official Reference Platforms**: Quectel **RM551E-GL** (Custom On-Modem OpenWRT) and **RM520N-GL** (Native Linux / SDXLEMUR). These are the developer's primary hardware testbeds where all releases and features are verified.
> - **Hardware-Probed Community Hardware**: Quectel **RG501Q-EU** (Snapdragon X55 / SDXPRAIRIE), probed and validated on real silicon (Kernel 4.14, Entware bootstrap tested).
> - **Community Experimental / Architectural Parity**: Modems sharing SDX6X and SDX55 architecture (**RM521F-GL**, **RM502Q-AE**, **RM500Q-GL**, **RG520N**). They share baseband and Poky Linux architectural parity, but are **untested by the core developer**. Community feedback and bug reports are warmly welcomed!
> - **Untested / Unvalidated**: Older Qualcomm Snapdragon X20/X24 modems (**EM120K**, **EM160R**) have **never been tested or validated** by the developer or community—do not expect out-of-the-box support.
> - **Unsupported**: Non-Qualcomm modems (**ASR**, **Unisoc**, or **MediaTek** like RG500U, EC200, EG25) lack Qualcomm diagnostic baseband hooks and are strictly **not supported**.

| Modem Model | Qualcomm Chipset | Form Factor | 5G / LTE Specs | Validation Tier | Notes |
|---|---|---|---|---|---|
| **RM551E-GL** | Snapdragon X75 | M.2 Key-B | 5G Advanced Sub-6GHz (7.5 Gbps DL) | **Official Reference Platform** | Primary reference platform for on-board custom OpenWRT baseband environment. Next-gen X75 module. |
| **RM520N-GL** | Snapdragon X62 (SDXLEMUR) | M.2 Key-B | 5G Sub-6GHz (3.4 Gbps DL) / LTE Cat 19 | **Official Reference Platform** | Primary reference platform. Runs native Qualcomm SDXLEMUR Linux on the modem. In a standalone Ethernet board it plugs into any router's WAN port. |
| **RG501Q-EU** | Snapdragon X55 (SDXPRAIRIE) | LGA Package / Carrier Board | 5G Sub-6GHz (2.5 Gbps DL) / LTE Cat 20 | **Hardware-Probed Community** | Probed on real silicon (Kernel 4.14, Entware bootstrap tested, runs on-modem Linux at \`192.168.225.1\`). |
| **RM521F-GL** | Snapdragon X65 | M.2 Key-B | 5G Sub-6GHz & mmWave (7.5 Gbps DL) | **Community Experimental** | Shares SDX65 baseline architecture with RM520N; unverified by core developer. Community testing welcome. |
| **RM550V-GL** | Snapdragon X75 / SDXPINN | M.2 Key-B | 5G Sub-6GHz & mmWave | **Community Experimental** | AA vs AB revisions; sensitive to \`CFUN 7\` EFS traps. Community testing welcome. |
| **RG520N-EB / EU**| Snapdragon X62 | LGA Package | 5G Sub-6GHz / LTE Cat 19 | **Community Experimental** | LGA surface-mount variant of SDX62; shares architecture with RM520N; unverified by core developer. |
| **RM502Q-AE** | Snapdragon X55 | M.2 Key-B / LGA | 5G Sub-6GHz (2.5 Gbps DL) / LTE Cat 20 | **Community Experimental** | Shares SDX55 baseline; unverified by core developer. Community feedback welcome. |
| **RM500Q-GL / AE**| Snapdragon X55 (SDXPRAIRIE)| M.2 Key-B | 5G Sub-6GHz (2.5 Gbps DL) / LTE Cat 16 | **Community Experimental** | Proven 1st gen Qualcomm 5G module architecture; unverified by core developer. |
| **RG500Q Series** | Snapdragon X55 | LGA Package | 5G Sub-6GHz / LTE Cat 16 | **Community Experimental** | LGA edition of RM500Q; unverified by core developer. |
| **EM120K / EM160R**| Snapdragon X24 / X20 | M.2 Key-B | LTE-A Pro (Cat 12/16) | ⚠️ **Untested / Unvalidated** | Qualcomm LTE-only modules. Never tested by developer or community; compatibility is unknown and unverified. |
| **RG500U / EC200 / EG25** | Unisoc / ASR / MediaTek | Various | 5G / LTE | ❌ **Unsupported** | Non-Qualcomm baseband chipsets lack the required diagnostic AT/QMI interfaces and Qualcomm sysfs hooks. |

---

## Firmware & Architecture Details

### Quectel RM551E-GL (Snapdragon X75)
- **Baseband Chipset**: Qualcomm Snapdragon X75 / ARM baseband
- **Modem Operating System**: Custom on-board OpenWRT baseband environment
- **Web Server**: Embedded \`uhttpd\` running directly on the modem
- **Control Interface**: Standard OpenWRT \`uci\` and \`netifd\` integration
- **Deployment**: Installs on-modem via the one-line curl installer

### Quectel RM520N-GL & RM521F (Snapdragon X62/X65)
- **Architecture**: ARMv7l (Cortex-A7 @ 1.5 GHz)
- **Modem Operating System**: Linux 5.4.180 (vanilla Qualcomm Poky/LE build)
- **Flash / Storage**: 1 GB NAND Flash, \`/usrdata\` read-write partition (~350 MB free)
- **RAM**: 512 MB LPDDR4x
- **Network Interface**: Qualcomm rmnet / RGMII Ethernet phy

> [!TIP]
> The RM520N-GL can operate as an autonomous, self-contained gateway when placed in an RGMII Ethernet carrier board. QManager runs directly on the modem's internal processor, and the board's Ethernet port plugs into the WAN port of any router (GL.iNet, OpenWrt or otherwise).

---

## Router Compatibility & Standalone Ethernet Boards

### Works With Any Router That Has a WAN Port
A standalone 5G-to-Ethernet board presents the modem to the rest of your network as ordinary Ethernet. Plug the board's RJ45 port into the **WAN port** of your router and the router treats it like any other internet uplink. No router-side drivers, packages or firmware changes are needed, and QManager keeps running on the modem itself.

This works with:
- **GL.iNet routers**: Beryl AX, Spitz AX, Flint 2 and the rest of the lineup.
- **OpenWrt routers**: any OpenWrt device with an Ethernet WAN port, including multi-WAN and failover setups.
- **Firewalls & gateways**: OPNsense, pfSense, MikroTik and similar.
- **Any other router**: consumer, ISP and mesh routers that have a WAN port.

> [!NOTE]
> Installing QManager *onto* a router with a USB or M.2 modem attached (modem in TE mode) is not an officially supported setup. QManager is designed to run on the modem, so the supported route is a standalone Ethernet board connected to the router's WAN port.

### Supported Standalone Boards (RGMII / Ethernet Carrier Boards)
- **Rework.Network 5G2PHY**: Indoor aluminum desktop enclosure featuring the Realtek RTL8125BG 2.5 Gbps Ethernet PHY, 12V DC input, and SIM slot. Fully validated with QManager.
- **Rework 5G-RGM-O**: Outdoor IP67 weatherproof aluminum enclosure with integrated mast mount and passive PoE interface.
- **Waveshare RM520N-GL to RJ45 Board**: Features Realtek or Qualcomm Gigabit PHY with 12V DC input.
- **Mcuzone 5G to Gigabit Ethernet Box**: Compact aluminum enclosure with cooling fan and nano-SIM slot.
- **Custom PCIe-to-RGMII Adapter Boards**: Fully supported as long as RGMII pins are routed to the PHY.

> [!WARNING]
> **Power Delivery Standard: 24V Passive PoE vs Active 802.3af/at**:
> Industrial outdoor carrier boards such as the **Rework 5G-RGM-O** operate exclusively on **24V Passive PoE** (power over spare pairs 4,5+ and 7,8-). They do NOT support active IEEE 802.3af or 802.3at handshake negotiation. Plugging them directly into a standard 802.3af/at managed switch will result in no power delivery or power cycling. Always use a 24V passive PoE injector.

---

## Specialty Modems & Cross-Flashing (FM190W, RM550V, RM521F)

Upstream research by Cameron Thompson (Cellular Modem Wiki) documented several notable module quirks and advanced hardware cross-flashing techniques:

### Fibocom FM190W-GL to RM551E-GL ("RMFaux51") Cross-Flashing
The Fibocom FM190W-GL is architecturally identical to the Quectel RM551E-GL, sharing the same Qualcomm Snapdragon X75 baseband:
- **Procedure**: Enthusiasts can cross-flash Quectel RM551E-GL firmware onto the Fibocom FM190W-GL using **Qflash** in emergency mode.
- **Calibration Recovery**: Because partition layouts differ slightly, modem calibration must be backed up before flashing using QPST (\`.xqcn\` format) and restored post-flash to preserve cellular RF calibration and IMEI registration.
- **Result**: The converted "RMFaux51" module runs the custom on-board OpenWRT baseband environment and supports QManager natively!

### Quectel RM550V-GL (AA vs AB Revisions & CFUN 7 Trap)
- **Hardware Revisions**: The RM550V exists in two distinct hardware steppings: **AA** (early engineering revision) and **AB** (production stepping). Firmware binaries are strictly non-interchangeable.
- **The CFUN 7 Trap**: Issuing \`AT+CFUN=7\` (factory test mode) on an RM550V with mismatched EFS NVRAM profiles triggers an unrecoverable RF calibration lockout. QManager's terminal broker automatically flags and intercepts destructive CFUN commands on this module.

### Quectel RM521F-GL (Engineering Sample Lifecycle & IP Quirk)
- Many RM521F-GL modules in community circulation are early Engineering Samples (ES).
- Certain ES firmwares contain a bug where \`/data/mobileap_cfg.xml\` resets the internal gateway IP to \`192.168.1.1\` on every reboot, creating an IP conflict with upstream routers. QManager's on-modem bootstrap automatically patches \`mobileap_cfg.xml\` to force \`192.168.225.1\`.

---

## Realtek RTL8125 PHY Stability Fixes (EEE & ASPM)

Standalone carrier boards equipped with the **Realtek RTL8125 2.5GbE PHY** can experience intermittent link renegotiation flaps or high latency under burst loads due to aggressive power-saving states:

1. **Disabling Energy Efficient Ethernet (EEE / 802.3az)**:
   Energy Efficient Ethernet attempts to place the physical link into low-power idle during transmission gaps, which frequently desynchronizes the RTL8125 PHY.
   \`\`\`sh
   ethtool --set-eee eth0 eee off
   \`\`\`
   Or via modem AT configuration on supported firmwares:
   \`\`\`
   AT+QETH="eee",0
   \`\`\`
2. **Disabling PCIe ASPM & Autosleep (\`sdxpinn-patch 3.1\`)**:
   Upstream research discovered that Qualcomm's PCIe root complex autosleep policy inadvertently puts the PCIe controller into L1 sub-states during cellular idle. Applying the community \`sdxpinn-patch 3.1\` disables PCIe ASPM (\`pcie_aspm=off\` in kernel cmdline), guaranteeing continuous line-rate 2.5 Gbps stability.

---

## Minimum System Requirements

- **Disk Space**: 15 MB free space on \`/www\` (OpenWRT) or \`/usrdata\` (Native Linux)
- **Memory (RAM)**: 8 MB RAM overhead during active use
- **Shell**: \`/bin/sh\` (BusyBox ash or bash)
- **Dependencies (OpenWRT)**: \`curl\` (strictly curl-only, no \`wget\`/\`uclient-fetch\`), \`tar\`, \`jsonfilter\`
- **Dependencies (Native Linux)**: \`curl\` or \`wget\` (installer bootstraps Entware, \`lighttpd\`, and \`bash\`)
## Screens in QManager

![QManager RM520N About device screen](/screenshots/features/rm520n-about-device-light.webp "RM520N: About Device shows the modem's identity, firmware, and LAN and WAN addresses.")

`
      },
      {
        slug: "modem-ethernet-mode",
        category: "getting-started",
        title: "Preparing the Modem: Standalone Ethernet (PHY) Mode",
        description: "Switch the modem into standalone 5G-to-Ethernet mode with the right AT commands for X5*/X6* and RM551E modems before installing QManager.",
        edition: "universal",
        badge: "Required",
        readTime: "7 min read",
        updatedAt: "2026-10-25",
        toc: [
          { id: "why-standalone-mode", title: "Why Standalone Mode", level: 2 },
          { id: "where-this-fits-in-setup", title: "Where This Fits in Setup", level: 2 },
          { id: "x5x6-modems-rm520n-rm521f-rg501q-rm50xq", title: "X5*/X6* Modems (RM520N, RM521F, RG501Q, RM50xQ)", level: 2 },
          { id: "rm551e-snapdragon-x75-sdxpinn", title: "RM551E (Snapdragon X75 / SDXPINN)", level: 2 },
          { id: "set-the-apn-and-verify-the-connection", title: "Set the APN and Verify the Connection", level: 2 },
          { id: "optional-ip-passthrough", title: "Optional: IP Passthrough", level: 2 },
          { id: "reverting-to-router-driven-mode", title: "Reverting to Router-Driven Mode", level: 2 },
          { id: "credits-sources", title: "Credits & Sources", level: 2 }
        ],
        content: `
# Preparing the Modem: Standalone Ethernet (PHY) Mode

Before you install QManager, the modem has to run in **standalone Ethernet mode**. This guide explains why that matters, lists the AT commands for each modem family, and shows how to confirm the connection and switch back if needed.

---

## Why Standalone Mode

By default, a Quectel modem runs in a TE ("terminal equipment") mode. In this mode the modem is a peripheral attached to a host over USB (NDIS/QMI or MBIM) or PCIe, and the host is in charge. On a router, the router's drivers and ModemManager or QMI scripts dial the data call, keep it up, and re-dial it whenever it drops.

That host-driven arrangement is the fragile part. Router-side scripts and drivers vary by vendor and firmware, and a router reboot or a driver hiccup can take the data call down. Some users have found this setup unreliable.

\`\`\`diagram-modem-modes
Router-driven (default, TE mode): cell tower -> modem (USB QMI/MBIM or PCIe endpoint) -> router. The router needs modem drivers and dial scripts, and it dials, keeps alive and re-dials the data call. If the router reboots or a driver hiccups, the data call drops until the router dials again.
Standalone Ethernet (AP mode, required for QManager): cell tower -> modem (dials and keeps the data call up, runs its own DHCP server and QManager) -> PCIe Root Complex -> Ethernet PHY (RTL8125 on the M.2-to-Ethernet board) -> Ethernet cable -> router WAN port, which just asks for an IP. If the router reboots, the modem stays online.
\`\`\`

In standalone mode (AP initiator), the Linux system running on the modem itself dials and maintains the cellular connection. The modem runs its own DHCP server and exposes a plain Ethernet port through the board's PHY, such as an RTL8125. The router connects to that port like any other ISP uplink and requests an address. It needs no modem drivers, and the modem is already connected when the router starts up.

Cameron Thompson's Cellular Modem Wiki makes the same point: "the modem's onboard connection management often works better than the scripts many routers use."

Removing the router from connection management removes a whole variable, which is why standalone mode is more stable. It is also the only arrangement QManager supports, because QManager runs on the modem itself.

| Aspect | Router-driven (TE) | Standalone (AP) |
|---|---|---|
| Who dials the data call | The router, through its modem drivers and scripts | The modem, which keeps the connection up on its own |
| What the router needs | QMI or MBIM drivers plus dial and keep-alive scripts | A DHCP client on its WAN port. No modem drivers or scripts |
| What happens when the router reboots | The data call drops and has to be re-dialed | The modem stays connected |
| Where QManager runs | Not supported | On the modem itself |
| Modem modes | \`usbnet\` 0 or 2, \`pcie/mode\` 0 | \`usbnet\` 1, \`pcie/mode\` 1 |

---

## Where This Fits in Setup

Standalone mode is step 2 of the setup:

1. [Unlock ADB access](/docs/getting-started/installation-rm520n/#unlocking-adb-access) so you can reach the modem's shell later. The AT commands below only need a USB serial connection.
2. **Switch the modem to Ethernet mode** (this page).
3. Set your APN and verify the data call.
4. Mount the modem in the Ethernet board and plug the board into the router's WAN port.
5. Install QManager with the [RM551E guide](/docs/getting-started/installation-openwrt/) or the [X5&#42;/X6&#42; guide](/docs/getting-started/installation-rm520n/).

Send the AT commands with the modem connected to your computer over USB. You can use Quectel's QNavigator with "automatic initialization" unchecked, or any serial AT terminal.

> [!NOTE]
> The board needs its own power. USB alone is not enough, so plug in the extra power (DC or passive PoE) at the same time as USB. If you use PoE, it must be passive. Active 802.3af or 802.3at PoE does not work. The RM551E is only recognized over USB if it powers on from USB first, so connect USB and then add the extra power.

---

## X5&#42;/X6&#42; Modems (RM520N, RM521F, RG501Q, RM50xQ)

These commands apply to Snapdragon X5&#42;/X6&#42; modems, which use the SDXLEMUR (X62/X65) and SDXPRAIRIE (X55) platforms. Send them in order:

\`\`\`at
AT+QCFG="data_interface",0,0
AT+QETH="eth_driver","r8125",1
AT+QCFG="pcie/mode",1
AT+QCFG="usbnet",1
AT+CFUN=1,1
\`\`\`

| Command | What it does |
|---|---|
| \`AT+QCFG="data_interface",0,0\` | Keeps the host data and diagnostic interfaces on USB (\`0\` = USB, \`1\` = PCIe), so the PCIe bus is free to drive the Ethernet chip. |
| \`AT+QETH="eth_driver","r8125",1\` | Enables the driver for the RTL8125 2.5GbE chip on the board. X5&#42;/X6&#42; modems need the endpoint driver enabled after switching to RC mode. To see the current driver and the supported list, send \`AT+QETH="eth_driver"\`. |
| \`AT+QCFG="pcie/mode",1\` | Sets PCIe Root Complex (RC) mode. The modem becomes the PCIe host and drives the Ethernet chip as its endpoint. The default, \`0\`, is endpoint mode, where a host drives the modem. |
| \`AT+QCFG="usbnet",1\` | Sets USB ECM, an AP mode in which the modem manages its own connection. |
| \`AT+CFUN=1,1\` | Reboots the modem to apply the changes. |

The modem reboots after the last command. Wait for it to come back before you continue.

---

## RM551E (Snapdragon X75 / SDXPINN)

On the RM551E, send these three commands in order:

\`\`\`at
AT+QCFG="pcie/mode",1
AT+QCFG="usbnet",1
AT+CFUN=1,1
\`\`\`

This sequence is shorter than the X5&#42;/X6&#42; one. Cameron's SDXPINN guide uses only these three commands. There is no \`data_interface\` line and no \`AT+QETH="eth_driver"\` line, Cameron's [M.2 form factor notes](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/m.2_formfactor.md) list only the RM50x, RM52x and RM530 as needing the endpoint driver enabled after switching to RC mode.

> [!CAUTION]
> Do not copy the X5&#42;/X6&#42; block onto an RM551E. Do not copy USB VID/PID values between families either. See the [USB VID / PID warning](/docs/getting-started/installation-rm520n/#unlocking-adb-access) in the RM520N install guide.

---

## Set the APN and Verify the Connection

Set the APN for PDP context 1, then reboot the modem:

\`\`\`at
AT+CGDCONT=1,"IPV4V6","your-apn"
AT+CFUN=1,1
\`\`\`

Replace \`your-apn\` with your carrier's APN. After the modem comes back up, check the connection:

| Command | What to look for |
|---|---|
| \`AT+QSIMSTAT?\` | SIM detected. \`0,1\` means yes. |
| \`AT+QENG="servingcell"\` | \`NOCONN\` is normal. \`LIMSERV\` usually means the APN is wrong. |
| \`AT+QMAP="WWAN"\` | Connected when you see \`+QMAP: "WWAN",1,1,"IPV4","<address>"\`. The first \`1\` means connected with an IP address. The second \`1\` is the PDP context in use. |
| \`AT+CGDCONT?\` | The APN set for each PDP context. |
| \`AT+QCFG="pcie/mode"\` | Reports \`1\`. |
| \`AT+QCFG="usbnet"\` | Reports \`1\`. |

A default MBN profile can override your APN after a reboot, so check \`AT+CGDCONT?\` again after rebooting. The data call uses PDP context 1 by default.

---

## Optional: IP Passthrough

By default, the modem acts as a NAT router for IPv4. On X5&#42;/X6&#42; modems its LAN gateway is \`192.168.225.1\`. Under QManager on the RM551E it is \`192.168.224.1\`. Your router therefore receives a private address behind the modem, which is double NAT. IP passthrough hands the cellular address straight to the router and removes the second layer of NAT.

To enable passthrough on an X5&#42;/X6&#42; modem:

\`\`\`at
AT+QMAP="MPDN_rule",0,1,0,1,1,"FF:FF:FF:FF:FF:FF"
\`\`\`

The fields are:

- **Rule:** \`0\`
- **PDP context:** \`1\`
- **VLAN:** \`0\` (none)
- **IP passthrough mode:** \`1\` (Ethernet)
- **Auto-connect:** \`1\` (on)
- **MAC address:** \`"FF:FF:FF:FF:FF:FF"\` passes the IP to the last connected Ethernet device.

The modem's gateway stays reachable while passthrough is on.

To turn passthrough off:

\`\`\`at
AT+QMAP="MPDN_rule",0
AT+QMAPWAC=1
\`\`\`

Releasing the rule briefly shuts off the Ethernet port, which then comes back up. \`AT+QMAPWAC=1\` is only needed if the modem is not in ECM mode (\`usbnet\` 1). You can optionally reboot with \`AT+CFUN=1,1\` afterwards.

> [!CAUTION]
> **RM551E, December 2024 firmware:** Do not release the rule with \`AT+QMAP="mpdn_rule",0\` and then reboot. Releasing the rule alone will not bring PDP context 1 back, and a reboot after releasing it can stop the rule from being set again. Flashing fresh firmware appears to be the only fix once the modem is in that state.
>
> Instead, release the rule and set a new one right away: \`AT+QMAP="mpdn_rule",0\`, then \`AT+QMAP="mpdn_rule",0,1,0,0,1\`.

---

## Reverting to Router-Driven Mode

To return the modem to its default router-driven mode, send:

\`\`\`at
AT+QCFG="pcie/mode",0
AT+QCFG="usbnet",0
AT+CFUN=1,1
\`\`\`

QManager will not work in this mode.

---

## Credits & Sources

The commands and behaviour in this guide come from Cameron Thompson's [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki). The specific pages used are:

- [SDXLEMUR: M.2 to Ethernet](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/sdxlemur/sdxlemur_m.2_to_eth.md)
- [SDXPRAIRIE: M.2 to Ethernet](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/sdxprairie/sdxprairie_m.2_to_eth.md)
- [SDXPINN: M.2 to Ethernet](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/sdxpinn/sdxpinn_m.2_to_eth.md)
- [M.2 Form Factor Modes](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/m.2_formfactor.md)
- [SDXLEMUR Advanced Configuration](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/sdxlemur/sdxlemur_advanced.md)
- [Verizon Connection Notes](https://github.com/iamromulan/cellular-modem-wiki/blob/main/quectel/verizon_connection.md), the source of the RM551E rule caution
`
      },
      {
        slug: "installation-openwrt",
        category: "getting-started",
        title: "Installation on RM551E (Custom OpenWRT)",
        description: "Step-by-step setup guide for Quectel RM551E modems running dedicated custom on-modem OpenWRT.",
        edition: "openwrt",
        badge: "RM551E",
        readTime: "4 min read",
        updatedAt: "2026-10-25",
        toc: [
          { id: "prerequisites", title: "Prerequisites", level: 2 },
          { id: "switch-the-modem-to-ethernet-mode", title: "Switch the Modem to Ethernet Mode", level: 2 },
          { id: "one-line-install", title: "One-Line Automated Installation", level: 2 },
          { id: "release-channels", title: "Selecting Release Channels", level: 2 },
          { id: "post-install-verification", title: "Post-Installation Verification", level: 2 },
          { id: "uninstalling", title: "Uninstalling QManager", level: 2 }
        ],
        content: `
# Installation on RM551E (Custom OpenWRT)

This guide covers installing **QManager** on the **Quectel RM551E** series modem, which operates with a dedicated on-board custom OpenWRT baseband environment (unlike the RM520N which runs native Qualcomm SDXLEMUR Linux). Once installed, the modem can sit in a standalone 5G-to-Ethernet board and plug into the WAN port of any router.

---

## Prerequisites

1. An RM551E modem running on-board custom OpenWRT.
2. SSH access to your modem (\`ssh root@192.168.224.1\`).
3. An active internet connection (or see [Manual Offline Installation](/docs/getting-started/manual-installation/)).
4. \`curl\` installed (\`opkg update && opkg install curl\`). *Note: The installer strictly requires \`curl\` (tools like BusyBox \`wget\` or \`uclient-fetch\` are not supported).*

---

## Switch the Modem to Ethernet Mode

This step is required. Put the modem into standalone Ethernet mode before you install QManager. Send these commands over USB with an AT terminal, such as Quectel's QNavigator with "automatic initialization" unchecked:

\`\`\`at
AT+QCFG="pcie/mode",1
AT+QCFG="usbnet",1
AT+CFUN=1,1
\`\`\`

The modem reboots after the last command.

> [!CAUTION]
> The X5&#42;/X6&#42; commands are different. Do not use them on the RM551E.

For what this mode does and how to verify the connection, see [Preparing the Modem: Standalone Ethernet (PHY) Mode](/docs/getting-started/modem-ethernet-mode/).

---

## One-Line Automated Installation

Open your terminal or SSH client, connect to your RM551E modem, and execute:

\`\`\`sh
curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh
\`\`\`

### What the Installer Does Automatically
1. Queries the GitHub Releases API to identify the latest compatible release tarball.
2. Downloads \`qmanager.tar.gz\` and verifies its SHA-256 integrity hash.
3. Decompresses the frontend assets into \`/www/qmanager\` (or \`/www\` root if selected).
4. Installs CGI endpoints into \`/www/cgi-bin/quecmanager/\`.
5. Configures \`uhttpd\` web server to handle JSON API requests and static routing.
6. Sets up \`procd\` services for the connection watchdog and live signal background broker.

---

## Selecting Release Channels

By default, the installer grabs the newest available release. You can specify channel flags if desired:

### Install Latest Stable Release Only
\`\`\`sh
curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh -s -- --channel stable
\`\`\`

### Pin a Specific Version Tag (e.g. v0.1.35)
\`\`\`sh
curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh -s -- --tag v0.1.35
\`\`\`

---

## Post-Installation Verification

1. Open your web browser and navigate to:
   \`\`\`
   http://192.168.224.1
   \`\`\`
   *(Stock on-modem RM551E default IP address)*

2. If prompted, log in with your modem root credentials.
3. The dashboard will automatically probe the serial port (\`/dev/ttyUSB2\` or \`/dev/cdc-wdm0\`) and begin streaming real-time signal metrics!

> [!TIP]
> If your web browser returns a 404 or CGI error, ensure the web server was restarted:
> \`\`\`sh
> /etc/init.d/uhttpd restart
> \`\`\`

---

## Uninstalling QManager

To completely remove QManager and all associated services from your RM551E modem:

\`\`\`sh
curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh -s -- --uninstall
\`\`\`
`
      },
      {
        slug: "installation-rm520n",
        category: "getting-started",
        title: "Installation on Quectel RM520N & Qualcomm X5*/X6* (On-Modem Linux)",
        description: "Deploy QManager directly inside the RM520N-GL, RG501, or any Qualcomm Snapdragon X5* and X6* modem running internal Linux.",
        edition: "rm520n",
        badge: "RM520N & X5*/X6*",
        readTime: "5 min read",
        updatedAt: "2026-10-25",
        toc: [
          { id: "prerequisites-rm520n", title: "Prerequisites & Preparation", level: 2 },
          { id: "unlocking-adb-access", title: "Unlocking ADB & Root Shell Access (carp4 & Value 2 Bypass)", level: 2 },
          { id: "switch-the-modem-to-ethernet-mode", title: "Switch the Modem to Ethernet Mode", level: 2 },
          { id: "one-line-install-rm520n", title: "One-Line Automated Installation", level: 2 },
          { id: "entware-and-services", title: "Entware & Lighttpd Bootstrap", level: 2 },
          { id: "accessing-web-console", title: "Accessing the Web Console", level: 2 },
          { id: "troubleshooting-rm520n", title: "Troubleshooting & Reset", level: 2 }
        ],
        content: `
# Installation on Quectel RM520N & Qualcomm X5*/X6* (On-Modem Linux)

The **QManager-RM520N** edition transforms Qualcomm Snapdragon-based Quectel modems into standalone smart router appliances running entirely on the modem's internal ARM processor.

![QManager RM520N Web console screen](/screenshots/features/rm520n-web-console-light.webp "The Web Console opens a root shell on the modem in your browser.")

> [!TIP]
> **Broad Qualcomm X5&#42; and X6&#42; Compatibility**:
> While this repository is named \`QManager-RM520N\`, it is **not exclusive** to the RM520N. Qualcomm Snapdragon X5* or X6* modems running internal Poky Linux (such as RM520N-GL reference, RG501Q-EU probed, or RM521F/RM502Q community) can use this on-modem installer!
> It has been verified on the **RM520N-GL** reference platform and hardware-probed on the **RG501Q-EU**. Qualcomm X20/X24 modems are untested. If you run it on another Qualcomm model, community feedback and test results on GitHub are warmly welcomed!

---

## Prerequisites & Preparation

1. **Qualcomm Snapdragon X5&#42; or X6&#42; modem** (such as RM520N-GL reference, RG501Q-EU probed, or RM521F community) mounted on an RGMII Ethernet carrier board or USB enclosure with Ethernet.
2. Direct access to the modem's internal Linux shell via **ADB** (\`adb shell\`) or **SSH** (\`ssh root@192.168.225.1\`, or \`ssh root@192.168.224.1\` depending on board firmware).
3. An active cellular data connection on the modem so it can download packages from GitHub and Entware.

> [!NOTE]
> QManager is 100% independent. You do **not** need SimpleAdmin or the RGMII Toolkit installed beforehand. The installer handles bootstrapping Entware package manager, setting up \`lighttpd\`, creating system users, and provisioning systemd service units.

---

## Unlocking ADB & Root Shell Access (carp4 & Value 2 Bypass)

Many production Quectel firmwares ship with Android Debug Bridge (ADB) disabled or locked by a challenge-response authorization system. You must unlock ADB or enable SSH before installing QManager:

### Method 1: The Standard \`AT+QADBKEY\` Challenge (carp4 Algorithm)
1. Send the challenge query command via any serial AT terminal:
   \`\`\`
   AT+QADBKEY?
   \`\`\`
   The modem responds with a cryptographic challenge:
   \`\`\`
   +QADBKEY: 3482719582910485
   \`\`\`
2. Compute the authorization key using **carp4's open-source \`qadbkey-unlock\`** Python algorithm:
   \`\`\`bash
   python3 qadbkey.py 3482719582910485
   # Output: Generated Response Key: a8f9c1e0b2d3...
   \`\`\`
3. Submit the generated key back to the modem:
   \`\`\`
   AT+QADBKEY="a8f9c1e0b2d3..."
   \`\`\`
4. Once verified, the modem returns \`OK\`. ADB root shell is now permanently unlocked!

### Method 2: The Value \`2\` Backdoor Bypass (Beta / Engineering Builds)
On select Quectel beta and development firmware images, ADB can be unlocked directly by altering the USB composition without key calculation:
\`\`\`
AT+QCFG="usbcfg",0x2C7C,0x0801,1,1,1,1,1,2,0
\`\`\`
- Setting parameter 9 to value **\`2\`** forces ADB daemon enablement unconditionally.
- Reboot the module with \`AT+CFUN=1,1\` to apply.

> [!CAUTION]
> **Model-Specific USB VID / PID Trap**:
> - **RM520N / RM521F**: Use Quectel VID \`0x2C7C\` and PID **\`0x0801\`**.
> - **RM550V / RM551E**: Use Quectel VID \`0x2C7C\` and PID **\`0x0122\`**.
> 
> **Never copy PID \`0x0801\` onto an RM550V/RM551E** or PID \`0x0122\` onto an RM520N! Doing so alters the hardware USB descriptor, causing USB ports to disappear completely and requiring hardware EDL test-point recovery.

---

## Switch the Modem to Ethernet Mode

This step is required. Before you install QManager, put the modem into standalone Ethernet mode. Without it, the modem stays in its default router-driven mode, which QManager does not support.

Send these commands over USB with an AT terminal, such as Quectel's QNavigator with "automatic initialization" unchecked:

\`\`\`at
AT+QCFG="data_interface",0,0
AT+QETH="eth_driver","r8125",1
AT+QCFG="pcie/mode",1
AT+QCFG="usbnet",1
AT+CFUN=1,1
\`\`\`

The modem reboots after the last command. Once it is back up, set your APN and confirm the data call. The steps, what each command does, and how to verify the connection are in [Preparing the Modem: Standalone Ethernet (PHY) Mode](/docs/getting-started/modem-ethernet-mode/). That page also covers IP passthrough.

---

## One-Line Automated Installation

Access your modem's shell via SSH or ADB:

\`\`\`sh
adb shell
# Or: ssh root@192.168.225.1 (default) or ssh root@192.168.224.1
\`\`\`

Run the official one-line bootstrap installer (works with either \`curl\` or \`wget\`):

\`\`\`bash
curl -fsSL -o /tmp/qmanager-installer.sh \
  https://github.com/dr-dolomite/QManager-RM520N/raw/refs/heads/main/qmanager-installer.sh && \
  bash /tmp/qmanager-installer.sh
\`\`\`

### Alternatively, using \`wget\`:
\`\`\`bash
wget -O /tmp/qmanager-installer.sh \
  https://github.com/dr-dolomite/QManager-RM520N/raw/refs/heads/main/qmanager-installer.sh && \
  bash /tmp/qmanager-installer.sh
\`\`\`

---

## Entware & Lighttpd Bootstrap

During execution, the installer:
1. Detects whether **Entware** is present in \`/opt\`. If missing, it downloads and initializes the ARMv7l Entware package repository.
2. Installs lightweight dependencies: \`lighttpd\`, \`lighttpd-mod-cgi\`, \`lighttpd-mod-redirect\`, \`zoneinfo-core\`.
3. Unpacks QManager into \`/usrdata/qmanager/www\` on the persistent NAND partition (\`/usrdata\` read-write split).
4. Configures AT routing using \`qcmd\` linked to \`atcli_smd11\` (compiled Rust ARMv7 binary) communicating directly over \`/dev/smd11\`.
5. Stores application configuration in \`/etc/qmanager/\`.
6. Registers and activates systemd service units:
   - \`lighttpd.service\` (Web server serving statically-exported UI from \`/usrdata/qmanager/www\`)
   - \`qmanager-poller.service\` (Adaptive background AT telemetry poller daemon)
   - \`qmanager-watchcat.service\` (Network resilience and automated watchdog recovery)
   - \`qmanager-setup.service\` (Boot initialization and hardware profile self-healing)

---

## Accessing the Web Console

Once the script completes (typically 30–60 seconds), the console outputs:

\`\`\`
  * QManager successfully installed!
  * Access URL: http://192.168.225.1
\`\`\`

Open your browser and navigate to:
\`\`\`
http://192.168.225.1
\`\`\`
*(Stock RM520N-GL & RG501Q-EU default Ethernet gateway address; or \`http://192.168.224.1\` on certain carrier board firmware)*

---

## Troubleshooting & Reset

### Check Service Status
\`\`\`sh
systemctl status lighttpd
systemctl status qmanager-poller
systemctl status qmanager-watchcat
\`\`\`

### Inspect Application Logs
\`\`\`sh
# Poller daemon live telemetry logs
journalctl -u qmanager-poller -n 50 -f

# System setup and self-heal diagnostic log
cat /tmp/qmanager.log
\`\`\`

### Completely Uninstall QManager
\`\`\`bash
bash /tmp/qmanager_install/uninstall_rm520n.sh
\`\`\`
`
      },
      {
        slug: "manual-installation",
        category: "getting-started",
        title: "Manual Offline Tarball Installation",
        description: "How to deploy QManager in air-gapped or offline environments using pre-built release archives.",
        edition: "universal",
        badge: "Offline",
        readTime: "3 min read",
        updatedAt: "2026-10-20",
        toc: [
          { id: "when-to-use-manual", title: "When to Use Offline Install", level: 2 },
          { id: "downloading-release-bundle", title: "Downloading the Release Bundle", level: 2 },
          { id: "transferring-to-device", title: "Transferring to the Device (SCP/ADB)", level: 2 },
          { id: "manual-unpack-and-run", title: "Extracting and Running install.sh", level: 2 }
        ],
        content: `
# Manual Offline Tarball Installation

For field deployments without active WAN connectivity, air-gapped industrial routers, or offline testing, QManager provides standalone \`.tar.gz\` release bundles.

---

## When to Use Offline Install

- Brand new modem without APN provisioned (unable to access GitHub over cellular).
- Restricted industrial networks blocking GitHub raw content.
- Custom automated firmware builds and mass provisioning.

---

## Downloading the Release Bundle

From a computer with internet access, download the latest release tarball and SHA-256 checksum from GitHub:

- **For RM551E Series (Custom OpenWRT)**: [QManager Releases](https://github.com/dr-dolomite/QManager/releases)
- **For Qualcomm X5* & X6* Modems On-Modem (RM520N, RG501, RM521F, etc.)**: [QManager-RM520N Releases](https://github.com/dr-dolomite/QManager-RM520N/releases)

Files needed:
- \`qmanager-vX.Y.Z.tar.gz\`
- \`qmanager-vX.Y.Z.tar.gz.sha256\`

---

## Transferring to the Device (SCP/ADB)

### Over SCP (RM551E or Modem with SSH):
\`\`\`sh
# For RM551E (192.168.224.1):
scp qmanager-v0.1.35.tar.gz root@192.168.224.1:/tmp/

# For RM520N & SDX55/SDX6X modems (192.168.225.1):
scp qmanager-v0.1.35.tar.gz root@192.168.225.1:/tmp/
\`\`\`

### Over ADB (Qualcomm RM520N, RG501 & X5*/X6* Modems):
\`\`\`sh
adb push qmanager-v0.1.35.tar.gz /tmp/
\`\`\`

---

## Extracting and Running install.sh

SSH or ADB into the device:

\`\`\`sh
cd /tmp
# Verify SHA256 checksum
sha256sum qmanager-v0.1.35.tar.gz

# Extract bundle
mkdir -p /tmp/qmanager_install
tar -xzf qmanager-v0.1.35.tar.gz -C /tmp/qmanager_install
cd /tmp/qmanager_install

# Execute bundled installer
sh install.sh
\`\`\`

The bundled \`install.sh\` script automatically copies the frontend static files, installs backend shell CGI scripts, configures permissions, and sets up service autorun.
`
      },
      {
        slug: "upgrades-and-updates",
        category: "getting-started",
        title: "Upgrades & OTA Self-Updates",
        description: "Seamless over-the-air updates, channel switching, and rollback safeguards.",
        edition: "universal",
        badge: "Maintenance",
        readTime: "3 min read",
        updatedAt: "2026-10-20",
        toc: [
          { id: "in-app-ota-updates", title: "In-App OTA Updates", level: 2 },
          { id: "cli-upgrade", title: "Command Line Upgrades", level: 2 },
          { id: "rollback-safeguards", title: "Rollback Safeguards", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Upgrades & OTA Self-Updates

QManager features built-in Over-The-Air (OTA) update checking and one-click upgrades.

![QManager RM551E Software update screen](/screenshots/features/rm551e-software-update-light.webp "RM551E: Check for a new QManager release and install it on the modem.")

---

## In-App OTA Updates

1. In the QManager web interface, navigate to **Settings > System / About**.
2. Click **Check for Updates**.
3. If a newer release is published on GitHub, the release notes and version diff will appear.
4. Click **Install Update**. The system will download the archive, verify its signature, unpack new assets, and refresh the browser interface without dropping your cellular connection.

---

## Command Line Upgrades

To upgrade via terminal at any time, simply re-run the bootstrap installer. It will automatically detect your existing installation and upgrade in-place:

### On OpenWRT:
\`\`\`sh
curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh
\`\`\`

### On RM520N-GL:
\`\`\`bash
curl -fsSL -o /tmp/qmanager-installer.sh \
  https://github.com/dr-dolomite/QManager-RM520N/raw/refs/heads/main/qmanager-installer.sh && \
  bash /tmp/qmanager-installer.sh
\`\`\`

---

## Rollback Safeguards

Before replacing any system binaries or scripts, the installer automatically creates a backup of the previous version at:
- \`/usrdata/qmanager/backup_prev/\` (on RM520N)
- \`/www/qmanager.bak/\` (on OpenWRT)

If an update fails verification or encounters an extraction error, the script immediately rolls back the previous build so your modem never enters a broken state.
## Screens in QManager

![QManager RM551E Reboot countdown screen](/screenshots/features/rm551e-reboot-light.webp "RM551E: While the modem restarts, QManager counts down and reconnects on its own.")

![QManager RM520N Software update screen](/screenshots/features/rm520n-software-update-light.webp "RM520N: Software Update checks GitHub for a newer QManager release and installs it on the modem.")

`
      },
      {
        slug: "first-time-setup",
        category: "getting-started",
        title: "First-Time Setup & Network Access",
        description: "Default IP addresses, port configuration, authentication, and guided setup wizard.",
        edition: "universal",
        badge: "Config",
        readTime: "4 min read",
        updatedAt: "2026-10-20",
        toc: [
          { id: "default-access-addresses", title: "Default Access IP Addresses", level: 2 },
          { id: "initial-setup-wizard", title: "Initial Setup Wizard", level: 2 },
          { id: "authentication-security", title: "Authentication & Security", level: 2 },
          { id: "changing-web-port", title: "Changing Web Port (Avoid 80 Port Conflicts)", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# First-Time Setup & Network Access

Once QManager is installed, follow this quick guide to complete initial onboarding and secure your installation.

![QManager RM551E Sign-in page screen](/screenshots/features/rm551e-login-light.webp "RM551E: The sign-in screen you see when opening QManager in a browser.")

---

## Default Access IP Addresses

| Deployment Setup | Default IP | Protocol / Port | Default Login |
|---|---|---|---|
| **RM551E Series (Custom OpenWRT)** | \`http://192.168.224.1\` (or \`192.168.1.1/qmanager/\`) | HTTP :80 / HTTPS :443 | Uses modem / router \`root\` credentials |
| **RM520N-GL Standalone Linux** | \`http://192.168.225.1\` | HTTP :80 / HTTPS :443 | Default user: \`admin\` / \`admin\` |

---

## Initial Setup Wizard

On first launch, QManager runs a 3-step configuration wizard:
1. **APN Setup**: Select your cellular carrier preset (T-Mobile, AT&T, Verizon, Telkomsel, Vodafone, etc.) or enter custom APN credentials.
2. **TTL / Mangling**: Enable IPv4 TTL and IPv6 Hop Limit mangling (recommended: 64 or 65) if your plan requires hotspot bypass.
3. **Serial Device Detection**: Confirms successful handshake with modem control port (\`/dev/ttyUSB2\` or \`/dev/mhi_DUN\`).

---

## Authentication & Security

QManager employs cryptographically secured cookie sessions with HTTP-only flags and brute-force rate limiting:
- Sessions expire after 24 hours of inactivity.
- Failed attempts lock out after 5 tries for 3 minutes.
- To reset your password on RM520N-GL via terminal:
  \`\`\`sh
  /usr/lib/qmanager/reset-credentials.sh
  \`\`\`

---

## Changing Web Port (Avoid 80 Port Conflicts)

If you are running OpenWRT LuCI on port 80 and wish to run QManager on a dedicated secondary port (e.g. 8080):

Edit \`/etc/config/uhttpd\`:
\`\`\`sh
uci add uhttpd qmanager
uci set uhttpd.qmanager.listen_http='0.0.0.0:8080'
uci set uhttpd.qmanager.home='/www/qmanager'
uci commit uhttpd
/etc/init.d/uhttpd restart
\`\`\`
## Screens in QManager

![QManager RM551E Pre-login modem overview screen](/screenshots/features/rm551e-overview-splash-light.webp "RM551E: Before signing in, QManager shows a quick overview of connection, signal and temperature.")

![QManager RM520N Public overview splash screen](/screenshots/features/rm520n-overview-splash-light.webp "RM520N: Before you sign in, the overview page shows carrier, bands, and signal at a glance.")

![QManager RM551E First-time setup wizard screen](/screenshots/features/rm551e-setup-wizard-light.webp "RM551E: The first-time setup wizard walks you through password, network mode, APN, bands and web port.")

![QManager RM520N Setup wizard screen](/screenshots/features/rm520n-setup-wizard-light.webp "RM520N: The first-run wizard asks for a password and offers optional network settings.")

![QManager RM551E Device access screen](/screenshots/features/rm551e-device-access-light.webp "RM551E: Change the web and SSH passwords and the web interface ports.")

![QManager RM551E Languages screen](/screenshots/features/rm551e-languages-light.webp "RM551E: Choose the interface language and install community translation packs.")

![QManager RM520N Languages screen](/screenshots/features/rm520n-languages-light.webp "RM520N: Languages switches the interface language and installs community translation packs.")

![QManager RM520N Login screen](/screenshots/features/rm520n-login-light.webp "RM520N: Sign in to QManager with the password you set during setup.")

`
      },
      {
        slug: "flashing-firmware-edl",
        category: "getting-started",
        title: "Firmware Flashing, Qflash & EDL Test-Point Recovery",
        description: "Comprehensive guide to flashing Quectel modem firmware with Qflash, triggering software EDL mode, physical hardware test-point locations, and Qualcomm QDLoader 9008 unbricking.",
        edition: "universal",
        badge: "Flashing & EDL",
        readTime: "7 min read",
        updatedAt: "2026-10-24",
        toc: [
          { id: "firmware-flashing-overview", title: "Firmware Flashing Overview & Architecture", level: 2 },
          { id: "qflash-windows-workflow", title: "Windows Qflash Procedure & Zero-Space Path Rule", level: 2 },
          { id: "diagnostic-dm-port-setup", title: "Diagnostic DM Port Setup (460800 Baud)", level: 2 },
          { id: "software-edl-trigger", title: "Software EDL Mode Trigger via ADB & AT Commands", level: 2 },
          { id: "physical-edl-testpoints", title: "Physical EDL Test-Point Pinouts Across Modems", level: 2 },
          { id: "qualcomm-9008-recovery", title: "Qualcomm QDLoader 9008 Recovery & Unbricking", level: 2 },
          { id: "community-credits", title: "Upstream Research Credits", level: 2 }
        ],
        content: `
# Firmware Flashing, Qflash & EDL Test-Point Recovery

Upgrading or restoring Quectel cellular modem baseband firmware requires interacting with Qualcomm's partition flashing architecture. This guide details the standard upgrade path using **Qflash** under Windows and Linux, triggering **Emergency Download (EDL)** mode, locating physical hardware test-points when a module is hard-bricked, and reviving devices from Qualcomm **QDLoader 9008** mode.

> [!NOTE]
> **Research & Heritage**: This flashing and unbricking methodology was heavily researched, verified, and documented by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** on the [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki).

---

## Firmware Flashing Overview & Architecture

Quectel modem firmware releases are distributed as complete multi-partition image bundles. An extracted firmware archive typically contains:
- **Firehose Programmer** (\`prog_firehose_lite.elf\` or \`prog_firehose_sdxlemur.mbn\`): Qualcomm's low-level protocol loader executed directly in modem RAM.
- **Partition Table** (\`rawprogram_nand_p2K_b128K.xml\` or \`rawprogram0.xml\`): XML definition mapping memory offsets to NAND flash blocks.
- **Patch Definitions** (\`patch_nand_p2K_b128K.xml\` or \`patch0.xml\`): Post-flash partition patches and sector checksums.
- **Baseband & OS Binaries**: Kernel images (\`boot.img\`), system root filesystems (\`rootfs.img\`), modem DSP firmware (\`NON-HLOS.bin\` / \`modem.img\`), and Qualcomm secondary bootloaders (\`sbl1.mbn\`).

Firmware flashing can be performed non-destructively over Quectel's **DM (Diagnostic Monitoring)** serial port without wiping the modem's non-volatile NVRAM calibration or IMEI profiles, provided user-calibration partitions (\`xqcn\` / \`fs_image\`) are not forcefully formatted.

---

## Windows Qflash Procedure & Zero-Space Path Rule

**Qflash** is Quectel's official utility for flashing Qualcomm-based modules. Follow this exact workflow to ensure stable flashing:

### 1. The Critical "Zero-Space" Path Rule
> [!CAUTION]
> **Zero-Space Path Rule**: The Qflash executable AND the extracted firmware folder **MUST NOT** reside in any path containing spaces, non-ASCII characters, or long folder nesting!
> - ❌ \`C:\\Users\\John Doe\\Downloads\\Quectel RM520N FW\\...\` (Will cause silent buffer overflow or parsing termination)
> - ✅ \`C:\\Quectel\\Qflash\\...\` and \`C:\\Quectel\\RM520NGLAAR03A03M4G\\...\`

Failure to observe this rule causes Qflash to halt mid-transfer, potentially leaving the bootloader in an inconsistent state.

### 2. Flashing Workflow Step-by-Step
1. Connect the modem via a verified USB 3.0 or USB-C adapter directly to the host PC (avoid unpowered USB hubs).
2. Ensure Quectel LTE&5G Windows USB drivers are installed. Open **Device Manager** and expand **Ports (COM & LPT)**.
3. Identify the **Quectel USB DM Port** (e.g. \`COM12\`).
4. Launch \`Qflash.exe\` (run as Administrator).
5. In the **COM Port** dropdown, select the DM Port.
6. Set the **Baudrate** to \`460800\` (standard diagnostic channel speed).
7. Click **Load FW Files** and navigate to the firmware folder. Select either the partition XML (\`rawprogram0.xml\`) or the folder containing \`prog_firehose_*.elf\`.
8. Click **Start**. The progress bar will indicate erase, write, and verify stages across each partition.
9. Upon completion, Qflash displays \`PASS\`. The modem will automatically reboot into normal operational mode. Do not disconnect power until the modem enumerates in Device Manager!

---

## Diagnostic DM Port Setup (460800 Baud)

When communicating with the modem over USB, Quectel modules expose multiple virtual serial interfaces:
- **AT / Modem Port**: Accepts standard AT commands and initiates dialup PPP.
- **NMEA Port**: Streams GPS/GNSS satellite NMEA-0183 sentences.
- **DM Port (Diagnostic Monitoring)**: High-speed binary diagnostics and Qualcomm firehose protocol channel.

If the DM port does not enumerate or communication times out:
1. Verify baud rate is explicitly locked to **460800 baud** in your terminal or flashing tool.
2. Verify USB composition with \`AT+QCFG="usbnet"\` and ensure diagnostic endpoints are active.
3. On Linux hosts, the DM port maps to \`/dev/ttyUSB0\` or \`/dev/ttyUSB1\` managed by the kernel \`qcserial\` or \`option\` driver.

---

## Software EDL Mode Trigger via ADB & AT Commands

If a firmware upgrade is interrupted or you need to flash a low-level baseband partition, the modem must be placed into **Emergency Download (EDL)** mode. Before resorting to hardware jumpers, attempt software triggers:

### Method A: ADB Software Reboot
If ADB access is active on the modem (see [RM520N Installation](/docs/getting-started/installation-rm520n/)):
\`\`\`bash
adb reboot edl
\`\`\`
The modem immediately disconnects from USB and re-enumerates as **Qualcomm HS-USB QDLoader 9008**.

### Method B: Serial AT Command Trigger
On supported firmware revisions:
\`\`\`
AT+QCFG="edl",1
\`\`\`
or for fastboot:
\`\`\`
AT+QFASTBOOT
\`\`\`

---

## Physical EDL Test-Point Pinouts Across Modems

When a module experiences a hard bootloop, corrupted primary bootloader (PBL/SBL), or damaged partition table, it will fail to enumerate normal serial ports. Under this condition, you must force Qualcomm's internal boot ROM (BROM) into EDL mode by **grounding the physical hardware test point during power-on**.

| Modem Generation | Target Chipset | Physical EDL Test-Point Location | Pinout Alternative |
|---|---|---|---|
| **RM500Q / RM502Q** | Snapdragon X55 (SDXPRAIRIE) | Gold test pad **TP1** adjacent to top RF shielding cover | M.2 Pin 7 (\`USB_BOOT\`) shorted to Ground |
| **RM520N / RM521F** | Snapdragon X62 / X65 (SDXLEMUR) | Circular gold pad on underside PCB near M.2 gold fingers | M.2 Pin 7 (\`USB_BOOT\`) shorted to Pin 3/5 (GND) |
| **RM550V / RM551E** | Snapdragon X75 / SDXPINN | Gold test point pad labeled **EDL** on lower edge of PCB | M.2 Pin 7 (\`USB_BOOT\`) shorted to Ground |

### Hardware Jumping Procedure:
1. Completely disconnect all power (USB and DC barrel jacks) from the modem and carrier board.
2. Locate the EDL test point on the PCB or use a precision conductive probe on **Pin 7 (\`USB_BOOT\`)** of the M.2 B-key connector.
3. Using conductive curved tweezers or an insulated jumper wire, short the EDL test point directly to any grounded metal RF shield.
4. While maintaining firm contact on the test point, connect the USB-C cable to the PC.
5. Hold the short for **3 to 4 seconds**, then release tweezers.
6. Open Windows Device Manager: Under **Ports (COM & LPT)**, the device will appear as:
   \`\`\`
   Qualcomm HS-USB QDLoader 9008 (COMx)
   \`\`\`

---

## Qualcomm QDLoader 9008 Recovery & Unbricking

Once the device is captured in **Qualcomm HS-USB QDLoader 9008** mode, the modem's internal BROM is waiting for an initial ELF firehose loader:

1. Launch **Qflash** or **Qualcomm QPST QFIL** (Qualcomm Flash Image Loader).
2. In Qflash, the port will display as \`COMx (Qualcomm HS-USB QDLoader 9008)\`.
3. Select the emergency programmer file:
   - For RM520N-GL: \`prog_firehose_sdxlemur.mbn\` or \`prog_firehose_lite.elf\`
   - For RM500Q / RM502Q: \`prog_firehose_sdx55.elf\`
   - For RM551E: \`prog_firehose_sdx75.elf\`
4. Select the corresponding \`rawprogram0.xml\` and \`patch0.xml\`.
5. Execute the flash. The firehose programmer is injected directly into modem RAM, initializes DDR memory, formats designated write blocks, and writes complete partition images.
6. When complete, power cycle the modem. The modem will boot cleanly into standard production firmware with all diagnostic AT ports restored.

---

## Upstream Research Credits

The hardware unbricking procedures, test-point pinout validation, and zero-space flashing guides documented here are based on the extensive hardware teardowns and community testing conducted by:
- **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** — Author of [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki) & [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit).
`
      },
      {
        slug: "m2-interfaces-pcie-modes",
        category: "getting-started",
        title: "M.2 B-Key, Initiator Modes & PCIe RC Hardware Deployment",
        description: "In-depth hardware guide covering M.2 Key-B pinouts, Terminal Equipment vs Application Processor modes, USB net modes, PCIe Root Complex vs Endpoint, and carrier board electrical power design.",
        edition: "universal",
        badge: "Hardware & Bus",
        readTime: "6 min read",
        updatedAt: "2026-10-25",
        toc: [
          { id: "m2-bkey-pinout-signals", title: "M.2 Key-B Architecture & Critical Signal Lines", level: 2 },
          { id: "te-vs-ap-modes", title: "Terminal Equipment (TE) vs Application Processor (AP) Modes", level: 2 },
          { id: "usbnet-modes-reference", title: "USB Net Modes: RMNET, ECM, MBIM & RNDIS", level: 2 },
          { id: "pcie-ep-vs-rc", title: "PCIe Endpoint (EP) vs Root Complex (RC) Switching", level: 2 },
          { id: "carrier-boards-deployment", title: "RGMII Carrier Boards: Rework 5G2PHY & 5G-RGM-O", level: 2 },
          { id: "power-sequencing-quirks", title: "Power Requirements: 24V Passive PoE & USB Sequencing", level: 2 },
          { id: "community-credits", title: "Hardware Research Credits", level: 2 }
        ],
        content: `
# M.2 B-Key, Initiator Modes & PCIe RC Hardware Deployment

Quectel 5G modules (RM520N, RM521F, RM551E, RM502Q) use the standardized **M.2 Key-B (Socket 2)** form factor (typically 3042 or 3052 sizing: 30mm width, 42mm/52mm length). Deploying these modems in standalone routers or carrier boards requires understanding bus signaling, initiator operating modes, and electrical power sequencing.

> [!NOTE]
> **Research & Heritage**: Detailed carrier board pin mapping, PCIe Root Complex driver binding, and power sequencing quirks were pioneered by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** and **Nate Carlson** through the [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit) project.

---

## M.2 Key-B Architecture & Critical Signal Lines

The M.2 Key-B connector has 75 mechanical pin positions (with pins 12–19 notched for keying). A high-speed cellular module multiplexes several physical interfaces over this connector:

| Pin Range / Pin | Signal Name | Electrical Description | Functional Role |
|---|---|---|---|
| **2, 4, 70, 72, 74** | \`VBAT_BB\` / \`VBAT_RF\` | 3.3V – 4.3V Power Rail (typically 3.8V nominal) | Supplies 5G RF power amplifier surges (requires up to 3.5A peak during transmission). |
| **3, 5, 11, 21, 27...**| \`GND\` | Ground Plane | Common signal and high-current RF return path. |
| **7, 9** | \`USB_D+\` / \`USB_D-\` | USB 2.0 Differential Data Pair | High-speed USB signaling (fallback and diagnostic channel). |
| **29, 31, 35, 37** | \`USB3_RX+/-\`, \`USB3_TX+/-\` | USB 3.1 Gen 1/2 SuperSpeed Pairs | Primary high-throughput USB data transport (> 5 Gbps). |
| **41, 43, 47, 49** | \`PCIE_TX+/-\`, \`PCIE_RX+/-\` | PCIe Gen 3/4 Lane 0 Differential Pairs | Direct PCIe data communication with host or Ethernet PHY. |
| **53, 55** | \`PCIE_REFCLK+/-\` | 100 MHz PCIe Reference Clock | PCIe bus synchronization. |
| **6** | \`FULL_CARD_POWER_OFF#\` | Active-Low Hardware Power Control | Pulled high to enable modem; pulling low cuts baseband power. |
| **8** | \`W_DISABLE1#\` | Active-Low RF Radio Kill Switch | Disables WWAN radio transmission when pulled low. |
| **67** | \`RESET#\` | Active-Low Hardware Reset | Hard reboot signal for baseband processor. |
| **7** | \`USB_BOOT\` | Hardware Boot Mode Override (EDL) | Shorting to Ground during boot forces Qualcomm QDLoader 9008 mode. |

---

## Terminal Equipment (TE) vs Application Processor (AP) Modes

Quectel Qualcomm modules can operate under two fundamentally different operational topologies:

### 1. Terminal Equipment (TE) Mode (Slave Peripheral)
In TE mode, the modem functions as an external cellular peripheral attached to a host processor (such as an x86 server or a router). The host CPU runs the network stack, DHCP server, NAT firewall, and web GUI, treating the modem as a USB or PCIe cellular modem via \`qmi_wwan\` or \`cdc_mbim\`. QManager is not designed for this mode, so installing it on the host is not an officially supported setup.

### 2. Application Processor (AP) Mode (Autonomous Standalone Router)
In AP mode, the internal ARM application processor inside the Qualcomm modem (e.g. ARMv7l Cortex-A7 in SDXLEMUR, or ARM64 in SDXPINN) operates as the **master router**. The modem runs on-modem Linux/OpenWRT, hosts the DHCP daemon, executes iptables firewall rules, drives an external physical Ethernet PHY over PCIe/RGMII, and hosts the **QManager** web console. The board's Ethernet port then plugs into the WAN port of any router (GL.iNet, OpenWrt or otherwise), or straight into a single device.

---

## USB Net Modes: RMNET, ECM, MBIM & RNDIS

When communicating over the USB bus, the network interface driver protocol is governed by the \`AT+QCFG="usbnet"\` command:

\`\`\`
AT+QCFG="usbnet",<mode>
\`\`\`

| Mode Value | Protocol Driver | Target Operating System & Use Case |
|---|---|---|
| **\`0\`** | **QMI / RMNET** | Qualcomm native driver. Best performance on OpenWRT Linux routers using \`qmi_wwan\` and \`uqmi\`. |
| **\`1\`** | **ECM (Ethernet Control Model)** | Standard CDC-ECM Linux USB ethernet gadget. Plug-and-play without proprietary drivers. |
| **\`2\`** | **MBIM (Mobile Broadband Interface)** | Native driver for Windows 10/11 and modern Linux systems using \`ModemManager\`. Supports multi-carrier profiling. |
| **\`3\`** | **RNDIS (Remote NDIS)** | Microsoft proprietary USB ethernet protocol. Compatible with legacy routers and Windows. |

After changing \`usbnet\`, reboot the modem with \`AT+CFUN=1,1\` to re-enumerate the USB interface.

---

## PCIe Endpoint (EP) vs Root Complex (RC) Switching

When a Quectel module connects directly to an Ethernet PHY chip (such as the Realtek RTL8125 2.5GbE controller on standalone carrier boards), the modem's PCIe bus controller must act as the **Root Complex (bus master)** rather than an **Endpoint (peripheral slave)**.

### Mode Command Configuration:
\`\`\`
AT+QCFG="pcie/mode",<mode>
\`\`\`
- \`0\` = **Endpoint (EP) Mode** (Default): Use when modem is installed into a PC motherboard or router PCIe slot.
- \`1\` = **Root Complex (RC) Mode**: Required when modem is installed into an RGMII/PCIe Ethernet breakout carrier board to drive the on-board PHY.

### Binding the Realtek RTL8125 PHY:
When running in PCIe RC mode on an X5&#42;/X6&#42; board (SDX55, SDX62/65), bind the Ethernet PHY driver:
\`\`\`
AT+QETH="eth_driver","r8125",1
\`\`\`
Reboot the module. On boot, the modem's internal kernel loads \`r8125.ko\` and exposes the physical network interface as \`eth0\`.

The RM551E (SDXPINN) sequence in Cameron's guide has no \`eth_driver\` line, so do not send it there. The full, per-family command sets are in [Preparing the Modem: Standalone Ethernet (PHY) Mode](/docs/getting-started/modem-ethernet-mode/).

---

## RGMII Carrier Boards: Rework 5G2PHY & 5G-RGM-O

Upstream research by Cameron Thompson and the open-source community validated several high-performance carrier boards for standalone Quectel deployments:

### 1. Rework.Network 5G2PHY (Indoor Standalone Board)
- **Form Factor**: Aluminum desktop enclosure with internal M.2 Key-B 3052 slot.
- **Ethernet PHY**: Realtek RTL8125BG 2.5 Gbps PCIe PHY.
- **Power Input**: 12V DC barrel jack or 5V USB-C auxiliary power.
- **Application**: Ideal indoor standalone 5G gateway running QManager directly on the modem.

### 2. Rework 5G-RGM-O (Outdoor Weatherproof Enclosure)
- **Form Factor**: IP67 waterproof aluminum chassis with integrated mast mount.
- **Power Delivery**: **24V Passive PoE** over RJ45 Ethernet port.
- **Thermal Management**: Direct die-to-casing thermal pad coupling for continuous outdoor operation under direct sunlight.

---

## Power Requirements: 24V Passive PoE & USB Sequencing

### ⚠️ The 24V Passive PoE vs Active 802.3af/at Trap
> [!WARNING]
> **PoE Standard Incompatibility**: Carrier boards such as the Rework 5G-RGM-O and many outdoor RGMII enclosures require **24V Passive PoE** (power injected across spare ethernet pairs 4,5 V+ and 7,8 V-).
> 
> They **DO NOT** contain active 802.3af/802.3at handshake negotiation ICs. Plugging an active PoE switch directly into a passive 24V carrier board will result in zero power delivery, or erratic rapid reboot cycling if the switch's auto-detect fails! Always use a dedicated 24V 1A passive PoE injector or an active-to-passive PoE step-down splitter.

### USB Power Initialization Sequencing Quirk
When performing initial configuration or recovery using both a DC power source (12V/24V) and a USB-C data cable connected to a PC:
- **The Quirk**: The USB 5V rail cannot supply the RF surge current a 5G modem draws, so running the board from USB alone causes bootloops or dropped PCIe enumeration.
- **The Rule**: Cameron's guides say to **plug in the board's extra power (DC or passive PoE) at the same time as USB**.
- **RM551E / RM550V exception**: these modules are only recognized over USB if they **power on from USB first**. Connect USB, then add the DC or PoE power right after.

---

## Hardware Research Credits

The hardware pinout definitions, PCIe Root Complex configuration, and carrier board electrical validation are credited to:
- **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** — Author of [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit) & [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki).
- **Nate Carlson** — Pioneer of open-source RGMII carrier board documentation.
`
      }
    ]
  },
  {
    id: "cellular",
    title: "Signal & Cellular Operations",
    iconName: "Radio",
    description: "Real-time RSRP/SINR metrics, 4x4 MIMO per-antenna readouts, antenna alignment, band locking, and tower locking.",
    articles: [
      {
        slug: "live-signal",
        category: "cellular",
        title: "Live Signal Monitoring & Multi-APN",
        description: "Real-time RSRP, RSRQ, SINR with per-antenna 4x4 MIMO metrics and 30-minute historical telemetry.",
        edition: "universal",
        badge: "Core Telemetry",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "overview-signal-metrics", title: "Overview of Cellular Metrics", level: 2 },
          { id: "4x4-mimo-per-antenna", title: "4x4 MIMO Per-Antenna Breakdown", level: 2 },
          { id: "live-telemetry-engine", title: "Live Telemetry Engine Architecture", level: 2 },
          { id: "multi-apn-monitoring", title: "Multi-APN Real-Time Monitoring", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Live Signal Monitoring & Multi-APN

The **Live Signal Dashboard** is QManager's primary operational display. It streams high-resolution baseband telemetry directly from the Quectel radio without lagging the web browser.

![QManager RM551E Dashboard screen](/screenshots/features/rm551e-dashboard-light.webp "RM551E: The dashboard shows network status, primary LTE and 5G signal, and device information at a glance.")

---

## Overview of Cellular Metrics

| Metric | Full Name | Ideal Range | Acceptable Range | Poor Range | Notes |
|---|---|---|---|---|---|
| **RSRP** | Reference Signal Received Power | > -80 dBm | -80 to -100 dBm | < -105 dBm | The true signal strength of the serving cell. |
| **RSRQ** | Reference Signal Received Quality | > -10 dB | -10 to -15 dB | < -16 dB | Signal quality factoring in interference and channel load. |
| **SINR** | Signal-to-Interference-plus-Noise | > 20 dB | 10 to 20 dB | < 5 dB | Best predictor of download and upload throughput. |
| **RSSI** | Received Signal Strength Indicator | > -65 dBm | -65 to -85 dBm | < -90 dBm | Wideband power including serving, neighbor, and noise. |

---

## 4x4 MIMO Per-Antenna Breakdown

Quectel 5G modules (RM520N and RM551E) utilize 4 distinct antenna ports (ANT0, ANT1, ANT2, ANT3). Traditional router GUIs average these values into a single misleading number.

QManager displays the individual signal strength and quality for **all four antenna lines**:
- **ANT0 (PRX)**: Primary Receiver
- **ANT1 (DRX)**: Diversity Receiver
- **ANT2 (MIMO1)**: Spatial Stream 1
- **ANT3 (MIMO2)**: Spatial Stream 2

> [!TIP]
> If one antenna port reads 15 dB lower than the others (e.g., ANT0 is -82 dBm but ANT2 is -105 dBm), you likely have a loose IPEX MHF4 pigtail connector, damaged coax cable, or improperly polarized external directional antenna.

---

## Live Telemetry Engine Architecture

Rather than executing slow AT commands on every browser poll, QManager's backend features a dedicated **tmpfs circular buffer**:
1. The background daemon reads cellular metrics every 1,000ms.
2. Formats readings into a compact JSON slice in \`/tmp/qmlive/signal.json\`.
3. The web frontend fetches this static file via HTTP \`ETag\` cache headers.
4. If the modem enters high-load state, the adaptive engine backs off automatically to prevent AT command collisions.

---

## Multi-APN Real-Time Monitoring

For corporate and IoT setups with dual PDP contexts (e.g. APN 1 for public internet and APN 2 for private corporate intranet or IMS VoLTE):
- Real-time IP address and DNS readout for each active context.
- Individual traffic byte counters (TX/RX) per APN.
## Screens in QManager

![QManager RM551E Dashboard (full page) screen](/screenshots/features/rm551e-dashboard-full-light.webp "RM551E: The full dashboard, including carrier aggregation, device health, connection quality, recent activity and signal history.")

![QManager RM520N Dashboard (full page) screen](/screenshots/features/rm520n-dashboard-full-light.webp "RM520N: The whole dashboard, including connection quality, signal history, and recent activity.")

![QManager RM551E Speed test screen](/screenshots/features/rm551e-speedtest-light.webp "RM551E: Run a speed test from the dashboard to see download, upload, ping and jitter.")

![QManager RM520N Speed test screen](/screenshots/features/rm520n-speedtest-light.webp "RM520N: The speed test dialog shows download, upload, and ping from the modem itself.")

![QManager RM551E Antenna statistics screen](/screenshots/features/rm551e-antenna-statistics-light.webp "RM551E: Per-antenna RSRP, RSRQ and SINR for each LTE and 5G receive chain.")

![QManager RM520N Antenna statistics screen](/screenshots/features/rm520n-antenna-statistics-light.webp "RM520N: Antenna Statistics compares RSRP, RSRQ, and SINR on all four receive chains.")

![QManager RM520N Dashboard screen](/screenshots/features/rm520n-dashboard-light.webp "RM520N: The dashboard gives a live view of network status, signal, and device details.")

`
      },
      {
        slug: "antenna-alignment",
        category: "cellular",
        title: "Antenna Alignment & Positioning Tool",
        description: "Field optimization tool: 3-position recording, composite scoring algorithm, and directional placement recommendations.",
        edition: "universal",
        badge: "Tool",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "why-alignment-matters", title: "Why Antenna Alignment Matters", level: 2 },
          { id: "how-the-tool-works", title: "How the 3-Position Tool Works", level: 2 },
          { id: "composite-scoring-formula", title: "The Composite Scoring Formula", level: 2 },
          { id: "step-by-step-guide", title: "Step-by-Step Field Alignment Guide", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Antenna Alignment & Positioning Tool

When aiming directional external antennas (such as Log-Periodic Dipole Arrays, Cross-Polarized Paneling, or Parabolic Grids), minute degree adjustments can double throughput or eliminate packet loss.

![QManager RM551E Antenna alignment screen](/screenshots/features/rm551e-antenna-alignment-light.webp "RM551E: Aim your antenna with a live score and record up to three positions to compare.")

---

## Why Antenna Alignment Matters

Cell towers transmit with distinct directional sector azimuths (usually 120° coverage per sector). Pointing directly at a tower's main lobe yields high SINR and enables high-order modulation (**256-QAM** or **1024-QAM**).

---

## How the 3-Position Tool Works

QManager allows you to record signal metrics across 3 prospective physical orientations:
- **Slot A**: Initial heading (e.g. 0° North)
- **Slot B**: Second candidate heading (e.g. 45° North-East)
- **Slot C**: Third candidate heading (e.g. 90° East)

The tool samples each position for 10 seconds, averages out instantaneous fading and jitter, and ranks the candidates.

---

## The Composite Scoring Formula

The alignment engine calculates a weighted composite score (0 to 100):

\`\`\`
Score = (SINR_weight * 0.50) + (RSRP_weight * 0.35) + (RSRQ_weight * 0.15)
\`\`\`

- **SINR carries the heaviest weight (50%)**: A signal with -90 dBm RSRP and +22 dB SINR will vastly outperform a -75 dBm signal with +4 dB SINR plagued by neighbor interference.
- **RSRP accounts for 35%**: Ensures baseline link budget reliability.
- **RSRQ accounts for 15%**: Detects channel congestion.

---

## Step-by-Step Field Alignment Guide

1. Navigate to **Cellular > Antenna Alignment**.
2. Mount your antenna in Direction 1. Click **Record Position A**. Wait for the 10-second sampling bar to complete.
3. Rotate antenna ~30 degrees. Click **Record Position B**.
4. Rotate antenna another 30 degrees. Click **Record Position C**.
5. Inspect the comparison card: QManager highlights the winning position with a green badge and displays the delta in predicted throughput!
## Screens in QManager

![QManager RM520N Antenna alignment screen](/screenshots/features/rm520n-antenna-alignment-light.webp "RM520N: Antenna Alignment scores the current aim and records up to three positions to compare.")

`
      },
      {
        slug: "band-locking",
        category: "cellular",
        title: "LTE & 5G NR Band Locking",
        description: "Select and lock specific frequency bands, disable congested carriers, and configure automatic band failover.",
        edition: "universal",
        badge: "RF Control",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "why-band-locking", title: "Why Lock Frequency Bands?", level: 2 },
          { id: "supported-bands", title: "Supported LTE and 5G NR Bands", level: 2 },
          { id: "at-command-translation", title: "Under the Hood: Quectel AT Band Masks", level: 2 },
          { id: "band-failover-engine", title: "Automatic Band Failover Safeguard", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# LTE & 5G NR Band Locking

Carrier modems frequently roam onto low-frequency coverage bands (e.g. LTE B12 or B71) because they have stronger penetrating power, even though a higher frequency capacity band (e.g. B66, B41, or 5G n77/n78) would deliver 5x faster speeds.

![QManager RM551E Band locking screen](/screenshots/features/rm551e-band-locking-light.webp "RM551E: Choose which LTE and 5G bands the modem may use, with automatic band failover.")

---

## Why Lock Frequency Bands?

- **Avoid Congestion**: Lock out overburdened low-band frequencies during peak hours.
- **Force 5G Standalone (SA)**: Keep your modem locked to Mid-Band NR (n41, n77, n78) for ultra-low latency and gigabit throughput.
- **Prevent Flapping**: Stop the modem from ping-ponging between two towers on different bands.

---

## Supported LTE and 5G NR Bands

QManager provides one-click checkbox toggles for all worldwide bands:

### 5G NR Sub-6 Bands
\`n1\`, \`n2\`, \`n3\`, \`n5\`, \`n7\`, \`n8\`, \`n12\`, \`n14\`, \`n20\`, \`n25\`, \`n28\`, \`n38\`, \`n40\`, **\`n41\` (T-Mobile Ultra Capacity)**, \`n48\` (CBRS), \`n66\`, **\`n71\` (Low-Band NR)**, **\`n77\` (C-Band / DoD)**, **\`n78\` (International 3.5 GHz)**.

### LTE Bands
\`B1\`, **\`B2\`**, \`B3\`, \`B4\`, \`B5\`, \`B7\`, \`B8\`, \`B12\`, \`B13\` (Verizon Primary), \`B14\` (FirstNet), \`B17\`, \`B20\`, \`B25\`, \`B26\`, \`B28\`, \`B32\`, \`B38\`, \`B40\`, **\`B41\`**, \`B42\`, \`B43\`, \`B48\` (CBRS), **\`B66\`**, \`B71\`.

---

## Under the Hood: Quectel AT Band Masks

When you check bands and click **Apply**, QManager calculates the 64-bit hexadecimal bitmasks and transmits them to the modem baseband via:

\`\`\`
AT+QNWPREFCFG="gw_band",<hex_mask>
AT+QNWPREFCFG="lte_band",<hex_mask>
AT+QNWPREFCFG="nsa_nr5g_band",<hex_mask>
AT+QNWPREFCFG="nr5g_band",<hex_mask>
\`\`\`

---

## Automatic Band Failover Safeguard

> [!WARNING]
> Locking to a band that is not currently broadcast by nearby towers will drop your cellular connection entirely.

To prevent getting stranded, QManager includes **Band Safety Fallback**:
1. When you apply a new band lock, a 60-second recovery timer starts.
2. QManager waits for baseband registration (\`+CEREG: 1\` or \`+C5GREG: 1\`).
3. If no cellular registration is achieved within 60 seconds, QManager automatically reverts your previous band mask!
## Screens in QManager

![QManager RM551E Frequency locking screen](/screenshots/features/rm551e-frequency-locking-light.webp "RM551E: Restrict the radio to specific LTE and 5G channels while it still picks the cell.")

![QManager RM551E Frequency calculator screen](/screenshots/features/rm551e-frequency-calculator-light.webp "RM551E: Convert an EARFCN or NR-ARFCN into its frequency and possible bands.")

![QManager RM520N Frequency calculator screen](/screenshots/features/rm520n-frequency-calculator-light.webp "RM520N: The Frequency Calculator converts an EARFCN or NR-ARFCN into its frequency and bands.")

![QManager RM520N Band locking screen](/screenshots/features/rm520n-band-locking-light.webp "RM520N: Band Locking restricts which LTE and 5G bands the modem may use, with an optional failover.")

![QManager RM520N Cellular basic settings screen](/screenshots/features/rm520n-cellular-settings-light.webp "RM520N: Cellular Settings controls the SIM slot, radio power, network mode, and roaming.")

![QManager RM520N Network priority screen](/screenshots/features/rm520n-network-priority-light.webp "RM520N: Network Priority sets the order in which the modem tries 5G NR, LTE, and WCDMA.")

`
      },
      {
        slug: "tower-lock-failover",
        category: "cellular",
        title: "Tower & Cell Locking with Auto-Failover",
        description: "Lock directly to specific cell towers by PCI and ARFCN, with scheduled switching and automatic link failover.",
        edition: "universal",
        badge: "Advanced RF",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-is-tower-locking", title: "What is Tower Locking (Cell Lock)?", level: 2 },
          { id: "identifying-target-cells", title: "Identifying Target Cell Towers", level: 2 },
          { id: "configuring-cell-lock", title: "Configuring Cell Lock in QManager", level: 2 },
          { id: "auto-failover-logic", title: "Auto-Failover on Cell Outage", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Tower & Cell Locking with Auto-Failover

While band locking restricts the frequency channel, **Tower Locking** (Cell Lock) restricts the modem to a specific physical sector radio identified by its **Physical Cell ID (PCI)** and **Absolute Radio Frequency Channel Number (EARFCN/NR-ARFCN)**.

![QManager RM551E Tower locking screen](/screenshots/features/rm551e-tower-locking-light.webp "RM551E: Lock the modem to specific cells, with signal failover and a lock schedule.")

---

## What is Tower Locking (Cell Lock)?

If you live between two cellular towers—one close with high load, and another slightly further with 10x faster speeds—the modem will default to the closer tower. Cell locking forces the modem to ignore the close tower and connect exclusively to the distant, high-speed tower.

---

## Identifying Target Cell Towers

1. In QManager, go to **Cellular > Cell Scanner**.
2. Click **Scan Neighbor Cells**.
3. The table lists all serving and neighbor cells detected by the modem's radio:
   - **Cell Type**: LTE or NR5G
   - **PCI**: Physical Cell ID (e.g. \`184\`)
   - **EARFCN / ARFCN**: Frequency channel (e.g. \`66536\` for B66, \`518970\` for n41)
   - **RSRP**: Signal strength of each individual tower sector

---

## Configuring Cell Lock in QManager

1. In **Cellular > Tower Lock**, click **Add Cell Lock**.
2. Enter the **PCI** and **EARFCN/ARFCN**.
3. Select the cellular technology: \`LTE\` or \`NR5G\`.
4. Click **Apply Lock**.

Under the hood, QManager issues:
\`\`\`
AT+QNWLOCK="common/4g",<num_cells>,<earfcn>,<pci>
# Or for 5G:
AT+QNWLOCK="common/5g",<pci>,<arfcn>,<scs>,<band>
\`\`\`

---

## Auto-Failover on Cell Outage

What happens if maintenance takes down your locked tower?
QManager's background watchdog continuously checks link ping:
- If the locked cell drops off the air for more than 3 consecutive minutes, QManager automatically clears the cell lock (\`AT+QNWLOCK="common/4g",0\`), allowing the modem to roam to any available tower until the primary tower returns!
## Screens in QManager

![QManager RM551E Cell scanner screen](/screenshots/features/rm551e-cell-scanner-light.webp "RM551E: A full sweep lists every tower in range by carrier, band and signal.")

![QManager RM520N Cell scanner screen](/screenshots/features/rm520n-cell-scanner-light.webp "RM520N: The Cell Scanner sweeps all supported bands and lists every tower found, by carrier.")

![QManager RM551E Neighbouring cells screen](/screenshots/features/rm551e-neighbour-cell-scanner-light.webp "RM551E: See the neighbouring cells your serving tower already tracks, without a full sweep.")

![QManager RM520N Neighbouring cells screen](/screenshots/features/rm520n-neighbour-scanner-light.webp "RM520N: Neighbouring Cells reads the cells the serving tower already tracks, without a full sweep.")

![QManager RM520N Tower locking screen](/screenshots/features/rm520n-tower-locking-light.webp "RM520N: Tower Locking pins the modem to specific cells, with reboot persistence, failover, and a schedule.")

![QManager RM520N Frequency locking screen](/screenshots/features/rm520n-frequency-locking-light.webp "RM520N: Frequency Locking limits the radio to chosen EARFCNs and NR-ARFCNs without pinning a PCI.")

`
      },
      {
        slug: "carrier-aggregation",
        category: "cellular",
        title: "Carrier Aggregation (CA) & Secondary Carriers",
        description: "Primary cell and secondary component carrier (SCC1–SCC3) monitoring with bandwidth metrics.",
        edition: "universal",
        badge: "Throughput",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "understanding-ca", title: "Understanding Carrier Aggregation (CA)", level: 2 },
          { id: "pcc-and-scc-breakdown", title: "PCC vs SCC1-SCC3 Breakdown", level: 2 },
          { id: "why-ca-sleeps", title: "Why Does CA Disappear When Idle?", level: 2 },
          { id: "tmobile-sa-efs-patches", title: "T-Mobile SA 4xCA & 5xCA EFS Patches", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Carrier Aggregation (CA) & Secondary Carriers

Carrier Aggregation combines multiple frequency bands simultaneously (e.g. B2 + B66 + n41) to multiply overall data transmission bandwidth.

![QManager RM551E Cellular information screen](/screenshots/features/rm551e-cellular-information-light.webp "RM551E: Every active carrier with its band, channel, PCI and live signal quality.")

---

## Understanding Carrier Aggregation (CA)

Quectel RM520N and RM551E modems support multi-carrier aggregation:
- **Up to 4x Downlink CA** in LTE.
- **Up to 3x Downlink CA** in 5G NR (NR-CA), including Sub-6 FDD+TDD aggregation.

---

## PCC vs SCC1-SCC3 Breakdown

In QManager's **Carrier Aggregation** widget:
- **PCC (Primary Component Carrier)**: Handles control signaling, uplink transmission, and downlink.
- **SCC1, SCC2, SCC3 (Secondary Component Carriers)**: Provide supplemental downlink bandwidth.

The dashboard displays:
- **Band & Channel**: e.g., \`PCC: B66 (20 MHz)\` + \`SCC1: B2 (15 MHz)\` + \`SCC2: n41 (100 MHz)\`.
- **Total Aggregated Bandwidth**: e.g., \`135 MHz Total Channel Width\`.
- **Modulation Scheme**: e.g., \`256-QAM\` or \`64-QAM\`.

---

## Why Does CA Disappear When Idle?

> [!NOTE]
> Cellular base stations only assign Secondary Component Carriers (SCCs) dynamically when active traffic exceeds a threshold. When your connection is idle, the tower de-allocates SCCs to save power, leaving only the PCC active.
>
> To test maximum CA capability, run a multi-threaded speed test or download a large test file while watching the CA card illuminate!

---

## T-Mobile SA 4xCA & 5xCA EFS Patches

In modern 5G Standalone (5G SA) networks—especially T-Mobile USA (PLMN \`310260\` / \`310410\`)—carriers deploy multi-band NR aggregation combining multiple mid-band and low-band channels simultaneously (such as \`n41 + n41 + n71 + n25\` or \`n41 + n41 + n77 + n71\`).

### The Missing RRC Capability Problem
Stock factory firmware on many Quectel modules (including early RM520N and RM551E builds) contains conservative default Radio Resource Control (RRC) capability tables that advertise support for only 2xCA or 3xCA in Standalone mode, preventing the network from assigning 4-carrier or 5-carrier aggregation.

### Upstream EFS Patch Injection Workflow
As reverse engineered and documented by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** in the [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki):

1. **Purging Stale Carrier Combos (\`AT+QNVFD\`)**:
   Stale or conflicting carrier aggregation definitions must first be removed from the Qualcomm EFS partition:
   \`\`\`
   AT+QNVFD="/nv/item_files/modem/lte/rrc/cap/combos"
   \`\`\`
2. **Injecting Custom CA Combo Tables (\`AT+QNVFW\`)**:
   The custom T-Mobile SA 4xCA/5xCA binary table is written directly into non-volatile EFS using Quectel's NV write command:
   \`\`\`
   AT+QNVFW="/nv/item_files/modem/nr5g/rrc/cap/ca_combos",<binary_payload>
   \`\`\`
3. **Overriding RRC Capability Limits**:
   Re-enables wide-bandwidth channel aggregation across non-contiguous n41 carriers and n25/n71 carrier combos.
4. **Rebooting Baseband**:
   \`\`\`
   AT+CFUN=1,1
   \`\`\`

> [!WARNING]
> **Stock March 2025 Firmware Warning**:
> Avoid flashing the stock March 2025 firmware release for SDX62/SDXLEMUR. This firmware build introduces a regression that overrides custom EFS tables on every boot and enforces strict digital signature verification on RRC combo files, preventing community 4xCA/5xCA combos from activating. Stick with verified late-2024 or patched community releases for maximum CA throughput.
## Screens in QManager

![QManager RM520N Cellular and radio information screen](/screenshots/features/rm520n-cellular-info-light.webp "RM520N: Cellular Information lists every active carrier with its band, channel, and signal.")

`
      }
    ]
  },
  {
    id: "networking",
    title: "Network Configuration & Routing",
    iconName: "Network",
    description: "LAN gateway settings, Custom DNS, IP Passthrough bridge mode, TTL/MTU mangling, and DPI video optimization.",
    articles: [
      {
        slug: "lan-config",
        category: "networking",
        title: "LAN Gateway & Subnet Configuration",
        description: "Configure local IP addresses, DHCP leases, address pool ranges, and prevent subnet collisions.",
        edition: "universal",
        badge: "LAN",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "gateway-ip-assignment", title: "Gateway IP & Subnet Setup", level: 2 },
          { id: "dhcp-server-options", title: "DHCP Server & Leases", level: 2 },
          { id: "avoiding-subnet-collisions", title: "Avoiding Subnet Collisions", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# LAN Gateway & Subnet Configuration

Configure the internal local network settings for the Ethernet / RGMII port on the modem or router.

![QManager RM551E Ethernet status and LAN address screen](/screenshots/features/rm551e-ethernet-light.webp "RM551E: Check the Ethernet link, limit its speed and set the LAN gateway address.")

---

## Gateway IP & Subnet Setup

In **Network > LAN Settings**:
- **IPv4 Address**: Default \`192.168.224.1\` for RM551E (on-modem OpenWRT) or \`192.168.225.1\` for RM520N & RG501 native Linux modems. If the modem sits behind your router's WAN port, keep its LAN subnet different from the router's own LAN subnet to avoid an IP conflict.
- **Subnet Mask**: Standard \`255.255.255.0\` (\`/24\`).

---

## DHCP Server & Leases

- **Start / End IP Range**: Assign dynamic pool within your subnet (e.g., \`192.168.224.100\`–\`192.168.224.250\` on RM551E, or \`192.168.225.100\`–\`192.168.225.250\` on RM520N).
- **Lease Time**: Default 12 hours (\`12h\`).
- **Static Leases**: Reserve dedicated IPs for internal servers, access points, and NAS devices based on client MAC address.

---

## Avoiding Subnet Collisions

> [!WARNING]
> Cellular networks frequently assign WAN IP addresses in the \`192.168.x.x\` or \`10.x.x.x\` ranges. If your LAN subnet matches your cellular provider's private IP pool, routing will fail. QManager's network guard checks for conflicts and alerts you automatically if a subnet change is advised.
## Screens in QManager

![QManager RM520N Ethernet status screen](/screenshots/features/rm520n-ethernet-status-light.webp "RM520N: Ethernet Status shows the host link state and lets you force a fixed port speed.")

`
      },
      {
        slug: "custom-dns",
        category: "networking",
        title: "Custom DNS, DNS-over-HTTPS (DoH) & IPv6",
        description: "Override carrier DNS servers with secure, privacy-preserving resolvers and configure IPv6 routing.",
        edition: "universal",
        badge: "DNS",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "why-change-dns", title: "Why Override Carrier DNS?", level: 2 },
          { id: "dns-presets", title: "One-Click Provider Presets", level: 2 },
          { id: "ipv6-dns-handling", title: "IPv6 DNS & Upstream Failover", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Custom DNS, DNS-over-HTTPS (DoH) & IPv6

Cellular carriers frequently intercept unencrypted DNS traffic, inject ads, or block domain names via transparent DNS proxies.

![QManager RM551E Custom DNS screen](/screenshots/features/rm551e-custom-dns-light.webp "RM551E: Give devices on your network your own DNS servers, for IPv4 and IPv6.")

---

## Why Override Carrier DNS?

- **Eliminate Carrier Tracking**: Prevent mobile operators from logging your visited domain names.
- **Bypass Censorship & CDN Throttling**: Carrier DNS servers often return degraded CDN endpoints for video services.
- **Faster Lookups**: Public resolvers like Cloudflare and Quad9 deliver sub-10ms lookup times.

---

## One-Click Provider Presets

QManager includes pre-configured, tested DNS configurations:
- **Cloudflare**: \`1.1.1.1\`, \`1.0.0.1\` / \`2606:4700:4700::1111\`
- **Quad9 (Security & Malware Filter)**: \`9.9.9.9\`, \`149.112.112.112\`
- **Google Public DNS**: \`8.8.8.8\`, \`8.8.4.4\`
- **AdGuard (Ad Blocking)**: \`94.140.14.14\`, \`94.140.15.15\`

---

## IPv6 DNS & Upstream Failover

If your SIM card provisions an IPv6-only or dual-stack IPv4v6 PDP context, QManager binds IPv6 resolvers alongside IPv4 and configures \`dnsmasq\` fallback to ensure zero DNS resolution drops.
## Screens in QManager

![QManager RM520N Custom DNS screen](/screenshots/features/rm520n-custom-dns-light.webp "RM520N: Custom DNS forwards LAN lookups to your own resolvers instead of the carrier's.")

`
      },
      {
        slug: "ip-passthrough",
        category: "networking",
        title: "IP Passthrough & Bridge Mode",
        description: "Pass your public cellular WAN IP directly to downstream third-party routers without double NAT.",
        edition: "universal",
        badge: "Routing",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-is-ip-passthrough", title: "What is IP Passthrough?", level: 2 },
          { id: "ippt-three-tier-taxonomy", title: "The 3-Tier IPPT Architecture (DMZ vs QMAP MPDN)", level: 2 },
          { id: "how-it-works", title: "How IP Passthrough Works", level: 2 },
          { id: "dns-proxy-bypass", title: "DNS Proxy Bypass & Carrier DNS Pass-Through", level: 2 },
          { id: "rm551e-mac-requirement", title: "RM551E Target MAC Requirement Quirk", level: 2 },
          { id: "enabling-passthrough", title: "Enabling IP Passthrough in QManager", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# IP Passthrough & Bridge Mode

Connect your Quectel modem to enterprise firewalls (pfSense, OPNsense, Ubiquiti UniFi, MikroTik) while avoiding double-NAT issues.

![QManager RM551E IP passthrough screen](/screenshots/features/rm551e-ip-passthrough-light.webp "RM551E: Hand the modem's public IP straight to one device over Ethernet or USB.")

---

## What is IP Passthrough?

In standard mode, the modem acts as a router/NAT gateway. In **IP Passthrough (Bridge Mode)**:
- The modem assigns the actual cellular WAN IP address directly to your downstream router's WAN port via DHCP.
- The modem transparently forwards all inbound and outbound packets without NAT address translation.
- QManager's web management interface remains accessible via a virtual management IP.

---

## The 3-Tier IPPT Architecture (DMZ vs QMAP MPDN)

Upstream research by Cameron Thompson (Cellular Modem Wiki) categorized cellular passthrough implementations into three functional tiers:

### 1. Pseudo-Bridge (DMZ Host)
The modem retains full NAT ownership, but automatically forwards all unsolicited inbound TCP/UDP ports to the downstream router's static LAN IP. While simple, double NAT still exists, which can disrupt VPNs, VoIP, and gaming protocols.

### 2. Full QMAP MPDN Hardware Passthrough
The modem baseband bypasses internal NAT entirely, bridging the public cellular WAN lease directly to the Ethernet PHY:
\`\`\`
AT+QMAP="MPDN_rule",0,1,0,1,1,"<MAC_ADDRESS>"
\`\`\`
- **\`0\`**: Profile rule ID.
- **\`1\`**: Context ID (PDP 1).
- **\`0\`**: VLAN tagging (0 = disabled).
- **\`1\`**: IP Passthrough mode enabled (1 = enabled, 0 = NAT).
- **\`1\`**: Target hardware interface (1 = \`eth0\` / RGMII).
- **\`<MAC_ADDRESS>\`**: Physical MAC address of downstream router WAN interface.

### 3. Full Bridge with DNS Proxy Bypass
By default, the modem's internal DHCP daemon forces its own IP address as the DNS server for connected clients. To disable this interception and forward genuine upstream carrier DNS or custom DNS servers directly:
\`\`\`
AT+QMAP="DHCPV4DNS","disable"
\`\`\`

---

## How IP Passthrough Works

QManager binds the cellular \`rmnet_data0\` interface to the Ethernet PHY using ARP-proxying or raw IP bridging. The downstream router receives the carrier lease directly.

---

## DNS Proxy Bypass & Carrier DNS Pass-Through

When IP Passthrough is enabled without disabling DNS proxying, DNS queries from your downstream router still hit the modem's internal resolver, increasing latency and potentially leaking queries.

QManager's IPPT toggle automatically executes:
\`\`\`
AT+QMAP="DHCPV4DNS","disable"
\`\`\`
This ensures the downstream enterprise firewall receives the upstream cellular DNS server addresses (or your configured custom DNS resolvers) directly in its DHCP ACK option 6.

---

## RM551E Target MAC Requirement Quirk

> [!WARNING]
> **RM551E Exact MAC Address Requirement**:
> On the RM520N-GL, you can specify the broadcast wildcard MAC address (\`FF:FF:FF:FF:FF:FF\`) in the QMAP command, allowing whichever router connects first to claim the WAN IP.
>
> However, on **Quectel RM551E (Snapdragon X75)** on-board OpenWRT firmwares, using \`FF:FF:FF:FF:FF:FF\` causes the internal \`mobileap\` daemon to fail to bind the DHCP lease. On the RM551E, **you must specify the exact hardware MAC address** of your downstream router's WAN port (e.g. \`00:E0:4C:68:01:22\`).

---

## Enabling IP Passthrough in QManager

1. Navigate to **Network > IP Passthrough**.
2. Toggle **Enable IP Passthrough** to ON.
3. Select or enter your **Target Client MAC Address** (the MAC address of your firewall's WAN port).
4. Specify a **Fallback Management IP** (e.g., \`192.168.224.1\` on RM551E or \`192.168.225.1\` on RM520N) so you can still reach QManager.
5. Click **Save & Apply**.
## Screens in QManager

![QManager RM520N IP passthrough screen](/screenshots/features/rm520n-ip-passthrough-light.webp "RM520N: IP Passthrough hands the modem's public IP to one device over Ethernet or USB.")

`
      },
      {
        slug: "ttl-mtu-engine",
        category: "networking",
        title: "TTL & MTU Packet Mangling",
        description: "Configure IPv4 TTL and IPv6 Hop Limit to prevent mobile carrier tethering and hotspot throttling.",
        edition: "universal",
        badge: "Essential",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "why-mangle-ttl", title: "Why Mangle TTL (Time To Live)?", level: 2 },
          { id: "recommended-ttl-values", title: "Recommended TTL & HL Values", level: 2 },
          { id: "firewall-hook-mechanics", title: "Under the Hood: OpenWRT lanUtils vs SDXLEMUR simplefirewall", level: 2 },
          { id: "mtu-clamping", title: "MTU Clamping for Cellular Interfaces", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# TTL & MTU Packet Mangling

Many cellular carriers (e.g. T-Mobile, AT&T, Verizon) differentiate between on-device smartphone data and tethered/hotspot data by inspecting the **IP Time To Live (TTL)** header.

![QManager RM551E TTL and MTU screen](/screenshots/features/rm551e-ttl-mtu-light.webp "RM551E: Rewrite TTL and hop limit and set the MTU on the cellular interface.")

---

## Why Mangle TTL (Time To Live)?

When a computer or TV connects behind a router, each router hop decrements the packet's TTL value by 1. A smartphone packet typically starts at TTL 64, while a router-forwarded packet arrives at the cell tower with TTL 63. Carriers detect this decrement and throttle speeds to 3G rates (e.g. 600 kbps).

By mangling outgoing packets, QManager locks the TTL so all outbound traffic appears identical to direct on-device smartphone traffic.

---

## Recommended TTL & HL Values

In **Network > TTL/HL Settings**:

| Carrier / Scenario | IPv4 TTL | IPv6 Hop Limit (HL) | Notes |
|---|---|---|---|
| **T-Mobile (USA / Magenta)** | \`65\` or \`64\` | \`65\` | Most common value for high-speed unlimited data. |
| **Verizon Wireless** | \`65\` | \`65\` | Prevents hotspot bucket deduction. |
| **AT&T Wireless** | \`64\` | \`64\` | Standard on-device mobile value. |
| **Custom / International** | \`64\`–\`128\` | \`64\`–\`128\` | Test between 64 and 65 depending on carrier DPI. |

Under the hood, QManager inserts persistent \`iptables\` / \`ip6tables\` rules:
\`\`\`sh
iptables -t mangle -I POSTROUTING -o rmnet_data+ -j TTL --ttl-set 65
ip6tables -t mangle -I POSTROUTING -o rmnet_data+ -j HL --hl-set 65
\`\`\`

---

## Under the Hood: OpenWRT lanUtils vs SDXLEMUR simplefirewall

Maintaining TTL and Hop Limit mangling across cellular radio cycles requires hook integration into modem OS network events:

### 1. OpenWRT & RM551E: \`/etc/data/lanUtils.sh\` Hooks
On the RM551E running custom on-modem OpenWRT, carrier network resets or baseband toggles trigger \`/etc/data/lanUtils.sh\`. Upstream analysis by Cameron Thompson identified the internal function \`util_combine_iptable_rules\`, which reassembles firewall chains on interface renewal.
QManager hooks into this initialization pipeline to inject:
- \`/etc/firewall.user.ttl\`
- \`/etc/firewall.user.mtu\`
directly into the mangle table postrouting chain, guaranteeing that TTL rules survive baseband restarts without being flushed by \`netifd\`.

### 2. SDXLEMUR Linux & RM520N: Systemd \`simplefirewall\`
On native Qualcomm SDXLEMUR Linux (RM520N-GL), standard OpenWRT network scripts do not exist. Instead, persistence is managed by:
- \`simplefirewall.service\`: Supervised systemd unit executing \`/usr/bin/simplefirewall.sh\`.
- Reads persistent configuration from \`/usrdata/simplefirewall/ttl-override\` and \`/usrdata/simplefirewall/hl-override\`.
- Applies iptables mangle rules dynamically to all active \`rmnet_data+\` cellular endpoints and \`eth0\` bridge interfaces upon link carrier acquisition.

---

## MTU Clamping for Cellular Interfaces

Cellular encapsulation (GTP tunnels) adds packet overhead. Setting an MTU that is too large causes packet fragmentation and sluggish web browsing.

QManager automatically applies optimal **MTU Clamping** (default: \`1420\` or \`1440\` for cellular WAN) to eliminate packet loss and TLS handshake timeouts.
## Screens in QManager

![QManager RM520N TTL and MTU screen](/screenshots/features/rm520n-ttl-mtu-light.webp "RM520N: TTL & MTU rewrites the hop count and sets the packet size on the cellular interface.")

`
      },
      {
        slug: "dpi-settings",
        category: "networking",
        title: "DPI Traffic Engine & Video Masquerade",
        description: "nfqws-based video streaming optimizer and TLS ClientHello masquerading to bypass carrier traffic shaping.",
        edition: "universal",
        badge: "DPI Engine",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-is-dpi-shaping", title: "What is Carrier DPI Shaping?", level: 2 },
          { id: "video-optimizer-nfqws", title: "Video Optimizer (nfqws Engine)", level: 2 },
          { id: "traffic-masquerade", title: "Traffic Masquerade (SNI Spoofing)", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# DPI Traffic Engine & Video Masquerade

Many mobile networks perform Deep Packet Inspection (DPI) to throttle video streams (Netflix, YouTube, Twitch) down to 480p SD quality (~1.5 to 2.5 Mbps).

![QManager RM551E Traffic engine (DPI) screen](/screenshots/features/rm551e-traffic-engine-light.webp "RM551E: Bypass video throttling or masquerade HTTPS traffic, with a live packet graph.")

---

## What is Carrier DPI Shaping?

Carrier middleboxes inspect the unencrypted **Server Name Indication (SNI)** in TLS ClientHello packets and the initial QUIC handshakes. When they see domains like \`googlevideo.com\` or \`nflxvideo.net\`, they apply a rate-limiting policer.

---

## Video Optimizer (nfqws Engine)

QManager integrates the high-performance \`nfqws\` (Netfilter Queue Web Scrambler) daemon:
- **TCP SNI Desynchronization**: Splits the TLS ClientHello packet across TCP segment boundaries, confusing carrier DPI middleboxes while allowing end servers to reassemble the stream seamlessly.
- **QUIC / HTTP/3 Desync**: Desynchronizes initial UDP QUIC packets.
- **Configurable CDN Hostlist**: Target specific video CDNs without touching banking or gaming traffic.

---

## Traffic Masquerade (SNI Spoofing)

For aggressive carrier networks, QManager provides **Traffic Masquerade**:
- Wraps outbound TCP connections in fake benign SNI headers.
- Mutually exclusive with the Video Optimizer.
- Toggle with one click in **Network > DPI Engine**.
## Screens in QManager

![QManager RM520N Traffic Engine screen](/screenshots/features/rm520n-traffic-engine-light.webp "RM520N: Traffic Engine runs the Video Optimizer or Full Bypass to get around carrier DPI throttling.")

`
      }
    ]
  },
  {
    id: "profiles",
    title: "SIM & APN Management",
    iconName: "CreditCard",
    description: "Manage multiple APN contexts, custom per-SIM configuration profiles, known SIM registry, and forbidden PLMNs.",
    articles: [
      {
        slug: "apn-management",
        category: "profiles",
        title: "APN Management & PDP Contexts",
        description: "Create, edit, and bind APN profiles across multiple PDP contexts (CID 1 to 4) with carrier presets.",
        edition: "universal",
        badge: "APN",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "apn-pdp-contexts", title: "APN & PDP Contexts Explained", level: 2 },
          { id: "carrier-presets", title: "Built-in Carrier APN Presets", level: 2 },
          { id: "manual-apn-config", title: "Manual APN Configuration", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# APN Management & PDP Contexts

An Access Point Name (APN) is the gateway between the cellular carrier's radio network and the public internet.

![QManager RM551E APN settings screen](/screenshots/features/rm551e-apn-management-light.webp "RM551E: Set the APN and IP type, and choose the carrier firmware profile.")

---

## APN & PDP Contexts Explained

Quectel modems support multiple Packet Data Protocol (PDP) contexts:
- **CID 1 (Primary)**: The primary internet APN.
- **CID 2 / 3**: Supplemental data context or IMS/VoLTE provisioning.
- **Protocol**: \`IPV4V6\` (recommended dual-stack), \`IP\` (IPv4 only), or \`IPV6\`.

---

## Built-in Carrier APN Presets

QManager includes a database of tested APN presets that automatically populate APN, authentication type (PAP/CHAP), and PDP protocol:
- **T-Mobile (USA)**: \`fast.t-mobile.com\`
- **Verizon Wireless**: \`vzwinternet\`
- **AT&T Broadband**: \`broadband\`
- **Visible Mobile**: \`VSBLINTERNET\`
- **Google Fi**: \`h2g2\`
- **Telkomsel / Indosat / XL Axiata** (Southeast Asia)
- **Vodafone / EE / O2** (Europe)

---

## Manual APN Configuration

1. In **SIM & Profiles > APN Settings**, select the target Context ID (CID 1).
2. Enter the APN string, authentication username/password (if required).
3. Click **Save & Apply**. QManager automatically executes:
   \`\`\`
   AT+CGDCONT=1,"IPV4V6","<apn_name>"
   \`\`\`
## Screens in QManager

![QManager RM551E Cellular settings screen](/screenshots/features/rm551e-cellular-settings-light.webp "RM551E: Pick the SIM slot, radio power, preferred network type and roaming behaviour.")

![QManager RM551E Network priority screen](/screenshots/features/rm551e-network-priority-light.webp "RM551E: Drag to set the order in which the modem tries 5G, LTE and WCDMA.")

![QManager RM520N APN management screen](/screenshots/features/rm520n-apn-management-light.webp "RM520N: APN Settings compares the APN you configured with what the network granted.")

`
      },
      {
        slug: "custom-sim-profiles",
        category: "profiles",
        title: "Custom SIM Profiles & Switching",
        description: "Save complete snapshots (APN + TTL + custom bands) tied to physical SIM cards for instant auto-provisioning.",
        edition: "universal",
        badge: "Profiles",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-is-sim-profile", title: "What is a Custom SIM Profile?", level: 2 },
          { id: "profile-attributes", title: "Attributes Saved in Each Profile", level: 2 },
          { id: "auto-switching-on-swap", title: "Automatic Switching on Physical SIM Swap", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Custom SIM Profiles & Switching

If you swap SIM cards between multiple providers (e.g. switching between a primary unlimited plan and a backup rural carrier), configuring APN, TTL, and band locks manually each time is tedious and error-prone.

![QManager RM551E Custom SIM profiles screen](/screenshots/features/rm551e-custom-sim-profiles-light.webp "RM551E: Bundle APN, IMEI and TTL settings into profiles and see which one is in force today.")

---

## What is a Custom SIM Profile?

A **Custom SIM Profile** is a complete, self-contained configuration snapshot saved in QManager's persistent registry.

---

## Attributes Saved in Each Profile

Each profile stores:
- **APN Credentials**: APN name, CID, authentication protocol.
- **Network Mangling**: IPv4 TTL, IPv6 Hop Limit, MTU.
- **Radio Policies**: Locked LTE/5G bands, network priority mode (NSA vs SA).
- **Optional IMEI**: Hardware identity tied to that specific carrier plan.

---

## Automatic Switching on Physical SIM Swap

When you swap SIM cards, QManager reads the new card's **ICCID** (Integrated Circuit Card ID) via \`AT+QCCID\`:
1. Checks the Known SIMs database.
2. Identifies the matching profile.
3. Automatically applies the appropriate APN, TTL, and band rules in under 5 seconds!
## Screens in QManager

![QManager RM551E IMEI settings screen](/screenshots/features/rm551e-imei-settings-light.webp "RM551E: View and change the modem IMEI, with a backup IMEI and built-in checks.")

![QManager RM520N IMEI settings screen](/screenshots/features/rm520n-imei-settings-light.webp "RM520N: IMEI Settings reads, checks, and writes the modem's IMEI, with a backup copy.")

![QManager RM520N Custom SIM profiles screen](/screenshots/features/rm520n-custom-sim-profiles-light.webp "RM520N: Custom SIM Profiles bundle APN, TTL, and a connection scenario, with a daily schedule.")

`
      },
      {
        slug: "known-sims",
        category: "profiles",
        title: "Known SIMs Registry & Auto-Detection",
        description: "Manage registered SIM ICCIDs, carrier nicknames, and automatic hardware detection.",
        edition: "universal",
        badge: "SIM Registry",
        readTime: "3 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "managing-known-sims", title: "Managing Known SIMs", level: 2 },
          { id: "iccid-detection", title: "ICCID & IMSI Detection", level: 2 }
        ],
        content: `
# Known SIMs Registry & Auto-Detection

The **Known SIMs Registry** provides an inventory of all SIM cards that have been inserted into the modem.

---

## Managing Known SIMs

In **SIM & Profiles > Known SIMs**:
- Assign human-friendly nicknames (e.g. *"T-Mobile Business Unlimited 5G"*, *"Verizon Rural Backup"*).
- View card metadata: **ICCID**, **IMSI**, **Serving Operator**, and **Last Active Timestamp**.
- Set default fallback profiles for unrecognized guest SIMs.

---

## ICCID & IMSI Detection

When a card is inserted, QManager queries:
\`\`\`
AT+QCCID   # Reads 20-digit SIM serial number
AT+CIMI    # Reads International Mobile Subscriber Identity
\`\`\`
If a new SIM is detected, a setup prompt appears allowing you to create a new profile with one click.
`
      },
      {
        slug: "scenario-profile-binding",
        category: "profiles",
        title: "Scenario-Based Profile Binding",
        description: "Automatically switch network profiles based on schedule, signal degradation, or data caps.",
        edition: "universal",
        badge: "Automation",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-are-scenarios", title: "What are Connection Scenarios?", level: 2 },
          { id: "triggers-and-actions", title: "Supported Triggers & Automation", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Scenario-Based Profile Binding

Automate how your modem reacts to changing physical and network conditions.

![QManager RM551E Connection scenarios screen](/screenshots/features/rm551e-connection-scenarios-light.webp "RM551E: Scenarios like Balanced, Gaming and Streaming, scheduled per profile.")

---

## What are Connection Scenarios?

A **Scenario** connects an event trigger to an automated profile action. For example:
- **Night-time Mode**: Switch to high-band 5G when nighttime congestion eases.
- **Signal Threshold Trigger**: If primary carrier RSRP drops below -115 dBm for 10 minutes, switch to backup carrier.
- **Data Cap Guard**: If monthly data usage approaches limit, switch to secondary SIM.

---

## Supported Triggers & Automation

- **Time of Day (Cron)**: Scheduled recurring switches.
- **Link Quality Failure**: Triggered when ping latency exceeds 250ms or packet loss exceeds 20%.
- **SIM Slot Switch**: Triggers \`AT+QUIMSLOT=1\` or \`2\` on dual-SIM hardware.
## Screens in QManager

![QManager RM520N Connection scenarios screen](/screenshots/features/rm520n-connection-scenarios-light.webp "RM520N: Saved profiles sit beside the connection scenarios, the radio and band setups a profile can switch between.")

`
      },
      {
        slug: "fplmn-management",
        category: "profiles",
        title: "Forbidden PLMN (FPLMN) Clearing",
        description: "Inspect and clear the Forbidden PLMN list on your SIM card to restore connection to roaming carriers.",
        edition: "universal",
        badge: "SIM Tool",
        readTime: "3 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "what-is-fplmn", title: "What is an FPLMN?", level: 2 },
          { id: "clearing-fplmn", title: "Clearing the FPLMN List", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Forbidden PLMN (FPLMN) Clearing

When a cellular modem attempts to register on a tower that temporarily rejects it, the SIM card writes that carrier's Public Land Mobile Network (PLMN) ID into its internal **Forbidden PLMN (FPLMN)** file.

![QManager RM551E Blocked networks (FPLMN) screen](/screenshots/features/rm551e-fplmn-settings-light.webp "RM551E: See whether your SIM is blocking networks and clear the list in one click.")

---

## What is an FPLMN?

Once written to the SIM's FPLMN list, the modem will **never attempt to connect to that network again**, even if the network issue is resolved and the tower is broadcasting at full signal!

---

## Clearing the FPLMN List

QManager allows you to inspect and clear the SIM card's forbidden list with one click:
1. Go to **SIM & Profiles > FPLMN Management**.
2. View current forbidden carrier entries (e.g. \`310410\`, \`311480\`).
3. Click **Clear All FPLMN Entries**.

Under the hood, QManager writes blank entries directly to the SIM elementary file:
\`\`\`
AT+CRSM=214,28539,0,0,12,"FFFFFFFFFFFFFFFFFFFFFFFF"
\`\`\`
## Screens in QManager

![QManager RM520N Blocked networks (FPLMN) screen](/screenshots/features/rm520n-blocked-networks-light.webp "RM520N: Blocked Networks shows the SIM's forbidden network list and lets you clear it.")

`
      },
      {
        slug: "carrier-setup-verizon",
        category: "profiles",
        title: "Multi-PDP Carrier Setup: Verizon 5G & IMS",
        description: "Configuring Verizon Wireless multi-PDP architecture on Quectel modems: IMS on PDP 1, vzwadmin on PDP 2, vzwinternet on PDP 3, and QMAP routing rule bug mitigations.",
        edition: "universal",
        badge: "Carrier Deep-Dive",
        readTime: "5 min read",
        updatedAt: "2026-10-24",
        toc: [
          { id: "verizon-multi-pdp-architecture", title: "Verizon 3-PDP Architecture & Carrier Requirements", level: 2 },
          { id: "pdp-context-provisioning", title: "PDP Context Provisioning via AT+CGDCONT", level: 2 },
          { id: "qmap-mpdn-routing-rule", title: "QMAP MPDN Routing Rules for Broadband Data", level: 2 },
          { id: "preserving-ims-and-sms", title: "Preserving IMS Voice/SMS While Routing Data", level: 2 },
          { id: "firmware-qmap-bug-mitigation", title: "Mitigating the Dec 2024 Firmware QMAP Release Bug", level: 2 },
          { id: "validation-and-troubleshooting", title: "Validation, Handshake Verification & Troubleshooting", level: 2 },
          { id: "community-credits", title: "Community Heritage & Research Credits", level: 2 }
        ],
        content: `
# Multi-PDP Carrier Setup: Verizon 5G & IMS

Unlike carriers such as T-Mobile or AT&T that multiplex data and signaling over a single APN context, Verizon Wireless (VZW) requires a strict **Multi-PDP (Packet Data Protocol) context architecture** on cellular modems. Failing to configure these separate contexts results in rejected registration, lack of SMS reception, or total loss of internet routing.

> [!NOTE]
> **Research & Heritage**: The precise Multi-PDP QMAP routing rules and the critical December 2024 firmware workaround documented in this guide were reverse engineered and published by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** in the [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki) and [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit).

---

## Verizon 3-PDP Architecture & Carrier Requirements

Verizon Wireless provisions cellular devices across three distinct APN bearers:

| PDP Context ID | APN Name | Protocol | Network Function & Purpose |
|---|---|---|---|
| **PDP 1** | \`IMS\` | IPV4V6 | IP Multimedia Subsystem: Handles VoNR/VoLTE signaling, SMS over IMS, and carrier network handshakes. |
| **PDP 2** | \`vzwadmin\` | IPV4V6 | Verizon Device Management (OMA-DM), administrative provisioning, and SIM profile verification. |
| **PDP 3** | \`vzwinternet\` | IPV4V6 | Customer Broadband Payload: All public internet and user data traffic traverses this context. |

If a modem defaults all IP routing to PDP Context 1 (\`IMS\`), general internet traffic will be rejected by Verizon's core packet gateway with error code \`403 Forbidden\` or throttled to 0 kbps.

---

## PDP Context Provisioning via AT+CGDCONT

To establish the 3-PDP structure on your Quectel modem, open the **QManager AT Terminal** or serial console and issue:

\`\`\`
AT+CGDCONT=1,"IPV4V6","IMS"
AT+CGDCONT=2,"IPV4V6","vzwadmin"
AT+CGDCONT=3,"IPV4V6","vzwinternet"
\`\`\`

Verify the configuration by querying:
\`\`\`
AT+CGDCONT?
\`\`\`

---

## QMAP MPDN Routing Rules for Broadband Data

In standalone RGMII / on-modem Linux router mode, Quectel modems use **QMAP (Qualcomm Multiplexing and Aggregation Protocol)** to route traffic between baseband PDP contexts and the local network interface (\`eth0\` or \`rmnet_data0\`).

To direct user data traffic to PDP Context 3 (\`vzwinternet\`), configure the MPDN rule:

\`\`\`
AT+QMAP="mpdn_rule",0,3,0,0,1
\`\`\`

### Parameter Breakdown:
- **\`0\`**: Profile rule index (primary rule).
- **\`3\`**: Target PDP context ID (binds to Context 3 \`vzwinternet\`).
- **\`0\`**: VLAN tagging (0 = untagged).
- **\`0\`**: IP type (0 = Dual-stack IPv4/IPv6 auto).
- **\`1\`**: Target hardware network interface (1 = RGMII / \`eth0\`).

Save the configuration and reboot the radio:
\`\`\`
AT+CFUN=0
AT+CFUN=1
\`\`\`

---

## Preserving IMS Voice/SMS While Routing Data

A primary advantage of the 3-PDP architecture is that incoming carrier SMS messages (such as two-factor verification codes and account alerts) are delivered reliably over the \`IMS\` bearer on PDP 1, while high-throughput internet downloads pass unhindered through PDP 3.

QManager's SMS engine automatically reads incoming messages from modem memory regardless of which PDP context handles active data routing.

---

## Mitigating the Dec 2024 Firmware QMAP Release Bug

> [!WARNING]
> **Critical Firmware Bug Notice**:
> In firmware updates released by Quectel in **December 2024 and early 2025** (such as certain revisions of \`RM520NGLAAR03A04\` and \`RM551E\`), a software regression in the internal \`mobileap\` daemon causes \`AT+QMAP="mpdn_rule",0,3,0,0,1\` to intermittently fail to assign an IP address or drop the \`eth0\` link carrier.

### Upstream Workaround:
As documented by **iamromulan**, if you encounter link failure on December 2024 firmware, you can bypass the QMAP bug by swapping the context roles:

1. Map \`vzwinternet\` directly to PDP Context 1:
   \`\`\`
   AT+CGDCONT=1,"IPV4V6","vzwinternet"
   AT+CGDCONT=2,"IPV4V6","vzwadmin"
   AT+CGDCONT=3,"IPV4V6","IMS"
   \`\`\`
2. Bind the QMAP MPDN rule to PDP Context 1:
   \`\`\`
   AT+QMAP="mpdn_rule",0,1,0,0,1
   \`\`\`
3. Reboot the baseband:
   \`\`\`
   AT+CFUN=1,1
   \`\`\`
This ensures broadband data functions stably while bypassing the corrupted MPDN rule router in the buggy firmware release.

---

## Validation, Handshake Verification & Troubleshooting

Verify that all contexts are active and have received IP leases:

1. Query active network registration:
   \`\`\`
   AT+C5GREG?
   AT+CEREG?
   \`\`\`
2. Query IP addresses assigned to each PDP context:
   \`\`\`
   AT+CGPADDR
   \`\`\`
   Expected response:
   \`\`\`
   +CGPADDR: 1,"10.x.x.x","2607:fb90:..."
   +CGPADDR: 2,"10.y.y.y","2607:fb90:..."
   +CGPADDR: 3,"100.z.z.z","2607:fb90:..."
   \`\`\`
3. Confirm that PDP 3 holds a valid public/CGNAT broadband IP and verify ping connectivity from QManager:
   \`\`\`bash
   ping -c 4 8.8.8.8
   \`\`\`

---

## Community Heritage & Research Credits

This multi-PDP configuration methodology and the December 2024 firmware bug mitigation were investigated and open-sourced by:
- **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** — Creator of [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki) & [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit).
`
      }
    ]
  },
  {
    id: "resilience",
    title: "Watchdog & Resilience",
    iconName: "ShieldCheck",
    description: "4-tier auto-recovery pipeline, connection watchdog, dual-SIM failover, and adaptive polling throttling.",
    articles: [
      {
        slug: "connection-watchdog",
        category: "resilience",
        title: "Connection Watchdog & Auto-Recovery",
        description: "Monotonic staleness counters, multi-tier recovery pipeline, and token-bucket reboot protection.",
        edition: "universal",
        badge: "Resilience",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "the-staleness-counter", title: "Monotonic Staleness Counter", level: 2 },
          { id: "the-4-tier-recovery-pipeline", title: "The 4-Tier Recovery Pipeline", level: 2 },
          { id: "hardware-ethernet-watchdog", title: "Hardware Ethernet & PCIe Link Watchdog (ethernet_watchdog.sh)", level: 2 },
          { id: "cfunfix-boot-recovery", title: "RF State Recovery on Boot (cfunfix.service)", level: 2 },
          { id: "token-bucket-rate-limiting", title: "Token-Bucket Reboot Protection", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Connection Watchdog & Auto-Recovery

Cellular connections are prone to silent lockups, tower handoff freezes, and carrier lease expirations. QManager's **Connection Watchdog** guarantees unattended 24/7 reliability.

![QManager RM551E Connection watchdog screen](/screenshots/features/rm551e-watchdog-light.webp "RM551E: The watchdog watches the internet link and climbs a recovery ladder when it drops.")

---

## Monotonic Staleness Counter

Rather than relying on basic ping probes that can fail during transient packet drops, QManager uses a **Monotonic Staleness Counter**:
- Sends lightweight ICMP and DNS probes to diverse endpoints (Cloudflare, Google, OpenDNS).
- A single failure does not trigger a panic.
- If failures persist consecutively across the configured threshold (e.g. 90 seconds), the multi-tier recovery pipeline engages.

---

## The 4-Tier Recovery Pipeline

QManager avoids premature reboots by attempting least-disruptive interventions first:

\`\`\`
[Link Outage Detected]
         │
         ▼
[Tier 1: Interface Reset] ──> Soft restart network interface (ifup / ip link)
         │ (Still offline after 30s)
         ▼
[Tier 2: Radio Toggle]    ──> Cycle baseband RF via AT+CFUN=0 then AT+CFUN=1
         │ (Still offline after 60s)
         ▼
[Tier 3: SIM Failover]     ──> Switch to secondary SIM card or alternate APN
         │ (Still offline after 90s)
         ▼
[Tier 4: System Reboot]   ──> Full hardware reset (reboot)
\`\`\`

---

## Hardware Ethernet & PCIe Link Watchdog (ethernet_watchdog.sh)

Beyond cellular WAN packet failure, standalone carrier boards (such as Rework 5G2PHY or Waveshare PCIe boards) can suffer from PCIe bus desynchronization or Realtek RTL8125 PHY lockups under sustained heavy throughput.

### The Upstream \`ethernet_watchdog.sh\` Architecture
Upstream research by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** identified distinct kernel driver failure signatures in the Linux ring buffer:
- \`eth0: cmd = 0xff\` (Indicates the PCIe bus has fallen off the root complex or register reads return all 1s).
- \`eth0: pci link is down\` (PHY link partner dropped or PCIe controller entered an unrecoverable sleep state).

The upstream \`ethernet_watchdog.sh\` daemon continuously monitors \`dmesg\` for these signatures:
1. When \`cmd = 0xff\` is detected, the watchdog avoids an immediate modem reboot.
2. It attempts to unbind and reload the kernel driver:
   \`\`\`sh
   echo "0000:01:00.0" > /sys/bus/pci/drivers/r8125/unbind
   sleep 1
   echo "0000:01:00.0" > /sys/bus/pci/drivers/r8125/bind
   \`\`\`
3. If reloading the driver fails to restore link within 15 seconds, it triggers a hardware PCIe reset line before escalating to a full system restart.

---

## RF State Recovery on Boot (cfunfix.service)

In certain power loss scenarios or carrier board brownouts, Quectel baseband firmware can initialize with its RF circuitry in offline mode (\`CFUN=0\` or \`CFUN=4\`), leaving the modem unable to register on cellular towers despite the Linux OS running normally.

Upstream's **\`cfunfix.service\`** resolves this condition by executing early in the boot sequence:
1. Queries the current radio state: \`AT+CFUN?\`.
2. If the response is not \`+CFUN: 1\`, it issues:
   \`\`\`
   AT+CFUN=1
   \`\`\`
3. Verifies that the SIM card elementary files are unlocked and forces network registration (\`AT+COPS=0\`).

---

## Token-Bucket Reboot Protection

> [!CAUTION]
> If a cell tower has a major fiber backhaul cut, a dumb watchdog will continuously reboot the router in an infinite loop, wearing out NAND flash and burning power.

QManager incorporates a **Token-Bucket Rate Limiter**:
- Restricts total reboots to a maximum (e.g. 3 reboots in a 2-hour window).
- If the token bucket is exhausted, QManager halts reboot loops, keeps services alive for local access, and sends an alert over the cellular control channel.
## Screens in QManager

![QManager RM551E Network events screen](/screenshots/features/rm551e-network-events-light.webp "RM551E: A timeline of band changes, handoffs, outages and recoveries.")

![QManager RM520N Network events screen](/screenshots/features/rm520n-network-events-light.webp "RM520N: Network Events logs band changes, handoffs, outages, and recoveries, newest first.")

![QManager RM551E Latency monitor screen](/screenshots/features/rm551e-latency-monitoring-light.webp "RM551E: Live and historical latency, plus how fast your favourite sites answer.")

![QManager RM520N Latency monitor screen](/screenshots/features/rm520n-latency-monitor-light.webp "RM520N: Latency Monitor charts round-trip time to the probe target and to the sites you track.")

![QManager RM551E Connection quality screen](/screenshots/features/rm551e-connection-quality-light.webp "RM551E: Choose the ping targets and the latency and loss limits that count as a bad link.")

![QManager RM520N Connection quality screen](/screenshots/features/rm520n-connection-quality-light.webp "RM520N: Connection Quality sets the probe targets and the latency and loss limits that raise events.")

![QManager RM520N Watchdog screen](/screenshots/features/rm520n-watchdog-light.webp "RM520N: The Watchdog probes the link and climbs a recovery ladder when it goes down.")

`
      },
      {
        slug: "sim-failover",
        category: "resilience",
        title: "Dual SIM Auto-Failover",
        description: "Automatic hardware SIM switching on link loss, high latency, or monthly data exhaustion.",
        edition: "universal",
        badge: "Failover",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "hardware-dual-sim", title: "Hardware Dual-SIM Support", level: 2 },
          { id: "failover-criteria", title: "Failover Criteria & Hysteresis", level: 2 }
        ],
        content: `
# Dual SIM Auto-Failover

For mission-critical internet deployments, QManager supports dual physical SIM slots and eSIM switching.

---

## Hardware Dual-SIM Support

Quectel RM520N modems feature dual USIM interfaces (SIM1 and SIM2). Switching between slots is executed in hardware via:
\`\`\`
AT+QUIMSLOT=1   # Activate Slot 1
AT+QUIMSLOT=2   # Activate Slot 2
\`\`\`

---

## Failover Criteria & Hysteresis

In **Resilience > SIM Failover**:
- **Primary SIM Selection**: Choose default everyday SIM.
- **Failover Threshold**: Trigger failover after \`X\` consecutive ping failures.
- **Failback Hysteresis**: Prevent flapping! Once failed over to SIM 2, QManager will only revert to SIM 1 after SIM 1 has been validated online and stable for at least 15 continuous minutes.
`
      },
      {
        slug: "adaptive-polling",
        category: "resilience",
        title: "Adaptive Polling Engine & CPU Throttling",
        description: "Dynamic telemetry polling tiers (Active, Idle, Sleep) preventing modem baseband AT lockups.",
        edition: "universal",
        badge: "Core Engine",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "the-at-lockup-problem", title: "The AT Command Lockup Problem", level: 2 },
          { id: "dynamic-polling-tiers", title: "Dynamic Polling Tiers", level: 2 }
        ],
        content: `
# Adaptive Polling Engine & CPU Throttling

Continuous high-frequency AT command polling can cause Quectel baseband processors to freeze or crash the USB serial interface.

![QManager RM551E Adaptive polling screen](/screenshots/features/rm551e-adaptive-polling-light.webp "RM551E: Query the modem less often while no one has QManager open.")

---

## The AT Command Lockup Problem

When traditional GUIs flood the modem's serial port with AT commands while heavy cellular download traffic is active, the modem's internal Cortex-A7 core starves, dropping packets and freezing the web UI.

---

## Dynamic Polling Tiers

QManager solves this with an **Adaptive Polling Engine**:

| Engine State | Condition | Polling Rate | Telemetry Depth |
|---|---|---|---|
| **Active Tier** | Web browser dashboard open and in focus | 1,000 ms (1s) | Full 4x4 MIMO, CA, RSRP, SINR |
| **Idle Tier** | Browser tab minimized or inactive | 5,000 ms (5s) | Core signal metrics only |
| **Deep Sleep Tier**| No web clients connected | 30,000 ms (30s) | Watchdog ping and health check only |

This reduces modem CPU utilization from ~35% down to under 1.5% during normal background operation!
`
      },
      {
        slug: "system-health-check",
        category: "resilience",
        title: "System Health Checks & Loop Prevention",
        description: "Netifd phantom WAN guard, memory monitoring, and baseband crash recovery.",
        edition: "universal",
        badge: "Health",
        readTime: "3 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "phantom-wan-guard", title: "WAN Interface Guard (OpenWRT)", level: 2 },
          { id: "memory-and-storage-checks", title: "Memory & Storage Monitoring", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# System Health Checks & Loop Prevention

QManager protects the operating system against common embedded Linux bugs.

![QManager RM551E System health check screen](/screenshots/features/rm551e-system-health-check-light.webp "RM551E: Run a full self-test and download a support bundle.")

---

## WAN Interface Guard (OpenWRT)

In OpenWRT, when a modem is re-initialized, \`netifd\` frequently generates duplicate "phantom" WAN interfaces (e.g. \`wan_4\`, \`wan_6\`) that spin in high-CPU retry loops.

QManager's **WAN Guard** monitors \`ubus\` network events, detects orphaned interfaces, and cleans them up automatically.

---

## Memory & Storage Monitoring

- Tracks \`/tmp\` and \`/var/log\` usage to prevent RAM disk overflow.
- Automatically trims rotated log files.
- Displays live system load average and temperature readouts from modem thermal zones.
## Screens in QManager

![QManager RM551E System settings screen](/screenshots/features/rm551e-system-settings-light.webp "RM551E: Set the time zone and units, and schedule automatic reboots.")

![QManager RM520N System health check screen](/screenshots/features/rm520n-system-health-check-light.webp "RM520N: The System Health Check tests every QManager subsystem and builds a support bundle.")

`
      }
    ]
  },
  {
    id: "messaging",
    title: "SMS, Alerts & Notifications",
    iconName: "Mail",
    description: "SMS inbox/outbox, automatic OTP verification code forwarding, email alerts, and control-channel SMS notifications.",
    articles: [
      {
        slug: "sms",
        category: "messaging",
        title: "SMS Inbox, Outbox & PDU Dispatch",
        description: "Send and receive SMS messages directly in the web browser with full Unicode and multi-part support.",
        edition: "universal",
        badge: "SMS",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "browser-sms-client", title: "Browser SMS Client Features", level: 2 },
          { id: "sending-sms-via-at", title: "Sending SMS Messages", level: 2 },
          { id: "storage-management", title: "SIM vs ME Storage Management", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# SMS Inbox, Outbox & PDU Dispatch

Manage cellular text messages without taking your SIM card out of the router.

![QManager RM551E SMS inbox screen](/screenshots/features/rm551e-sms-inbox-light.webp "RM551E: Read text messages received by the modem, grouped into conversations.")

---

## Browser SMS Client Features

- **Full Unicode Support**: Supports UTF-8 and GSM 7-bit characters, emojis, and non-Latin alphabets (Arabic, Cyrillic, Chinese).
- **Multi-part Concatenation**: Automatically joins multi-part SMS messages into single readable conversations.
- **Real-Time Badge Counters**: Unread SMS counter appears directly in QManager's top navigation bar.

---

## Sending SMS Messages

1. Go to **Messages > SMS**.
2. Click **Compose Message**.
3. Enter recipient phone number with international country code (e.g. \`+12025550199\`).
4. Type message and click **Send**.

---

## SIM vs ME Storage Management

Quectel modems can store SMS messages in the SIM card memory (\`SM\`) or the modem's onboard flash (\`ME\`). QManager allows you to select storage locations and provides a one-click **Clear Read Messages** button to prevent SIM storage overflow.
## Screens in QManager

![QManager RM551E SMS conversation screen](/screenshots/features/rm551e-sms-conversation-light.webp "RM551E: Open a conversation to read the full thread and reply from the browser.")

![QManager RM520N SMS Center screen](/screenshots/features/rm520n-sms-center-light.webp "RM520N: SMS Center shows messages from both modem and SIM memory and lets you send new ones.")

`
      },
      {
        slug: "sms-forwarding",
        category: "messaging",
        title: "SMS Auto-Forwarding",
        description: "Automatically forward incoming carrier text messages, bank OTPs, and verification codes to email or Telegram.",
        edition: "universal",
        badge: "Forwarding",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "why-sms-forwarding", title: "Why Enable SMS Forwarding?", level: 2 },
          { id: "forwarding-destinations", title: "Supported Forwarding Destinations", level: 2 },
          { id: "configuring-forwarding", title: "Configuring Forwarding Rules", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# SMS Auto-Forwarding

Never miss a two-factor authentication code (2FA) or carrier account balance alert sent to your modem's phone number.

![QManager RM551E SMS forwarding screen](/screenshots/features/rm551e-sms-forwarding-light.webp "RM551E: Forward every incoming text to another phone number automatically.")

---

## Why Enable SMS Forwarding?

When using dedicated cellular data plans, carriers frequently send verification codes, usage cap warnings, and billing notifications via SMS. Logging into your router just to check a text message is inconvenient.

---

## Supported Forwarding Destinations

- **Forward to Email**: Delivers messages via SMTP (\`msmtp\`) directly to your personal email inbox.
- **Forward to Telegram Bot**: Instant push notification to your phone or private Telegram channel.
- **Forward to Secondary Phone Number**: Re-sends the SMS over the cellular network to your personal smartphone.

---

## Configuring Forwarding Rules

1. In **Messages > SMS Forwarding**, click **Enable Auto-Forwarding**.
2. Select destination (e.g. **Telegram Bot**).
3. Enter your Telegram Bot Token and Chat ID.
4. Click **Send Test Message** to verify delivery.
## Screens in QManager

![QManager RM520N SMS forwarding screen](/screenshots/features/rm520n-sms-forwarding-light.webp "RM520N: SMS Forwarding relays every incoming message to another number and reports delivery health.")

`
      },
      {
        slug: "alerts",
        category: "messaging",
        title: "Centralized System Alerts & Notifications",
        description: "Email notifications via msmtp and control-channel SMS downtime alerts during complete WAN outages.",
        edition: "universal",
        badge: "Alerts",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "how-alerts-work", title: "How QManager Alerts Work", level: 2 },
          { id: "sms-control-channel-alerts", title: "Cellular Control Channel Alerts", level: 2 },
          { id: "email-smtp-setup", title: "Email (SMTP) Alert Configuration", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Centralized System Alerts & Notifications

Stay informed of cellular drops, carrier tower handoffs, SIM swaps, and hardware reboots.

![QManager RM551E Alerts screen](/screenshots/features/rm551e-alerts-light.webp "RM551E: Get an SMS or email when the connection drops, comes back or the modem restarts.")

---

## How QManager Alerts Work

Traditional routers send email alerts when internet goes down. But if internet is down, email cannot be sent!

QManager solves this with a **Dual-Channel Notification Strategy**:
1. **Email Alerts (Post-Recovery)**: Sent once WAN connectivity is restored, providing full incident report, downtime duration, and recovery tier details.
2. **SMS Control Channel Alerts (During Outage)**: Sent *during the active outage* over the cellular baseband control channel via \`sms_tool\`, reaching your phone even while the IP data link is completely offline!

---

## Cellular Control Channel Alerts

- Reaches you even if data routing is frozen.
- Features de-duplication to prevent SMS spam during transient tower flickers.
- Configurable threshold (e.g. only alert if outage exceeds 5 minutes).

---

## Email (SMTP) Alert Configuration

Configure lightweight \`msmtp\` in **Messages > Alert Settings**:
- Host: \`smtp.gmail.com\` (or any custom SMTP server)
- Port: \`587\` (STARTTLS) or \`465\` (TLS)
- App Password authentication.
## Screens in QManager

![QManager RM520N Alerts screen](/screenshots/features/rm520n-alerts-light.webp "RM520N: Alerts sends SMS, email, or Discord messages when the connection drops or the modem restarts.")

`
      }
    ]
  },
  {
    id: "management",
    title: "Remote Management & Tools",
    iconName: "Wrench",
    description: "Tailscale/Netbird mesh VPN, serialized AT terminal broker, ping/traceroute diagnostics, backup & restore, and Prometheus metrics.",
    articles: [
      {
        slug: "tailscale-vpn",
        category: "management",
        title: "Tailscale & Netbird VPN Remote Access",
        description: "One-click mesh VPN setup to access QManager securely over the internet without public IPs or port forwarding.",
        edition: "universal",
        badge: "Remote Access",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "bypassing-cgnat", title: "Bypassing Carrier CGNAT", level: 2 },
          { id: "one-click-tailscale", title: "One-Click Tailscale Setup", level: 2 },
          { id: "tailscale-ssh-toggle", title: "Tailscale SSH & Security ACLs", level: 2 },
          { id: "port-firewall", title: "Built-in Interface Firewall", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Tailscale & Netbird VPN Remote Access

Mobile networks place cellular modems behind strict **Carrier-Grade NAT (CGNAT)**, making it impossible to access your router from outside using standard DDNS or port forwarding.

![QManager RM551E Tailscale VPN screen](/screenshots/features/rm551e-tailscale-light.webp "RM551E: Join your tailnet to reach the modem from anywhere and see your other devices.")

---

## Bypassing Carrier CGNAT

QManager integrates native **Tailscale** and **Netbird** mesh VPN support:
- Connects outbound over WireGuard.
- Assigns a secure 100.x.x.x Tailscale IP to your modem.
- Enables you to reach QManager from anywhere in the world on your laptop, phone, or tablet.

---

## One-Click Tailscale Setup

1. In QManager, go to **Remote Management > Tailscale**.
2. Click **Install / Connect**.
3. Copy the generated one-time authentication URL and authorize the modem in your Tailscale admin console.
4. The device displays a green status badge and its assigned Tailscale IP address.

---

## Tailscale SSH & Security ACLs

QManager features a one-click **Tailscale SSH** toggle:
- Access your modem's root terminal securely without SSH keys or open ports.
- The toggle state is preserved across reboots and reconnections.

---

## Built-in Interface Firewall

To prevent unauthorized access, QManager's built-in firewall:
- Restricts web ports (80/443) exclusively to the local LAN and Tailscale interfaces.
- Blocks all inbound connection requests originating from the cellular WAN.
## Screens in QManager

![QManager RM551E NetBird VPN screen](/screenshots/features/rm551e-netbird-light.webp "RM551E: Connect the modem to a NetBird mesh network and see which peers are online.")

![QManager RM520N Tailscale VPN screen](/screenshots/features/rm520n-tailscale-vpn-light.webp "RM520N: Tailscale VPN joins the modem to your tailnet and lists the other devices on it.")

`
      },
      {
        slug: "at-broker",
        category: "management",
        title: "Serialized Interactive AT Terminal Broker",
        description: "Thread-safe serial AT broker daemon preventing command collisions, with history and safety guardrails.",
        edition: "universal",
        badge: "Terminal",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "the-broker-architecture", title: "The Serial AT Broker Architecture", level: 2 },
          { id: "virtual-pty-vs-serialized-broker", title: "Virtual PTY Bridging vs Compiled Broker (socat-at-bridge)", level: 2 },
          { id: "compound-chaining-syntax", title: "Atomic Compound Chaining Syntax (\";\")", level: 2 },
          { id: "interactive-terminal-features", title: "Interactive Web Terminal Features", level: 2 },
          { id: "safety-guardrails", title: "Safety Guardrails & Blocked Commands", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Serialized Interactive AT Terminal Broker

The **AT Terminal** gives advanced users direct access to the modem's baseband processor while preventing crashes.

![QManager RM551E AT terminal screen](/screenshots/features/rm551e-at-terminal-light.webp "RM551E: Send AT commands to the modem and read the raw replies.")

---

## The Serial AT Broker Architecture

Cellular baseband ports cannot handle concurrent callers: if two processes send AT commands simultaneously to \`/dev/smd11\` or \`/dev/ttyUSB2\`, both commands corrupt and the serial channel locks up.

QManager serializes every AT interaction via \`qcmd\`:
- **RM520N & SDX55/SDX6X Linux**: Uses POSIX \`flock\` on \`/tmp/qmanager_at.lock\` to gate access through the native ARM binary \`atcli_smd11\`, writing directly to the hardware SMD channel at \`/dev/smd11\` without requiring socat or extra bridge daemons.
- **RM551E & OpenWRT**: Serializes access through \`qcmd\` and the \`qmanager_atd\` daemon over Quectel serial device channels.
- Guarantees sequential atomic command execution with deterministic lock timeouts and zero collision risk.

---

## Virtual PTY Bridging vs Compiled Broker (socat-at-bridge)

In early open-source Quectel toolkit implementations (such as Nate Carlson and Cameron Thompson's **\`socat-at-bridge\`**), concurrent AT access was achieved by spawning virtual pseudo-terminals (PTYs) using \`socat\`:
- \`/dev/ttyIN\` was bridged to \`/dev/ttyOUT\` forwarding into \`/dev/smd11\` (modem control channel).
- Secondary PTYs (\`/dev/ttyIN2\` / \`/dev/ttyOUT2\`) forwarded to \`/dev/smd7\` for diagnostic telemetry, while OpenWRT utilized \`/dev/ttySMD11\`.

### Comparative Architectural Analysis:
| Architecture | Mechanism | RAM / CPU Footprint | Collision Resilience | Round-Trip Latency |
|---|---|---|---|---|
| **Upstream \`socat-at-bridge\`** | Background \`socat\` PTY processes | High (~15–20 MB RAM per daemon); prone to buffer bloat under rapid polling. | Weak: Simultaneous writes can interleave characters if multiple scripts write without locks. | ~4–8 ms per transaction |
| **QManager Compiled Broker** | Native Rust ARM binary \`atcli_smd11\` with POSIX \`flock\` on \`/tmp/qmanager_at.lock\` | Zero idle daemon memory; lightweight on-demand invocation. | Absolute: Hard kernel mutex guarantees complete command isolation. | < 1 ms direct SMD register write |

---

## Atomic Compound Chaining Syntax (";")

When executing complex multi-step reconfigurations—such as switching APN and restarting the cellular transceiver—issuing individual AT commands sequentially over the terminal introduces latency and intermediate error states.

Quectel Qualcomm basebands support **Atomic Compound Chaining** delimited by a semicolon (\`;\`):

\`\`\`
AT+CFUN=0;+CGDCONT=1,"IPV4V6","fast.t-mobile.com";+CFUN=1
\`\`\`

### Chaining Rules:
1. The prefix \`AT\` is supplied only once at the very beginning of the command string.
2. Each subsequent command is chained with a semicolon (\`;\`) followed immediately by the command symbol (e.g. \`;+CGDCONT=...\`).
3. Commands execute sequentially in a single baseband thread without yielding the serial lock to background pollers.

---

## Interactive Web Terminal Features

- **Command History**: Navigate previous commands with Up/Down arrow keys.
- **Command Auto-complete**: Suggests official Quectel AT syntax as you type.
- **Copy Output**: One-click button to copy modem response logs for support.

---

## Safety Guardrails & Blocked Commands

To protect against accidental modem bricking, QManager warns or blocks destructive commands:
- \`AT+QPOWD\` (Immediate unclean power down).
- Erase partition or invalid NVRAM write commands.
## Screens in QManager

![QManager RM551E Hardware offload and host AT ports screen](/screenshots/features/rm551e-hardware-light.webp "RM551E: Turn hardware packet offload and host AT command access on or off.")

![QManager RM520N AT terminal screen](/screenshots/features/rm520n-at-terminal-light.webp "RM520N: The AT Terminal sends AT commands to the modem and shows the raw replies.")

`
      },
      {
        slug: "diagnostics",
        category: "management",
        title: "Diagnostics, Ping, Traceroute & Sysfs Inspector",
        description: "Built-in network diagnostic utilities, ICMP ping testing, MTU path discovery, and sysfs radio inspection.",
        edition: "universal",
        badge: "Tools",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "network-ping-and-traceroute", title: "Network Ping & Traceroute", level: 2 },
          { id: "sysfs-radio-inspector", title: "Sysfs Radio Node Inspector", level: 2 },
          { id: "system-log-viewer", title: "System Log Viewer & Search", level: 2 },
          { id: "screens-in-qmanager", title: "Screens in QManager", level: 2 }
        ],
        content: `
# Diagnostics, Ping, Traceroute & Sysfs Inspector

A full suite of network troubleshooting utilities built directly into the web UI.

![QManager RM551E System logs screen](/screenshots/features/rm551e-system-logs-light.webp "RM551E: Filter QManager's log by severity and component to see what each part has been doing.")

---

## Network Ping & Traceroute

In **Tools > Diagnostics**:
- **Continuous Ping**: Measure latency, jitter, and standard deviation against customizable target hosts (e.g. \`1.1.1.1\`, \`8.8.8.8\`).
- **Traceroute**: Map out every network hop between your modem and target destination to identify carrier packet loss.
- **DNS Lookup**: Verify resolution time and returned IP addresses.

---

## Sysfs Radio Node Inspector

On the RM520N-GL, QManager can inspect raw kernel sysfs radio nodes:
- \`/sys/class/net/rmnet_data0/\` statistics.
- Hardware temperature sensors (MDM core, PA thermal sensors).
- Transmit and receive byte counters with error drop rates.

---

## System Log Viewer & Search

View unified system logs (\`logread\` on OpenWRT, \`journalctl\` on RM520N) with instant keyword filtering to diagnose connection drops and watchdog events.
## Screens in QManager

![QManager RM520N System settings screen](/screenshots/features/rm520n-system-settings-light.webp "RM520N: System Settings sets the time zone, units, scheduled reboot, and remembered SIMs.")

![QManager RM520N System logs screen](/screenshots/features/rm520n-system-logs-light.webp "RM520N: System Logs shows QManager's own log, filterable by level and component.")

`
      },
      {
        slug: "config-backup-restore",
        category: "management",
        title: "Configuration Backup & JSON Restore",
        description: "Export full QManager settings, custom SIM profiles, and band preferences to JSON for easy cloning.",
        edition: "universal",
        badge: "Backup",
        readTime: "3 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "exporting-configuration", title: "Exporting Settings to JSON", level: 2 },
          { id: "restoring-configuration", title: "Restoring Configurations", level: 2 },
          { id: "factory-reset", title: "Factory Reset Safeguards", level: 2 }
        ],
        content: `
# Configuration Backup & JSON Restore

Safeguard your custom configuration or clone settings across multiple router deployments.

![QManager RM551E Configuration backup screen](/screenshots/features/rm551e-config-backup-light.webp "RM551E: Save an encrypted backup of your settings or restore one.")

---

## Exporting Settings to JSON

Navigate to **Tools > Backup & Restore**:
- Click **Export Configuration**.
- QManager generates a clean, readable JSON file containing:
  - All Custom SIM Profiles & APN credentials.
  - Band and Tower locking configurations.
  - Watchdog thresholds and alert contact info.
  - Network and TTL settings.

---

## Restoring Configurations

1. Click **Import Configuration**.
2. Select your backup JSON file.
3. QManager validates schema integrity and applies settings without requiring a device reboot.

---

## Factory Reset Safeguards

If you need to return to default settings, the **Factory Reset** tool clears user data while keeping QManager binaries intact.
`
      },
      {
        slug: "prometheus-metrics",
        category: "management",
        title: "Prometheus Metrics & Grafana",
        description: "Expose real-time cellular metrics on /metrics for Prometheus scraping, Grafana dashboards, and Home Assistant.",
        edition: "universal",
        badge: "Metrics",
        readTime: "4 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "the-metrics-endpoint", title: "The /metrics Endpoint", level: 2 },
          { id: "sample-metrics-output", title: "Sample Prometheus Metrics", level: 2 },
          { id: "grafana-integration", title: "Grafana & Home Assistant Integration", level: 2 }
        ],
        content: `
# Prometheus Metrics & Grafana

Integrate your cellular modem into your existing monitoring infrastructure.

![QManager RM551E Prometheus metrics screen](/screenshots/features/rm551e-prometheus-light.webp "RM551E: Let a Prometheus server collect signal and health readings, with a ready-made scrape config.")

---

## The /metrics Endpoint

QManager exposes a standard Prometheus scrape endpoint at:
\`\`\`
http://<modem_ip>/cgi-bin/quecmanager/metrics
\`\`\`
*(Or \`http://<modem_ip>/metrics\` on RM520N)*

No authentication token is required if scraped from trusted internal subnets.

---

## Sample Prometheus Metrics

\`\`\`promql
# HELP qmanager_signal_rsrp Serving cell RSRP in dBm
# TYPE qmanager_signal_rsrp gauge
qmanager_signal_rsrp{carrier="T-Mobile",band="n41",pci="184"} -82

# HELP qmanager_signal_sinr Serving cell SINR in dB
# TYPE qmanager_signal_sinr gauge
qmanager_signal_sinr{carrier="T-Mobile",band="n41"} 22.4

# HELP qmanager_antenna_rsrp Per-antenna RSRP in dBm
# TYPE qmanager_antenna_rsrp gauge
qmanager_antenna_rsrp{antenna="ant0"} -82
qmanager_antenna_rsrp{antenna="ant1"} -84
qmanager_antenna_rsrp{antenna="ant2"} -83
qmanager_antenna_rsrp{antenna="ant3"} -85

# HELP qmanager_traffic_bytes_total Total bytes transferred
# TYPE qmanager_traffic_bytes_total counter
qmanager_traffic_bytes_total{direction="rx"} 1845291048
qmanager_traffic_bytes_total{direction="tx"} 245109281
\`\`\`

---

## Grafana & Home Assistant Integration

- **Home Assistant**: Add the Prometheus sensor integration to trigger automations if signal drops.
- **Grafana Dashboard**: Import QManager's official Grafana dashboard JSON for real-time graphs of RSRP, SINR, throughput, and temperature.
`
      }
    ]
  },
  {
    id: "developer",
    title: "Architecture & Developer Reference",
    iconName: "Code",
    description: "System architecture, CGI execution model, complete REST API endpoint schemas, and the RM520N porting ledger.",
    articles: [
      {
        slug: "system-architecture",
        category: "developer",
        title: "System Architecture & CGI Execution Model",
        description: "Deep dive into QManager's stateless CGI design, uhttpd/lighttpd daemon bindings, and minimal resource footprint.",
        edition: "universal",
        badge: "Architecture",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "stateless-design", title: "Stateless Execution Model", level: 2 },
          { id: "cgi-shell-backend", title: "POSIX Shell CGI Backend", level: 2 },
          { id: "broker-ipc", title: "Daemon IPC & Shared Memory", level: 2 },
          { id: "rootfs-overlays-and-binds", title: "RootFS Overlays & Entware Bind Mounts (sdxpinn-mount-fix)", level: 2 },
          { id: "volatile-journald-logging", title: "NAND Wear Protection: Volatile journald Logging", level: 2 },
          { id: "experimental-overhaul-branch", title: "Status of the overhaul-SDXLEMUR Branch", level: 2 }
        ],
        content: `
# System Architecture & CGI Execution Model

Designed from the ground up for low-power embedded platforms with limited memory.

---

## Stateless Execution Model

Traditional web applications require heavy Node.js or Python runtimes that consume 150MB+ RAM. On an embedded router with 128MB or 256MB total RAM, this is unacceptable.

QManager adopts a **stateless, micro-CGI architecture**:
- The Next.js frontend is fully compiled into static HTML/CSS/JavaScript and pre-rendered.
- Web requests are served by ultra-lightweight web daemons: \`uhttpd\` on OpenWRT (written in C) or \`lighttpd\` on RM520N.
- API endpoints are lightweight POSIX shell scripts (\`/bin/sh\`).
- When a client sends a POST request, the web server executes the specific script, returns JSON, and immediately terminates.

---

## POSIX Shell CGI Backend

Located in \`/www/cgi-bin/quecmanager/\` (on OpenWRT) or \`/usrdata/qmanager/www/cgi-bin/quecmanager/\` (on RM520N Native Linux):
- Zero external interpreter dependencies.
- Uses \`jsonfilter\` or lightweight \`jq\`/\`awk\`/\`sed\` to parse and output JSON.
- Average response time: < 15ms.

---

## Daemon IPC & Shared Memory

For operations requiring persistent state (like telemetry history or AT serial locking via \`qcmd\`), QManager utilizes shared memory in **tmpfs** (\`/tmp/\` and \`/tmp/qmlive/\`). Multiple processes read and write via atomic file swaps and POSIX \`flock\` without incurring NAND flash wear.

---

## RootFS Overlays & Entware Bind Mounts (sdxpinn-mount-fix)

Deploying complex userland tooling on embedded modem flash partitions requires solving storage and filesystem constraints:

### 1. RM551E / SDXPINN OpenWRT Overlay Mechanics
On the Quectel RM551E, the base operating system runs from a read-only compressed SquashFS partition. Writable directories are provided via an OverlayFS layer backed by the persistent \`/usrdata\` partition.
Upstream research by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** developed the **\`sdxpinn-mount-fix\`** script:
- In factory firmware, early boot initialization mounted \`/usrdata\` after \`fstab\` services, resulting in a read-only rootfs fallback.
- The \`sdxpinn-mount-fix\` intercepts early init to mount the persistent flash block directly before \`procd\` begins spawning services, ensuring persistent packages, custom scripts, and QManager assets survive modem reboots without filesystem corruption.

### 2. SDXLEMUR Linux: Entware \`/usrdata/opt\` Bind Mount
On the RM520N-GL running Poky Linux, the root directory (\`/\`) has only ~5 MB of free space, while \`/usrdata\` has over 350 MB:
- The standard Entware package manager expects binaries and libraries located in \`/opt\`.
- QManager solves this by creating a directory at \`/usrdata/opt\` and mounting it over \`/opt\` via systemd bind-mount during boot:
  \`\`\`sh
  mount --bind /usrdata/opt /opt
  \`\`\`
- This enables full access to \`opkg\`, \`lighttpd\`, and standard GNU utilities without filling up the modem's root filesystem.

---

## NAND Wear Protection: Volatile journald Logging

Industrial cellular modems use SLC or MLC NAND flash chips with finite erase cycles. Writing continuous debug and polling logs to disk will prematurely wear out flash sectors within months.

QManager configures systemd's logging daemon (\`/etc/systemd/journald.conf\`) into **volatile RAM mode**:
\`\`\`ini
[Journal]
Storage=volatile
RuntimeMaxUse=16M
\`\`\`
- All system and daemon logs reside strictly in memory (RAM).
- Total log buffer size is capped at 16 MB.
- High-frequency live polling logs are discarded automatically when memory limits are reached, resulting in zero NAND flash write cycles during normal 24/7 telemetry collection.

---

## Status of the overhaul-SDXLEMUR Branch

In the upstream community (e.g. Cameron Thompson's repositories), researchers explored the **\`overhaul-SDXLEMUR\`** project—an effort to replace the Qualcomm Poky/Yocto Linux userland with a clean Debian or Alpine ARM rootfs.

> [!WARNING]
> **Experimental & Broken Notice**:
> The \`overhaul-SDXLEMUR\` branch remains **strictly experimental and non-functional for general deployments**. Qualcomm's proprietary cellular baseband drivers (\`rmnet_ipa.ko\`, \`smd.ko\`, \`mhi_net.ko\`) are tightly coupled to Qualcomm's downstream Linux 5.4.180 kernel ABI and proprietary Android-derived IPC daemons (\`netmgrd\`, \`qmi_proxy\`, \`data-ipa-cfg-mgr\`). Standard Debian rootfs builds fail to load these proprietary binary blobs.
>
> QManager remains focused on delivering first-class reliability on top of the tested stock Poky Linux userland with Entware integration.
`
      },
      {
        slug: "api-reference",
        category: "developer",
        title: "Complete REST & CGI API Reference",
        description: "Full endpoint directory, request methods, query parameters, JSON payload schemas, and error codes.",
        edition: "universal",
        badge: "API Spec",
        readTime: "6 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "api-conventions", title: "API Conventions & Headers", level: 2 },
          { id: "signal-endpoints", title: "Signal & Cellular Endpoints", level: 2 },
          { id: "configuration-endpoints", title: "Configuration Endpoints", level: 2 },
          { id: "at-broker-endpoints", title: "AT Command Endpoints", level: 2 }
        ],
        content: `
# Complete REST & CGI API Reference

All QManager backend functions can be automated via standard HTTP JSON requests.

---

## API Conventions & Headers

- **Base URL (OpenWRT)**: \`http://<router_ip>/cgi-bin/quecmanager/\`
- **Base URL (RM520N)**: \`http://<modem_ip>/cgi-bin/quecmanager/\`
- **Headers**:
  - \`Content-Type: application/json\`
  - Cookie session header (if authentication is active)

---

## Signal & Cellular Endpoints

### \`GET /get_signal.sh\`
Returns live cellular signal metrics for all active carriers.

**Response Schema**:
\`\`\`json
{
  "status": "success",
  "data": {
    "carrier": "T-Mobile",
    "network_type": "5G-SA",
    "band": "n41",
    "bandwidth": 100,
    "pci": 184,
    "earfcn": 518970,
    "rsrp": -82,
    "rsrq": -11,
    "sinr": 22.5,
    "rssi": -65,
    "mimo": {
      "ant0": -82,
      "ant1": -84,
      "ant2": -83,
      "ant3": -85
    },
    "ca": [
      { "band": "n41", "width": 100, "role": "PCC" },
      { "band": "n71", "width": 20, "role": "SCC1" }
    ]
  }
}
\`\`\`

---

## Configuration Endpoints

### \`POST /set_band.sh\`
Locks or unlocks specific LTE/NR bands.

**Request Payload**:
\`\`\`json
{
  "lte_bands": ["B2", "B66"],
  "nr_bands": ["n41", "n77"]
}
\`\`\`

---

## AT Command Endpoints

### \`POST /at_command.sh\`
Executes an arbitrary AT command through the serialized broker.

**Request Payload**:
\`\`\`json
{
  "command": "AT+QGMR"
}
\`\`\`

**Response Schema**:
\`\`\`json
{
  "status": "success",
  "command": "AT+QGMR",
  "response": "RM520NGLAAR03A03M4G\r\n\r\nOK"
}
\`\`\`
`
      },
      {
        slug: "rm520n-port-ledger",
        category: "developer",
        title: "OpenWRT vs RM520N Architecture Differences",
        description: "Engineering ledger detailing the differences between the RM551E OpenWRT build and SDXLEMUR on-modem Linux.",
        edition: "universal",
        badge: "Porting Ledger",
        readTime: "5 min read",
        updatedAt: "2026-10-21",
        toc: [
          { id: "architectural-divergence", title: "Architectural Divergence Summary", level: 2 },
          { id: "subsystem-comparison", title: "Subsystem-by-Subsystem Comparison", level: 2 },
          { id: "sysfs-vs-at-sources", title: "Sysfs vs AT Fetch Sources", level: 2 }
        ],
        content: `
# OpenWRT vs RM520N Architecture Differences

QManager is ported across two distinctly different Linux environments. This document outlines the technical design divergence.

---

## Architectural Divergence Summary

| Subsystem | QManager (OpenWRT) | QManager-RM520N (SDXLEMUR) |
|---|---|---|
| **Init / Service Manager** | OpenWRT \`procd\` | Systemd (\`systemctl\`) |
| **Network Daemon** | \`netifd\` + OpenWRT \`uci\` | Direct \`iproute2\` / Qualcomm proprietary daemons |
| **Firewall** | \`fw4\` (nftables) or \`fw3\` (iptables) | Native \`iptables\` / \`ip6tables\` |
| **Package Management** | \`opkg\` | Entware (\`opkg\` pointing to Entware armv7sf-k3.2 repo) |
| **Web Server** | \`uhttpd\` | \`lighttpd\` with \`mod_cgi\` |
| **File Paths** | Web files in \`/www/qmanager\` | Web files in \`/usrdata/qmanager/www\` |
| **Serial AT Interface** | \`/dev/ttyUSB2\` or \`/dev/cdc-wdm0\` | \`/dev/mhi_DUN\` or \`/dev/smd11\` (internal IPC bus) |

---

## Subsystem-by-Subsystem Comparison

### Serial Port Handling
On the OpenWRT build, the modem communicates across a USB bus using the \`option\` or \`qmi_wwan\` kernel drivers. Latency is ~5–10ms per AT command.

On the RM520N-GL internal Linux, the application communicates with the baseband through internal Qualcomm shared memory devices (\`/dev/mhi_DUN\` or SMD channels) with near-zero (< 1ms) latency!

---

## Sysfs vs AT Fetch Sources

On the RM520N-GL, many network stats do not require AT commands at all. They can be read directly from Qualcomm sysfs nodes:
- \`/sys/devices/platform/soc/...\`
- Kernel thermal sensors in \`/sys/class/thermal/thermal_zone*\`
- RGMII PHY link state in \`/sys/class/net/eth0/carrier\`
`
      },
      {
        slug: "quectel-at-command-index",
        category: "developer",
        title: "Master Quectel AT Command & Compound Chaining Reference",
        description: "Master reference index of Quectel AT commands, compound command chaining syntax, RF power management, MBN profiling, QMAP routing, and EFS NVRAM inspection.",
        edition: "universal",
        badge: "Command Index",
        readTime: "8 min read",
        updatedAt: "2026-10-24",
        toc: [
          { id: "command-syntax-and-chaining", title: "Command Syntax & Compound Chaining (\";\") Rules", level: 2 },
          { id: "system-and-identification", title: "System Identity & Firmware Revision Commands", level: 2 },
          { id: "rf-states-and-cfun", title: "Radio Power States, CFUN Modes & Network Registration", level: 2 },
          { id: "carrier-mbn-profiling", title: "Qualcomm MBN Carrier Profiling & Auto-Selection", level: 2 },
          { id: "band-and-cell-locking", title: "Cellular Band Selection & Physical Cell Tower Locking", level: 2 },
          { id: "qmap-ip-routing-commands", title: "QMAP IP Routing, Multiplexing & MPDN Rules", level: 2 },
          { id: "ethernet-and-pcie-subsystem", title: "Ethernet PHY (QETH) & PCIe Bus Configuration", level: 2 },
          { id: "efs-and-nvram-commands", title: "Low-Level NVRAM, EFS Management & ADB Backdoors", level: 2 },
          { id: "community-credits", title: "Reference Credits & Heritage", level: 2 }
        ],
        content: `
# Master Quectel AT Command & Compound Chaining Reference

This document serves as the comprehensive engineering cheat sheet and syntax manual for Quectel 5G and LTE-A modems (RM551E, RM520N, RM521F, RG501, RM502, RM500Q). It details standard command forms, high-throughput compound chaining syntax, RF control states, MBN profiles, and low-level Qualcomm NVRAM commands.

> [!NOTE]
> **Research & Heritage**: Compiled from Quectel AT command specifications, Qualcomm platform documentation, and the open-source engineering catalog maintained by **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** in the [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki).

---

## Command Syntax & Compound Chaining (";") Rules

Quectel AT commands follow standard V.250 conventions with 4 execution variations:
- **Test Command** (\`AT+<cmd>=?\`): Queries supported parameters and acceptable value ranges.
- **Read Command** (\`AT+<cmd>?\`): Returns current operational values.
- **Write Command** (\`AT+<cmd>=<p1>,<p2>\`): Sets active configuration parameters.
- **Execution Command** (\`AT+<cmd>\`): Triggers a specific action with no arguments.

### Compound Command Chaining with Semicolons (\`;\`)
Multiple AT commands can be concatenated into a single atomic string by using a semicolon (\`;\`) delimiter:
\`\`\`
AT+CFUN=0;+CGDCONT=1,"IPV4V6","fast.t-mobile.com";+CFUN=1
\`\`\`
- The prefix \`AT\` is specified once at the start of the line.
- Subsequent chained commands begin immediately with \`+\` after the semicolon (omit redundant \`AT\`).
- Compound chaining reduces serial bus round-trips and guarantees that radio toggle sequences execute in rapid atomic succession.

---

## System Identity & Firmware Revision Commands

| AT Command | Syntax Example | Description |
|---|---|---|
| **\`ATI\`** | \`ATI\` | Product Identification: Returns manufacturer name, model designation, and baseline firmware revision. |
| **\`+GSN\`** | \`AT+GSN\` | Returns the International Mobile Equipment Identity (IMEI) number. |
| **\`+QGMR\`** | \`AT+QGMR\` | Quectel Extended Firmware Version: Returns full internal build string (e.g. \`RM520NGLAAR03A03M4G\`). |
| **\`+QPRTPARA\`** | \`AT+QPRTPARA=1\` | Restore NVRAM factory default parameters. (\`AT+QPRTPARA=3\` restores backup NV parameters). |
| **\`+QPRTPARA\`** | \`AT+QPRTPARA=4\` | Backup current NV configuration to recovery flash partition. |
| **\`+QSCLK\`** | \`AT+QSCLK=0\` | Sleep mode control (0 = disable baseband sleep, 1 = enable sleep/low-power). |

---

## Radio Power States, CFUN Modes & Network Registration

### Setting RF Power States (\`AT+CFUN=<mode>\`)
- **\`AT+CFUN=0\`**: Minimum functionality. Disables RF transceiver and cuts cellular transmit/receive power (SIM card remains powered).
- **\`AT+CFUN=1\`**: Full functionality. RF active, registers on network, and maintains data sessions.
- **\`AT+CFUN=4\`**: Airplane mode. Disables RF transceiver; safe for antenna disconnection.
- **\`AT+CFUN=1,1\`**: Hardware reboot. Performs full warm reboot of baseband processor and reloads NVRAM.
- **\`AT+CFUN=7\`**: Offline / Factory Test mode. **⚠️ Warning**: On RM550V/RM551E modules, invoking \`CFUN 7\` on mismatched EFS combos can lock the modem into an unprovisioned test loop.

### Network Registration Queries
- **\`AT+CREG?\`**: Query 2G/3G GSM circuit-switched registration.
- **\`AT+CEREG?\`**: Query 4G LTE packet data registration (\`0,1\` = home network, \`0,5\` = registered roaming).
- **\`AT+C5GREG?\`**: Query 5G NR network registration (\`0,1\` = registered 5G SA home, \`0,5\` = 5G SA roaming).
- **\`AT+COPS=?\`**: Scan for all available cellular operators in range (blocking operation, may take 30–60 seconds).
- **\`AT+COPS?\`**: Query currently selected operator and network acquisition mode.

---

## Qualcomm MBN Carrier Profiling & Auto-Selection

Quectel Qualcomm modems store pre-compiled carrier firmware configuration bundles called **MBN (Modem Binary)** files:

| AT Command | Syntax Example | Description |
|---|---|---|
| **\`+QMBNCFG="list"\`** | \`AT+QMBNCFG="list"\` | Displays all carrier MBN profiles installed in modem flash with activation status. |
| **\`+QMBNCFG="AutoSel"\`**| \`AT+QMBNCFG="AutoSel",1\` | Enables automatic MBN selection based on inserted SIM MCC/MNC (\`0\` = disable auto-select). |
| **\`+QMBNCFG="select"\`** | \`AT+QMBNCFG="select","mcfg_sw/generic/common/row/commercial/mcfg_sw.mbn"\` | Manually activates a specific carrier MBN profile (e.g. Generic ROW or T-Mobile commercial). |
| **\`+QMBNCFG="deactivate"\`**| \`AT+QMBNCFG="deactivate"\` | Deactivates currently selected MBN profile, reverting to uncustomized baseband baseline. |

---

## Cellular Band Selection & Physical Cell Tower Locking

### Band Locking Commands
- **\`AT+QNWPREFCFG="nr5g_band"\`**: Lock specific 5G NR bands (e.g. \`AT+QNWPREFCFG="nr5g_band",41:71:77\`).
- **\`AT+QNWPREFCFG="lte_band"\`**: Lock specific 4G LTE bands (e.g. \`AT+QNWPREFCFG="lte_band",2:4:12:66\`).
- **\`AT+QNWPREFCFG="mode_pref"\`**: Set cellular RAT priority:
  - \`"AUTO"\` = Automatic (5G NR / LTE / WCDMA)
  - \`"NR5G"\` = 5G Standalone (SA) only
  - \`"LTE"\` = 4G LTE only

### Tower & Cell Locking Commands (\`+QNWLOCK\`)
- **4G Cell Lock**: \`AT+QNWLOCK="common/4g",<num_cells>,<earfcn>,<pci>\`
- **5G Cell Lock**: \`AT+QNWLOCK="common/5g",<num_cells>,<arfcn>,<pci>,<scs>,<band>\`
- **Unlock All Cells**: \`AT+QNWLOCK="common/4g",0\` and \`AT+QNWLOCK="common/5g",0\`

---

## QMAP IP Routing, Multiplexing & MPDN Rules

QMAP commands configure internal packet routing between modem baseband contexts and Ethernet/USB interfaces:

\`\`\`
AT+QMAP="MPDN_rule",<rule_id>,<pdp_id>,<vlan_id>,<ip_type>,<target_if>
\`\`\`

- **LAN IP Configuration**: \`AT+QMAP="LAN_IP_Set",<ip>,<subnet>,<gateway>\`
- **DHCP Server Range**: \`AT+QMAP="DHCP_Range",<start_ip>,<end_ip>,<lease_time>\`
- **DNS Proxy Bypass**: \`AT+QMAP="DHCPV4DNS","disable"\` (Pushes carrier DNS directly to client without modem interception).

---

## Ethernet PHY (QETH) & PCIe Bus Configuration

| AT Command | Syntax Example | Description |
|---|---|---|
| **\`+QCFG="pcie/mode"\`** | \`AT+QCFG="pcie/mode",1\` | Switches PCIe controller between Endpoint (\`0\`) and Root Complex (\`1\`). |
| **\`+QETH="eth_driver"\`** | \`AT+QETH="eth_driver","r8125",1\` | Binds the Realtek RTL8125 2.5G Ethernet PHY driver. |
| **\`+QETH="phy_type"\`** | \`AT+QETH="phy_type"\` | Queries or sets hardware PHY interface type (RGMII, PCIe, SGMII). |
| **\`+QETH="speed"\`** | \`AT+QETH="speed",2500\` | Forces Ethernet link speed (10, 100, 1000, 2500 Mbps, or auto-negotiate). |
| **\`+QCFG="usbnet"\`** | \`AT+QCFG="usbnet",0\` | Configures USB network interface driver (0 = QMI, 1 = ECM, 2 = MBIM, 3 = RNDIS). |

---

## Low-Level NVRAM, EFS Management & ADB Backdoors

> [!CAUTION]
> Direct NVRAM and EFS commands modify non-volatile calibration flash blocks. Exercise extreme care when issuing these commands.

- **\`AT+QNVFW\`**: Injects custom carrier aggregation combo tables and RRC capability structures into modem NVRAM.
- **\`AT+QNVFD\`**: Deletes designated files from Qualcomm EFS partition (used to purge stale CA configurations).
- **\`AT+QADBKEY?\`**: Requests the cryptographic challenge string for unlocking modem ADB root shell.
- **Value \`2\` ADB Backdoor Bypass**: On select beta and development firmwares:
  \`\`\`
  AT+QCFG="usbcfg",0x2C7C,0x0801,1,1,1,1,1,2,0
  \`\`\`
  Setting parameter 9 to value \`2\` forcibly unlocks ADB without requiring a response key from \`AT+QADBKEY\`.

---

## Reference Credits & Heritage

This master command reference incorporates reverse-engineered command parameters, chaining syntax, and hardware registers documented by:
- **Cameron Thompson ([\`iamromulan\`](https://github.com/iamromulan))** — Maintainer of [Cellular Modem Wiki](https://github.com/iamromulan/cellular-modem-wiki) & [Quectel RGMII Toolkit](https://github.com/iamromulan/quectel-rgmii-toolkit).
`
      }
    ]
  }
];

export function getAllArticles(): DocArticle[] {
  return DOC_CATEGORIES.flatMap(category => category.articles);
}

export function getArticle(categorySlug: string, articleSlug: string): DocArticle | undefined {
  const category = DOC_CATEGORIES.find(c => c.id === categorySlug);
  if (!category) return undefined;
  return category.articles.find(a => a.slug === articleSlug);
}

export function getAdjacentArticles(categorySlug: string, articleSlug: string): { prev?: DocArticle; next?: DocArticle } {
  const all = getAllArticles();
  const currentIndex = all.findIndex(a => a.category === categorySlug && a.slug === articleSlug);
  if (currentIndex === -1) return {};
  return {
    prev: currentIndex > 0 ? all[currentIndex - 1] : undefined,
    next: currentIndex < all.length - 1 ? all[currentIndex + 1] : undefined,
  };
}
