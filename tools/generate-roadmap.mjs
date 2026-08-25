import fs from "fs";

const models = [
  // --- 2020 ---
  { id: "gpt-3", date: "Jun 2020", title: "GPT-3 (175B)", source: "openai", type: "milestone", pos: 350, tier: 1, desc: "175B autoregressive LLM proving in-context few-shot prompting capabilities." },
  
  // --- 2021 ---
  { id: "dalle-1", date: "Jan 2021", title: "DALL-E 1 & CLIP", source: "openai", type: "milestone", pos: 750, tier: 2, desc: "Groundbreaking zero-shot multimodal image generation and text-image alignment." },
  
  // --- 2022 ---
  { id: "chatgpt", date: "Nov 2022", title: "ChatGPT (GPT-3.5)", source: "openai", type: "breakthrough", pos: 1250, tier: 1, desc: "Conversational RLHF alignment catalyst sparking worldwide generative AI adoption." },
  
  // --- 2023 ---
  { id: "llama-1", date: "Feb 2023", title: "LLaMA 1", source: "meta", type: "milestone", pos: 1450, tier: 3, desc: "7B-65B open research weights igniting the local LLM and quantization revolution." },
  { id: "gpt-4", date: "Mar 2023", title: "GPT-4", source: "openai", type: "breakthrough", pos: 1620, tier: 1, desc: "Massive multimodal leap passing Uniform Bar Exam at 90th percentile." },
  { id: "claude-1", date: "Mar 2023", title: "Claude 1 & Instant", source: "anthropic", type: "milestone", pos: 1780, tier: 2, desc: "Constitutional AI foundation providing safe, helpful, and honest conversational responses." },
  { id: "palm-2", date: "May 2023", title: "PaLM 2 (Bard)", source: "google", type: "milestone", pos: 1940, tier: 3, desc: "Google's multilingual reasoning architecture powering the original Bard conversational engine." },
  { id: "claude-2", date: "Jul 2023", title: "Claude 2 (100k)", source: "anthropic", type: "milestone", pos: 2100, tier: 1, desc: "Pioneering 100k token context window enabling full document analysis and synthesis." },
  { id: "llama-2", date: "Jul 2023", title: "Llama 2", source: "meta", type: "milestone", pos: 2260, tier: 2, desc: "Free commercial open-source license model enabling widespread enterprise deployment." },
  { id: "gpt-4-turbo", date: "Nov 2023", title: "GPT-4 Turbo", source: "openai", type: "milestone", pos: 2420, tier: 3, desc: "128k context window, JSON mode, and GPT-4V multimodal vision capabilities." },
  { id: "gemini-1", date: "Dec 2023", title: "Gemini 1.0 (Ultra/Pro)", source: "google", type: "milestone", pos: 2580, tier: 1, desc: "Google's native multimodal model trained from ground up across text, code, audio, and video." },
  
  // --- 2024 ---
  { id: "gemini-15-pro", date: "Feb 2024", title: "Gemini 1.5 Pro (2M)", source: "google", type: "breakthrough", pos: 2760, tier: 2, desc: "Breakthrough 1M-2M context window with 99%+ needle-in-a-haystack retrieval across whole codebases." },
  { id: "claude-3", date: "Mar 2024", title: "Claude 3 (Opus/Sonnet)", source: "anthropic", type: "milestone", pos: 2940, tier: 3, desc: "Opus captures #1 spot on Chatbot Arena; Sonnet offers balanced high-throughput intelligence." },
  { id: "llama-3", date: "Apr 2024", title: "Llama 3 (8B/70B)", source: "meta", type: "milestone", pos: 3100, tier: 1, desc: "15T+ training tokens with 128k tokenizer, setting high-water mark for open weights." },
  { id: "gpt-4o", date: "May 2024", title: "GPT-4o (Omni)", source: "openai", type: "breakthrough", pos: 3260, tier: 2, desc: "Single neural network natively handling text, vision, and real-time audio conversations." },
  { id: "gemini-15-flash", date: "May 2024", title: "Gemini 1.5 Flash", source: "google", type: "milestone", pos: 3420, tier: 3, desc: "Ultra-fast, low-latency 1M context model optimized for high-volume multimodal pipelines." },
  { id: "claude-35", date: "Jun 2024", title: "Claude 3.5 Sonnet", source: "anthropic", type: "breakthrough", pos: 3580, tier: 1, desc: "Landmark coding and agentic reasoning model; introduced Artifacts interactive workspace." },
  { id: "gpt-4o-mini", date: "Jul 2024", title: "GPT-4o mini", source: "openai", type: "milestone", pos: 3740, tier: 2, desc: "Cost-efficient small model outperforming GPT-3.5 with 128k context and vision support." },
  { id: "llama-31", date: "Jul 2024", title: "Llama 3.1 (405B)", source: "meta", type: "milestone", pos: 3900, tier: 3, desc: "Flagship 405B open-weights model rivaling top proprietary foundation models with 128k context." },
  { id: "o1-preview", date: "Sep 2024", title: "OpenAI o1-preview", source: "openai", type: "breakthrough", pos: 4080, tier: 1, desc: "Test-time compute reasoning paradigm shift with internal chain-of-thought exploration." },
  { id: "claude-35-haiku", date: "Oct 2024", title: "Claude 3.5 & Computer Use", source: "anthropic", type: "milestone", pos: 4260, tier: 2, desc: "Pioneered API capability for AI agents to control desktop mouse, keyboard, and screen." },
  { id: "gemini-2-flash", date: "Dec 2024", title: "Gemini 2.0 Flash", source: "google", type: "milestone", pos: 4440, tier: 3, desc: "Agentic multimodal streaming architecture with real-time video/audio and tool execution." },
  { id: "o1-full", date: "Dec 2024", title: "OpenAI o1 Full", source: "openai", type: "milestone", pos: 4600, tier: 1, desc: "Production o1 with vision multimodal inputs, structured outputs, and reduced hallucination rate." },
  
  // --- 2025 ---
  { id: "deepseek", date: "Jan 2025", title: "DeepSeek R1 & V3", source: "deepseek", type: "breakthrough", pos: 4780, tier: 2, desc: "Pure RL reasoning model & 671B MLA MoE architecture delivering frontier performance at high efficiency." },
  { id: "o3-mini", date: "Jan 2025", title: "OpenAI o3-mini", source: "openai", type: "breakthrough", pos: 4960, tier: 3, desc: "High-compute small reasoning model topping competitive coding and STEM benchmarks." },
  { id: "claude-37", date: "Feb 2025", title: "Claude 3.7 Sonnet", source: "anthropic", type: "breakthrough", pos: 5140, tier: 1, desc: "First hybrid thinking model with user-controllable reasoning budget; leader in SWE-bench Verified." },
  { id: "gemini-2-pro", date: "Feb 2025", title: "Gemini 2.0 Pro", source: "google", type: "milestone", pos: 5320, tier: 2, desc: "Google's premier coding and complex reasoning model with Flash-Thinking experimental branch." },
  { id: "gemini-25", date: "May 2025", title: "Gemini 2.5 Pro & Ultra", source: "google", type: "milestone", pos: 5500, tier: 3, desc: "Natively integrated deep reasoning across multimodal audio, vision, and dynamic execution sandboxes." },
  { id: "claude-4", date: "Jun 2025", title: "Claude 4 & Opus 4", source: "anthropic", type: "breakthrough", pos: 5680, tier: 1, desc: "Next-generation Constitutional reasoning engine with multi-hour autonomous task orchestration." },
  { id: "o3-full", date: "Aug 2025", title: "OpenAI o3 Full", source: "openai", type: "breakthrough", pos: 5860, tier: 2, desc: "Flagship frontier test-time reasoning model scaling compute across Olympiad math and complex engineering." },
  { id: "claude-45", date: "Oct 2025", title: "Claude 4.5 Sonnet", source: "anthropic", type: "milestone", pos: 6040, tier: 3, desc: "Ultra-fast autonomous code refactoring and advanced multi-agent desktop interaction protocols." },
  { id: "gpt-5", date: "Nov 2025", title: "GPT-5 (Orion)", source: "openai", type: "breakthrough", pos: 6220, tier: 1, desc: "Unified frontier foundation model merging native multimodal perception with deep test-time compute." },
  { id: "gemini-30", date: "Dec 2025", title: "Gemini 3.0 Pro", source: "google", type: "breakthrough", pos: 6400, tier: 2, desc: "Universal agent foundation with continuous execution loops, memory persistence, and deep codebase graphs." },

  // --- 2026 ---
  { id: "deepseek-r2", date: "Jan 2026", title: "DeepSeek R2 & V4", source: "deepseek", type: "breakthrough", pos: 6580, tier: 3, desc: "Sparse MoE 1T+ architecture with self-evolving verifiers and zero-latency thinking kernels." },
  { id: "sonnet-5", date: "Feb 2026", title: "Claude Sonnet 5 & Opus 5", source: "anthropic", type: "breakthrough", pos: 6760, tier: 1, desc: "Anthropic's flagship 5th-generation autonomous engineering and high-speed cognitive architecture." },
  { id: "mythos-5", date: "Mar 2026", title: "Anthropic Mythos 5", source: "anthropic", type: "breakthrough", pos: 6940, tier: 2, desc: "Autonomous cyber-defense and frontier agentic paradigm model capable of end-to-end mission orchestration." },
  { id: "gpt-55", date: "Apr 2026", title: "OpenAI o4 & GPT-5.5", source: "openai", type: "breakthrough", pos: 7120, tier: 3, desc: "Omni-agentic system with realtime tool synthesis, hardware interface hooks, and proactive reasoning." },
  { id: "gemini-31-pro", date: "Jun 2026", title: "Gemini 3.1 Pro & Ultra", source: "google", type: "breakthrough", pos: 7300, tier: 1, desc: "Google's breakthrough multi-modal reasoning engine with trillion-token context retrieval and live world modeling." },
  { id: "gemini-35", date: "Aug 2026", title: "Gemini 3.5 & Agent Swarms", source: "google", type: "milestone", pos: 7480, tier: 2, desc: "Distributed autonomous agentic swarm coordinator with formal verification loops and code synthesis." }
];

const badgeLabel = (src) => {
  if (src === "openai") return "OpenAI";
  if (src === "anthropic") return "Anthropic";
  if (src === "google") return "Google";
  if (src === "meta") return "Meta";
  if (src === "deepseek") return "DeepSeek";
  return "Frontier";
};

const itemsHtml = models.map(m => `
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
      content="Interactive horizontal engineering trajectory and AI model release timeline (2020–2026) showcasing Insider Edge, GPT-5, Sonnet 5, Mythos 5, Gemini 3.1 Pro, and frontier models."
    >
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Engineering Roadmap">
    <meta property="og:title" content="Engineering Trajectory & AI Horizon Timeline">
    <meta property="og:description" content="Horizontal interactive timeline of software engineering projects and OpenAI, Anthropic, and Google AI model releases.">
    <meta property="og:url" content="https://cvut-crossroad.com/roadmap">
    <title>Engineering Trajectory & AI Timeline (2020–2026)</title>
    <link rel="canonical" href="https://cvut-crossroad.com/roadmap">
    <link rel="manifest" href="./manifest.webmanifest">
    <link rel="stylesheet" href="./timeline.css?v=2.3.0">
  </head>
  <body>
    <div class="ambient-glow" aria-hidden="true"></div>

    <div class="app-shell">
      <!-- Header Bar -->
      <header class="timeline-header">
        <div class="brand-section">
          <div class="brand-badge">TX</div>
          <div class="brand-text">
            <h1>Engineering Trajectory &amp; AI Horizon</h1>
            <p>2020–2026 Chronological Track &bull; GPT-5 &bull; Sonnet 5 &bull; Mythos 5 &bull; Gemini 3.1 Pro &bull; Projects</p>
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
          <div class="swimlane-indicators" style="top: 90px;">
            <span class="lane-tag lane-tag-project">&bull; Engineering Projects</span>
          </div>
          <div class="swimlane-indicators" style="bottom: 60px;">
            <span class="lane-tag lane-tag-ai">&bull; AI Frontier Horizon</span>
          </div>

          <!-- TOP SWIMLANE: Personal Engineering Projects -->
          <section class="swimlane-projects" aria-label="Engineering Projects">

            <!-- 2026: Insider Edge -->
            <article class="project-item" data-id="insider-edge" data-type="breakthrough" style="left: 7450px;">
              <div class="project-card">
                <div class="card-header">
                  <span class="card-date">August 2026</span>
                  <span class="card-badge badge-project"><span class="pulse-dot"></span> Completed (v1.0.0)</span>
                </div>
                <h3 class="card-title">Insider Edge &mdash; SEC Form 4 Bot</h3>
                <p class="card-desc">
                  Automated insider trading bot with multi-tier risk guardrails, SQLite state engine, Starlette telemetry room, and TrueNAS SCALE automation.
                </p>
                <div class="card-tags">
                  <span class="mini-tag">Python 3.11</span>
                  <span class="mini-tag">Alpaca API</span>
                  <span class="mini-tag">SQLite</span>
                  <span class="mini-tag">Docker</span>
                  <span class="mini-tag">Prometheus</span>
                </div>
                <span class="inspect-cue">Inspect Architecture &rarr;</span>
              </div>
              <div class="project-stem-down"></div>
              <div class="project-node-axis"></div>
            </article>

          </section>

          <!-- CENTER AXIS: Chronological Time Ribbon -->
          <div class="timeline-center-axis" aria-hidden="true">
            <div class="axis-line"></div>

            <div class="axis-year-marker" id="year-2020" style="left: 250px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2020</span>
            </div>

            <div class="axis-year-marker" id="year-2021" style="left: 700px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2021</span>
            </div>

            <div class="axis-year-marker" id="year-2022" style="left: 1200px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2022</span>
            </div>

            <div class="axis-year-marker" id="year-2023" style="left: 1800px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2023</span>
            </div>

            <div class="axis-year-marker" id="year-2024" style="left: 3000px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2024</span>
            </div>

            <div class="axis-year-marker" id="year-2025" style="left: 4700px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2025</span>
            </div>

            <div class="axis-year-marker is-current" id="year-2026" style="left: 6500px;">
              <div class="axis-node"></div>
              <span class="axis-year-label">2026 (Now)</span>
            </div>
          </div>

          <!-- BOTTOM SWIMLANE: AI Frontier Releases (3-Tier Staggered Collapsed Pins) -->
          <section class="swimlane-ai" aria-label="AI Frontier Releases">
${itemsHtml}
          </section>

        </div>
      </main>

      <!-- Footer Info Bar -->
      <footer class="timeline-footer">
        <div>
          <span>Horizontal Chronological View (2020&ndash;2026) &bull; Collapsed Interactive Pins</span>
        </div>
        <div class="footer-keys">
          <span class="key-hint"><kbd>Drag</kbd> or <kbd>Wheel</kbd> to pan</span>
          <span class="key-hint"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> scroll</span>
          <span class="key-hint"><kbd>Hover</kbd> for quick preview</span>
          <span class="key-hint"><kbd>Click</kbd> pin to inspect</span>
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

    <script src="./timeline.js?v=2.3.0"></script>
  </body>
</html>
`;

fs.writeFileSync("public/roadmap.html", html, "utf8");
console.log("Successfully generated public/roadmap.html with 39 models!");
