
// =====================================================
// theme-fix.js
// 全站深淺色模式同步
// =====================================================

(function () {
    "use strict";

    const STORAGE_KEY = "theme";

    // 01. 讀取目前主題
    function getTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "light"
                ? "light"
                : "dark";
        } catch (error) {
            return document.documentElement.classList.contains("dark")
                ? "dark"
                : "light";
        }
    }

    // 02. 套用主題
    function applyTheme(theme) {
        const isDark = theme === "dark";
        const root = document.documentElement;

        root.classList.toggle("dark", isDark);
        root.classList.toggle("dark-mode", isDark);

        root.setAttribute(
            "data-bs-theme",
            isDark ? "dark" : "light"
        );

        document.querySelectorAll(
            "#modeButton, #theme-toggle"
        ).forEach(function (button) {
            const label = isDark
                ? "切換淺色模式"
                : "切換深色模式";

            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);
            button.setAttribute(
                "aria-pressed",
                String(!isDark)
            );

            if (button.id === "theme-toggle") {
                const icon = button.querySelector("i");

                if (icon) {
                    icon.className = isDark
                        ? "fa-solid fa-sun"
                        : "fa-solid fa-moon";
                }
            }
        });
    }

    // 03. 儲存主題
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            // 無法儲存時仍可切換本頁
        }
    }

    // 04. 切換主題
    function toggleTheme() {
        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme = isDark ? "light" : "dark";

        saveTheme(nextTheme);
        applyTheme(nextTheme);
    }

    // 05. 頁面初始狀態
    applyTheme(getTheme());

    // 06. 處理共用導覽列與 Bio 的切換按鈕
    // 使用 capture，避免舊程式重複切換兩次
    document.addEventListener("click", function (event) {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const button = target.closest(
            "#modeButton, #theme-toggle"
        );

        if (!button) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        toggleTheme();
    }, true);

    // 07. 導覽列非同步插入後同步按鈕狀態
    document.addEventListener("DOMContentLoaded", function () {
        applyTheme(getTheme());

        const navbarContainer = document.getElementById(
            "navbar-container"
        );

        if (navbarContainer && "MutationObserver" in window) {
            const observer = new MutationObserver(function () {
                applyTheme(
                    document.documentElement.classList.contains("dark")
                        ? "dark"
                        : "light"
                );
            });

            observer.observe(navbarContainer, {
                childList: true
            });
        }
    });

    // 08. 不同分頁修改主題時同步
    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY) {
            applyTheme(getTheme());
        }
    });

})();
