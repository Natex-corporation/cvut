(function () {
  "use strict";

  const filterButtons = document.querySelectorAll(".timeline-filter-btn");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const countAll = document.getElementById("count-all");
  const countProjects = document.getElementById("count-projects");
  const countAi = document.getElementById("count-ai");
  const countCompleted = document.getElementById("count-completed");

  if (!filterButtons.length || !timelineItems.length) return;

  function updateCounts() {
    let all = 0;
    let projects = 0;
    let ai = 0;
    let completed = 0;

    timelineItems.forEach((item) => {
      all++;
      if (item.classList.contains("is-project")) projects++;
      if (item.classList.contains("is-ai")) ai++;
      if (item.dataset.status === "completed") completed++;
    });

    if (countAll) countAll.textContent = all;
    if (countProjects) countProjects.textContent = projects;
    if (countAi) countAi.textContent = ai;
    if (countCompleted) countCompleted.textContent = completed;
  }

  function applyFilter(filter) {
    timelineItems.forEach((item) => {
      let match = false;
      if (filter === "all") {
        match = true;
      } else if (filter === "projects") {
        match = item.classList.contains("is-project");
      } else if (filter === "ai") {
        match = item.classList.contains("is-ai");
      } else if (filter === "completed") {
        match = item.dataset.status === "completed";
      }

      if (match) {
        item.classList.remove("is-hidden");
      } else {
        item.classList.add("is-hidden");
      }
    });

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      applyFilter(filter);
    });
  });

  updateCounts();
})();
