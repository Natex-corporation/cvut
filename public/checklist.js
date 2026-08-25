(() => {
  const storageKey = "cvut-crossroad:checklist:v1";
  const items = Array.from(document.querySelectorAll("[data-checklist-item]"));
  const completedCount = document.querySelector("#completed-count");
  const totalCount = document.querySelector("#total-count");
  const progressBar = document.querySelector("#checklist-progress-bar");
  const progressPercent = document.querySelector("#progress-percent");
  const progressMessage = document.querySelector("#progress-message");
  const resetButton = document.querySelector("#reset-checklist");
  const printButton = document.querySelector("#print-checklist");
  const storageNote = document.querySelector("#storage-note");
  let storageAvailable = true;

  if (items.length === 0) return;

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      storageAvailable = false;
      return new Set();
    }
  }

  function writeProgress(keys) {
    if (!storageAvailable) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(keys));
    } catch {
      storageAvailable = false;
      storageNote.textContent = "Progress cannot be saved in this browser. You can still use or print the checklist during this visit.";
      storageNote.classList.add("storage-warning");
    }
  }

  function messageFor(completed, total) {
    if (completed === 0) return "Begin with your CTU identity. Most other services depend on it.";
    if (completed < 3) return "Keep going with identity setup before moving into the study systems.";
    if (completed < 7) return "Your identity is taking shape. Next, make sure the study systems and university email work.";
    if (completed < 10) return "The study essentials are covered. Prepare the services you will use around campus.";
    if (completed < total) return "Nearly ready. Save a support route and choose one way to join the wider university community.";
    return "Essential setup complete. Keep checking official pages for live rules and deadlines.";
  }

  function updateProgress({ save = true } = {}) {
    const selected = items.filter((item) => item.checked);
    const selectedKeys = selected.map((item) => item.dataset.checklistItem);
    const completed = selected.length;
    const total = items.length;
    const percent = Math.round((completed / total) * 100);

    items.forEach((item) => {
      item.closest(".checklist-item")?.classList.toggle("is-complete", item.checked);
    });

    completedCount.textContent = String(completed);
    totalCount.textContent = String(total);
    progressBar.max = total;
    progressBar.value = completed;
    progressBar.textContent = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    progressMessage.textContent = messageFor(completed, total);
    resetButton.disabled = completed === 0;

    if (save) writeProgress(selectedKeys);
  }

  const savedProgress = readProgress();
  items.forEach((item) => {
    item.checked = savedProgress.has(item.dataset.checklistItem);
    item.addEventListener("change", () => updateProgress());
  });

  if (!storageAvailable) {
    storageNote.textContent = "Progress cannot be saved in this browser. You can still use or print the checklist during this visit.";
    storageNote.classList.add("storage-warning");
  }

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset all checklist progress saved on this device?")) return;
    items.forEach((item) => {
      item.checked = false;
    });
    updateProgress();
    document.querySelector("#progress-heading")?.focus({ preventScroll: true });
  });

  printButton.addEventListener("click", () => window.print());
  updateProgress({ save: false });
})();
