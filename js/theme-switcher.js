document.addEventListener("DOMContentLoaded", () => {
  const modeButton = document.getElementById("modeButton");
  const modeIcon = document.getElementById("modeIcon");
  const htmlElement = document.documentElement;

  // 1. 初始化檢查儲存的模式
  const savedTheme = localStorage.getItem("theme") || "dark"; // 預設暗色
  htmlElement.setAttribute("data-bs-theme", savedTheme);
  updateIcon(savedTheme);

  // 2. 點擊按鈕切換
  if (modeButton) {
    modeButton.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-bs-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      htmlElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateIcon(newTheme);
    });
  }

  // 3. 更新按鈕圖示
  function updateIcon(theme) {
    if (!modeIcon) return;
    if (theme === "dark") {
      modeIcon.className = "bi bi-sun-fill text-warning";
    } else {
      modeIcon.className = "bi bi-moon-fill text-dark";
    }
  }
});