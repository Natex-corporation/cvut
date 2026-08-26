import fs from "fs";

// 19 Personal Engineering Projects (Top Swimlane - 4 Tier Staggering)
const projects = [
  {
    id: "line-follower-3pi",
    date: "Feb 2020",
    title: "Pololu 3Pi Autonomous Line Follower",
    type: "project",
    pos: 400,
    tier: 1,
    badge: "Robotics & AVR C++",
    desc: "Autonomous optical line-following robot with custom AVR C++ PID reflectance sensor tracking and motor PWM control."
  },
  {
    id: "face-detection-sec",
    date: "May 2020",
    title: "Computer Vision & Biometric Gateway",
    type: "project",
    pos: 900,
    tier: 2,
    badge: "Vision & Security",
    desc: "Early JavaScript FaceAPI biometric detection and secured client gateway prototypes."
  },
  {
    id: "pre-gpt3-quant",
    date: "May 2021",
    title: "Statistical ML & Risk Regression",
    type: "project",
    pos: 1700,
    tier: 3,
    badge: "Quantitative ML",
    desc: "Linear regression and logistic regression risk scoring on historical equity price histories and OHLCV datasets."
  },
  {
    id: "deep-q-learning",
    date: "Nov 2021",
    title: "Deep Q-Learning RL Market Agent",
    type: "project",
    pos: 2250,
    tier: 4,
    badge: "Reinforcement Learning",
    desc: "Deep Q-learning policy agent trained inside custom simulated stock market environments for risk-adjusted trade execution."
  },
  {
    id: "discord-bot-alerts",
    date: "Jan 2022",
    title: "Stock Activity Telemetry & Discord Bot",
    type: "project",
    pos: 2800,
    tier: 1,
    badge: "Fintech Telemetry",
    desc: "Automated real-time Discord webhook service broadcasting breakout volume, trend triggers, and market movement alerts."
  },
  {
    id: "laser-challenge-m2",
    date: "Feb 2022",
    title: "Laser Challenge — M² Beam Quality Profiler",
    type: "project",
    pos: 3100,
    tier: 2,
    badge: "Optics & Stepper Control",
    desc: "Automated laser beam propagation M² analyzer using motorized knife-edge profilometry, error function fitting, and ISO 11146 compliance."
  },
  {
    id: "final-work-thesis",
    date: "Apr 2022",
    title: "Final Thesis: ThomasTheAI (LSTM)",
    type: "project",
    pos: 3450,
    tier: 3,
    badge: "Graduation Thesis & LSTM",
    desc: "High school graduation thesis (Názler_AkciováAnalýza) combining custom C++ neural layers and Python LSTMs for directional market forecasting."
  },
  {
    id: "thomas-ai-2",
    date: "Dec 2022",
    title: "ThomasTheAI 2.0 & Desktop Trading App",
    type: "project",
    pos: 4000,
    tier: 4,
    badge: "Desktop Trading GUI",
    desc: "Desktop trading client integrating technical indicators (RSI, MA), multi-timeframe feature scalers, and interactive charts."
  },
  {
    id: "ronik-real-trade",
    date: "Feb 2023",
    title: "Ronik-App & RealTrade Execution Engine",
    type: "project",
    pos: 4600,
    tier: 1,
    badge: "Alpaca Market Execution",
    desc: "Automated live and paper trading order execution harness with Alpaca REST/WebSocket connectivity and bracket order management."
  },
  {
    id: "plutus-models",
    date: "May 2023",
    title: "Plutus ML Inference Service & Models",
    type: "project",
    pos: 5200,
    tier: 2,
    badge: "ML Model Serving",
    desc: "Dedicated microservice repository delivering real-time neural network inference and feature normalization for PlutusApp."
  },
  {
    id: "hack-austria",
    date: "Jul 2023",
    title: "HackAustria — Raiffeisen PSD2 Banking",
    type: "project",
    pos: 5800,
    tier: 3,
    badge: "Fintech & Open Banking",
    desc: "Raiffeisen PSD2 Open Banking aggregation platform with automated transaction carbon accounting and route optimization."
  },
  {
    id: "aaa-trading",
    date: "Nov 2023",
    title: "AAA Trading Live Execution Gateway",
    type: "project",
    pos: 6400,
    tier: 4,
    badge: "High-Throughput Trading",
    desc: "Real-time execution gateway with deterministic order sizing and risk-bounded market integration."
  },
  {
    id: "plastic-production",
    date: "Mar 2024",
    title: "RonikRecycle / Distributed Manufacturing OS",
    type: "project",
    pos: 7100,
    tier: 1,
    badge: "Hardware & Production",
    desc: "Recycled plastic extrusion PID control, filament quality sensing, and distributed 3D print order coordination."
  },
  {
    id: "enerfis-testing",
    date: "Aug 2024",
    title: "Enerfis IoT Telemetry & QA Automation",
    type: "project",
    pos: 7800,
    tier: 2,
    badge: "IoT & QA Automation",
    desc: "Automated end-to-end testing harness and spatial telemetry verification for smart building energy sensors."
  },
  {
    id: "boiler-battery",
    date: "Apr 2025",
    title: "BoilerBattery Smart Solar Energy Diverter",
    type: "project",
    pos: 8600,
    tier: 3,
    badge: "Smart Energy & IoT",
    desc: "Dual ESP32 IoT gateway dynamically routing surplus rooftop solar energy into domestic thermal storage buffers."
  },
  {
    id: "crop-carbon",
    date: "Oct 2025",
    title: "CropCarbon Agricultural Telemetry",
    type: "project",
    pos: 9300,
    tier: 4,
    badge: "AgTech & Climate",
    desc: "Farm soil telemetry ingestion, carbon sequestration calculation algorithms, and sustainability incentive dashboards."
  },
  {
    id: "opti-radar",
    date: "Mar 2026",
    title: "OptiRadar / SkyWatch Computer Vision",
    type: "project",
    pos: 10000,
    tier: 1,
    badge: "Computer Vision",
    desc: "Real-time high-frame-rate optical object tracking, motion vector extraction, and skyward trajectory estimation."
  },
  {
    id: "realestate-scraper",
    date: "Apr 2026",
    title: "RealEstate Intelligence & Scraper Engine",
    type: "project",
    pos: 10600,
    tier: 2,
    badge: "Data Engineering",
    desc: "Multi-source real estate aggregation engine, geospatial deduplication, valuation modeling, and TrueNAS deployment."
  },
  {
    id: "insider-edge",
    date: "Aug 2026",
    title: "Insider Edge (v1.0.0)",
    type: "project",
    pos: 11200,
    tier: 3,
    badge: "Trading & DevOps",
    desc: "Automated SEC Form 4 insider trading bot with multi-tier risk guardrails, SQLite state engine, and Starlette control room."
  }
];

// 27 Frontier AI Models (Bottom Swimlane - 4 Tier Staggering)
const models = [
  // --- 2020 ---
  { id: "gpt-3", date: "Jun 2020", title: "GPT-3 (175B)", source: "openai", type: "milestone", pos: 650, tier: 1, desc: "175B autoregressive LLM proving in-context few-shot prompting capabilities." },
  
  // --- 2021 ---
  { id: "dalle-1", date: "Jan 2021", title: "DALL-E 1 & CLIP", source: "openai", type: "milestone", pos: 1950, tier: 2, desc: "Groundbreaking zero-shot multimodal image generation and text-image alignment." },
  
  // --- 2022 ---
  { id: "chatgpt", date: "Nov 2022", title: "ChatGPT (GPT-3.5)", source: "openai", type: "breakthrough", pos: 3650, tier: 1, desc: "Conversational RLHF alignment catalyst sparking worldwide generative AI adoption." },
  
  // --- 2023 ---
  { id: "llama-1", date: "Feb 2023", title: "LLaMA 1", source: "meta", type: "milestone", pos: 4350, tier: 2, desc: "7B-65B open research weights igniting the local LLM and quantization revolution." },
  { id: "gpt-4", date: "Mar 2023", title: "GPT-4", source: "openai", type: "breakthrough", pos: 4750, tier: 3, desc: "Massive multimodal leap passing Uniform Bar Exam at 90th percentile." },
  { id: "claude-1", date: "Mar 2023", title: "Claude 1 & Instant", source: "anthropic", type: "milestone", pos: 5000, tier: 4, desc: "Constitutional AI foundation providing safe, helpful, and honest conversational responses." },
  { id: "palm-2", date: "May 2023", title: "PaLM 2 (Bard)", source: "google", type: "milestone", pos: 5250, tier: 1, desc: "Google's multilingual reasoning architecture powering the original Bard conversational engine." },
  { id: "claude-2", date: "Jul 2023", title: "Claude 2 (100k)", source: "anthropic", type: "milestone", pos: 5550, tier: 2, desc: "Pioneering 100k token context window enabling full document analysis and synthesis." },
  { id: "llama-2", date: "Jul 2023", title: "Llama 2", source: "meta", type: "milestone", pos: 5800, tier: 3, desc: "Free commercial open-source license model enabling widespread enterprise deployment." },
  { id: "gpt-4-turbo", date: "Nov 2023", title: "GPT-4 Turbo", source: "openai", type: "milestone", pos: 6200, tier: 4, desc: "128k context window, JSON mode, and GPT-4V multimodal vision capabilities." },
  { id: "gemini-1", date: "Dec 2023", title: "Gemini 1.0 (Ultra/Pro)", source: "google", type: "milestone", pos: 6550, tier: 1, desc: "Google's native multimodal model trained from ground up across text, code, audio, and video." },
  
  // --- 2024 ---
  { id: "gemini-15-pro", date: "Feb 2024", title: "Gemini 1.5 Pro (2M)", source: "google", type: "breakthrough", pos: 6850, tier: 2, desc: "Breakthrough 1M-2M context window with 99%+ needle-in-a-haystack retrieval across whole codebases." },
  { id: "claude-3", date: "Mar 2024", title: "Claude 3 (Opus/Sonnet)", source: "anthropic", type: "milestone", pos: 7100, tier: 3, desc: "Opus captures #1 spot on Chatbot Arena; Sonnet offers balanced high-throughput intelligence." },
  { id: "llama-3", date: "Apr 2024", title: "Llama 3 (8B/70B)", source: "meta", type: "milestone", pos: 7300, tier: 4, desc: "15T+ training tokens with 128k tokenizer, setting high-water mark for open weights." },
  { id: "gpt-4o", date: "May 2024", title: "GPT-4o (Omni)", source: "openai", type: "breakthrough", pos: 7500, tier: 1, desc: "Single neural network natively handling text, vision, and real-time audio conversations." },
  { id: "gemini-15-flash", date: "May 2024", title: "Gemini 1.5 Flash", source: "google", type: "milestone", pos: 7680, tier: 2, desc: "Ultra-fast, low-latency 1M context model optimized for high-volume multimodal pipelines." },
  { id: "claude-35", date: "Jun 2024", title: "Claude 3.5 Sonnet", source: "anthropic", type: "breakthrough", pos: 7860, tier: 3, desc: "Landmark coding and agentic reasoning model; introduced Artifacts interactive workspace." },
  { id: "gpt-4o-mini", date: "Jul 2024", title: "GPT-4o mini", source: "openai", type: "milestone", pos: 8040, tier: 4, desc: "Cost-efficient small model outperforming GPT-3.5 with 128k context and vision support." },
  { id: "llama-31", date: "Jul 2024", title: "Llama 3.1 (405B)", source: "meta", type: "milestone", pos: 8220, tier: 1, desc: "Flagship 405B open-weights model rivaling top proprietary foundation models with 128k context." },
  { id: "o1-preview", date: "Sep 2024", title: "OpenAI o1-preview", source: "openai", type: "breakthrough", pos: 8400, tier: 2, desc: "Test-time compute reasoning paradigm shift with internal chain-of-thought exploration." },
  { id: "claude-35-haiku", date: "Oct 2024", title: "Claude 3.5 & Computer Use", source: "anthropic", type: "milestone", pos: 8580, tier: 3, desc: "Pioneered API capability for AI agents to control desktop mouse, keyboard, and screen." },
  { id: "gemini-2-flash", date: "Dec 2024", title: "Gemini 2.0 Flash", source: "google", type: "milestone", pos: 8760, tier: 4, desc: "Agentic multimodal streaming architecture with real-time video/audio and tool execution." },
  { id: "o1-full", date: "Dec 2024", title: "OpenAI o1 Full", source: "openai", type: "milestone", pos: 8940, tier: 1, desc: "Production o1 with vision multimodal inputs, structured outputs, and reduced hallucination rate." },
  
  // --- 2025 ---
  { id: "deepseek", date: "Jan 2025", title: "DeepSeek R1 & V3", source: "deepseek", type: "breakthrough", pos: 9100, tier: 2, desc: "Pure RL reasoning model & 671B MLA MoE architecture delivering frontier performance at high efficiency." },
  { id: "o3-mini", date: "Jan 2025", title: "OpenAI o3-mini", source: "openai", type: "breakthrough", pos: 9280, tier: 3, desc: "High-compute small reasoning model topping competitive coding and STEM benchmarks." },
  { id: "claude-37", date: "Feb 2025", title: "Claude 3.7 Sonnet", source: "anthropic", type: "breakthrough", pos: 9460, tier: 4, desc: "First hybrid thinking model with user-controllable reasoning budget; leader in SWE-bench Verified." },
  { id: "gemini-2-pro", date: "Feb 2025", title: "Gemini 2.0 Pro", source: "google", type: "milestone", pos: 9640, tier: 1, desc: "Google's premier coding and complex reasoning model with Flash-Thinking experimental branch." },
  { id: "gemini-25", date: "May 2025", title: "Gemini 2.5 Pro & Ultra", source: "google", type: "milestone", pos: 9820, tier: 2, desc: "Natively integrated deep reasoning across multimodal audio, vision, and dynamic execution sandboxes." },
  { id: "claude-4", date: "Jun 2025", title: "Claude 4 & Opus 4", source: "anthropic", type: "breakthrough", pos: 10000, tier: 3, desc: "Next-generation Constitutional reasoning engine with multi-hour autonomous task orchestration." },
  { id: "o3-full", date: "Aug 2025", title: "OpenAI o3 Full", source: "openai", type: "breakthrough", pos: 10180, tier: 4, desc: "Flagship frontier test-time reasoning model scaling compute across Olympiad math and complex engineering." },
  { id: "claude-45", date: "Oct 2025", title: "Claude 4.5 Sonnet", source: "anthropic", type: "milestone", pos: 10360, tier: 1, desc: "Ultra-fast autonomous code refactoring and advanced multi-agent desktop interaction protocols." },
  { id: "gpt-5", date: "Nov 2025", title: "GPT-5 (Orion)", source: "openai", type: "breakthrough", pos: 10540, tier: 2, desc: "Unified frontier foundation model merging native multimodal perception with deep test-time compute." },
  { id: "gemini-30", date: "Dec 2025", title: "Gemini 3.0 Pro", source: "google", type: "breakthrough", pos: 10720, tier: 3, desc: "Universal agent foundation with continuous execution loops, memory persistence, and deep codebase graphs." },

  // --- 2026 ---
  { id: "deepseek-r2", date: "Jan 2026", title: "DeepSeek R2 & V4", source: "deepseek", type: "breakthrough", pos: 10880, tier: 4, desc: "Sparse MoE 1T+ architecture with self-evolving verifiers and zero-latency thinking kernels." },
  { id: "sonnet-5", date: "Feb 2026", title: "Claude Sonnet 5 & Opus 5", source: "anthropic", type: "breakthrough", pos: 11040, tier: 1, desc: "Anthropic's flagship 5th-generation autonomous engineering and high-speed cognitive architecture." },
  { id: "mythos-5", date: "Mar 2026", title: "Anthropic Mythos 5", source: "anthropic", type: "breakthrough", pos: 11180, tier: 2, desc: "Autonomous cyber-defense and frontier agentic paradigm model capable of end-to-end mission orchestration." },
  { id: "gpt-55", date: "Apr 2026", title: "OpenAI o4 & GPT-5.5", source: "openai", type: "breakthrough", pos: 11320, tier: 3, desc: "Omni-agentic system with realtime tool synthesis, hardware interface hooks, and proactive reasoning." },
  { id: "gemini-31-pro", date: "Jun 2026", title: "Gemini 3.1 Pro & Ultra", source: "google", type: "breakthrough", pos: 11460, tier: 4, desc: "Google's breakthrough multi-modal reasoning engine with trillion-token context retrieval and live world modeling." },
  { id: "gemini-35", date: "Aug 2026", title: "Gemini 3.5 & Agent Swarms", source: "google", type: "milestone", pos: 11600, tier: 1, desc: "Distributed autonomous agentic swarm coordinator with formal verification loops and code synthesis." }
];

const badgeLabel = (src) => {
  if (src === "openai") return "OpenAI";
  if (src === "anthropic") return "Anthropic";
  if (src === "google") return "Google";
  if (src === "meta") return "Meta";
  if (src === "deepseek") return "DeepSeek";
  return "Frontier";
};

// Generate Projects HTML (Top Swimlane)
const projectsHtml = projects.map(p => `
            <!-- ${p.date}: ${p.title} -->
            <article class="project-pin-item tier-${p.tier}" data-id="${p.id}" data-type="project" style="left: ${p.pos}px;">
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

// Generate AI Models HTML (Bottom Swimlane)
const aiHtml = models.map(m => `
            <!-- ${m.date}: ${m.title} [${badgeLabel(m.source)}] -->
            <article class="ai-pin-item tier-${m.tier} source-${m.source}" data-id="${m.id}" data-source="${m.source}" data-type="${m.type}" style="left: ${m.pos}px;">
              <div class="ai-axis-dot"></div>
              <div class="ai-stem-down"></div>
              <div class="ai-pin-pill">
                <span class="pin-date">${m.date}</span>
                <span class="pin-title">${m.title}</span>
                <span class="pin-badge badge-${m.source}">${badgeLabel(m.source)}</span>
              </div>
              <div class="pin-popover">
                <p class="popover-desc">${m.desc}</p>
                <span class="popover-hint">Click to inspect &rarr;</span>
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
      content="Interactive horizontal engineering trajectory and AI model release timeline (2020–2026) showcasing personal engineering systems and frontier AI epochs."
    >
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Engineering Roadmap">
    <meta property="og:title" content="Engineering Trajectory & AI Horizon Timeline (2020–2026)">
    <meta property="og:description" content="Interactive dual-swimlane chronological roadmap of software engineering systems and frontier AI model releases.">
    <meta property="og:url" content="https://cvut-crossroad.com/roadmap">
    <title>Engineering Trajectory & AI Timeline (2020–2026)</title>
    <link rel="canonical" href="https://cvut-crossroad.com/roadmap">
    <link rel="manifest" href="./manifest.webmanifest">
    <link rel="stylesheet" href="./timeline.css?v=3.0.0">
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
            <h1>Engineering Trajectory &amp; AI Horizon</h1>
            <p>2020–2026 Chronological Track &bull; Shipped Projects &bull; Frontier AI Epochs</p>
          </div>
        </div>

        <div class="header-controls">
          <nav class="filter-pills" aria-label="Milestone categories">
            <button class="filter-btn active" data-filter="all" type="button">
              All <span class="badge-count" id="count-all">0</span>
            </button>
            <button class="filter-btn filter-projects" data-filter="projects" type="button">
              Projects <span class="badge-count" id="count-projects">0</span>
            </button>
            <button class="filter-btn filter-openai" data-filter="openai" type="button">
              OpenAI <span class="badge-count" id="count-openai">0</span>
            </button>
            <button class="filter-btn filter-anthropic" data-filter="anthropic" type="button">
              Anthropic <span class="badge-count" id="count-anthropic">0</span>
            </button>
            <button class="filter-btn filter-google" data-filter="google" type="button">
              Google <span class="badge-count" id="count-google">0</span>
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
      <main class="timeline-viewport" id="timeline-viewport" tabindex="0" aria-label="Horizontal timeline canvas">
        <div class="timeline-canvas">

          <!-- Swimlane Indicators -->
          <div class="swimlane-indicators" style="top: 85px;">
            <span class="lane-tag lane-tag-project">&bull; Engineering Projects (Top Track)</span>
          </div>
          <div class="swimlane-indicators" style="bottom: 55px;">
            <span class="lane-tag lane-tag-ai">&bull; Frontier AI Releases (Bottom Track)</span>
          </div>

          <!-- TOP SWIMLANE: Personal Engineering Projects (4-Tier Staggered Pins) -->
          <section class="swimlane-projects" aria-label="Engineering Projects">
${projectsHtml}
          </section>

          <!-- CENTER AXIS: Chronological Time Ribbon -->
          <div class="timeline-center-axis" aria-hidden="true">
            <div class="axis-line"></div>

            <div class="axis-year-marker" id="year-2020" style="left: 350px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2020</span>
            </div>

            <div class="axis-year-marker" id="year-2021" style="left: 1500px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2021</span>
            </div>

            <div class="axis-year-marker" id="year-2022" style="left: 2700px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2022</span>
            </div>

            <div class="axis-year-marker" id="year-2023" style="left: 4400px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2023</span>
            </div>

            <div class="axis-year-marker" id="year-2024" style="left: 6800px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2024</span>
            </div>

            <div class="axis-year-marker" id="year-2025" style="left: 8400px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2025</span>
            </div>

            <div class="axis-year-marker is-current" id="year-2026" style="left: 10000px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2026 (Now)</span>
            </div>
          </div>

          <!-- BOTTOM SWIMLANE: AI Frontier Releases (4-Tier Staggered Collapsed Pins) -->
          <section class="swimlane-ai" aria-label="AI Frontier Releases">
${aiHtml}
          </section>

        </div>
      </main>

      <!-- Footer Info Bar -->
      <footer class="timeline-footer">
        <div>
          <span>Horizontal Chronological View (2020&ndash;2026) &bull; 19 Engineering Projects &bull; 27 AI Epochs</span>
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

    <script src="./timeline.js?v=3.0.0"></script>
  </body>
</html>
`;

fs.writeFileSync("public/roadmap.html", html, "utf8");
console.log("Successfully generated public/roadmap.html with Back to Hub button!");
