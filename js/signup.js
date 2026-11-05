"use strict";

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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const citySelect = document.getElementById("city");
  const districtSelect = document.getElementById("district");
  const addressDetail = document.getElementById("address_detail");
  const schoolCitySelect = document.getElementById("school_city");
  const schoolNameSelect = document.getElementById("school_name");
  const formAlert = document.getElementById("formAlert");
  const loadingAlert = document.getElementById("loadingAlert");
  const showmsg = document.getElementById("showmsg");
  const resumeFileInput = document.getElementById("resume_file");
  let cityData = [];

  const fields = {
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    email: document.getElementById("email"),
    idcard: document.getElementById("idcard"),
    phone: document.getElementById("phone"),
    school_city: schoolCitySelect,
    school_name: schoolNameSelect,
    department: document.getElementById("department"),
    degree: document.getElementById("degree"),
    city: citySelect,
    district: districtSelect,
    address_detail: addressDetail,
    resume_file: resumeFileInput
  };

  const errors = {
    username: document.getElementById("usernameError"),
    password: document.getElementById("passwordError"),
    email: document.getElementById("emailError"),
    idcard: document.getElementById("idcardError"),
    phone: document.getElementById("phoneError"),
    school_city: document.getElementById("schoolCityError"),
    school_name: document.getElementById("schoolNameError"),
    department: document.getElementById("departmentError"),
    degree: document.getElementById("degreeError"),
    city: document.getElementById("cityError"),
    district: document.getElementById("districtError"),
    address_detail: document.getElementById("addressError"),
    resume_file: document.getElementById("resumeError")
  };

  function setFieldState(name, message) {
    const field = fields[name];
    const error = errors[name];
    const valid = message === "";
    if (field) {
      field.classList.toggle("is-valid", valid);
      field.classList.toggle("is-invalid", !valid);
    }
    if (error) {
      error.textContent = message;
      error.style.display = valid ? "none" : "block";
    }
    return valid;
  }

  function validateDepartments() {
    const checked = document.querySelectorAll(".dept-chk:checked");
    const errBox = document.getElementById("deptError");
    if (checked.length === 0 || checked.length > 2) {
      if (errBox) errBox.style.display = "block";
      return false;
    } else {
      if (errBox) errBox.style.display = "none";
      return true;
    }
  }

  function validatePrivacy() {
    const chk = document.getElementById("privacyConsent");
    const errBox = document.getElementById("privacyError");
    if (!chk.checked) {
      chk.classList.add("is-invalid");
      if (errBox) errBox.style.display = "block";
      return false;
    } else {
      chk.classList.remove("is-invalid");
      if (errBox) errBox.style.display = "none";
      return true;
    }
  }

  // 學校連動
  schoolCitySelect.addEventListener("change", () => {
    const selectedCity = schoolCitySelect.value;
    schoolNameSelect.replaceChildren(new Option("請選擇大專院校", ""));
    if (selectedCity && collegeData[selectedCity]) {
      collegeData[selectedCity].forEach(college => schoolNameSelect.add(new Option(college, college)));
      schoolNameSelect.disabled = false;
    } else {
      schoolNameSelect.disabled = true;
    }
  });

  // 縣市連動
  citySelect.addEventListener("change", () => {
    const selectedCity = cityData.find(item => item.CityName === citySelect.value);
    districtSelect.replaceChildren(new Option("請選擇鄉鎮市區", ""));
    if (selectedCity && Array.isArray(selectedCity.AreaList)) {
      selectedCity.AreaList.forEach(area => districtSelect.add(new Option(area.AreaName, area.AreaName)));
      districtSelect.disabled = false;
    } else {
      districtSelect.disabled = true;
    }
  });

  // 載入縣市資料
  async function loadCityData() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json");
      const data = await response.json();
      cityData = data;
      citySelect.replaceChildren(new Option("請選擇縣市", ""));
      schoolCitySelect.replaceChildren(new Option("請選擇學校縣市", ""));
      data.forEach(item => {
        citySelect.add(new Option(item.CityName, item.CityName));
        schoolCitySelect.add(new Option(item.CityName, item.CityName));
      });
      citySelect.disabled = false;
      schoolCitySelect.disabled = false;
      if (loadingAlert) loadingAlert.classList.add("d-none");
    } catch (e) {
      if (loadingAlert) {
        loadingAlert.className = "alert alert-warning";
        loadingAlert.textContent = "目前無法載入縣市資料，請檢查網路連線。";
      }
    }
  }

  // 密碼顯示切換
  const togglePasswordBtn = document.getElementById("togglePassword");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const input = fields.password;
      const icon = document.getElementById("passwordIcon");
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      icon.classList.toggle("bi-eye", !reveal);
      icon.classList.toggle("bi-eye-slash", reveal);
    });
  }

  // 志願複選限制
  document.querySelectorAll(".dept-chk").forEach(chk => {
    chk.addEventListener("change", () => {
      const checked = document.querySelectorAll(".dept-chk:checked");
      if (checked.length > 2) {
        chk.checked = false;
        alert("實習志願部門最多只能選擇 2 項！");
      }
      validateDepartments();
    });
  });

  document.getElementById("privacyConsent").addEventListener("change", validatePrivacy);

  // 表單送出與預覽資料呈現
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (formAlert) formAlert.classList.add("d-none");

      const isDeptValid = validateDepartments();
      const isPrivacyValid = validatePrivacy();

      if (!isDeptValid || !isPrivacyValid) {
        if (formAlert) {
          formAlert.textContent = "尚有必填欄位未勾選或不符合規定，請檢查。";
          formAlert.classList.remove("d-none");
        }
        showmsg.textContent = "尚未完成驗證，請修正表單後再送出。";
        return;
      }

      showmsg.replaceChildren();
      const selectedDepts = Array.from(document.querySelectorAll(".dept-chk:checked")).map(c => c.value);
      const resumeFile = resumeFileInput.files[0];

      const details = [
        ["申請人姓名", fields.username.value.trim() || "未填寫"],
        ["聯絡 Email", fields.email.value.trim() || "未填寫"],
        ["身分證/居留證", fields.idcard.value ? fields.idcard.value.slice(0, 1) + "*********（基於個資安全已隱蔽）" : "未填寫"],
        ["行動電話", fields.phone.value.trim() || "未填寫"],
        ["大專學歷", (schoolNameSelect.value || "") + " " + (fields.department.value.trim() || "") + " (" + (fields.degree.value || "") + ")"],
        ["通訊地址", (citySelect.value || "") + (districtSelect.value || "") + (addressDetail.value.trim() || "")],
        ["志願實習部門", selectedDepts.join("、") || "未選擇"],
        ["已上傳附件", resumeFile ? `${resumeFile.name} (${(resumeFile.size / 1024 / 1024).toFixed(2)} MB)` : "無"]
      ];

      details.forEach(([label, value]) => {
        const row = document.createElement("p");
        row.className = "mb-2";
        const strong = document.createElement("strong");
        strong.textContent = label + "：";
        row.append(strong, document.createTextNode(value));
        showmsg.appendChild(row);
      });

      const note = document.createElement("p");
      note.className = "text-success mb-0 mt-3 fw-bold";
      note.textContent = "恭喜！實習報名資料已成功通過驗證，已為您產送報名試算號碼 #ST2027-8891。";
      showmsg.appendChild(note);
    });
  }

  citySelect.disabled = true;
  schoolCitySelect.disabled = true;
  loadCityData();
});