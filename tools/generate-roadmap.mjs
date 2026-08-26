import fs from "fs";

// 19 Personal Engineering Projects (4-Tier Staggered Layout)
const projects = [
  {
    id: "line-follower-3pi",
    date: "Feb 2020",
    title: "Pololu 3Pi Autonomous Line Follower",
    category: "hardware",
    pos: 400,
    tier: 1,
    badge: "Robotics & AVR C++",
    desc: "Autonomous optical line-following robot with custom AVR C++ PID reflectance sensor tracking and motor PWM control."
  },
  {
    id: "face-detection-sec",
    date: "May 2020",
    title: "Computer Vision & Biometric Gateway",
    category: "ai-vision",
    pos: 850,
    tier: 2,
    badge: "Vision & Security",
    desc: "Early JavaScript FaceAPI biometric detection and secured client gateway prototypes."
  },
  {
    id: "pre-gpt3-quant",
    date: "May 2021",
    title: "Statistical ML & Risk Regression",
    category: "fintech",
    pos: 1550,
    tier: 3,
    badge: "Quantitative ML",
    desc: "Linear regression and logistic regression risk scoring on historical equity price histories and OHLCV datasets."
  },
  {
    id: "deep-q-learning",
    date: "Nov 2021",
    title: "Deep Q-Learning RL Market Agent",
    category: "fintech",
    pos: 2100,
    tier: 4,
    badge: "Reinforcement Learning",
    desc: "Deep Q-learning policy agent trained inside custom simulated stock market environments for risk-adjusted trade execution."
  },
  {
    id: "discord-bot-alerts",
    date: "Jan 2022",
    title: "Stock Activity Telemetry & Discord Bot",
    category: "fintech",
    pos: 2600,
    tier: 1,
    badge: "Fintech Telemetry",
    desc: "Automated real-time Discord webhook service broadcasting breakout volume, trend triggers, and market movement alerts."
  },
  {
    id: "laser-challenge-m2",
    date: "Feb 2022",
    title: "Laser Challenge — M² Beam Quality Profiler",
    category: "hardware",
    pos: 2950,
    tier: 2,
    badge: "Optics & Stepper Control",
    desc: "Automated laser beam propagation M² analyzer using motorized knife-edge profilometry, error function fitting, and ISO 11146 compliance."
  },
  {
    id: "final-work-thesis",
    date: "Apr 2022",
    title: "Final Thesis: ThomasTheAI (LSTM)",
    category: "fintech",
    pos: 3300,
    tier: 3,
    badge: "Graduation Thesis & LSTM",
    desc: "High school graduation thesis (Názler_AkciováAnalýza) combining custom C++ neural layers and Python LSTMs for directional market forecasting."
  },
  {
    id: "thomas-ai-2",
    date: "Dec 2022",
    title: "ThomasTheAI 2.0 & Desktop Trading App",
    category: "fintech",
    pos: 3800,
    tier: 4,
    badge: "Desktop Trading GUI",
    desc: "Desktop trading client integrating technical indicators (RSI, MA), multi-timeframe feature scalers, and interactive charts."
  },
  {
    id: "ronik-real-trade",
    date: "Feb 2023",
    title: "Ronik-App & RealTrade Execution Engine",
    category: "fintech",
    pos: 4350,
    tier: 1,
    badge: "Alpaca Market Execution",
    desc: "Automated live and paper trading order execution harness with Alpaca REST/WebSocket connectivity and bracket order management."
  },
  {
    id: "plutus-models",
    date: "May 2023",
    title: "Plutus ML Inference Service & Models",
    category: "fintech",
    pos: 4900,
    tier: 2,
    badge: "ML Model Serving",
    desc: "Dedicated microservice repository delivering real-time neural network inference and feature normalization for PlutusApp."
  },
  {
    id: "hack-austria",
    date: "Jul 2023",
    title: "HackAustria — Raiffeisen PSD2 Banking",
    category: "fintech",
    pos: 5450,
    tier: 3,
    badge: "PSD2 Open Banking",
    desc: "Raiffeisen PSD2 Open Banking aggregation platform with automated transaction carbon accounting and route optimization."
  },
  {
    id: "aaa-trading",
    date: "Nov 2023",
    title: "AAA Trading Live Execution Gateway",
    category: "fintech",
    pos: 6000,
    tier: 4,
    badge: "High-Throughput Trading",
    desc: "Real-time execution gateway with deterministic order sizing and risk-bounded market integration."
  },
  {
    id: "plastic-production",
    date: "Mar 2024",
    title: "RonikRecycle / Distributed Manufacturing OS",
    category: "hardware",
    pos: 6650,
    tier: 1,
    badge: "Hardware & Production",
    desc: "Recycled plastic extrusion PID control, filament quality sensing, and distributed 3D print order coordination."
  },
  {
    id: "enerfis-testing",
    date: "Aug 2024",
    title: "Enerfis IoT Telemetry & QA Automation",
    category: "hardware",
    pos: 7250,
    tier: 2,
    badge: "IoT & QA Automation",
    desc: "Automated end-to-end testing harness and spatial telemetry verification for smart building energy sensors."
  },
  {
    id: "boiler-battery",
    date: "Apr 2025",
    title: "BoilerBattery Smart Solar Energy Diverter",
    category: "hardware",
    pos: 7950,
    tier: 3,
    badge: "Smart Energy & IoT",
    desc: "Dual ESP32 IoT gateway dynamically routing surplus rooftop solar energy into domestic thermal storage buffers."
  },
  {
    id: "crop-carbon",
    date: "Oct 2025",
    title: "CropCarbon Agricultural Telemetry",
    category: "ai-vision",
    pos: 8600,
    tier: 4,
    badge: "AgTech & Climate",
    desc: "Farm soil telemetry ingestion, carbon sequestration calculation algorithms, and sustainability incentive dashboards."
  },
  {
    id: "opti-radar",
    date: "Mar 2026",
    title: "OptiRadar / SkyWatch Computer Vision",
    category: "ai-vision",
    pos: 9200,
    tier: 1,
    badge: "Computer Vision",
    desc: "Real-time high-frame-rate optical object tracking, motion vector extraction, and skyward trajectory estimation."
  },
  {
    id: "realestate-scraper",
    date: "Apr 2026",
    title: "RealEstate Intelligence & Scraper Engine",
    category: "ai-vision",
    pos: 9750,
    tier: 2,
    badge: "Data Engineering",
    desc: "Multi-source real estate aggregation engine, geospatial deduplication, valuation modeling, and TrueNAS deployment."
  },
  {
    id: "insider-edge",
    date: "Aug 2026",
    title: "Insider Edge (v1.0.0)",
    category: "fintech",
    pos: 10300,
    tier: 3,
    badge: "Trading & DevOps",
    desc: "Automated SEC Form 4 insider trading bot with multi-tier risk guardrails, SQLite state engine, and Starlette control room."
  }
];

// Generate Projects HTML
const projectsHtml = projects.map(p => `
            <!-- ${p.date}: ${p.title} -->
            <article class="project-pin-item tier-${p.tier}" data-id="${p.id}" data-category="${p.category}" style="left: ${p.pos}px;">
              <div class="project-pin-pill">
                <span class="pin-date">${p.date}</span>
                <span class="pin-title">${p.title}</span>
                <span class="project-badge">${p.badge}</span>
              </div>
              <div class="project-stem-down"></div>
              <div class="project-node-axis"></div>
              <div class="pin-popover popover-project">
                <p class="popover-desc">${p.desc}</p>
                <span class="popover-hint project-hint">Click to inspect architecture &rarr;</span>
              </div>
            </article>`).join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#060910">
    <meta
      name="description"
      content="Interactive horizontal engineering trajectory timeline (2020–2026) showcasing shipped software architectures, quantitative fintech systems, hardware IoT, and computer vision projects."
    >
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Engineering Roadmap">
    <meta property="og:title" content="Engineering Trajectory Roadmap (2020–2026)">
    <meta property="og:description" content="Chronological engineering milestones and open-source systems built from 2020 to 2026.">
    <meta property="og:url" content="https://cvut-crossroad.com/roadmap">
    <title>Engineering Trajectory Roadmap (2020–2026)</title>
    <link rel="canonical" href="https://cvut-crossroad.com/roadmap">
    <link rel="manifest" href="./manifest.webmanifest">
    <link rel="stylesheet" href="./timeline.css?v=3.1.0">
  </head>
  <body>
    <div class="ambient-glow" aria-hidden="true"></div>

    <div class="app-shell">
      <!-- Header Bar -->
      <header class="timeline-header">
        <div class="brand-section">
          <a href="./" class="nav-crossroad-btn" aria-label="Back to main hub">&larr; Back to Hub</a>
          <div class="brand-badge">TX</div>
          <div class="brand-text">
            <h1>Engineering Trajectory Roadmap</h1>
            <p>2020–2026 Chronological Track &bull; 19 Shipped Projects &amp; Systems</p>
          </div>
        </div>

        <div class="header-controls">
          <nav class="filter-pills" aria-label="Project domains">
            <button class="filter-btn active" data-filter="all" type="button">
              All <span class="badge-count" id="count-all">19</span>
            </button>
            <button class="filter-btn filter-fintech" data-filter="fintech" type="button">
              Fintech &amp; Trading <span class="badge-count" id="count-fintech">0</span>
            </button>
            <button class="filter-btn filter-hardware" data-filter="hardware" type="button">
              Hardware &amp; IoT <span class="badge-count" id="count-hardware">0</span>
            </button>
            <button class="filter-btn filter-vision" data-filter="ai-vision" type="button">
              Vision &amp; Data <span class="badge-count" id="count-vision">0</span>
            </button>
          </nav>

          <div class="time-anchors" aria-label="Jump to timeline anchor">
            <button class="time-btn" data-year="2020" type="button">2020</button>
            <button class="time-btn" data-year="2021" type="button">2021</button>
            <button class="time-btn" data-year="2022" type="button">2022</button>
            <button class="time-btn" data-year="2023" type="button">2023</button>
            <button class="time-btn" data-year="2024" type="button">2024</button>
            <button class="time-btn" data-year="2025" type="button">2025</button>
            <button class="time-btn highlight" data-year="2026" type="button">2026</button>
            <button class="time-btn" data-year="latest" type="button">Latest &rarr;</button>
          </div>

          <div class="canvas-nav-actions" aria-label="Horizontal scroll navigation">
            <button class="nav-arrow-btn" id="btn-scroll-left" type="button" aria-label="Scroll left">&larr;</button>
            <button class="nav-arrow-btn" id="btn-scroll-right" type="button" aria-label="Scroll right">&rarr;</button>
          </div>
        </div>
      </header>

      <!-- Horizontal Timeline Viewport -->
      <main class="timeline-viewport" id="timeline-viewport" tabindex="0" aria-label="Horizontal engineering timeline canvas">
        <div class="timeline-canvas">

          <!-- Engineering Projects Track (4-Tier Staggered Pins) -->
          <section class="swimlane-projects" aria-label="Engineering Projects">
${projectsHtml}
          </section>

          <!-- CENTER/BOTTOM AXIS: Chronological Time Ribbon -->
          <div class="timeline-center-axis" aria-hidden="true">
            <div class="axis-line"></div>

            <div class="axis-year-marker" id="year-2020" style="left: 350px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2020</span>
            </div>

            <div class="axis-year-marker" id="year-2021" style="left: 1350px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2021</span>
            </div>

            <div class="axis-year-marker" id="year-2022" style="left: 2500px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2022</span>
            </div>

            <div class="axis-year-marker" id="year-2023" style="left: 4150px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2023</span>
            </div>

            <div class="axis-year-marker" id="year-2024" style="left: 6450px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2024</span>
            </div>

            <div class="axis-year-marker" id="year-2025" style="left: 7750px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2025</span>
            </div>

            <div class="axis-year-marker is-current" id="year-2026" style="left: 9000px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2026 (Now)</span>
            </div>
          </div>

        </div>
      </main>

      <!-- Footer Info Bar -->
      <footer class="timeline-footer">
        <div>
          <span>Horizontal Chronological View (2020&ndash;2026) &bull; 19 Personal Engineering Projects &bull; Open-Source Architectures</span>
        </div>
        <div class="footer-keys">
          <span class="key-hint"><kbd>Drag</kbd> or <kbd>Wheel</kbd> to pan</span>
          <span class="key-hint"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> scroll</span>
          <span class="key-hint"><kbd>Hover</kbd> for quick preview</span>
          <span class="key-hint"><kbd>Click</kbd> pin to inspect architecture</span>
        </div>
      </footer>
    </div>

    <!-- Slide-Over Inspector Drawer -->
    <div class="inspector-overlay" id="inspector-overlay"></div>
    <aside class="inspector-drawer" id="inspector-drawer" aria-labelledby="drawer-title" aria-modal="true" role="dialog">
      <div class="drawer-header">
        <h2 id="drawer-title">Project Details</h2>
        <button class="drawer-close-btn" id="drawer-close-btn" type="button" aria-label="Close drawer">&times;</button>
      </div>
      <div class="drawer-content" id="drawer-body">
        <!-- Injected via JavaScript -->
      </div>
    </aside>

    <script src="./timeline.js?v=3.1.0"></script>
  </body>
</html>
`;

fs.writeFileSync("public/roadmap.html", html, "utf8");
console.log("Successfully generated public/roadmap.html with projects-only layout!");
