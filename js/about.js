
"use strict";

// =====================================================
// ABOUT.JS｜關於智造完整優化版
// =====================================================

// 01. 技術發展資料
const techData = [
    {
        num: "01",
        tag: "FOUNDATION",
        title: "創始奠基：傳統工藝與穩定產能",
        short: "創立初期，公司以雙面與多層印刷電路板（PCB）之傳統製造技術起家，致力於提升基礎製程良率...",
        full: "創立初期，公司以雙面與多層印刷電路板（PCB）之傳統製造技術起家，致力於提升基礎製程良率與良好品質管理控制。透過導入自動化光學檢測（AOI）系統與標準化生產管理流程，我們成功建立穩定高效率的產能，並獲得國內多家消費性電子品牌廠的長期信任與合作。"
    },
    {
        num: "02",
        tag: "TRANSFORMATION",
        title: "技術轉型：邁向高密度互連",
        short: "因應智慧型手機與行動通訊裝置的迅速普及，公司啟動第一次重大技術轉型，全面佈局 HDI 先進領域...",
        full: "因應智慧型手機與行動通訊裝置的迅速普及，公司啟動第一次重大技術轉型，全面佈局高密度互連板（HDI）先進領域。我們引進高精度雷射鑽孔設備與微孔盲埋技術，大幅優化電路板佈線空間與傳輸效能。成功轉型後，公司順利打入國際一線供應鏈。"
    },
    {
        num: "03",
        tag: "FUTURE",
        title: "AI 時代：智慧製造與高效能運算",
        short: "迎接 AI 伺服器、高效能運算（HPC）與 5G/6G 通訊時代，公司全面建置智慧工廠，專注封裝載板研發...",
        full: "迎接 AI 伺服器、高效能運算（HPC）與 5G/6G 通訊時代，公司全面建置全自動智慧製造工廠，並專注於高階封裝載板研發。透過結合 AI 大數據即時品質監控、物聯網產線監測與 AGV 搬運系統，大幅降低損耗並提昇生產效率，落實永續經營目標。"
    }
];

// 02. 關係企業資料
const companyData = [
    {
        name: "海豚電子科技 (竹科廠)",
        addr: "新竹科學園區展業一路 888 號",
        tel: "(03) 578-1234",
        desc: "專注於高密度互連板（HDI）與先進封裝載板製造，主要提供 AI 伺服器晶片支援。",
        img: "a2.jpg",
        url: "#"
    },
    {
        name: "柑仔軟硬結合板有限公司",
        addr: "桃園市龜山工業區興邦路 999 號",
        tel: "(03) 369-5678",
        desc: "深耕車用電子與穿戴式裝置 Rigid-Flex 領域，為國際電動車大廠合作供應商。",
        img: "a3.jpg",
        url: "#"
    },
    {
        name: "幻視智慧綠能材料",
        addr: "台中科學園區科雅路 666 號",
        tel: "(04) 2567-8901",
        desc: "致力於環保低耗能電路板基材與高導熱銅箔基板研發，助力達成低碳目標。",
        img: "a4.jpg",
        url: "#"
    },
    {
        name: "極光微電子封裝測試",
        addr: "高雄楠梓科技產業園區加昌路 555 號",
        tel: "(07) 361-9988",
        desc: "提供半導體後段封裝測試一站式服務，專精高階晶片整合與高頻測試技術。",
        img: "a5.jpg",
        url: "#"
    }
];

// 03. 深淺色模式
function getTheme() {
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

function applyTheme(theme) {
    const isDark = theme === "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", isDark);
    root.classList.toggle("dark-mode", isDark);
    root.setAttribute("data-bs-theme", theme);

    const button = document.getElementById("modeButton");

    if (button) {
        const label = isDark
            ? "切換淺色模式"
            : "切換深色模式";

        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
        button.setAttribute("aria-pressed", String(!isDark));
    }
}

function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";

    try {
        localStorage.setItem("theme", nextTheme);
    } catch (error) {
        // 無法儲存時仍可切換本頁
    }

    applyTheme(nextTheme);
}

// 04. 閱讀完整內容
function toggleText(index) {
    const paragraph = document.getElementById(`text-${index}`);
    const button = document.getElementById(`read-${index}`);
    const item = techData[index];

    if (!paragraph || !button || !item) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";

    paragraph.textContent = isExpanded
        ? item.short
        : item.full;

    button.textContent = isExpanded
        ? "閱讀完整內容"
        : "收合內容";

    button.setAttribute("aria-expanded", String(!isExpanded));
}

// 05. 頁面載入
document.addEventListener("DOMContentLoaded", function () {

    // 初始化主題
    applyTheme(getTheme());

    const modeButton = document.getElementById("modeButton");

    if (modeButton) {
        modeButton.addEventListener("click", toggleTheme);
    }

    // 06. 產生技術文章
    const techContainer = document.getElementById("techArticles");

    if (techContainer) {
        techContainer.innerHTML = techData.map(function (item, index) {
            return `
                <article class="d-flex border rounded overflow-hidden mb-3 shadow-sm">

                    <div class="article-num d-flex align-items-center justify-content-center">
                        ${item.num}
                    </div>

                    <div class="p-3 flex-grow-1">

                        <span class="subtitle d-block mb-1">
                            ${item.tag}
                        </span>

                        <h2 class="h5 fw-bold mb-2">
                            ${item.title}
                        </h2>

                        <p class="small mb-2"
                           id="text-${index}">
                            ${item.short}
                        </p>

                        <button type="button"
                                class="read-btn px-2 py-1"
                                id="read-${index}"
                                aria-expanded="false"
                                aria-controls="text-${index}">
                            閱讀完整內容
                        </button>

                    </div>
                </article>
            `;
        }).join("");

        // 閱讀按鈕事件
        techContainer.addEventListener("click", function (event) {
            const button = event.target.closest(".read-btn");

            if (!button) return;

            const index = Number(button.id.replace("read-", ""));

            if (Number.isInteger(index)) {
                toggleText(index);
            }
        });
    }

    // 07. 產生關係企業卡片
    const companyContainer = document.getElementById("companyCards");

    if (companyContainer) {
        companyContainer.innerHTML = companyData.map(function (company) {
            return `
                <div class="col">

                    <div class="card col-company h-100 shadow-sm">

                        <div class="card-img-wrapper">

                            <img src="images/${company.img}"
                                 class="card-img-top"
                                 alt="${company.name}"
                                 loading="lazy">

                            <div class="roller-overlay">
                                <span class="more-badge">
                                    了解更多 ➔
                                </span>
                            </div>

                        </div>

                        <div class="card-body">

                            <div class="company-name fw-bold ps-2 mb-2">
                                ${company.name}
                            </div>

                            <div class="small text-secondary">
                                📍 ${company.addr}
                            </div>

                            <div class="small text-secondary mb-2">
                                📞 ${company.tel}
                            </div>

                            <p class="card-text small text-muted">
                                ${company.desc}
                            </p>

                        </div>
                    </div>

                </div>
            `;
        }).join("");
    }

    // 08. 企業卡片連結
    // 原始資料的 url 為 "#"，不建立無效跳轉。
    const companyCards = document.querySelectorAll(".col-company");

    companyCards.forEach(function (card, index) {
        const company = companyData[index];

        if (!company || !company.url || company.url === "#") {
            return;
        }

        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");

        function openCompany() {
            window.location.href = company.url;
        }

        card.addEventListener("click", openCompany);

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                openCompany();
            }
        });
    });

});

// 09. 跨分頁主題同步
window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
        applyTheme(getTheme());
    }
});
