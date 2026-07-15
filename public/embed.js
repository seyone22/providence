(function () {
  function init() {
    // 1. Locate the container where the widget should reside
    const container = document.getElementById("providence-widget");
    if (!container) {
      // If the script runs before the DOM is ready, wait for it
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
      } else {
        console.error("Providence Widget Error: <div id=\"providence-widget\"></div> element not found on page.");
      }
      return;
    }

    // 2. Find the script tag itself to extract the dealer ID
    const scriptTag = document.currentScript || document.querySelector('script[src*="embed.js"]');
    let dealerId = "";
    if (scriptTag) {
      dealerId = scriptTag.getAttribute("data-dealer-id") || "";
    }

    if (!dealerId) {
      console.warn("Providence Widget Warning: data-dealer-id attribute not specified on script tag.");
    }

    // 3. Determine the base URL dynamically based on where the script is hosted
    let baseUrl = "https://providenceauto.com";
    if (scriptTag && scriptTag.src) {
      try {
        const urlObj = new URL(scriptTag.src);
        baseUrl = urlObj.origin;
      } catch (e) {
        // Fallback
      }
    }

    // 4. Create the iframe element
    const iframe = document.createElement("iframe");
    const embedUrl = `${baseUrl}/embed/request?ref=${encodeURIComponent(dealerId)}&dealerId=${encodeURIComponent(dealerId)}`;
    
    iframe.src = embedUrl;
    iframe.style.width = "100%";
    iframe.style.height = "750px";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.background = "transparent";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("title", "Providence Auto Sourcing Request Form");

    // 5. Append the iframe to the container
    container.innerHTML = ""; // Clear any placeholder content
    container.appendChild(iframe);

    // 6. Listen for resizing messages from the iframe to adjust height dynamically
    window.addEventListener("message", function (event) {
      if (event.origin !== baseUrl) return;
      if (event.data && event.data.type === "providence-resize" && event.data.height) {
        iframe.style.height = event.data.height + "px";
      }
    }, false);
  }

  // Execute initialization
  init();
})();
