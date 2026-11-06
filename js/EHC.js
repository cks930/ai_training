
"use strict";

// ================================================
// EHC.js｜職安知識詳情版
// 8 張卡片、8 組詳情、無地圖導航
// ================================================

// 圖片備援
const fallbackSvg = "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="600" height="400" viewBox="0 0 600 400">
            <rect width="600" height="400" fill="#203650"/>
            <text x="300" y="200"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-size="25"
                  font-family="sans-serif"
                  fill="#ffffff">
                職業安全衛生宣導
            </text>
        </svg>
    `);

// 雇主應辦理的事項
const employerData = [
    {
        title: "防止危害發生",
        desc: "設置機械、防爆、防電熱及搬運作業等符合規定的安全設備與預防措施。",
        pic: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        tag: "設備安全",
        location: "勞動部職業安全衛生署",
        points: [
            "定期檢查機械設備與安全防護裝置是否正常。",
            "針對電氣、火災及搬運作業進行危害評估。",
            "設備異常時應停止使用，並交由合格人員處理。"
        ],
        reminder: "危害預防應從設備、作業流程及人員教育共同著手。"
    },
    {
        title: "工作環境管理",
        desc: "保持通道與地板安全，防止跌倒、滑倒或物件滾落，確保動線順暢。",
        pic: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        tag: "環境維護",
        location: "職業安全衛生展示館",
        points: [
            "定期巡查走道、樓梯及工作區域。",
            "保持逃生通道暢通，避免堆放雜物。",
            "發現地面積水、照明不足或障礙物時應及時改善。"
        ],
        reminder: "良好的環境管理能降低滑倒、絆倒及物品掉落等事故風險。"
    },
    {
        title: "危害辨識控制",
        desc: "訂定職業安全衛生管理計畫，定期評估作業風險並完整留存紀錄。",
        pic: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=600&q=80",
        tag: "風險評估",
        location: "職業安全衛生署北區職業安全衛生中心",
        points: [
            "辨識各工作流程可能存在的安全與健康危害。",
            "依風險程度安排改善優先順序。",
            "定期檢討改善措施並保存相關紀錄。"
        ],
        reminder: "風險評估應隨設備、材料及作業方式變更而重新檢討。"
    },
    {
        title: "個人防護具提供",
        desc: "備妥耳塞、耳罩、防塵口罩及防護面罩等裝備，並督導確實配戴。",
        pic: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
        tag: "防護裝備",
        location: "職業安全衛生署中區職業安全衛生中心",
        points: [
            "依照作業危害選擇適當的個人防護具。",
            "確認防護具尺寸、狀態及使用方式。",
            "定期清潔、保養並更換損壞的裝備。"
        ],
        reminder: "個人防護具是重要保護措施，但不能取代必要的危害源頭控制。"
    }
];

// 勞工應配合的事項
const workerData = [
    {
        title: "接受安全教育訓練",
        desc: "勞工不得無故拒絕雇主安排的職安訓練（含新進訓練及定期在職訓練）。",
        pic: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
        tag: "教育訓練",
        location: "職業安全衛生署南區職業安全衛生中心",
        points: [
            "參加工作所需的職業安全衛生教育訓練。",
            "了解設備操作、危害通報及緊急應變程序。",
            "遇到不熟悉的作業時，先向主管確認安全要求。"
        ],
        reminder: "教育訓練不只是完成課程，更重要的是能將安全知識運用於工作。"
    },
    {
        title: "接受健康檢查",
        desc: "勞工有義務配合接受一般健康檢查、特殊危害健檢與特定追蹤管理。",
        pic: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
        tag: "健康維護",
        location: "勞工體格及健康檢查認可醫療機構",
        points: [
            "依工作性質及適用規定配合健康檢查。",
            "留意醫療人員提出的健康管理建議。",
            "如工作環境可能影響健康，應向適當的職安衛或醫療人員反映。"
        ],
        reminder: "健康檢查資料應妥善保護，並依適用規定辦理後續健康管理。"
    },
    {
        title: "確實佩戴及使用防護具",
        desc: "作業期間必須正確佩戴個人防護具（如安全帽、護目鏡、防護手套）。",
        pic: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80",
        tag: "裝備配戴",
        location: "勞動部勞動及職業安全衛生研究所",
        points: [
            "進入需要防護的作業區域前確認裝備齊全。",
            "依照訓練及產品使用說明正確佩戴防護具。",
            "發現裝備破損或不合適時，應及時通報並更換。"
        ],
        reminder: "不同作業可能需要不同防護具，應依實際風險及工作規範選用。"
    },
    {
        title: "遵守安全衛生工作守則",
        desc: "必須嚴格遵守會同勞工代表訂定並公告之各項「安全衛生工作守則」。",
        pic: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        tag: "守則遵循",
        location: "勞動部職業安全衛生署",
        points: [
            "熟悉工作場所公告的安全衛生工作守則。",
            "依照標準作業程序執行工作。",
            "發現危險情況時，依規定通報並採取適當安全措施。"
        ],
        reminder: "遵守工作守則有助於建立安全文化，也能降低不必要的作業風險。"
    }
];

// 建立卡片
function renderCards(dataList, targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    target.replaceChildren();

    dataList.forEach(function (item) {
        const column = document.createElement("div");

        // 保留原本 Bootstrap 行列
        column.className = "col-12 col-md-6 col-lg-3";

        column.innerHTML = `
            <article class="safety-card">
                <div class="card-img-wrap">
                    <img src="${item.pic}"
                         alt="${item.title}"
                         loading="lazy">
                </div>

                <div class="card-body-custom">
                    <div>
                        <span class="badge-tag">${item.tag}</span>

                        <h3 class="card-title-custom">
                            ${item.title}
                        </h3>

                        <p class="card-desc">
                            ${item.desc}
                        </p>
                    </div>

                    <div class="pt-2">
                        <button type="button"
                                class="btn-nav js-detail-button">
                            📖 查看更多職安知識
                        </button>
                    </div>
                </div>
            </article>
        `;

        const image = column.querySelector("img");

        if (image) {
            image.addEventListener("error", function () {
                image.src = fallbackSvg;
            }, { once: true });
        }

        const button = column.querySelector(".js-detail-button");

        button.addEventListener("click", function () {
            openDetail(item);
        });

        target.appendChild(column);
    });
}

// 開啟詳細知識視窗
function openDetail(item) {
    const modalElement = document.getElementById("ehcDetailModal");

    if (!modalElement || typeof bootstrap === "undefined") return;

    document.getElementById("ehcDetailTag").textContent = item.tag;
    document.getElementById("ehcDetailTitle").textContent = item.title;
    document.getElementById("ehcDetailDescription").textContent = item.desc;
    document.getElementById("ehcDetailReminder").textContent = item.reminder;

    const detailImage = document.getElementById("ehcDetailImage");
    detailImage.src = item.pic;
    detailImage.alt = item.title;

    detailImage.onerror = function () {
        detailImage.onerror = null;
        detailImage.src = fallbackSvg;
    };

    const pointsList = document.getElementById("ehcDetailPoints");
    pointsList.replaceChildren();

    item.points.forEach(function (point) {
        const li = document.createElement("li");
        li.textContent = point;
        pointsList.appendChild(li);
    });

    bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

// 深淺色設定
function applyEhcTheme(theme) {
    const isDark = theme === "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", isDark);
    root.classList.toggle("dark-mode", isDark);
    root.setAttribute("data-bs-theme", theme);
}

function getEhcTheme() {
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

// 初始化
document.addEventListener("DOMContentLoaded", function () {
    applyEhcTheme(getEhcTheme());

    renderCards(employerData, "#employerList");
    renderCards(workerData, "#workerList");
});

// 跨分頁同步深淺色
window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
        applyEhcTheme(getEhcTheme());
    }
});
