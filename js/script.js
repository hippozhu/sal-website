document.querySelector(".icon-menu")?.addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

(function initPhotowall() {
  const root = document.querySelector("[data-photowall]");
  if (!root) return;

  const viewport = root.querySelector("[data-photowall-viewport]");
  const prevBtn = root.querySelector("[data-photowall-prev]");
  const nextBtn = root.querySelector("[data-photowall-next]");
  const dotsWrap = root.querySelector("[data-photowall-dots]");
  if (!viewport || !prevBtn || !nextBtn || !dotsWrap) return;

  let dotButtons = [];
  let syncScheduled = false;

  function pageStep() {
    return Math.max(1, viewport.clientWidth);
  }

  function pageTotal() {
    const step = pageStep();
    return Math.max(1, Math.ceil(viewport.scrollWidth / step - 0.001));
  }

  function activePageIndex() {
    const step = pageStep();
    const maxIdx = pageTotal() - 1;
    return Math.min(maxIdx, Math.max(0, Math.round(viewport.scrollLeft / step)));
  }

  function rebuildDots() {
    dotsWrap.innerHTML = "";
    const n = pageTotal();
    const step = pageStep();
    for (let i = 0; i < n; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "photowall__dot";
      b.setAttribute("aria-label", "Gallery page " + (i + 1));
      (function (pageIdx) {
        b.addEventListener("click", function () {
          viewport.scrollTo({ left: pageIdx * step, behavior: "smooth" });
        });
      })(i);
      dotsWrap.appendChild(b);
    }
    dotButtons = Array.from(dotsWrap.querySelectorAll(".photowall__dot"));
  }

  function syncDotsAndArrows() {
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const idx = activePageIndex();
    dotButtons.forEach(function (d, i) {
      d.setAttribute("aria-current", i === idx ? "true" : "false");
    });
    prevBtn.disabled = viewport.scrollLeft <= 2;
    nextBtn.disabled = viewport.scrollLeft >= maxScroll - 2;
  }

  function onScroll() {
    if (syncScheduled) return;
    syncScheduled = true;
    requestAnimationFrame(function () {
      syncScheduled = false;
      syncDotsAndArrows();
    });
  }

  prevBtn.addEventListener("click", function () {
    viewport.scrollBy({ left: -pageStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", function () {
    viewport.scrollBy({ left: pageStep(), behavior: "smooth" });
  });

  viewport.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener(
    "resize",
    function () {
      rebuildDots();
      syncDotsAndArrows();
    },
    { passive: true }
  );

  rebuildDots();
  syncDotsAndArrows();
})();
