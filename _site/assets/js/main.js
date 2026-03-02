document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Mobile navbar toggle
  // -----------------------------
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = navMenu.classList.contains("open");
      if (isOpen) closeMenu();
      else {
        navMenu.classList.add("open");
        navToggle.classList.add("active");
        navToggle.setAttribute("aria-expanded", "true");
      }
    };

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking a nav link (mobile)
    navMenu.addEventListener("click", (e) => {
      const link = e.target.closest(".navbar__link");
      if (!link) return;
      closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close if resized to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // -----------------------------
  // Modal (guarded, no early return)
  // -----------------------------
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  const templateEl = document.getElementById("modal-template");

  if (modal && modalContent && templateEl) {
    const openModal = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      // Stop/reset videos so they can play again next time
      modalContent.querySelectorAll("video").forEach((v) => {
        try {
          v.pause();
          v.currentTime = 0;

          const s = v.querySelector("source");
          if (s) s.src = "";

          v.load();
        } catch (_) {}
      });

      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      modalContent.innerHTML = "";
      document.body.style.overflow = "";
    };

    const fill = (tpl, p) => {
      const platforms = (p.platforms || [])
        .map((x) => `<span class="tag tag--platform">${x}</span>`)
        .join("");
      const tech = (p.tech || [])
        .map((x) => `<span class="tag tag--tech">${x}</span>`)
        .join("");
      const responsibilities = (p.responsibilities || [])
        .map((x) => `<li>${x}</li>`)
        .join("");
      const challenges = (p.challenges || [])
        .map((x) => `<li>${x}</li>`)
        .join("");

      return tpl
        .replaceAll("{title}", p.title || "")
        .replaceAll("{company}", p.company || "")
        .replaceAll("{role}", p.role || "")
        .replaceAll("{video}", p.video || "")
        .replaceAll("{thumb}", p.thumb || "")
        .replaceAll("{full_desc}", p.full_desc || "")
        .replaceAll("{platforms}", platforms)
        .replaceAll("{tech}", tech)
        .replaceAll("{responsibilities}", responsibilities)
        .replaceAll("{challenges}", challenges);
    };

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-modal]");
      if (!btn) return;

      const id = btn.getAttribute("data-modal");
      const p = (window.projectsData || []).find((x) => x.id === id);
      if (!p) return;

      modalContent.innerHTML = fill(templateEl.innerHTML, p);

      // Force video src + load (avoids stuck/black states)
      const v = modalContent.querySelector("video.modal__video");
      const srcEl = v?.querySelector("source");
      if (v && srcEl) {
        srcEl.src = p.video || "";
        v.load();
      }

      openModal();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-modal]")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  // -----------------------------
  // Projects filter (ALL/MOBILE/VR)
  // -----------------------------
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  if (filterButtons.length && projectCards.length) {
    const setActiveFilterBtn = (btn) => {
      filterButtons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
    };

    const applyFilter = (filter) => {
      const f = (filter || "all").toLowerCase();
      projectCards.forEach((card) => {
        const cat = (card.getAttribute("data-category") || "").toLowerCase();
        const show = f === "all" || cat === f;
        card.classList.toggle("hidden", !show);
      });
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.getAttribute("data-filter") || "all";
        setActiveFilterBtn(btn);
        applyFilter(f);
      });
    });

    const active = document.querySelector(".filter-btn.filter-btn--active");
    applyFilter(active?.getAttribute("data-filter") || "all");
  }

  // -----------------------------
  // "View Projects" hero CTA (smooth scroll)
  // -----------------------------
  const viewProjectsBtn = document.querySelector('[data-testid="view-projects-btn"]');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener("click", () => {
      document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // -----------------------------
  // Navbar scroll spy (stable + contact fix + hero clears)
  // -----------------------------
  const navLinks = Array.from(document.querySelectorAll(".navbar__link[data-section]"));

  const getSectionIdFromLink = (a) => {
    const ds = a.getAttribute("data-section");
    if (ds) return ds.replace("#", "").trim();
    const href = a.getAttribute("href") || "";
    return href.startsWith("#") ? href.slice(1) : "";
  };

  const sectionIds = navLinks.map(getSectionIdFromLink).filter(Boolean);
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.remove("active"));
    const link = navLinks.find((a) => getSectionIdFromLink(a) === id);
    if (link) link.classList.add("active");
  };

  const clearActive = () => {
    navLinks.forEach((a) => a.classList.remove("active"));
  };

  const navHeight = () => {
    const css = getComputedStyle(document.documentElement).getPropertyValue("--nav-height");
    const n = parseInt(css, 10);
    return Number.isFinite(n) ? n : 70;
  };

  const updateActiveOnScroll = () => {
    if (!sections.length) return;

    const marker = window.scrollY + navHeight() + window.innerHeight * 0.25; // 25% from top

    // Hero -> clear all highlights
    const firstTop = sections[0].offsetTop;
    if (marker < firstTop) {
      clearActive();
      return;
    }

    // Near bottom -> force Contact
    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    if (nearBottom) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    let current = sections[0].id;
    for (const s of sections) {
      if (s.offsetTop <= marker) current = s.id;
      else break;
    }

    setActive(current);
  };

  if (sections.length) {
    window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
    window.addEventListener("resize", updateActiveOnScroll);
    updateActiveOnScroll(); // initial
  }
});