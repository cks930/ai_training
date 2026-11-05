
// =====================================================
// BIO.JS｜Kesin Chen 個人作品集
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // 01. 深淺色模式
  const themeButton = document.getElementById("theme-toggle");
  let currentTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  function applyTheme(theme) {
    currentTheme = theme;
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-bs-theme", theme);

    if (themeButton) {
      const icon = themeButton.querySelector("i");

      if (icon) {
        icon.className = isDark
          ? "fa-solid fa-sun"
          : "fa-solid fa-moon";
      }

      const label = isDark ? "切換淺色模式" : "切換深色模式";

      themeButton.title = label;
      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("aria-pressed", String(!isDark));
    }
  }

  applyTheme(currentTheme);

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      try {
        localStorage.setItem("theme", nextTheme);
      } catch (error) {
        // 儲存空間不可用時仍可切換
      }

      applyTheme(nextTheme);
    });
  }

  // 02. WOW.js 進場動畫
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion && typeof WOW !== "undefined") {
    new WOW({
      boxClass: "wow",
      animateClass: "animate__animated",
      offset: 70,
      mobile: true,
      live: true
    }).init();
  } else {
    document.querySelectorAll(".wow").forEach(function (item) {
      item.style.visibility = "visible";
      item.classList.remove("wow");
    });
  }

  // 03. 經歷圖片卡片切換
  const thumbCards = document.querySelectorAll(".thumb-card");

  function activateCard(selectedCard) {
    thumbCards.forEach(function (card) {
      const active = card === selectedCard;

      card.classList.toggle("active", active);
      card.setAttribute("aria-pressed", String(active));
    });
  }

  thumbCards.forEach(function (card, index) {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-pressed", String(index === 0));

    card.addEventListener("click", function () {
      activateCard(card);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateCard(card);
      }
    });
  });

  // 04. 數字動畫
  const counters = document.querySelectorAll(".counter-num");

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const decimals = Number(counter.dataset.decimals || 0);

    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      counter.textContent = target.toFixed(decimals);
      return;
    }

    const duration = 1600;
    let startTime = null;

    function update(time) {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      counter.textContent = value.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toFixed(decimals);
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const counter = entry.target;

          if (counter.dataset.started !== "true") {
            counter.dataset.started = "true";
            animateCounter(counter);
          }

          currentObserver.unobserve(counter);
        });
      },
      {
        threshold: 0.35
      }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  // 05. 作品集即時搜尋
  const searchInput = document.getElementById("project-search");
  const projectItems = document.querySelectorAll(".project-item");
  const noProject = document.getElementById("no-project");

  function filterProjects() {
    if (!searchInput) return;

    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projectItems.forEach(function (item) {
      const name = (item.dataset.project || "").toLowerCase();
      const content = item.textContent.toLowerCase();

      const matched =
        name.includes(keyword) ||
        content.includes(keyword);

      item.classList.toggle("is-hidden", !matched);

      if (matched) {
        visibleCount++;
      }
    });

    if (noProject) {
      noProject.classList.toggle("d-none", visibleCount > 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  // 06. 平滑捲動
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.getElementById(targetId.slice(1));

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // 07. 圖片載入錯誤處理
  document.querySelectorAll("img").forEach(function (image) {
    function handleError() {
      image.classList.add("image-error");

      if (!image.alt) {
        image.alt = "圖片暫時無法顯示";
      }
    }

    image.addEventListener("error", handleError);

    if (image.complete && image.naturalWidth === 0) {
      handleError();
    }
  });

  // 08. 初始化完成
  console.log("Bio 頁面初始化完成");

});
