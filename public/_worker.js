export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const isLocalPreview =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]";

    if (url.hostname === "www.cvut-crossroad.com") {
      url.hostname = "cvut-crossroad.com";
      return Response.redirect(url.toString(), 301);
    }

    if (url.protocol === "http:" && !isLocalPreview) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    const cleanPaths = {
      "/index.html": "/",
      "/guide.html": "/guide",
      "/checklist.html": "/checklist",
      "/roadmap.html": "/roadmap",
      "/about.html": "/about",
      "/sources.html": "/sources",
      "/privacy.html": "/privacy",
      "/contact.html": "/contact"
    };

    if (cleanPaths[url.pathname]) {
      url.pathname = cleanPaths[url.pathname];
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  }
};
