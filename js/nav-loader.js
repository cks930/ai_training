
"use strict";

// ================================================
// nav-loader.js｜全站共用導覽列完整修正版
// ================================================

document.addEventListener("DOMContentLoaded", function () {

    const navbarContainer = document.getElementById("navbar-container");

    // 讀取儲存的主題
    function getSavedTheme() {
        try {
            return localStorage.getItem("theme") === "light"
                ? "light"
                : "dark";
        } catch (error) {
            return "dark";
        }
    }

    // 套用主題
    function applyTheme(theme) {
        const root = document.documentElement;
        const isDark = theme === "dark";

        root.classList.toggle("dark", isDark);
        root.classList.toggle("dark-mode", isDark);
        root.setAttribute("data-bs-theme", theme);

        // 更新切換按鈕狀態
        const modeButton = document.getElementById("modeButton");

        if (modeButton) {
            modeButton.setAttribute("aria-pressed", String(isDark));
            modeButton.setAttribute(
                "aria-label",
                isDark ? "目前為深色模式，切換至淺色模式"
                       : "目前為淺色模式，切換至深色模式"
            );
        }
    }

    // 儲存主題
    function saveTheme(theme) {
        try {
            localStorage.setItem("theme", theme);
        } catch (error) {
            console.warn("無法儲存主題設定：", error);
        }
    }

    // 設定深淺色切換
    function setupModeButton() {
        const modeButton = document.getElementById("modeButton");

        if (!modeButton) return;

        // 避免重複綁定
        if (modeButton.dataset.initialized === "true") return;
        modeButton.dataset.initialized = "true";

        modeButton.addEventListener("click", function () {

            const isDark =
                document.documentElement.getAttribute("data-bs-theme") === "dark";

            const newTheme = isDark ? "light" : "dark";

            applyTheme(newTheme);
            saveTheme(newTheme);
        });

        applyTheme(getSavedTheme());
    }

    // 自動標示目前頁面
    function highlightCurrentPage() {

        const currentPage =
            decodeURIComponent(
                window.location.pathname.split("/").pop()
            ).toLowerCase() || "home.html";

        const links = navbarContainer
            ? navbarContainer.querySelectorAll(".nav-link")
            : document.querySelectorAll(".navbar .nav-link");

        links.forEach(function (link) {

            const linkPage =
                link.getAttribute("href")
                    .split("?")[0]
                    .split("#")[0]
                    .split("/")
                    .pop()
                    .toLowerCase();

            const isCurrent = linkPage === currentPage;

            link.classList.toggle("active", isCurrent);

            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // 載入共用導覽列
    async function loadNavbar() {

        if (!navbarContainer) {
            setupModeButton();
            return;
        }

        try {
            const response = await fetch("navbar.html");

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status + "：無法載入 navbar.html"
                );
            }

            const html = await response.text();

            navbarContainer.innerHTML = html;

            setupModeButton();
            highlightCurrentPage();

        } catch (error) {
            console.error("導覽列載入失敗：", error);

            // 載入失敗時使用與 navbar.html 完全相同的原始導覽列。
            // 適用於直接雙擊 HTML (file://) 或本機 fetch 受限制的情況。
            navbarContainer.innerHTML = "\r\n<header class=\"navbar navbar-expand-lg px-4 shadow-sm w-100\">\r\n    <div class=\"container-fluid d-flex align-items-center justify-content-between flex-wrap\">\r\n\r\n        <!-- 左側 Logo 與標題 -->\r\n        <a href=\"home.html\"\r\n           class=\"logo-group text-decoration-none d-flex align-items-center gap-2 flex-shrink-0\">\r\n\r\n            <div class=\"logo-icon fallback-icon\">智</div>\r\n\r\n            <div class=\"logo-text d-flex align-items-baseline gap-2\">\r\n                <span class=\"company-name fw-bold fs-5\">智造科技</span>\r\n                <span class=\"company-tagline small d-none d-md-inline\">\r\n                    | 專業 PCB 製造\r\n                </span>\r\n            </div>\r\n        </a>\r\n\r\n        <!-- 手機版選單 -->\r\n        <button class=\"navbar-toggler ms-auto\"\r\n                type=\"button\"\r\n                data-bs-toggle=\"collapse\"\r\n                data-bs-target=\"#navbarNav\"\r\n                aria-controls=\"navbarNav\"\r\n                aria-expanded=\"false\"\r\n                aria-label=\"切換導覽列\">\r\n            <span class=\"navbar-toggler-icon\"></span>\r\n        </button>\r\n\r\n        <!-- 導覽選單 -->\r\n        <div class=\"collapse navbar-collapse justify-content-end\" id=\"navbarNav\">\r\n\r\n            <ul class=\"nav-links navbar-nav mx-auto gap-3 mb-2 mb-lg-0 align-items-center list-unstyled text-nowrap\">\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"home.html\">🏠 首頁</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"about-us.html\">🏢 關於智造</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"timeline.html\">📈 發展時間軸</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"EHC-policy.html\">🛡️ 職業安全</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"union.html\">🎁 員工福利</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"R-D.html\">🚀 科技展示</a>\r\n                </li>\r\n\r\n                <li class=\"nav-item\">\r\n                    <a class=\"nav-link\" href=\"signup.html\">📝 線上報名</a>\r\n                </li>\r\n\r\n            </ul>\r\n\r\n            <!-- 深淺色切換 -->\r\n            <div class=\"nav-right d-flex align-items-center gap-3 flex-shrink-0 mt-2 mt-lg-0\">\r\n\r\n                <button class=\"mode-switch btn d-flex align-items-center gap-2\"\r\n                        id=\"modeButton\"\r\n                        type=\"button\"\r\n                        aria-label=\"切換深淺色模式\"\r\n                        aria-pressed=\"true\">\r\n\r\n                    <span class=\"mode-label\">☀ / ☾</span>\r\n\r\n                    <span class=\"switch-track\" aria-hidden=\"true\">\r\n                        <span class=\"switch-dot\"></span>\r\n                    </span>\r\n\r\n                </button>\r\n\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</header>\r\n";
            setupModeButton();
            highlightCurrentPage();
        }
    }

    // 初始主題
    applyTheme(getSavedTheme());

    // 載入導覽列
    loadNavbar();

    // 跨分頁同步深淺色
    window.addEventListener("storage", function (event) {

        if (event.key === "theme") {
            applyTheme(getSavedTheme());
        }

    });

});
