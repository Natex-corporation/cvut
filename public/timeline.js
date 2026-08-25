(function () {
  "use strict";

  const viewport = document.getElementById("timeline-viewport");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-pin-item");
  const aiItems = document.querySelectorAll(".ai-pin-item");
  const allItems = document.querySelectorAll(".project-pin-item, .ai-pin-item");
  const timeButtons = document.querySelectorAll(".time-btn");
  const btnScrollLeft = document.getElementById("btn-scroll-left");
  const btnScrollRight = document.getElementById("btn-scroll-right");
  
  const inspectorOverlay = document.getElementById("inspector-overlay");
  const inspectorDrawer = document.getElementById("inspector-drawer");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const drawerBody = document.getElementById("drawer-body");
  const drawerTitle = document.getElementById("drawer-title");

  // --- 1. Global Scroll Containment: Only pan the timeline horizontally ---
  window.addEventListener("wheel", (e) => {
    // Allow normal vertical scrolling inside the inspector drawer content when open
    if (e.target.closest(".inspector-drawer") || e.target.closest(".drawer-content")) {
      return;
    }
    e.preventDefault();
    if (viewport) {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      viewport.scrollLeft += delta * 1.5;
    }
  }, { passive: false });

  // --- 2. Mouse Drag-to-Scroll on Timeline Viewport ---
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let velocity = 0;
  let lastX = 0;
  let animationId = null;

  if (viewport) {
    viewport.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      isDown = true;
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
      lastX = e.pageX;
      cancelAnimationFrame(animationId);
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      function momentum() {
        if (Math.abs(velocity) > 0.5) {
          viewport.scrollLeft += velocity;
          velocity *= 0.92;
          animationId = requestAnimationFrame(momentum);
        }
      }
      momentum();
    });

    viewport.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      viewport.scrollLeft = scrollLeft - walk;
      velocity = lastX - e.pageX;
      lastX = e.pageX;
    });
  }

  // --- 3. Arrow Controls ---
  if (btnScrollLeft && viewport) {
    btnScrollLeft.addEventListener("click", () => {
      viewport.scrollBy({ left: -480, behavior: "smooth" });
    });
  }

  if (btnScrollRight && viewport) {
    btnScrollRight.addEventListener("click", () => {
      viewport.scrollBy({ left: 480, behavior: "smooth" });
    });
  }

  // --- 4. Year Jump Navigation ---
  timeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const year = btn.dataset.year;
      if (year === "latest") {
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: "smooth" });
        return;
      }
      const marker = document.getElementById("year-" + year);
      if (marker && viewport) {
        const targetX = marker.offsetLeft - (viewport.clientWidth / 2);
        viewport.scrollTo({ left: Math.max(0, targetX), behavior: "smooth" });
      }
    });
  });

  // --- 5. Dynamic Filtering ---
  function updateCounts() {
    const countAll = document.getElementById("count-all");
    const countProjects = document.getElementById("count-projects");
    const countOpenai = document.getElementById("count-openai");
    const countAnthropic = document.getElementById("count-anthropic");
    const countGoogle = document.getElementById("count-google");

    let all = allItems.length;
    let projects = projectItems.length;
    let openai = document.querySelectorAll(`[data-source="openai"]`).length;
    let anthropic = document.querySelectorAll(`[data-source="anthropic"]`).length;
    let google = document.querySelectorAll(`[data-source="google"]`).length;

    if (countAll) countAll.textContent = all;
    if (countProjects) countProjects.textContent = projects;
    if (countOpenai) countOpenai.textContent = openai;
    if (countAnthropic) countAnthropic.textContent = anthropic;
    if (countGoogle) countGoogle.textContent = google;
  }

  function applyFilter(filter) {
    allItems.forEach((item) => {
      let match = false;
      const isProject = item.classList.contains("project-pin-item");
      const src = item.dataset.source;

      if (filter === "all") match = true;
      else if (filter === "projects") match = isProject;
      else if (filter === "openai") match = src === "openai";
      else if (filter === "anthropic") match = src === "anthropic";
      else if (filter === "google") match = src === "google";

      if (match) {
        item.classList.remove("is-hidden");
      } else {
        item.classList.add("is-hidden");
      }
    });

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("active", isActive);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyFilter(btn.dataset.filter);
    });
  });

  // --- 6. Deep Technical Inspector Content ---
  const PROJECT_DETAILS = {
    // 1. Line Follower 3Pi
    "line-follower-3pi": {
      title: "Pololu 3Pi Autonomous Line Follower (2020)",
      date: "February 2020",
      status: "Hardware & Robotics",
      badge: "Embedded AVR C++",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Autonomous high-speed differential-drive robotics platform built on the Pololu 3pi platform using custom Atmel AVR C++ with Proportional-Integral-Derivative (PID) line tracking.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Technical Architecture</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>PID Reflectance Sensor Calibration</strong>
              <p>Dynamic 5-sensor infrared reflectance array auto-calibration normalizing ambient lighting shifts and track contrast.</p>
            </div>
            <div class="feature-box">
              <strong>Real-Time Motor PWM Loop</strong>
              <p>Sub-millisecond loop frequency generating differential motor PWM speeds to navigate acute angles without losing track lock.</p>
            </div>
          </div>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Tech Stack</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">C++ / C</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">AVR ATmega328P</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">PID Control</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Pololu 3pi</span>
          </div>
        </div>
      `
    },

    // 2. Pre-GPT-3 Quant
    "pre-gpt3-quant": {
      title: "Pre-GPT-3 Quantitative & Predictive ML Suite (2021)",
      date: "May 2021",
      status: "Machine Learning & Quant Research",
      badge: "Pre-Transformer AI",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            A suite of early quantitative finance and machine learning models engineered prior to the mainstream transformer/LLM era, focusing on price direction forecasting, statistical arbitrage, and reinforcement learning.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Core Subsystems</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>Time-Series LSTM &amp; Regression Models</strong>
              <p>Multivariate recurrent neural networks predicting short-term equity direction using historical OHLCV features and technical indicators.</p>
            </div>
            <div class="feature-box">
              <strong>Deep Q-Learning Market Agent</strong>
              <p>Q-learning policy network trained in custom simulated market environments for risk-adjusted trade execution.</p>
            </div>
            <div class="feature-box">
              <strong>Automated Data Scraping Engine</strong>
              <p>High-throughput web scrapers collecting real-time ticker fundamentals and order book depth.</p>
            </div>
          </div>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Tech Stack</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Python</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">TensorFlow / Keras</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Scikit-Learn</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">NumPy / Pandas</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Deep Q-Learning</span>
          </div>
        </div>
      `
    },

    // 3. Thomas The AI & PlutusApp
    "plutus-thomas": {
      title: "ThomasTheAI 2.0 & PlutusApp (2022)",
      date: "November 2022",
      status: "Algorithmic Trading",
      badge: "Automated Trading",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Evolution of automated trading systems combining quantitative risk management, automated order routing via Alpaca, Discord alerts, and backtesting simulation.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Key Capabilities</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>Alpaca Broker Integration</strong>
              <p>Direct REST &amp; WebSocket execution for paper and live market orders with automated position sizing.</p>
            </div>
            <div class="feature-box">
              <strong>Real-Time Discord Operations Bot</strong>
              <p>Automated notification bot streaming execution alerts, fill prices, and portfolio P&amp;L telemetry.</p>
            </div>
          </div>
        </div>
      `
    },

    // 4. Hack Austria
    "hack-austria": {
      title: "HackAustria — Raiffeisen PSD2 Open Banking (2023)",
      date: "July 2023",
      status: "Fintech Hackathon Winner",
      badge: "PSD2 Open Banking",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Fintech application built for Hack Austria integrating Raiffeisen PSD2 Open Banking APIs to aggregate multi-bank transactions, estimate personal carbon emissions from categorized spending, and plan eco-friendly travel routes.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Features</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>PSD2 Multi-Bank Aggregation</strong>
              <p>Seamless OAuth authorization and transaction synchronization across Austrian banking providers.</p>
            </div>
            <div class="feature-box">
              <strong>Carbon Footprint Calculation</strong>
              <p>Real-time CO2 emission conversion algorithms mapping merchant categories to sustainability scores.</p>
            </div>
          </div>
        </div>
      `
    },

    // 5. Plastic Production
    "plastic-production": {
      title: "RonikRecycle / Distributed Manufacturing OS (2024)",
      date: "March 2024",
      status: "Hardware & Production Automation",
      badge: "Distributed 3D Printing",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Hardware-software platform for recycled plastic filament extrusion, automated temperature PID regulation, filament quality sensing, and distributed print farm job coordination.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">System Modules</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>Extruder Thermal PID Controller</strong>
              <p>Precise multi-zone temperature stabilization for melting recycled polymers (PET, PLA) into consistent 1.75mm filament.</p>
            </div>
            <div class="feature-box">
              <strong>Distributed Print Order Dispatch</strong>
              <p>Web platform coordinating customer job queues, print duration estimation, and material inventory tracking.</p>
            </div>
          </div>
        </div>
      `
    },

    // 6. Enerfis Testing Tools
    "enerfis-testing": {
      title: "Enerfis IoT Telemetry & QA Automation (2024)",
      date: "August 2024",
      status: "IoT Testing & Automation",
      badge: "QA Engineering",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Automated quality assurance framework and spatial telemetry verification harness for building energy efficiency IoT sensor platforms and environmental monitoring hubs.
          </p>
        </div>
      `
    },

    // 7. BoilerBattery (Safe, non-sensitive architectural overview)
    "boiler-battery": {
      title: "BoilerBattery — Smart Solar Energy Diverter (2025)",
      date: "April 2025",
      status: "Smart Energy IoT System",
      badge: "CleanTech & Microcontrollers",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Architectural Concept</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            A decentralized IoT energy management system that monitors domestic photovoltaic battery state of charge (SoC) and dynamically diverts surplus solar power into water heater thermal storage buffers instead of curtailing or dumping power to the grid.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Core Subsystems</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>ESP32 Energy Gateway (Client/Server)</strong>
              <p>Dual-node microcontroller firmware monitoring real-time power production, battery SoC thresholds, and temperature telemetry.</p>
            </div>
            <div class="feature-box">
              <strong>Thermal Storage Buffer Management</strong>
              <p>Proportional power modulation regulating boiler heating elements to absorb excess kilowatt-hours safely with automatic thermal cutoffs.</p>
            </div>
          </div>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Tech Stack</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">ESP32 Firmware</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">C++ / Arduino</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Python Server</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">IoT Protocols</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Clean Energy</span>
          </div>
        </div>
      `
    },

    // 8. CropCarbon
    "crop-carbon": {
      title: "CropCarbon — Agricultural Telemetry Engine (2025)",
      date: "October 2025",
      status: "AgTech & Climate Platform",
      badge: "Sustainability Telemetry",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Agricultural sustainability platform tracking soil telemetry, crop rotation patterns, and verifying carbon sequestration credits for agricultural landholders.
          </p>
        </div>
      `
    },

    // 9. RonikCloud & CloudR2
    "ronik-cloud": {
      title: "RonikCloud & CloudR2 Hybrid Storage Platform (2025–2026)",
      date: "November 2025",
      status: "Cloud Infrastructure",
      badge: "Cloudflare R2 & Firebase",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            High-performance distributed cloud storage system featuring zero-egress Cloudflare R2 object buckets, Firebase security rules, client-side encryption, and Jenkins continuous deployment.
          </p>
        </div>
      `
    },

    // 10. OptiRadar
    "opti-radar": {
      title: "OptiRadar / SkyWatch Computer Vision (2026)",
      date: "March 2026",
      status: "Computer Vision & Edge AI",
      badge: "Optical Object Tracking",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            High-frame-rate optical radar system designed for real-time moving object detection, background subtraction, skyward trajectory estimation, and automated camera video stream analysis.
          </p>
        </div>
      `
    },

    // 11. RealEstate Scraper
    "realestate-scraper": {
      title: "RealEstate Intelligence & Scraper Engine (2026)",
      date: "April 2026",
      status: "Data Engineering Platform",
      badge: "Real Estate Analytics",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Automated multi-source property intelligence platform scraping, cleaning, deduplicating, and pricing real estate listings across the Czech market with automated TrueNAS deployment.
          </p>
        </div>
      `
    },

    // 12. Insider Edge
    "insider-edge": {
      title: "Insider Edge — SEC Form 4 Trading Bot (2026)",
      date: "August 2026",
      status: "Production v1.0.0",
      badge: "Algorithmic Trading & DevOps",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Executive Summary</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Insider Edge</strong> is an autonomous algorithmic trading service designed to track high-conviction SEC Form 4 insider transactions, run multi-tier risk evaluations, execute paper trades via Alpaca, and expose a real-time web operations control room.
          </p>
        </div>

        <div class="drawer-section">
          <span class="drawer-section-title">Core Architecture &amp; Pipeline</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>1. SEC Form 4 Scraping &amp; Ingestion</strong>
              <p>Automated polling of EDGAR Form 4 XML filings with transaction categorization (P-Purchases vs S-Sales) and deduplication engine.</p>
            </div>
            <div class="feature-box">
              <strong>2. Multi-Tier Risk Guardrails</strong>
              <p>Strict max position caps ($2,000 per ticker), total portfolio leverage limits, cash reserve preservation, and duplicate entry blocking.</p>
            </div>
            <div class="feature-box">
              <strong>3. Execution &amp; Exit Automation</strong>
              <p>Deterministic order sizing, Alpaca paper trading API interop, and fill-based Take-Profit / Stop-Loss bracket management.</p>
            </div>
            <div class="feature-box">
              <strong>4. Control Room &amp; Telemetry</strong>
              <p>Embedded Starlette web dashboard with real-time portfolio metrics, active position monitor, and Prometheus exporter.</p>
            </div>
            <div class="feature-box">
              <strong>5. ACID SQLite Engine</strong>
              <p>WAL-mode SQLite state engine maintaining strict idempotency, executed trades history, open positions, and state recovery.</p>
            </div>
            <div class="feature-box">
              <strong>6. Docker &amp; TrueNAS SCALE</strong>
              <p>Hardened non-root container deployment, automated compose generation, and seamless headless NAS deployment.</p>
            </div>
          </div>
        </div>

        <div class="drawer-section">
          <span class="drawer-section-title">Tech Stack &amp; Verification</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Python 3.11</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Alpaca API</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Starlette</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">SQLite ACID</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Docker Non-Root</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">TrueNAS SCALE</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Prometheus</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">Pytest (96%+ Cov)</span>
            <span class="mini-tag" style="color:#10b981; border-color: rgba(16,185,129,0.3)">GitHub Actions</span>
          </div>
        </div>

        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/insider-trading" target="_blank" rel="noopener noreferrer" class="btn-primary">
            Open GitHub Repository &#8594;
          </a>
        </div>
      `
    },

    // AI Models
    "gpt-5": {
      title: "OpenAI GPT-5 (Orion Foundation)",
      date: "November 2025",
      status: "Frontier Foundation",
      badge: "Unified Reasoning & Omni",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>GPT-5</strong> represents OpenAI's breakthrough architectural unification: integrating test-time compute search, real-time multimodal sensory streaming, and autonomous multi-agent tool synthesis into a single foundation model.
          </p>
        </div>
      `
    },
    "sonnet-5": {
      title: "Anthropic Claude Sonnet 5 & Opus 5",
      date: "February 2026",
      status: "Frontier 5th Generation",
      badge: "Autonomous Architecture",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Claude Sonnet 5</strong> is Anthropic's 5th-generation autonomous engineering model, featuring continuous background verification, sub-second latency, and verified SWE-bench leadership across multi-repo codebases.
          </p>
        </div>
      `
    },
    "mythos-5": {
      title: "Anthropic Mythos 5",
      date: "March 2026",
      status: "Frontier Autonomous Paradigm",
      badge: "Cyber & Strategic Agent",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Anthropic Mythos 5</strong> is Anthropic's dedicated autonomous paradigm model engineered for cyber security, formal theorem proving, and continuous multi-agent mission execution.
          </p>
        </div>
      `
    },
    "gemini-31-pro": {
      title: "Google Gemini 3.1 Pro & Ultra",
      date: "June 2026",
      status: "Google Flagship 2026",
      badge: "World Modeling & Trillion Context",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Gemini 3.1 Pro</strong> introduces Google's next-generation world modeling neural engine with trillion-token context retrieval, live interactive software environment simulation, and native self-verifying code generation.
          </p>
        </div>
      `
    }
  };

  function openInspector(id, fallbackData) {
    const data = PROJECT_DETAILS[id];
    if (data) {
      drawerTitle.textContent = data.title;
      drawerBody.innerHTML = data.content;
    } else if (fallbackData) {
      drawerTitle.textContent = fallbackData.title;
      drawerBody.innerHTML = `
        <div class="drawer-section">
          <span class="drawer-section-title">Milestone Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">${fallbackData.desc}</p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Release Details</span>
          <div class="feature-box">
            <strong>Date: ${fallbackData.date}</strong>
            <p>${fallbackData.category}</p>
          </div>
        </div>
      `;
    }

    inspectorOverlay.classList.add("open");
    inspectorDrawer.classList.add("open");
  }

  function closeInspector() {
    inspectorOverlay.classList.remove("open");
    inspectorDrawer.classList.remove("open");
  }

  allItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      const titleEl = item.querySelector(".card-title, .pin-title");
      const descEl = item.querySelector(".card-desc, .popover-desc");
      const dateEl = item.querySelector(".card-date, .pin-date");
      const badgeEl = item.querySelector(".card-badge, .pin-badge, .project-badge");

      const fallbackData = {
        title: titleEl ? titleEl.textContent : "Milestone",
        desc: descEl ? descEl.textContent : "",
        date: dateEl ? dateEl.textContent : "",
        category: badgeEl ? badgeEl.textContent : "Milestone"
      };

      openInspector(id, fallbackData);
    });
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeInspector);
  if (inspectorOverlay) inspectorOverlay.addEventListener("click", closeInspector);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeInspector();
    if (e.key === "ArrowRight" && viewport) viewport.scrollBy({ left: 350, behavior: "smooth" });
    if (e.key === "ArrowLeft" && viewport) viewport.scrollBy({ left: -350, behavior: "smooth" });
  });

  // Init
  updateCounts();

  // Scroll to current / latest position on initial load
  window.addEventListener("DOMContentLoaded", () => {
    const year2026 = document.getElementById("year-2026");
    if (year2026 && viewport) {
      setTimeout(() => {
        const targetX = year2026.offsetLeft - (viewport.clientWidth / 2);
        viewport.scrollTo({ left: Math.max(0, targetX), behavior: "smooth" });
      }, 100);
    }
  });
})();
