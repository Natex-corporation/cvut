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

  // --- 6. Deep Technical Inspector Content (Every single project has working action buttons) ---
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/Line_Folower" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 2. Face Detection & Security
    "face-detection-sec": {
      title: "FaceDetection & Computer Vision Security (2020)",
      date: "May 2020",
      status: "Computer Vision Prototype",
      badge: "Vision & Security",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Early exploration into client-side computer vision utilizing JavaScript FaceAPI neural models for real-time facial landmark detection paired with a secure web gateway prototype.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Key Capabilities</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>Neural Landmark Tracking</strong>
              <p>Browser-based neural net estimating 68 facial points for live user presence verification.</p>
            </div>
          </div>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/FaceDetection" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 3. Pre-GPT-3 Quant
    "pre-gpt3-quant": {
      title: "Statistical ML & Risk Regression (2021)",
      date: "May 2021",
      status: "Machine Learning & Quant Research",
      badge: "Pre-Transformer AI",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Early quantitative finance foundations engineered prior to mainstream LLMs: linear regression price modeling, logistic regression risk scoring, and automated market data ingestion.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/01_early_ml_foundations" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect Early ML in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 4. Deep Q-Learning
    "deep-q-learning": {
      title: "Deep Q-Learning RL Market Agent (2021)",
      date: "November 2021",
      status: "Reinforcement Learning",
      badge: "RL Trading Agent",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            A Deep Q-Learning (DQN) policy network trained in a custom simulated market environment to learn risk-adjusted trade execution policies across historical price datasets.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/01_early_ml_foundations" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect RL Agent in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 5. Discord Bot
    "discord-bot-alerts": {
      title: "Stock Activity Telemetry & Discord Bot (2022)",
      date: "January 2022",
      status: "Fintech Telemetry",
      badge: "Real-Time Alerts",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Automated market monitoring and webhook notification service streaming real-time equity breakout alerts, volume spikes, and technical indicator triggers.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/07_telemetry_discord_bot" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect Discord Bot in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 6. Laser Challenge M^2 Profiler
    "laser-challenge-m2": {
      title: "Laser Challenge — M² Laser Beam Quality Profiler (2022)",
      date: "February 2022",
      status: "Optics & Physics Competition",
      badge: "ISO 11146 Laser Profilometry",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Competition &amp; Physics Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Hardware-software optical profilometry system engineered for the <strong>Laser Challenge / Science Challenge</strong> physics and engineering competition. The system automated the precise measurement of laser beam quality propagation factor (<strong>M²</strong>) in compliance with the <strong>ISO 11146</strong> standard.
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Technical Architecture &amp; Methodology</span>
          <div class="feature-grid">
            <div class="feature-box">
              <strong>Motorized Knife-Edge Stage</strong>
              <p>Precision microstepping translation stage driving an opaque razor blade across the focused laser beam cross-section with sub-micron spatial resolution.</p>
            </div>
            <div class="feature-box">
              <strong>Mathematical Data Analysis Engine</strong>
              <p>C++ and Python regression fitting transmission intensity profiles to complementary Gaussian error functions (erf) to extract beam waist (w₀), Rayleigh range (z_R), and divergence (θ).</p>
            </div>
          </div>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/LaserChalllange" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 7. Final Work Thesis
    "final-work-thesis": {
      title: "High School Graduation Capstone: ThomasTheAI (2022)",
      date: "April 2022",
      status: "Graduation Capstone Thesis",
      badge: "C++ Neural Layers & LSTM",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Thesis Summary</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            High school graduation capstone research project (<em>Názler_AkciováAnalýza</em>) exploring neural network applications in financial time series forecasting, featuring custom C++ neural layers (<code>ThomasTheAI.cpp</code>) and multivariate Python LSTM networks.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/02_final_work_thesis" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect Thesis in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 8. ThomasTheAI 2.0
    "thomas-ai-2": {
      title: "ThomasTheAI 2.0 & Desktop Trading App (2022)",
      date: "December 2022",
      status: "Desktop Trading Application",
      badge: "Interactive GUI",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Desktop client unifying market charting, multi-timeframe feature scaling, technical indicator evaluation (RSI, Moving Averages), and directional trading signals.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/04_desktop_trading_apps" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect Trading GUI in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 9. Ronik-App & RealTrade
    "ronik-real-trade": {
      title: "Ronik-App & RealTrade Execution Engine (2023)",
      date: "February 2023",
      status: "Broker Execution Harness",
      badge: "Alpaca Trading",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Automated market execution harness connecting directly to Alpaca REST and WebSocket APIs for paper and live trading with bracket order support (Take-Profit &amp; Stop-Loss).
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/05_real_trade_engines" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect RealTrade in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 10. Plutus Models Service
    "plutus-models": {
      title: "Plutus ML Inference Service & Models (2023)",
      date: "May 2023",
      status: "Machine Learning Microservice",
      badge: "Model Serving",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Dedicated inference service and model registry repository delivering real-time neural network scoring and feature transformations for the Plutus trading platform.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/06_ml_models_service" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect ML Models in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 11. Hack Austria
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/HackAustria-Raiffeisenbank" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 12. AAA Trading
    "aaa-trading": {
      title: "AAA Trading Live Execution Gateway (2023)",
      date: "November 2023",
      status: "Execution Gateway",
      badge: "High-Throughput Trading",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            High-throughput order routing engine and execution gateway enforcing deterministic sizing and risk-bounded market integration.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/PlutusApp/tree/main/05_real_trade_engines/aaa_trading" target="_blank" rel="noopener noreferrer" class="btn-primary">Inspect AAA Trading in Plutus Monorepo &#8594;</a>
        </div>
      `
    },

    // 13. Plastic Production
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/plastic_production_v2" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 14. Enerfis Testing Tools
    "enerfis-testing": {
      title: "Enerfis IoT Telemetry & QA Automation (2024)",
      date: "August 2024",
      status: "IoT Testing & Automation",
      badge: "QA Engineering",
      content: `
        <div class="drawer-section">
          <span class="drawer-section-title">Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            Automated quality assurance framework and spatial telemetry verification harness for building energy efficiency IoT sensor platforms.
          </p>
        </div>
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/enerfis_testing_tools" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 15. BoilerBattery (Safe architecture)
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/BoilerBattery" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 16. CropCarbon
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/cropcarbon" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 17. OptiRadar
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/OpticalRadar" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 18. RealEstate Scraper
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/realestate-scraper" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
        </div>
      `
    },

    // 19. Insider Edge
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
        <div class="drawer-actions">
          <a href="https://github.com/Natex-corporation/insider-trading" target="_blank" rel="noopener noreferrer" class="btn-primary">Open GitHub Repository &#8594;</a>
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
        <div class="drawer-actions">
          <a href="https://openai.com" target="_blank" rel="noopener noreferrer" class="btn-primary">Official OpenAI Research &#8594;</a>
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
        <div class="drawer-actions">
          <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" class="btn-primary">Official Anthropic Research &#8594;</a>
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
        <div class="drawer-actions">
          <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" class="btn-primary">Official Anthropic Research &#8594;</a>
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
        <div class="drawer-actions">
          <a href="https://blog.google/technology/ai/" target="_blank" rel="noopener noreferrer" class="btn-primary">Official Google DeepMind Research &#8594;</a>
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
