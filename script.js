/* Akshay Anand — academic portfolio interactions.
   Add verified profile URLs below when available. Empty values are intentionally hidden. */
(function () {
  "use strict";

  const profileLinks = {
    email: "mailto:akshayanand049@gmail.com",
    linkedin: "https://www.linkedin.com/in/akshay-anand-667776239",
    github: "",        // Add Akshay's verified GitHub profile URL.
    googleScholar: "", // Add the public Google Scholar profile URL.
    orcid: ""          // Add the ORCID profile URL.
  };

  const profileLabels = [
    ["linkedin", "LinkedIn"],
    ["googleScholar", "Google Scholar"],
    ["orcid", "ORCID"],
    ["github", "GitHub"]
  ];

  function makeLink(href, label) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = label;

    if (/^https?:\/\//i.test(href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  function renderProfileLinks() {
    const heroList = document.getElementById("heroProfileLinks");
    const contactList = document.getElementById("contactProfileLinks");

    profileLabels.forEach(([key, label]) => {
      const href = profileLinks[key];
      if (!href) return;

      if (heroList) {
        const item = document.createElement("li");
        item.appendChild(makeLink(href, label));
        heroList.appendChild(item);
      }

      if (contactList) {
        const item = document.createElement("li");
        item.appendChild(makeLink(href, label));
        contactList.appendChild(item);
      }
    });
  }

  function setupNavigation() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;

    function setMenuOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", () => {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 901px)").matches) {
        setMenuOpen(false);
      }
    });

    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = navLinks
      .map((anchor) => document.querySelector(anchor.getAttribute("href")))
      .filter(Boolean);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((anchor) => {
            const isCurrent = anchor.getAttribute("href") === "#" + entry.target.id;
            if (isCurrent) {
              anchor.setAttribute("aria-current", "location");
            } else {
              anchor.removeAttribute("aria-current");
            }
          });
        });
      }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      });

      sections.forEach((section) => observer.observe(section));
    }
  }

  function setupAccessibleDetails() {
    // Native <details>/<summary> elements provide keyboard-accessible research disclosures.
    // No custom interaction is needed; this hook ensures summaries remain discoverable.
    document.querySelectorAll("details.research-details summary").forEach((summary) => {
      summary.setAttribute("aria-label", summary.textContent.trim());
    });
  }

  function setupCVLinks() {
    const cvPath = "assets/akshay_anand_cv.pdf";
    document.querySelectorAll('a[href="' + cvPath + '"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        // Avoid navigating to a missing asset if the PDF has not been added to the project.
        // The deployment must include this file at the path above.
        if (anchor.dataset.cvReady === "false") {
          event.preventDefault();
        }
      });
    });
  }

  renderProfileLinks();
  setupNavigation();
  setupAccessibleDetails();
  setupCVLinks();
})();
