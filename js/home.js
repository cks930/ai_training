document.addEventListener("DOMContentLoaded", function () {
    const modeButton = document.getElementById("modeButton");
    
    // 1. 初始化：檢查 localStorage 裡的設定，預設為 dark[cite: 2]
    const currentTheme = localStorage.getItem("theme") || "dark";
    applyTheme(currentTheme);

    // 2. 點擊按鈕切換深淺色模式[cite: 2]
    if (modeButton) {
        modeButton.addEventListener("click", function () {
            const isDark = document.documentElement.classList.contains("dark");
            const newTheme = isDark ? "light" : "dark";
            
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    } else {
        console.warn("找不到 ID 為 modeButton 的切換按鈕");
    }

    // 套用主題的通用函式[cite: 2]
    function applyTheme(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    }
});