document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");
    
    function initTheme() {
        const savedTheme = localStorage.getItem("theme") || "dark";
        applyTheme(savedTheme);
    }

    function applyTheme(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark", "dark-mode");
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark", "dark-mode");
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    }

    if (navbarContainer) {
        fetch("navbar.html")
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
                setupModeButton();
            })
            .catch(err => console.error("導覽列載入失敗:", err));
    } else {
        setupModeButton();
    }

    function setupModeButton() {
        const modeButton = document.getElementById("modeButton");
        if (modeButton) {
            modeButton.addEventListener("click", function () {
                const isDark = document.documentElement.classList.contains("dark") || 
                               document.documentElement.getAttribute("data-bs-theme") === "dark";
                const newTheme = isDark ? "light" : "dark";
                applyTheme(newTheme);
                localStorage.setItem("theme", newTheme);
            });
        }
    }

    initTheme();
});