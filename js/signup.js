
"use strict";

/* ============================================
   signup.js
   2027 暑期高階研發實習生計畫
   前端表單驗證示範
============================================ */

// 原本學校資料（示範清單，非即時完整校籍名錄）
const collegeData = {
    "臺北市": ["國立臺灣大學", "國立臺灣科技大學", "國立臺北科技大學", "國立臺灣師範大學", "國立政治大學", "國立臺北大學", "臺北市立大學", "東吳大學", "中國文化大學", "銘傳大學", "實踐大學", "大同大學", "世新大學", "臺北醫學大學", "德明財經科技大學", "中國科技大學"],
    "新北市": ["國立臺北大學", "輔仁大學", "淡江大學", "真理大學", "亞東科技大學", "明志科技大學", "聖母醫護管理專科學校", "景文科技大學", "華夏科技大學", "醒吾科技大學"],
    "基隆市": ["國立臺灣海洋大學", "崇右影藝科技大學", "經國管理暨健康學院"],
    "桃園市": ["國立中央大學", "中原大學", "元智大學", "長庚大學", "開南大學", "龍華科技大學", "健行科技大學", "萬能科技大學", "長庚科技大學"],
    "新竹市": ["國立清華大學", "國立陽明交通大學", "中華大學", "玄奘大學", "元培醫事科技大學"],
    "新竹縣": ["明新科技大學", "大華科技大學"],
    "苗栗縣": ["國立聯合大學", "育達科技大學", "仁德醫護管理專科學校"],
    "臺中市": ["國立中興大學", "國立臺中科技大學", "國立勤益科技大學", "國立臺灣體育運動大學", "東海大學", "逢甲大學", "靜宜大學", "中山醫學大學", "中國醫藥大學", "嶺東科技大學", "中台科技大學", "弘光科技大學", "朝陽科技大學", "修平科技大學"],
    "彰化縣": ["國立彰化師範大學", "大葉大學", "建國科技大學", "中州科技大學"],
    "南投縣": ["國立暨南國際大學", "南開科技大學"],
    "雲林縣": ["國立雲林科技大學", "國立虎尾科技大學", "環球科技大學"],
    "嘉義市": ["國立嘉義大學", "吳鳳科技大學"],
    "嘉義縣": ["國立中正大學", "南華大學", "稻江科技暨管理學院"],
    "臺南市": ["國立成功大學", "國立臺南大學", "國立臺南藝術大學", "長榮大學", "南台科技大學", "崑山科技大學", "嘉南藥理大學", "台南應用科技大學", "遠東科技大學"],
    "高雄市": ["國立中山大學", "國立高雄大學", "國立高雄科技大學", "國立高雄餐旅大學", "義守大學", "高雄醫學大學", "樹德科技大學", "輔英科技大學", "正修科技大學", "文藻外語大學"],
    "屏東縣": ["國立屏東大學", "國立屏東科技大學", "大仁科技大學", "美和科技大學"],
    "宜蘭縣": ["國立宜蘭大學", "佛光大學", "淡江大學 (蘭陽校區)", "聖母醫護管理專科學校"],
    "花蓮縣": ["國立東華大學", "慈濟大學", "慈濟科技大學"],
    "臺東縣": ["國立臺東大學", "國立臺東專科學校"],
    "澎湖縣": ["國立澎湖科技大學"],
    "金門縣": ["國立金門大學"]
};

// 台灣身分證字母轉換碼
const idLetterCodes = {
    A: 10, B: 11, C: 12, D: 13, E: 14,
    F: 15, G: 16, H: 17, I: 34, J: 18,
    K: 19, L: 20, M: 21, N: 22, O: 35,
    P: 23, Q: 24, R: 25, S: 26, T: 27,
    U: 28, V: 29, W: 32, X: 30, Y: 31,
    Z: 33
};

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registrationForm");
    if (!form) return;

    const $ = id => document.getElementById(id);

    const fields = {
        username: $("username"),
        password: $("password"),
        confirmPassword: $("confirmPassword"),
        email: $("email"),
        idcard: $("idcard"),
        phone: $("phone"),
        school_city: $("school_city"),
        school_name: $("school_name"),
        department: $("department"),
        degree: $("degree"),
        city: $("city"),
        district: $("district"),
        address_detail: $("address_detail"),
        resume_file: $("resume_file")
    };

    const errorIds = {
        username: "usernameError",
        password: "passwordError",
        confirmPassword: "confirmPasswordError",
        email: "emailError",
        idcard: "idcardError",
        phone: "phoneError",
        school_city: "schoolCityError",
        school_name: "schoolNameError",
        department: "departmentError",
        degree: "degreeError",
        city: "cityError",
        district: "districtError",
        address_detail: "addressError",
        resume_file: "resumeError"
    };

    const formAlert = $("formAlert");
    const loadingAlert = $("loadingAlert");
    const showmsg = $("showmsg");

    const schoolCity = fields.school_city;
    const schoolName = fields.school_name;
    const city = fields.city;
    const district = fields.district;

    let cityData = [];
    let triedSubmit = false;

    // ========================================
    // 工具函式
    // ========================================

    function setError(name, message, showSuccess = false) {
        const field = fields[name];
        const error = $(errorIds[name]);

        if (!field) return false;

        field.classList.toggle("is-invalid", !!message);
        field.classList.toggle("is-valid", !message && showSuccess);
        field.setAttribute("aria-invalid", String(!!message));

        if (error) {
            error.textContent = message;
        }

        return !message;
    }

    function setSimpleError(input, errorId, message) {
        input.classList.toggle("is-invalid", !!message);
        input.setAttribute("aria-invalid", String(!!message));
        $(errorId).textContent = message;
        return !message;
    }

    function text(name) {
        return fields[name].value.trim();
    }

    function validSelection(select) {
        return !select.disabled &&
            select.value !== "" &&
            Array.from(select.options).some(
                option => option.value === select.value && !option.disabled
            );
    }

    function showAlert(message) {
        formAlert.textContent = message;
        formAlert.classList.remove("d-none");
        formAlert.focus();
    }

    function clearAlert() {
        formAlert.textContent = "";
        formAlert.classList.add("d-none");
    }

    // ========================================
    // 台灣身分證 / 新式居留證檢查碼
    // ========================================

    function validTaiwanId(value) {
        const id = value.toUpperCase();

        // 身分證或新式居留證：
        // 1 個英文字母 + 9 個數字
        if (!/^[A-Z][0-9]{9}$/.test(id)) {
            return false;
        }

        const code = idLetterCodes[id[0]];
        if (code === undefined) return false;

        // 第二碼：
        // 身分證 1/2；新式居留證 8/9
        if (!/[1289]/.test(id[1])) {
            return false;
        }

        const digits = [
            Math.floor(code / 10),
            code % 10,
            ...id.slice(1).split("").map(Number)
        ];

        const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

        const sum = digits.reduce(
            (total, number, index) => total + number * weights[index],
            0
        );

        return sum % 10 === 0;
    }

    // ========================================
    // 單欄驗證
    // ========================================

    function validateField(name, showSuccess = false) {
        let message = "";
        const value = text(name);

        switch (name) {

            case "username":
                if (!value) {
                    message = "請填寫中文或英文姓名。";
                } else if (value.length < 2 || value.length > 50) {
                    message = "姓名長度須介於 2 至 50 個字元。";
                } else if (!/^[\p{L}\p{M} .·'-]+$/u.test(value)) {
                    message = "姓名僅接受文字、空格及常見姓名符號。";
                }
                break;

            case "password":
                if (!value) {
                    message = "請設定進度查詢密碼。";
                } else if (value.length < 8 || value.length > 64) {
                    message = "密碼長度須介於 8 至 64 個字元。";
                } else if (
                    !/[A-Z]/.test(value) ||
                    !/[a-z]/.test(value) ||
                    !/[0-9]/.test(value)
                ) {
                    message = "密碼必須包含大寫英文、小寫英文及數字。";
                }
                break;

            case "confirmPassword":
                if (!value) {
                    message = "請再次輸入密碼。";
                } else if (value !== fields.password.value) {
                    message = "兩次輸入的密碼不一致。";
                }
                break;

            case "email":
                if (!value) {
                    message = "請輸入聯絡 Email。";
                } else if (
                    value.length > 254 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    message = "Email 格式不正確。";
                }
                break;

            case "idcard":
                if (!value) {
                    message = "請輸入身分證字號或新式居留證號。";
                } else if (!validTaiwanId(value)) {
                    message = "證號格式或檢查碼不正確；目前支援身分證及新式居留證。";
                }
                break;

            case "phone":
                if (!value) {
                    message = "請輸入行動電話。";
                } else if (!/^09\d{8}$/.test(value)) {
                    message = "請輸入 09 開頭的 10 碼台灣手機號碼。";
                }
                break;

            case "school_city":
                if (!validSelection(schoolCity) ||
                    !Object.hasOwn(collegeData, schoolCity.value)) {
                    message = "請選擇學校所在縣市。";
                }
                break;

            case "school_name":
                if (!validSelection(schoolName) ||
                    !(collegeData[schoolCity.value] || []).includes(schoolName.value)) {
                    message = "請選擇大專院校。";
                }
                break;

            case "department":
                if (!value) {
                    message = "請填寫就讀科系或研究所。";
                } else if (value.length > 100) {
                    message = "科系名稱不可超過 100 個字元。";
                }
                break;

            case "degree":
                if (!["大三", "大四", "碩一", "碩二"].includes(value)) {
                    message = "請選擇目前年級。";
                }
                break;

            case "city":
                if (!validSelection(city) ||
                    !cityData.some(item => item.CityName === city.value)) {
                    message = "請選擇通訊地址縣市。";
                }
                break;

            case "district": {
                const selectedCity = cityData.find(
                    item => item.CityName === city.value
                );

                if (!validSelection(district) ||
                    !selectedCity ||
                    !selectedCity.AreaList.some(
                        area => area.AreaName === district.value
                    )) {
                    message = "請選擇鄉鎮市區。";
                }
                break;
            }

            case "address_detail":
                if (!value) {
                    message = "請填寫詳細地址。";
                } else if (value.length < 4 || value.length > 120) {
                    message = "詳細地址須介於 4 至 120 個字元。";
                }
                break;

            case "resume_file": {
                const file = fields.resume_file.files[0];

                if (!file) {
                    message = "請選擇 PDF 履歷及成績單。";
                } else if (!file.name.toLowerCase().endsWith(".pdf")) {
                    message = "檔案副檔名必須是 .pdf。";
                } else if (file.size === 0) {
                    message = "檔案不可為空白。";
                } else if (file.size > 10 * 1024 * 1024) {
                    message = "PDF 檔案不可超過 10 MB。";
                } else if (
                    file.type &&
                    file.type !== "application/pdf"
                ) {
                    message = "請選擇 PDF 格式的檔案。";
                }
                break;
            }
        }

        return setError(name, message, showSuccess);
    }

    // 檢查 PDF 檔案開頭是否為 %PDF-
    async function validatePdfSignature() {
        const file = fields.resume_file.files[0];
        if (!file) return false;

        try {
            const buffer = await file.slice(0, 5).arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const signature = Array.from(bytes)
                .map(number => String.fromCharCode(number))
                .join("");

            if (signature !== "%PDF-") {
                setError("resume_file", "檔案內容不是有效的 PDF 格式。");
                return false;
            }

            return true;
        } catch (error) {
            setError("resume_file", "無法讀取 PDF，請重新選擇檔案。");
            return false;
        }
    }

    // ========================================
    // 志願與同意確認
    // ========================================

    function selectedDepartments() {
        return Array.from(
            document.querySelectorAll(".dept-chk:checked")
        ).map(input => input.value);
    }

    function validateDepartments() {
        const count = selectedDepartments().length;
        const message = count < 1 || count > 2
            ? "請至少選擇 1 項志願，最多只能選擇 2 項。"
            : "";

        $("deptError").textContent = message;
        return !message;
    }

    function validatePrivacy() {
        const checkbox = $("privacyConsent");

        return setSimpleError(
            checkbox,
            "privacyError",
            checkbox.checked ? "" : "請確認了解此頁為示範模式。"
        );
    }

    // ========================================
    // 學校連動
    // ========================================

    function updateSchools() {
        schoolName.replaceChildren(
            new Option("請選擇大專院校", "")
        );

        const schools = collegeData[schoolCity.value] || [];

        schools.forEach(name => {
            schoolName.add(new Option(name, name));
        });

        schoolName.disabled = schools.length === 0;
    }

    // ========================================
    // 地址連動
    // ========================================

    function updateDistricts() {
        district.replaceChildren(
            new Option("請選擇鄉鎮市區", "")
        );

        const selectedCity = cityData.find(
            item => item.CityName === city.value
        );

        const areas = selectedCity?.AreaList || [];

        areas.forEach(area => {
            district.add(
                new Option(area.AreaName, area.AreaName)
            );
        });

        district.disabled = areas.length === 0;
    }

    // ========================================
    // 縣市資料載入
    // ========================================

    async function loadCityData() {
        const url =
            "https://raw.githubusercontent.com/donma/" +
            "TaiwanAddressCityAreaRoadChineseEnglishJSON/" +
            "master/CityCountyData.json";

        city.disabled = true;
        district.disabled = true;
        schoolCity.disabled = true;
        schoolName.disabled = true;

        // 學校資料本身已內建，先載入學校縣市
        schoolCity.replaceChildren(
            new Option("請選擇學校縣市", "")
        );

        Object.keys(collegeData).forEach(name => {
            schoolCity.add(new Option(name, name));
        });

        schoolCity.disabled = false;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("縣市資料格式錯誤");
            }

            cityData = data.filter(item =>
                typeof item.CityName === "string" &&
                Array.isArray(item.AreaList)
            );

            city.replaceChildren(
                new Option("請選擇縣市", "")
            );

            cityData.forEach(item => {
                city.add(
                    new Option(item.CityName, item.CityName)
                );
            });

            city.disabled = false;
            loadingAlert.classList.add("d-none");

        } catch (error) {
            console.error("縣市資料載入失敗：", error);

            loadingAlert.className = "alert alert-warning";
            loadingAlert.textContent =
                "通訊地址縣市資料載入失敗，請檢查網路後重新整理頁面。";
        }
    }

    // ========================================
    // 密碼顯示切換
    // ========================================

    $("togglePassword").addEventListener("click", function () {
        const input = fields.password;
        const reveal = input.type === "password";

        input.type = reveal ? "text" : "password";

        $("passwordIcon").classList.toggle("bi-eye", !reveal);
        $("passwordIcon").classList.toggle("bi-eye-slash", reveal);

        this.setAttribute("aria-pressed", String(reveal));
        this.setAttribute(
            "aria-label",
            reveal ? "隱藏密碼" : "顯示密碼"
        );
    });

    // ========================================
    // 即時驗證
    // ========================================

    Object.keys(fields).forEach(name => {
        const field = fields[name];
        const eventName =
            field.tagName === "SELECT" ||
            field.type === "file"
                ? "change"
                : "input";

        field.addEventListener(eventName, function () {
            if (triedSubmit || field.classList.contains("is-invalid")) {
                validateField(name, true);
            }

            // 修改密碼時也重新驗證確認密碼
            if (name === "password" && triedSubmit) {
                validateField("confirmPassword", true);
            }
        });
    });

    schoolCity.addEventListener("change", function () {
        updateSchools();

        setError("school_name", "", false);

        if (triedSubmit) {
            validateField("school_city", true);
        }
    });

    city.addEventListener("change", function () {
        updateDistricts();

        setError("district", "", false);

        if (triedSubmit) {
            validateField("city", true);
        }
    });

    // 志願最多 2 項
    document.querySelectorAll(".dept-chk").forEach(input => {
        input.addEventListener("change", function () {
            const checked = document.querySelectorAll(".dept-chk:checked");

            if (checked.length > 2) {
                this.checked = false;
                $("deptError").textContent =
                    "最多只能選擇 2 項志願。";
            } else {
                validateDepartments();
            }
        });
    });

    $("privacyConsent").addEventListener(
        "change", validatePrivacy
    );

    // 身分證轉大寫
    fields.idcard.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });

    // ========================================
    // 預覽資料
    // ========================================

    function showPreview() {
        showmsg.replaceChildren();

        const file = fields.resume_file.files[0];

        const details = [
            ["申請人姓名", text("username")],
            ["聯絡 Email", text("email")],
            [
                "身分證 / 居留證",
                text("idcard").slice(0, 1) + "*********"
            ],
            [
                "行動電話",
                text("phone").slice(0, 4) + "******"
            ],
            [
                "大專學歷",
                schoolName.value + " " +
                text("department") + "（" +
                fields.degree.value + "）"
            ],
            [
                "通訊地址",
                city.value + district.value + "（詳細地址已隱藏）"
            ],
            [
                "志願實習部門",
                selectedDepartments().join("、")
            ],
            [
                "選擇附件",
                file.name + "（" +
                (file.size / 1024 / 1024).toFixed(2) +
                " MB）"
            ]
        ];

        details.forEach(([label, value]) => {
            const row = document.createElement("p");
            row.className = "mb-2";

            const strong = document.createElement("strong");
            strong.textContent = label + "：";

            row.append(
                strong,
                document.createTextNode(value)
            );

            showmsg.appendChild(row);
        });

        const note = document.createElement("p");
        note.className = "preview-success mt-3 mb-0";

        note.textContent =
            "✓ 前端表單驗證通過。此為資料預覽，尚未正式送出報名申請。";

        showmsg.appendChild(note);
        showmsg.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // ========================================
    // 送出驗證
    // ========================================

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        triedSubmit = true;
        clearAlert();

        const names = Object.keys(fields);

        let valid = true;
        let firstInvalid = null;

        names.forEach(name => {
            if (!validateField(name, true)) {
                valid = false;
                if (!firstInvalid) firstInvalid = fields[name];
            }
        });

        if (!validateDepartments()) {
            valid = false;
            if (!firstInvalid) {
                firstInvalid = document.querySelector(".dept-chk");
            }
        }

        if (!validatePrivacy()) {
            valid = false;
            if (!firstInvalid) {
                firstInvalid = $("privacyConsent");
            }
        }

        if (!valid) {
            showAlert("表單尚有錯誤，請依照紅色提示修正。");
            showmsg.textContent = "尚未完成驗證，請修正表單。";

            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
            return;
        }

        // 檢查檔案內容
        const pdfValid = await validatePdfSignature();

        if (!pdfValid) {
            showAlert("PDF 檔案格式不正確，請重新選擇。");
            fields.resume_file.focus();
            return;
        }

        showPreview();
    });

    // ========================================
    // 重設表單
    // ========================================

    form.addEventListener("reset", function () {
        setTimeout(function () {
            triedSubmit = false;

            Object.keys(fields).forEach(name => {
                const field = fields[name];

                field.classList.remove("is-valid", "is-invalid");
                field.removeAttribute("aria-invalid");

                $(errorIds[name]).textContent = "";
            });

            schoolName.replaceChildren(
                new Option("請先選擇學校縣市", "")
            );
            schoolName.disabled = true;

            district.replaceChildren(
                new Option("請先選擇縣市", "")
            );
            district.disabled = true;

            $("deptError").textContent = "";
            $("privacyError").textContent = "";
            $("privacyConsent").classList.remove("is-invalid");

            fields.password.type = "password";
            $("passwordIcon").className = "bi bi-eye";
            $("togglePassword").setAttribute("aria-pressed", "false");
            $("togglePassword").setAttribute("aria-label", "顯示密碼");

            clearAlert();
            showmsg.textContent = "尚未完成表單驗證";
        }, 0);
    });

    // 啟動縣市載入
    loadCityData();
});
