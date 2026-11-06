/* 全站唯一日夜模式控制器：預設深藍灰，與舊 portfolio-theme 設定相容 */
(function () {
  "use strict";
  const KEY = "theme";
  function read() {
    try { return localStorage.getItem(KEY) || localStorage.getItem("portfolio-theme") || "dark"; }
    catch (_) { return "dark"; }
  }
  function current() { return document.documentElement.getAttribute("data-bs-theme") === "light" ? "light" : "dark"; }
  function renderButtons() {
    const dark = current() === "dark";
    document.querySelectorAll("#modeButton, #theme-toggle, #themeBtn").forEach(button => {
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "目前深色模式，切換至淺色" : "目前淺色模式，切換至深色");
      button.title = dark ? "切換淺色模式" : "切換深色模式";
      if (button.id === "themeBtn") button.textContent = dark ? "☀️ 淺色模式" : "🌙 深色模式";
      if (button.id === "modeButton") {
        const icon = button.querySelector("#modeIcon");
        const label = button.querySelector("#modeText");
        if (icon) icon.textContent = dark ? "☀️" : "🌙";
        if (label) label.textContent = dark ? "切換淺色" : "切換深色";
      }
      if (button.id === "theme-toggle") {
        const icon = button.querySelector("i");
        if (icon) icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    });
  }
  function apply(theme, persist) {
    const value = theme === "light" ? "light" : "dark";
    const root = document.documentElement;
    root.dataset.theme = value;
    root.setAttribute("data-bs-theme", value);
    root.classList.toggle("dark", value === "dark");
    root.classList.toggle("dark-mode", value === "dark");
    if (persist) {
      try { localStorage.setItem(KEY, value); localStorage.setItem("portfolio-theme", value); } catch (_) {}
    }
    renderButtons();
  }
  window.PortfolioTheme = { apply, current, refresh: renderButtons };
  apply(read(), false);
  document.addEventListener("click", event => {
    const button = event.target.closest?.("#modeButton, #theme-toggle, #themeBtn");
    if (!button) return;
    event.preventDefault();
    apply(current() === "dark" ? "light" : "dark", true);
  });
  document.addEventListener("DOMContentLoaded", renderButtons);
  window.addEventListener("storage", event => {
    if (event.key === KEY || event.key === "portfolio-theme") apply(read(), false);
  });
  // navbar.html 透過 fetch 非同步插入，更新新按鈕的狀態
  document.addEventListener("portfolio:navbar-ready", renderButtons);
})();
