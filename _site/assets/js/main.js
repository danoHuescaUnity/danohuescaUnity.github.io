document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  const templateEl = document.getElementById("modal-template");

  if (!modal || !modalContent || !templateEl) return;

  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

 const closeModal = () => {
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

    // initial state
    const active = document.querySelector(".filter-btn.filter-btn--active");
    applyFilter(active?.getAttribute("data-filter") || "all");
  }

  
});