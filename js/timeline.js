
"use strict";

// =====================================================
// TIMELINE.JS
// 深淺色同步 + 查看更多彈出視窗
// =====================================================

// 01. 讀取主題
function getTimelineTheme() {
    try {
        return localStorage.getItem("theme") === "light"
            ? "light"
            : "dark";
    } catch (error) {
        return document.documentElement.classList.contains("dark")
            ? "dark"
            : "light";
    }
}

// 02. 套用主題
function applyTimelineTheme(theme) {
    const isDark = theme === "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", isDark);
    root.classList.toggle("dark-mode", isDark);
    root.setAttribute("data-bs-theme", theme);
}

// 03. 初始化
applyTimelineTheme(getTimelineTheme());

// 04. 頁面載入完成
document.addEventListener("DOMContentLoaded", function () {

    const modalElement = document.getElementById("timelineModal");
    const modalTitle = document.getElementById("timelineModalTitle");
    const modalImage = document.getElementById("timelineModalImage");
    const modalYear = document.getElementById("timelineModalYear");
    const modalContent = document.getElementById("timelineModalContent");

    // 檢查 Bootstrap Modal 是否存在
    if (
        !modalElement ||
        !modalTitle ||
        !modalImage ||
        !modalYear ||
        !modalContent ||
        typeof bootstrap === "undefined"
    ) {
        return;
    }

    const timelineModal = new bootstrap.Modal(modalElement);

    // 05. 取得原本的四個時間軸區塊
    const timelineRows = document.querySelectorAll(".timeline-row");

    // 06. 查看更多按鈕
    document.querySelectorAll("[data-timeline]").forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(button.dataset.timeline);
            const row = timelineRows[index];

            if (!row) return;

            // 取得卡片標題
            const title = row.querySelector(".timeline-card h2");

            // 取得年份
            const year = row.querySelector(".timeline-tag");

            // 取得原本圖片
            const imageBox = row.querySelector(".imgbox");

            // 取得原本介紹文字
            const paragraphs = row.querySelectorAll(".timeline-card p");

            if (!title || !year || !imageBox) return;

            modalTitle.textContent = title.textContent.trim();
            modalYear.textContent = year.textContent.trim();

            // 取得 CSS background-image 的圖片路徑
            const backgroundImage = imageBox.style.backgroundImage;
            const imageMatch = backgroundImage.match(
                /url\(["']?(.*?)["']?\)/
            );

            if (imageMatch) {
                modalImage.src = imageMatch[1];
                modalImage.alt = title.textContent.trim();
                modalImage.hidden = false;
            } else {
                modalImage.removeAttribute("src");
                modalImage.hidden = true;
            }

            // 清空舊內容
            modalContent.replaceChildren();

            // 使用原本卡片文字建立段落
            paragraphs.forEach(function (paragraph) {
                const p = document.createElement("p");
                p.textContent = paragraph.textContent.trim();
                p.className = "mb-3";
                modalContent.appendChild(p);
            });

            // 顯示視窗
            timelineModal.show();
        });

    });

    // 07. 圖片載入失敗時隱藏
    modalImage.addEventListener("error", function () {
        modalImage.hidden = true;
    });

    // 08. 關閉視窗時清除內容
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalImage.removeAttribute("src");
        modalContent.replaceChildren();
    });

});

// 09. 不同分頁主題同步
window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
        applyTimelineTheme(getTimelineTheme());
    }
});
