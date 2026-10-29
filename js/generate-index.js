const fs = require('fs');
const path = require('path');

// 根目錄 (__dirname 的上一層)
const rootDir = path.join(__dirname, '..');
const targetIndexFile = 'index.html';

// 1. 讀取根目錄下的所有檔案（單層）
fs.readdir(rootDir, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('讀取目錄失敗：', err);
        return;
    }

    const links = [];

    // 2. 篩選出根目錄的 HTML 檔案
    files.forEach(file => {
        if (file.isFile() && path.extname(file.name).toLowerCase() === '.html') {
            const fileName = file.name;
            
            // 排除首頁自己與備份檔
            if (fileName === targetIndexFile || fileName.startsWith('#')) return;

            const filePath = path.join(rootDir, fileName);
            
            // 3. 讀取 HTML 內容以抓取 <title>
            const content = fs.readFileSync(filePath, 'utf-8');
            const match = content.match(/<title>([^<]+)<\/title>/i);
            
            const pageTitle = match ? match[1].trim() : fileName;

            // 分類標籤判斷
            let tag = 'Frontend';
            if (pageTitle.includes('Bootstrap') || pageTitle.includes('響應式')) tag = 'RWD';
            else if (pageTitle.includes('Data') || pageTitle.includes('美食') || pageTitle.includes('串接')) tag = 'API';
            else if (pageTitle.includes('表單') || pageTitle.includes('系統')) tag = 'Interactive';

            links.push({
                fileName: fileName,
                title: pageTitle,
                tag: tag
            });
        }
    });

    // 4. 動態組合明亮風格的卡片 HTML 內容
    let listItems = links.map((item, index) => {
        return `        <li data-title="${item.title.toLowerCase()}" data-filename="${item.fileName.toLowerCase()}" style="animation-delay: ${index * 0.06}s;">
            <a href="${item.fileName}" target="_blank">
                <div class="card-top">
                    <span class="card-icon">💡</span>
                    <span class="card-tag ${item.tag.toLowerCase()}">${item.tag}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-file">${item.fileName}</p>
                </div>
                <div class="card-bottom">
                    <span class="action-text">進入專案</span>
                    <span class="arrow-icon">→</span>
                </div>
            </a>
        </li>`;
    }).join('\n');

    let newHtmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>前端開發學習歷程作品集</title>
    <link rel="stylesheet" href="css/mycss.css">
    <style>
        /* 明亮高質感變數設計 */
        :root {
            --bg-color: #f8fafc;
            --bg-gradient-1: #e0f2fe;
            --bg-gradient-2: #fae8ff;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-hover: rgba(255, 255, 255, 1);
            --text-main: #1e293b;
            --text-muted: #64748b;
            --accent-primary: #4f46e5;
            --accent-secondary: #9333ea;
            --accent-cyan: #0284c7;
            --border-color: rgba(226, 232, 240, 0.8);
            --shadow-color: rgba(148, 163, 184, 0.15);
        }

        body {
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(at 10% 10%, var(--bg-gradient-1) 0px, transparent 50%),
                radial-gradient(at 90% 90%, var(--bg-gradient-2) 0px, transparent 50%);
            color: var(--text-main);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            margin: 0;
            padding: 60px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
        }

        .wrapper {
            width: 100%;
            max-width: 1100px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* 標題與副標設計 */
        .header-container {
            text-align: center;
            margin-bottom: 35px;
            animation: fadeInDown 0.8s ease-out;
        }

        .mytitle-01 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 0 10px 0;
            letter-spacing: 0.5px;
        }

        .subtitle {
            color: var(--text-muted);
            font-size: 1.05rem;
            margin: 0;
            font-weight: 500;
        }

        /* 即時搜尋框設計 */
        .search-box {
            width: 100%;
            max-width: 480px;
            margin-bottom: 45px;
            position: relative;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid var(--border-color);
            padding: 14px 20px 14px 48px;
            border-radius: 30px;
            color: var(--text-main);
            font-size: 1rem;
            outline: none;
            box-shadow: 0 4px 12px var(--shadow-color);
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .search-input:focus {
            border-color: var(--accent-primary);
            background: #ffffff;
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.15);
        }

        .search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.1rem;
        }

        /* 網格卡片佈局 (Grid) */
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
        }

        li {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
        }

        /* 卡片本體 */
        li a {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: var(--card-bg);
            border: 2px solid var(--border-color);
            padding: 24px;
            border-radius: 20px;
            text-decoration: none;
            color: var(--text-main);
            backdrop-filter: blur(12px);
            height: 200px;
            box-sizing: border-box;
            box-shadow: 0 10px 25px -5px var(--shadow-color);
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        li a:hover {
            background: var(--card-hover);
            border-color: var(--accent-primary);
            transform: translateY(-6px);
            box-shadow: 0 20px 35px -10px rgba(79, 70, 229, 0.2);
        }

        .card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-icon {
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        }

        li a:hover .card-icon {
            transform: scale(1.15) rotate(10deg);
        }

        /* 明亮風標籤設計 */
        .card-tag {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 20px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .card-tag.frontend { background: #e0e7ff; color: #4338ca; }
        .card-tag.rwd { background: #e0f2fe; color: #0369a1; }
        .card-tag.api { background: #fef9c3; color: #a16207; }
        .card-tag.interactive { background: #fae8ff; color: #86198f; }

        .card-content {
            margin: 10px 0;
        }

        .card-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 6px 0;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .card-file {
            font-size: 0.82rem;
            color: var(--text-muted);
            font-family: monospace;
            margin: 0;
        }

        .card-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border-color);
            padding-top: 14px;
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--accent-primary);
            transition: color 0.3s ease;
        }

        .arrow-icon {
            transition: transform 0.3s ease;
        }

        li a:hover .arrow-icon {
            transform: translateX(6px);
        }

        /* 動畫設定 */
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header-container">
            <h1 class="mytitle-01">前端開發學習歷程</h1>
            <p class="subtitle">HTML, CSS, JavaScript & Responsive Web Design Portfolio</p>
        </div>

        <!-- 即時搜尋列 -->
        <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="searchInput" class="search-input" placeholder="快速搜尋專案名稱或檔名...">
        </div>

        <ul id="projectList">
${listItems}
        </ul>
    </div>

    <!-- 結合即時搜尋與 jQuery 互動 -->
    <script src="js/jquery-4.0.0.js"></script>
    <script>
        $(document).ready(function() {
            $('#searchInput').on('keyup', function() {
                let keyword = $(this).val().toLowerCase();
                $('#projectList li').filter(function() {
                    let title = $(this).data('title');
                    let filename = $(this).data('filename');
                    let match = title.indexOf(keyword) > -1 || filename.indexOf(keyword) > -1;
                    $(this).toggle(match);
                });
            });
        });
    </script>
</body>
</html>`;

    // 5. 寫入根目錄的 index.html
    fs.writeFileSync(path.join(rootDir, targetIndexFile), newHtmlContent, 'utf-8');
    console.log(`✨ 成功！已重新生成明亮清爽風格的 ${targetIndexFile}，共收錄 ${links.length} 個網頁。`);
});