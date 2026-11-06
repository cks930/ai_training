
"use strict";

// ============================================
// union.js｜員工福利合作廠商列表
// API 載入、搜尋、重新整理、手機版表格
// ============================================

// 原本農業部開放資料網址
const UNION_API =
    "https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193";

// 保留原本最多 50 筆資料
const UNION_LIMIT = 50;

// 資料儲存
let unionData = [];
let unionLoading = false;
let unionController = null;

// 圖片備援
const unionFallback = "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="240" height="180" viewBox="0 0 240 180">
            <rect width="240" height="180" fill="#263d56"/>
            <text x="120" y="90"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-family="sans-serif"
                  font-size="20"
                  fill="#ffffff">
                暫無圖片
            </text>
        </svg>
    `);

// 安全處理外部網址
function safeImageUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return unionFallback;
    }

    try {
        const url = new URL(value.trim());

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {
        return unionFallback;
    }

    return unionFallback;
}

// 處理資料欄位
function cleanText(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}

// 取得地圖搜尋連結（不強制導航）
function createMapUrl(item) {
    const lat = Number(item.Latitude);
    const lng = Number(item.Longitude);

    const hasCoordinates =
        cleanText(item.Latitude) !== "" &&
        cleanText(item.Longitude) !== "" &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180;

    // 有座標：搜尋該位置
    if (hasCoordinates) {
        return "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(lat + "," + lng);
    }

    // 無座標：搜尋店名與地址
    const query = [
        cleanText(item.Name),
        cleanText(item.Address)
    ].filter(Boolean).join(" ");

    if (!query) {
        return "";
    }

    return "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(query);
}

// 建立表格欄位
function createCell(label, content) {
    const td = document.createElement("td");

    // 修正原本 CSS data-label / JS data-th 不一致
    td.setAttribute("data-label", label);
    td.appendChild(content);

    return td;
}

// 建立純文字元素
function createTextElement(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

// 建立單筆店家資料
function createRestaurantRow(item) {
    const tr = document.createElement("tr");

    const name = cleanText(item.Name) || "未提供";
    const tel = cleanText(item.Tel);
    const addr = cleanText(item.Address);

    // 1. 餐廳名稱
    tr.appendChild(
        createCell(
            "餐廳名稱",
            createTextElement("span", name, "restaurant-name")
        )
    );

    // 2. 圖片
    const imageWrap = document.createElement("span");
    imageWrap.className = "img-container";

    const image = document.createElement("img");
    image.src = safeImageUrl(item.PicURL);
    image.alt = name + "店家圖片";
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", function () {
        image.src = unionFallback;
    }, { once: true });

    imageWrap.appendChild(image);
    tr.appendChild(createCell("圖片", imageWrap));

    // 3. 電話
    let phoneElement;

    // 只接受常見電話字元，避免產生不安全的連結
    if (tel && /^[+()\d\s-]+$/.test(tel)) {
        phoneElement = document.createElement("a");
        phoneElement.className = "restaurant-phone";
        phoneElement.href = "tel:" + tel.replace(/[()\s-]/g, "");
        phoneElement.textContent = tel;
    } else {
        phoneElement = createTextElement(
            "span",
            tel || "未提供",
            "restaurant-phone"
        );
    }

    tr.appendChild(createCell("電話", phoneElement));

    // 4. 地址
    tr.appendChild(
        createCell(
            "住址",
            createTextElement(
                "span",
                addr || "未提供",
                "restaurant-address"
            )
        )
    );

    // 5. 地圖位置
    const mapUrl = createMapUrl(item);
    let mapElement;

    if (mapUrl) {
        mapElement = document.createElement("a");
        mapElement.className = "btn-map";
        mapElement.href = mapUrl;
        mapElement.target = "_blank";
        mapElement.rel = "noopener noreferrer";
        mapElement.textContent = "📍 查看地圖";
        mapElement.setAttribute(
            "aria-label",
            "在 Google Maps 搜尋 " + name
        );
    } else {
        mapElement = createTextElement(
            "span",
            "暫無位置資訊",
            "map-unavailable"
        );
    }

    tr.appendChild(createCell("地圖位置", mapElement));

    return tr;
}

// 更新狀態文字
function updateCount(message) {
    const count = document.getElementById("resultCount");

    if (count) {
        count.textContent = message;
    }
}

// 顯示載入或錯誤訊息
function showStatus(message, className = "") {
    const list = document.getElementById("myList");
    if (!list) return;

    list.replaceChildren();

    const tr = document.createElement("tr");
    tr.className = "status-row";

    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "text-center py-4 " + className;
    td.textContent = message;

    tr.appendChild(td);
    list.appendChild(tr);
}

// 顯示表格資料
function renderUnionData() {
    const list = document.getElementById("myList");
    const input = document.getElementById("searchInput");

    if (!list) return;

    const keyword = (input ? input.value : "")
        .trim()
        .toLocaleLowerCase();

    const filtered = unionData.filter(function (item) {
        const content = [
            item.Name,
            item.Tel,
            item.Address
        ].map(cleanText).join(" ").toLocaleLowerCase();

        return content.includes(keyword);
    });

    list.replaceChildren();

    if (filtered.length === 0) {
        showStatus(
            unionData.length === 0
                ? "目前沒有可顯示的店家資料。"
                : "找不到符合搜尋條件的店家。",
            "empty-message"
        );

        updateCount(
            "顯示 0 筆／已載入 " + unionData.length + " 筆"
        );

        return;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach(function (item) {
        fragment.appendChild(createRestaurantRow(item));
    });

    list.appendChild(fragment);

    updateCount(
        "顯示 " + filtered.length +
        " 筆／已載入 " + unionData.length + " 筆"
    );
}

// 取得開放資料
async function loadUnionData() {
    if (unionLoading) return;

    unionLoading = true;

    const reloadButton = document.getElementById("reloadButton");

    if (reloadButton) {
        reloadButton.disabled = true;
        reloadButton.textContent = "載入中...";
    }

    showStatus("正在載入美食資料中...");
    updateCount("正在讀取資料...");

    unionController = new AbortController();

    // 避免網路請求無限等待
    const timeoutId = setTimeout(function () {
        unionController.abort();
    }, 15000);

    try {
        const response = await fetch(UNION_API, {
            method: "GET",
            signal: unionController.signal,
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("開放資料格式不符合預期");
        }

        unionData = data.slice(0, UNION_LIMIT);

        renderUnionData();

    } catch (error) {
        console.error("美食資料載入失敗：", error);

        // 載入失敗時不顯示舊資料，避免誤認為最新
        unionData = [];

        showStatus(
            "⚠️ 美食資料載入失敗，請稍後按「重新載入資料」。",
            "error-message"
        );

        updateCount("資料載入失敗");

    } finally {
        clearTimeout(timeoutId);
        unionLoading = false;
        unionController = null;

        if (reloadButton) {
            reloadButton.disabled = false;
            reloadButton.textContent = "↻ 重新載入資料";
        }
    }
}

// 啟動
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const reloadButton = document.getElementById("reloadButton");

    if (searchInput) {
        searchInput.addEventListener("input", renderUnionData);
    }

    if (reloadButton) {
        reloadButton.addEventListener("click", loadUnionData);
    }

    loadUnionData();
});
