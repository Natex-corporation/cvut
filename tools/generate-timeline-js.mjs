import fs from "fs";

const jsContent = `(function () {
  "use strict";

  const viewport = document.getElementById("timeline-viewport");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");
  const aiItems = document.querySelectorAll(".ai-pin-item");
  const allItems = document.querySelectorAll(".project-item, .ai-pin-item");
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
    let openai = document.querySelectorAll(\`[data-source="openai"]\`).length;
    let anthropic = document.querySelectorAll(\`[data-source="anthropic"]\`).length;
    let google = document.querySelectorAll(\`[data-source="google"]\`).length;

    if (countAll) countAll.textContent = all;
    if (countProjects) countProjects.textContent = projects;
    if (countOpenai) countOpenai.textContent = openai;
    if (countAnthropic) countAnthropic.textContent = anthropic;
    if (countGoogle) countGoogle.textContent = google;
  }

  function applyFilter(filter) {
    allItems.forEach((item) => {
      let match = false;
      const isProject = item.classList.contains("project-item");
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

  // --- 6. Slide-Over Inspector Drawer ---
  const PROJECT_DETAILS = {
    "insider-edge": {
      title: "Insider Edge — SEC Form 4 Trading Bot",
      date: "August 2026",
      status: "Production v1.0.0",
      badge: "Algorithmic Trading & DevOps",
      content: \`
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
      \`
    },
    "claude-37": {
      title: "Anthropic Claude 3.7 Sonnet & Hybrid Thinking",
      date: "February 2025",
      status: "Frontier State of the Art",
      badge: "Hybrid Reasoning",
      content: \`
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Claude 3.7 Sonnet</strong> is Anthropic's first hybrid reasoning foundation model, allowing developers to dynamically allocate test-time compute thinking tokens (from instant responses up to 64k tokens of deep chain-of-thought analysis).
          </p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Key Architectural Milestones</span>
          <div class="feature-box">
            <strong>Hybrid Thinking Budget</strong>
            <p>Users and API consumers can specify exact thinking limits per call, optimizing latency vs reasoning depth.</p>
          </div>
          <div class="feature-box">
            <strong>SWE-bench Verified Leader</strong>
            <p>Establishes new state-of-the-art across software engineering benchmarks, complex code refactoring, and multi-file code editing.</p>
          </div>
        </div>
      \`
    },
    "o3-mini": {
      title: "OpenAI o3-mini (High-Compute Reasoning)",
      date: "January 2025",
      status: "Frontier Reasoning",
      badge: "STEM & Code Leader",
      content: \`
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>o3-mini</strong> is OpenAI's cost-efficient, high-performance reasoning model designed for deep STEM, competitive programming, and structured tool calling with low latency and high reasoning effort settings.
          </p>
        </div>
      \`
    },
    "gemini-2-pro": {
      title: "Google Gemini 2.0 Pro",
      date: "February 2025",
      status: "Frontier Multimodal",
      badge: "Google Frontier",
      content: \`
        <div class="drawer-section">
          <span class="drawer-section-title">Model Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
            <strong>Gemini 2.0 Pro</strong> delivers Google's strongest performance for complex coding and multi-step reasoning, alongside the experimental Flash-Thinking extended chain-of-thought branch.
          </p>
        </div>
      \`
    }
  };

  function openInspector(id, fallbackData) {
    const data = PROJECT_DETAILS[id];
    if (data) {
      drawerTitle.textContent = data.title;
      drawerBody.innerHTML = data.content;
    } else if (fallbackData) {
      drawerTitle.textContent = fallbackData.title;
      drawerBody.innerHTML = \`
        <div class="drawer-section">
          <span class="drawer-section-title">Milestone Overview</span>
          <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">\${fallbackData.desc}</p>
        </div>
        <div class="drawer-section">
          <span class="drawer-section-title">Release Details</span>
          <div class="feature-box">
            <strong>Date: \${fallbackData.date}</strong>
            <p>\${fallbackData.category}</p>
          </div>
        </div>
      \`;
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
      const badgeEl = item.querySelector(".card-badge, .pin-badge");

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
`;

fs.writeFileSync("public/timeline.js", jsContent, "utf8");
console.log("Successfully generated public/timeline.js!");
