
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. 日夜模式切換
    // =========================
    const modeButton = document.getElementById("modeButton");
    const modeIcon = document.getElementById("modeIcon");
    const modeText = document.getElementById("modeText");
    const html = document.documentElement;

    function applyTheme(theme) {
        const isDark = theme === "dark";

        html.setAttribute(
            "data-bs-theme",
            isDark ? "dark" : "light"
        );

        modeIcon.textContent = isDark ? "☀️" : "🌙";
        modeText.textContent = isDark ? "切換淺色" : "切換深色";
        modeButton.setAttribute("aria-pressed", String(isDark));
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem("theme", theme);
        } catch (error) {
            console.warn("無法儲存主題設定", error);
        }
    }

    applyTheme(html.getAttribute("data-bs-theme") || "light");

    modeButton.addEventListener("click", function () {
        const currentTheme = html.getAttribute("data-bs-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);
        saveTheme(newTheme);
    });

    // =========================
    // 2. 即時搜尋作品
    // =========================
    const searchInput = document.getElementById("searchInput");
    const projectList = document.querySelectorAll("#projectList li");
    const emptyMessage = document.getElementById("emptyMessage");

    searchInput.addEventListener("input", function () {
        const keyword = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        projectList.forEach(function (item) {
            const title = (item.dataset.title || "").toLowerCase();
            const filename = (item.dataset.filename || "").toLowerCase();

            const matched =
                title.includes(keyword) ||
                filename.includes(keyword);

            item.hidden = !matched;

            if (matched) {
                visibleCount++;
            }
        });

        emptyMessage.hidden = visibleCount > 0;
    });

    // =========================
    // 3. 跨分頁同步日夜模式
    // =========================
    window.addEventListener("storage", function (event) {
        if (event.key === "theme") {
            applyTheme(event.newValue || "light");
        }
    });

});
