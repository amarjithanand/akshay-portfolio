
/* Akshay Anand — academic portfolio interactions.
   Add verified profile URLs below when available.
   Empty values are intentionally hidden. */

(function () {
  "use strict";

  const profileLinks = {
    email: "mailto:akshayanand049@gmail.com",
    linkedin: "https://www.linkedin.com/in/akshay-anand-667776239",
    github: "",        // Add verified GitHub profile URL.
    googleScholar: "", // Add public Google Scholar profile URL.
    orcid: ""          // Add ORCID profile URL.
  };

  const profileLabels = [
    ["linkedin", "LinkedIn"],
    ["googleScholar", "Google Scholar"],
    ["orcid", "ORCID"],
    ["github", "GitHub"]
  ];

  /* Create a profile link safely */
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

  /* Render available profile links */
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

  /* Mobile and desktop navigation */
  function setupNavigation() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");

    if (!toggle || !nav) return;

    const mobileQuery = window.matchMedia("(max-width: 900px)");

    function setMenuOpen(open) {
      // Never keep the mobile menu open on desktop.
      if (!mobileQuery.matches) {
        open = false;
      }

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );

      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);

      // Keep hidden mobile menu links out of keyboard navigation.
      if (mobileQuery.matches) {
        nav.setAttribute("aria-hidden", String(!open));

        nav.querySelectorAll("a").forEach((link) => {
          if (open) {
            link.removeAttribute("tabindex");
          } else {
            link.setAttribute("tabindex", "-1");
          }
        });
      } else {
        nav.removeAttribute("aria-hidden");

        nav.querySelectorAll("a").forEach((link) => {
          link.removeAttribute("tabindex");
        });
      }
    }

    // Initialize the menu in the correct state.
    setMenuOpen(false);

    // Open or close using the menu button.
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    // Close after selecting a navigation link.
    nav.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    // Close when clicking outside the navigation and menu button.
    document.addEventListener("click", (event) => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    // Escape closes the menu and returns focus to the button.
    document.addEventListener("keydown", (event) => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape" && isOpen) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    // Reset menu state when moving between mobile and desktop layouts.
    function handleViewportChange() {
      setMenuOpen(false);
    }

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else {
      // Compatibility with older browsers.
      mobileQuery.addListener(handleViewportChange);
    }

    // Highlight the navigation link for the visible section.
    const navLinks = Array.from(
      nav.querySelectorAll('a[href^="#"]')
    );

    const sections = navLinks
      .map((anchor) => {
        const target = anchor.getAttribute("href");

        if (!target || target === "#") return null;

        try {
          return document.querySelector(target);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((anchor) => {
              const isCurrent =
                anchor.getAttribute("href") ===
                "#" + entry.target.id;

              if (isCurrent) {
                anchor.setAttribute("aria-current", "location");
              } else {
                anchor.removeAttribute("aria-current");
              }
            });
          });
        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }

  /* Accessible research disclosures */
  function setupAccessibleDetails() {
    document
      .querySelectorAll("details.research-details summary")
      .forEach((summary) => {
        summary.setAttribute(
          "aria-label",
          summary.textContent.trim()
        );
      });
  }

  /* CV link handling */
  function setupCVLinks() {
    const cvPath = "assets/akshay_anand_cv.pdf";

    document
      .querySelectorAll('a[href="' + cvPath + '"]')
      .forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
          // Prevent navigation only when explicitly marked unavailable.
          if (anchor.dataset.cvReady === "false") {
            event.preventDefault();
          }
        });
      });
  }

  /* Initialize portfolio interactions */
  function init() {
    renderProfileLinks();
    setupNavigation();
    setupAccessibleDetails();
    setupCVLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
