$(document).ready(function() {
    // 1. 日夜模式切換與狀態記憶
    const modeButton = $('#modeButton');
    
    modeButton.on('click', function() {
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-bs-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. 即時關鍵字搜尋過濾
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