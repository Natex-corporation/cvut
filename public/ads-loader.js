(function () {
  "use strict";

  const config = window.AD_CONFIG || {};

  if (!isEligiblePage() || !isValidClient(config.adsenseClient)) {
    return;
  }

  if (
    document.querySelector("script[data-cvut-adsense]") ||
    document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
  ) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.cvutAdsense = "true";
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
    encodeURIComponent(config.adsenseClient);
  document.head.appendChild(script);

  function isEligiblePage() {
    if (!config.enabled || config.provider !== "adsense") {
      return false;
    }

    const eligiblePaths = Array.isArray(config.eligiblePaths)
      ? config.eligiblePaths
      : ["/"];
    const currentPath = normalizePath(window.location.pathname || "/");
    return eligiblePaths.some((path) => normalizePath(path) === currentPath);
  }

  function normalizePath(path) {
    const normalized = String(path || "/").replace(/\/+$/, "");
    return normalized || "/";
  }

  function isValidClient(clientId) {
    return /^ca-pub-\d{16}$/.test(String(clientId || ""));
  }
})();
