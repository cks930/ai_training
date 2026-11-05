document.addEventListener("DOMContentLoaded", function () {
    // 1. 日夜模式切換與狀態記憶
    const modeButton = document.getElementById("modeButton");

    function applyTheme(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark", "dark-mode");
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark", "dark-mode");
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    }

    if (modeButton) {
        modeButton.addEventListener("click", function () {
            const isDark = document.documentElement.classList.contains("dark") || 
                           document.documentElement.getAttribute("data-bs-theme") === "dark";
            const newTheme = isDark ? "light" : "dark";
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // 2. 3D 卡片動態滑鼠視差特效 (Tilt Effect)
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });
});

// 3. 即時關鍵字搜尋過濾 (使用 jQuery)
$(document).ready(function() {
    $('#searchInput').on('keyup', function() {
        let keyword = $(this).val().toLowerCase().trim();
        $('#projectList li').filter(function() {
            let title = ($(this).data('title') || '').toLowerCase();
            let filename = ($(this).data('filename') || '').toLowerCase();
            let match = title.indexOf(keyword) > -1 || filename.indexOf(keyword) > -1;
            $(this).toggle(match);
        });
    });
});