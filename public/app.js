(function () {
  "use strict";

  const config = window.SCHOOL_CONFIG || {};
  const adConfig = window.AD_CONFIG || {};
  const links = Array.isArray(window.SCHOOL_LINKS) ? window.SCHOOL_LINKS : [];
  const storageKeys = {
    favorites: "cvut-crossroad:favorites:v1",
    recent: "cvut-crossroad:recent:v1"
  };

  const preferredCategoryOrder = [
    "All",
    "Study",
    "First Year",
    "Account & IT",
    "Campus",
    "Dorms",
    "Meals",
    "Library",
    "Support",
    "International",
    "Career",
    "Community",
    "Printing",
    "Faculty",
    "Niche"
  ];
  const availableCategories = [...new Set(links.map((link) => link.category))];
  const categoryOrder = preferredCategoryOrder.filter(
    (category) => category === "All" || availableCategories.includes(category)
  );

  const state = {
    category: "All",
    query: "",
    savedOnly: false,
    sort: "recommended",
    favorites: new Set(readStoredArray(storageKeys.favorites)),
    recent: readStoredArray(storageKeys.recent)
  };

  const iconPaths = {
    badge:
      '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8"></path><path d="M9 13h6"></path>',
    book:
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>',
    bookOpen:
      '<path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"></path><path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8z"></path>',
    building:
      '<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M9 21v-4h6v4"></path><path d="M8 7h.01"></path><path d="M12 7h.01"></path><path d="M16 7h.01"></path><path d="M8 11h.01"></path><path d="M12 11h.01"></path><path d="M16 11h.01"></path>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
    clock:
      '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    home:
      '<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
    key:
      '<circle cx="8" cy="15" r="4"></circle><path d="m10.8 12.2 8-8"></path><path d="m15 6 3 3"></path><path d="m17 4 3 3"></path>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5z"></path><path d="m3 12 9 5 9-5"></path><path d="m3 17 9 5 9-5"></path>',
    library:
      '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-1.5z"></path><path d="M8 7h7"></path><path d="M8 11h7"></path>',
    lifeBuoy:
      '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><path d="m4.9 4.9 4.3 4.3"></path><path d="m14.8 14.8 4.3 4.3"></path><path d="m19.1 4.9-4.3 4.3"></path><path d="m9.2 14.8-4.3 4.3"></path>',
    mail:
      '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>',
    map:
      '<path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z"></path><path d="M9 3v15"></path><path d="M15 6v15"></path>',
    phone:
      '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z"></path>',
    printer:
      '<path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path><path d="M18 12h.01"></path>',
    route:
      '<circle cx="6" cy="19" r="3"></circle><circle cx="18" cy="5" r="3"></circle><path d="M9 19h3a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6"></path>',
    utensils:
      '<path d="M4 3v8"></path><path d="M8 3v8"></path><path d="M4 7h4"></path><path d="M6 11v10"></path><path d="M16 3a4 4 0 0 0-4 4v5h5v9"></path>',
    user:
      '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
    wifi:
      '<path d="M5 13a10 10 0 0 1 14 0"></path><path d="M8.5 16.5a5 5 0 0 1 7 0"></path><path d="M2 9a15 15 0 0 1 20 0"></path><path d="M12 20h.01"></path>'
  };

  const elements = {
    title: document.querySelector("#site-title"),
    label: document.querySelector("#site-label"),
    subtitle: document.querySelector("#site-subtitle"),
    catalogCount: document.querySelector("#catalog-count"),
    search: document.querySelector("#search"),
    clearSearch: document.querySelector("#clear-search"),
    filters: document.querySelector("#filters"),
    resetFilters: document.querySelector("#reset-filters"),
    savedFilter: document.querySelector("#saved-filter"),
    savedCount: document.querySelector("#saved-count"),
    sort: document.querySelector("#sort-links"),
    heading: document.querySelector("#active-heading"),
    summary: document.querySelector("#active-summary"),
    count: document.querySelector("#result-count"),
    grid: document.querySelector("#links-grid"),
    empty: document.querySelector("#empty-state"),
    emptyReset: document.querySelector("#empty-reset"),
    quickAccess: document.querySelector("#quick-access"),
    quickGrid: document.querySelector("#quick-grid"),
    clearRecent: document.querySelector("#clear-recent"),
    adPanel: document.querySelector("#ad-panel"),
    adSlot: document.querySelector("#ad-slot"),
    taskButtons: document.querySelectorAll("[data-category-filter]")
  };

  function init() {
    setText(elements.title, config.title || "CVUT Crossroad");
    setText(elements.label, config.label || "Unofficial CVUT Links");
    setText(
      elements.subtitle,
      config.subtitle || "The right CVUT service for the task in front of you."
    );
    setText(elements.catalogCount, String(links.length));

    if (!elements.search || !elements.filters || !elements.grid) {
      return;
    }

    loadStateFromUrl();
    elements.search.value = state.query;
    elements.sort.value = state.sort;
    bindEvents();
    renderAll();
  }

  function bindEvents() {
    elements.search.addEventListener("input", (event) => {
      state.query = event.target.value.trim();
      renderResults();
      syncControls();
      syncUrl();
    });

    elements.search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        clearSearch();
      }
    });

    elements.clearSearch.addEventListener("click", clearSearch);
    elements.resetFilters.addEventListener("click", resetAllFilters);
    elements.emptyReset.addEventListener("click", resetAllFilters);
    elements.savedFilter.addEventListener("click", () => {
      state.savedOnly = !state.savedOnly;
      renderAll();
      syncUrl();
    });
    elements.sort.addEventListener("change", (event) => {
      state.sort = event.target.value === "az" ? "az" : "recommended";
      renderResults();
      syncUrl();
    });
    elements.clearRecent.addEventListener("click", () => {
      state.recent = [];
      writeStoredArray(storageKeys.recent, state.recent);
      renderQuickAccess();
    });

    elements.taskButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectCategory(button.dataset.categoryFilter || "All");
        elements.grid.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      });
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        elements.search.focus();
      }
    });

    window.addEventListener("popstate", () => {
      loadStateFromUrl();
      elements.search.value = state.query;
      elements.sort.value = state.sort;
      renderAll();
    });
  }

  function renderAll() {
    renderFilters();
    renderResults();
    renderQuickAccess();
    syncControls();
  }

  function renderFilters() {
    const fragment = document.createDocumentFragment();

    categoryOrder.forEach((category) => {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.type = "button";
      button.setAttribute("aria-pressed", String(category === state.category));

      const label = document.createElement("span");
      label.textContent = category;
      const count = document.createElement("span");
      count.className = "filter-count";
      count.textContent = String(
        category === "All"
          ? links.length
          : links.filter((link) => link.category === category).length
      );

      button.append(label, count);
      button.addEventListener("click", () => selectCategory(category));
      fragment.appendChild(button);
    });

    elements.filters.replaceChildren(fragment);
  }

  function selectCategory(category) {
    state.category = categoryOrder.includes(category) ? category : "All";
    state.savedOnly = false;
    renderAll();
    syncUrl();
  }

  function renderResults() {
    const filtered = getFilteredLinks();
    const fragment = document.createDocumentFragment();

    filtered.forEach((link) => fragment.appendChild(createLinkCard(link)));
    elements.grid.replaceChildren(fragment);
    elements.grid.hidden = filtered.length === 0;
    elements.empty.hidden = filtered.length > 0;
    setText(elements.heading, getHeading());
    setText(elements.summary, getSummary());
    setText(elements.count, `${filtered.length} ${filtered.length === 1 ? "link" : "links"}`);
    syncAdVisibility(filtered.length > 0);
  }

  function getFilteredLinks() {
    const queryTokens = normalize(state.query).split(/\s+/).filter(Boolean);

    return links
      .filter((link) => {
        const categoryMatches =
          state.category === "All" || link.category === state.category;
        const savedMatches = !state.savedOnly || state.favorites.has(link.url);
        const searchable = searchableText(link);
        const queryMatches = queryTokens.every((token) => searchable.includes(token));
        return categoryMatches && savedMatches && queryMatches;
      })
      .sort((first, second) => {
        if (state.sort === "recommended" && first.featured !== second.featured) {
          return first.featured ? -1 : 1;
        }
        return first.title.localeCompare(second.title, "en", { sensitivity: "base" });
      });
  }

  function searchableText(link) {
    return normalize(
      [
        link.title,
        link.description,
        link.category,
        link.school,
        getHost(link.url),
        ...(Array.isArray(link.tags) ? link.tags : [])
      ].join(" ")
    );
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function createLinkCard(link) {
    const card = document.createElement("article");
    card.className = "link-card";
    card.dataset.accent = link.accent || "blue";

    const favorite = document.createElement("button");
    const isFavorite = state.favorites.has(link.url);
    favorite.className = "favorite-button";
    favorite.type = "button";
    favorite.textContent = isFavorite ? "★" : "☆";
    favorite.title = isFavorite ? "Remove from saved links" : "Save this link";
    favorite.setAttribute("aria-label", `${isFavorite ? "Remove" : "Save"} ${link.title}`);
    favorite.setAttribute("aria-pressed", String(isFavorite));
    favorite.addEventListener("click", () => toggleFavorite(link.url));

    const anchor = document.createElement("a");
    anchor.className = "card-link";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", `${link.title}: ${link.description}`);
    anchor.addEventListener("click", () => rememberRecent(link.url));

    const top = document.createElement("div");
    top.className = "card-top";

    const icon = document.createElement("span");
    icon.className = "card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = svg(link.icon);

    const pills = document.createElement("div");
    pills.className = "card-pills";
    const category = document.createElement("span");
    category.className = "category-pill";
    category.textContent = link.category || "Link";
    pills.appendChild(category);
    if (link.featured) {
      const recommended = document.createElement("span");
      recommended.className = "recommended-pill";
      recommended.textContent = "Popular";
      pills.appendChild(recommended);
    }
    top.append(icon, pills);

    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3");
    title.textContent = link.title;
    const description = document.createElement("p");
    description.textContent = link.description;
    body.append(title, description);

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const host = document.createElement("span");
    host.className = "host-name";
    host.textContent = getHost(link.url);
    const arrow = document.createElement("span");
    arrow.className = "arrow-icon";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    footer.append(host, arrow);

    anchor.append(top, body, footer);
    card.append(favorite, anchor);
    return card;
  }

  function toggleFavorite(url) {
    if (state.favorites.has(url)) {
      state.favorites.delete(url);
    } else {
      state.favorites.add(url);
    }
    writeStoredArray(storageKeys.favorites, [...state.favorites]);
    renderResults();
    renderQuickAccess();
    syncControls();
  }

  function rememberRecent(url) {
    state.recent = [url, ...state.recent.filter((item) => item !== url)].slice(0, 8);
    writeStoredArray(storageKeys.recent, state.recent);
    renderQuickAccess();
  }

  function renderQuickAccess() {
    if (!elements.quickAccess || !elements.quickGrid) {
      return;
    }

    const favorites = links.filter((link) => state.favorites.has(link.url));
    const recentLinks = state.recent
      .map((url) => links.find((link) => link.url === url))
      .filter(Boolean);
    const combined = [
      ...favorites.map((link) => ({ link, type: "Saved" })),
      ...recentLinks
        .filter((link) => !state.favorites.has(link.url))
        .map((link) => ({ link, type: "Recent" }))
    ].slice(0, 8);

    elements.quickAccess.hidden = combined.length === 0;
    elements.clearRecent.hidden = recentLinks.length === 0;
    if (combined.length === 0) {
      elements.quickGrid.replaceChildren();
      return;
    }

    const fragment = document.createDocumentFragment();
    combined.forEach(({ link, type }) => {
      const anchor = document.createElement("a");
      anchor.className = "quick-link";
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.addEventListener("click", () => rememberRecent(link.url));

      const marker = document.createElement("span");
      marker.className = "quick-marker";
      marker.textContent = type === "Saved" ? "★" : "↺";
      marker.setAttribute("aria-hidden", "true");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = link.title;
      const meta = document.createElement("small");
      meta.textContent = `${type} · ${link.category}`;
      copy.append(title, meta);
      anchor.append(marker, copy);
      fragment.appendChild(anchor);
    });
    elements.quickGrid.replaceChildren(fragment);
  }

  function syncControls() {
    const hasFilters = Boolean(state.query) || state.category !== "All" || state.savedOnly;
    elements.clearSearch.hidden = !state.query;
    elements.resetFilters.hidden = !hasFilters;
    elements.savedFilter.setAttribute("aria-pressed", String(state.savedOnly));
    setText(elements.savedCount, String(state.favorites.size));
  }

  function clearSearch() {
    state.query = "";
    elements.search.value = "";
    renderResults();
    syncControls();
    syncUrl();
    elements.search.focus();
  }

  function resetAllFilters() {
    state.query = "";
    state.category = "All";
    state.savedOnly = false;
    state.sort = "recommended";
    elements.search.value = "";
    elements.sort.value = state.sort;
    renderAll();
    syncUrl();
  }

  function getHeading() {
    if (state.savedOnly) {
      return "Saved links";
    }
    if (state.category !== "All") {
      return state.category;
    }
    if (state.query) {
      return "Search results";
    }
    return "All links";
  }

  function getSummary() {
    const details = [];
    if (state.query) {
      details.push(`matching “${state.query}”`);
    }
    if (state.category !== "All") {
      details.push(`in ${state.category}`);
    }
    if (state.savedOnly) {
      details.push("saved on this device");
    }
    if (details.length > 0) {
      return `Showing links ${details.join(" ")}.`;
    }
    return state.sort === "az"
      ? "Every destination sorted alphabetically."
      : "Popular student services appear first.";
  }

  function loadStateFromUrl() {
    const params = new URL(window.location.href).searchParams;
    const requestedCategory = params.get("category") || "All";
    state.category = categoryOrder.includes(requestedCategory) ? requestedCategory : "All";
    state.query = (params.get("q") || "").trim();
    state.savedOnly = params.get("saved") === "1";
    state.sort = params.get("sort") === "az" ? "az" : "recommended";
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    setUrlParam(url, "q", state.query);
    setUrlParam(url, "category", state.category === "All" ? "" : state.category);
    setUrlParam(url, "saved", state.savedOnly ? "1" : "");
    setUrlParam(url, "sort", state.sort === "az" ? "az" : "");
    window.history.replaceState({}, "", url);
  }

  function setUrlParam(url, key, value) {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }

  function syncAdVisibility(hasResults) {
    if (!elements.adPanel || !elements.adSlot) {
      return;
    }
    if (
      !hasResults ||
      !adConfig.enabled ||
      adConfig.provider !== "adsense" ||
      !/^ca-pub-\d{16}$/.test(String(adConfig.adsenseClient || "")) ||
      !/^\d+$/.test(String(adConfig.adsenseSlot || ""))
    ) {
      elements.adPanel.hidden = true;
      return;
    }

    if (elements.adSlot.childElementCount === 0) {
      const unit = document.createElement("ins");
      unit.className = "adsbygoogle";
      unit.style.display = "block";
      unit.dataset.adClient = adConfig.adsenseClient;
      unit.dataset.adSlot = adConfig.adsenseSlot;
      unit.dataset.adFormat = adConfig.adsenseFormat || "auto";
      unit.dataset.fullWidthResponsive = String(adConfig.fullWidthResponsive !== false);
      elements.adSlot.appendChild(unit);
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
    elements.adPanel.hidden = false;
  }

  function svg(name) {
    return `<svg viewBox="0 0 24 24" focusable="false">${
      iconPaths[name] || iconPaths.route
    }</svg>`;
  }

  function getHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  function readStoredArray(key) {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  }

  function writeStoredArray(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The directory still works if storage is disabled by the browser.
    }
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }

  init();
})();
