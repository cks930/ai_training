// 互動式作品集：完整 JavaScript
try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')||'dark'}catch(e){document.documentElement.dataset.theme='dark'}
document.addEventListener('DOMContentLoaded',()=>{
const $=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function read(key,fallback){try{return localStorage.getItem(key)||fallback}catch(e){return fallback}}
function save(key,value){try{localStorage.setItem(key,value)}catch(e){}}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let toastTimer;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3000)}
function celebrate(){if(reduced.matches)return;const colors=['#38bdf8','#c084fc','#facc15','#34d399','#fb7185'];for(let i=0;i<50;i++){const p=document.createElement('span');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.animationDelay=Math.random()*.5+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4000)}}
const closeIntro=()=>{$('intro').hidden=true};$('skipIntro').addEventListener('click',closeIntro);setTimeout(closeIntro,reduced.matches?100:2200);
function updateTheme(){$('themeBtn').textContent=document.documentElement.dataset.theme==='dark'?'☀️ 淺色模式':'🌙 深色模式'}updateTheme();$('themeBtn').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;save('portfolio-theme',next);updateTheme()});
const cards=[...document.querySelectorAll('.project-card')];const projects=cards.map(card=>({title:card.querySelector('.card-title').textContent.trim(),file:card.getAttribute('href')}));$('totalCount').textContent=projects.length;
function searchProjects(){const term=$('searchInput').value.trim().toLowerCase();let n=0;cards.forEach(card=>{const show=card.textContent.toLowerCase().includes(term)||card.getAttribute('href').toLowerCase().includes(term);card.parentElement.hidden=!show;if(show)n++});$('visibleCount').textContent=n;$('emptyMessage').hidden=n>0}$('searchInput').addEventListener('input',searchProjects);searchProjects();
document.addEventListener('keydown',e=>{const a=document.activeElement;const typing=a.matches('input,textarea')||a.isContentEditable;if(e.key==='/'&&!typing&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();$('searchInput').focus()}if(e.key==='Escape'&&a===$('searchInput')){$('searchInput').value='';searchProjects();a.blur()}});
cards.forEach(card=>{card.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');card.style.transform=`perspective(900px) rotateX(${(.5-y)*8}deg) rotateY(${(x-.5)*8}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
let lastSpark=0;document.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches||Date.now()-lastSpark<65)return;lastSpark=Date.now();const p=document.createElement('span');p.className='spark';p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),650)});
let explored=[];try{explored=JSON.parse(read('portfolio-explored','[]'))}catch(e){}if(!Array.isArray(explored))explored=[];explored=[...new Set(explored.filter(f=>projects.some(p=>p.file===f)))];
function updateExplore(){const n=explored.length;$('exploreBar').style.width=n/projects.length*100+'%';$('exploreText').textContent=`已探索 ${n} / ${projects.length} 個作品`;$('achievementTitle').textContent=n===8?'🏆 全站探索者':n>=4?'🚀 進階探索者':'🔎 初階探索者'}
function recordExplore(file){if(!projects.some(p=>p.file===file)||explored.includes(file))return;explored.push(file);save('portfolio-explored',JSON.stringify(explored));updateExplore();if(explored.length===projects.length){toast('🏆 恭喜解鎖全站探索者！');celebrate()}}
cards.forEach(card=>card.addEventListener('click',()=>recordExplore(card.getAttribute('href'))));$('resetExplore').addEventListener('click',()=>{if(!confirm('確定要重新開始探索嗎？'))return;explored=[];save('portfolio-explored','[]');updateExplore()});updateExplore();
function drawProject(){const p=projects[Math.floor(Math.random()*projects.length)];$('mysteryResult').hidden=false;$('mysteryTitle').textContent='🎉 '+p.title;$('mysteryFile').textContent=p.file;$('mysteryLink').href=p.file;toast('🎁 神祕作品已揭曉！')}$('drawBtn').addEventListener('click',drawProject);$('drawAgain').addEventListener('click',drawProject);$('mysteryLink').addEventListener('click',function(){recordExplore(this.getAttribute('href'))});
const questionBank=[
['HTML 主要負責網頁的哪個部分？',['網頁結構','動畫速度','伺服器設定','資料庫管理'],0,'HTML 建立網頁內容結構。'],
['CSS 主要用來控制什麼？',['資料庫','網頁樣式','網域名稱','伺服器硬體'],1,'CSS 控制顏色、字體與排版。'],
['JavaScript 最常用來增加網頁的什麼功能？',['網路線路','硬碟容量','互動功能','網域註冊'],2,'JavaScript 可處理按鈕與表單互動。'],
['HTML 中建立超連結應使用哪個標籤？',['<div>','<p>','<span>','<a>'],3,'a 標籤搭配 href 建立連結。'],
['HTML 中顯示圖片常用哪個標籤？',['<img>','<image>','<photo>','<picturebox>'],0,'img 標籤使用 src 指定圖片。'],
['CSS 中設定文字顏色使用哪個屬性？',['background','color','font-size','border'],1,'color 設定文字顏色。'],
['CSS 中設定背景顏色使用哪個屬性？',['font-color','text-color','background-color','opacity'],2,'background-color 設定背景顏色。'],
['CSS 中設定字體大小使用哪個屬性？',['font-weight','line-height','font-family','font-size'],3,'font-size 控制文字大小。'],
['哪個 CSS 宣告能啟用 Flexbox 排版？',['display:flex','display:block','display:inline','display:none'],0,'display:flex 啟用 Flexbox。'],
['哪個 CSS 宣告能啟用 Grid 排版？',['display:table','display:grid','display:inline','display:list-item'],1,'display:grid 啟用網格排版。'],
['RWD 的主要目的是什麼？',['增加檔案大小','限制手機使用','適應不同螢幕','取消網頁圖片'],2,'RWD 適應手機、平板和電腦。'],
['CSS 常用哪個規則撰寫響應式斷點？',['@import','@font-face','@keyframes','@media'],3,'@media 依螢幕條件套用樣式。'],
['JavaScript 宣告可重新指定值的區域變數常用哪個關鍵字？',['let','const','static','define'],0,'let 宣告的變數可重新賦值。'],
['哪個關鍵字不允許重新指定變數綁定？',['var','const','let','new'],1,'const 不可重新賦值。'],
['JavaScript 的 === 主要表示什麼？',['指定值','只比較型別','嚴格相等比較','字串相加'],2,'=== 比較值與型別。'],
['JavaScript 陣列的第一個索引是多少？',['1','-1','2','0'],3,'陣列索引從 0 開始。'],
['哪個方法可依 ID 取得 HTML 元素？',['document.getElementById()','document.createElement()','document.write()','document.querySelectorAll()'],0,'getElementById 取得指定 ID 元素。'],
['監聽按鈕點擊事件常用哪個方法？',['setAttribute()','addEventListener()','parseInt()','toUpperCase()'],1,'addEventListener 可監聽事件。'],
['localStorage 主要用來做什麼？',['修改網域','建立伺服器','在瀏覽器儲存資料','壓縮圖片'],2,'localStorage 可保存主題偏好。'],
['JSON.stringify() 的主要功能是什麼？',['刪除資料','建立 CSS','重新載入網頁','轉成 JSON 字串'],3,'JSON.stringify 轉成 JSON 字串。'],
['CSS 設定元素圓角使用哪個屬性？',['border-radius','border-width','outline','margin'],0,'border-radius 設定圓角。'],
['CSS 設定元素外距使用哪個屬性？',['padding','margin','gap','height'],1,'margin 是外距。'],
['HTML 密碼欄位常用哪個 input type？',['text','email','password','number'],2,'type=password 會遮蔽輸入內容。'],
['哪個屬性可提供圖片替代文字？',['href','title','target','alt'],3,'alt 提供圖片替代文字。'],
['Math.random() 回傳哪個範圍的數值？',['0 以上且小於 1','1 到 10 的整數','0 到 100 的整數','只有 0 或 1'],0,'Math.random 回傳 0 到小於 1 的數。'],
['哪個方法可在陣列尾端加入元素？',['pop()','push()','shift()','slice()'],1,'push 將元素加入陣列尾端。'],
['CSS 的 z-index 主要影響什麼？',['字體大小','元素寬度','堆疊順序','圖片解析度'],2,'z-index 影響堆疊層級。'],
['哪個方法可解析 JSON 字串？',['JSON.stringify()','String()','Number()','JSON.parse()'],3,'JSON.parse 解析 JSON 字串。'],
['CSS 哪個屬性可控制不透明度？',['opacity','overflow','position','display'],0,'opacity 控制不透明度。'],
['哪個方法可取消表單預設送出行為？',['stopTimer()','preventDefault()','reload()','clearInterval()'],1,'preventDefault 可取消預設行為。']
];
let quizList=[],quizIndex=0,quizScore=0,quizTime=120,quizTimer=null,quizAnswered=false,quizRunning=false;
function endQuiz(timedOut=false){if(!quizRunning)return;quizRunning=false;clearInterval(quizTimer);$('quizGame').hidden=true;$('quizEnd').hidden=false;$('finalScore').textContent=`最終得分：${quizScore} / 100`;$('finalTitle').textContent=quizScore===100?'🏆 前端工程師王者！':quizScore>=80?'🚀 前端高手！':quizScore>=60?'💻 前端探索者！':'🌱 前端新手冒險家！';$('finalMessage').textContent=timedOut?'時間到！歡迎重新挑戰。':'挑戰完成！可以再玩一次，題目會重新隨機抽選。';if(quizScore===100)celebrate()}
function showQuestion(){quizAnswered=false;const [q,answers]=quizList[quizIndex];$('quizNumber').textContent=`第 ${quizIndex+1} / 10 題`;$('quizScore').textContent=`得分：${quizScore}`;$('quizBar').style.width=quizIndex*10+'%';$('questionText').textContent=q;$('quizOptions').replaceChildren();$('quizFeedback').hidden=true;$('nextQuestion').hidden=true;answers.forEach((answer,i)=>{const b=document.createElement('button');b.className='option';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.addEventListener('click',()=>chooseAnswer(i));$('quizOptions').appendChild(b)})}
function chooseAnswer(index){if(!quizRunning||quizAnswered)return;quizAnswered=true;const [, ,correct,explain]=quizList[quizIndex];if(index===correct)quizScore+=10;$('quizScore').textContent=`得分：${quizScore}`;Array.from($('quizOptions').children).forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add('correct');else if(i===index)b.classList.add('wrong')});$('quizFeedback').textContent=(index===correct?'✅ 答對了！':'❌ 答錯了！')+' '+explain;$('quizFeedback').hidden=false;$('nextQuestion').textContent=quizIndex===9?'查看成績':'下一題 →';$('nextQuestion').hidden=false}
function startQuiz(){clearInterval(quizTimer);quizList=shuffle(questionBank).slice(0,10);quizIndex=0;quizScore=0;quizTime=120;quizRunning=true;$('quizStart').hidden=true;$('quizEnd').hidden=true;$('quizGame').hidden=false;$('quizTimer').textContent='⏱️ 120 秒';showQuestion();quizTimer=setInterval(()=>{quizTime--;$('quizTimer').textContent=`⏱️ ${quizTime} 秒`;if(quizTime<=0)endQuiz(true)},1000)}
$('startQuiz').addEventListener('click',startQuiz);$('restartQuiz').addEventListener('click',startQuiz);$('quitQuiz').addEventListener('click',()=>endQuiz());$('nextQuestion').addEventListener('click',()=>{if(!quizAnswered)return;quizIndex++;if(quizIndex>=10)endQuiz();else showQuestion()});
// 四合一闖關
let stage=0,labToken=0,energyTimer=null;const stageIds=['passwordStage','bugStage','memoryStage','energyStage'];
function hideStages(){stageIds.forEach(id=>$(id).hidden=true);$('labWelcome').hidden=true;$('labComplete').hidden=true}
function updateLab(){ $('labBar').style.width=stage/4*100+'%';$('labProgress').textContent=`已完成 ${stage} / 4 關`;for(let i=0;i<4;i++){$('stageCard'+i).classList.toggle('done',i<stage);$('stageCard'+i).classList.toggle('active',i===stage);$('stageStatus'+i).textContent=i<stage?'✅ 已完成':i===stage?'進行中':'🔒 未解鎖'}}
function showStage(){hideStages();updateLab();if(stage===4){$('labComplete').hidden=false;save('portfolio-lab-complete','yes');toast('🏆 科技實驗室全部通關！');celebrate();return}$(stageIds[stage]).hidden=false;if(stage===0)generatePassword();if(stage===1)showBug();if(stage===2)prepareMemory();if(stage===3)prepareEnergy()}
function nextStage(){stage++;labToken++;clearInterval(energyTimer);showStage()}
function startLab(){labToken++;clearInterval(energyTimer);stage=0;bugIndex=0;showStage()}
$('startLab').addEventListener('click',startLab);$('restartLab').addEventListener('click',startLab);updateLab();
// 第一關：隨機題型、四位不重複密碼、五次猜測與位置提示
let secretPassword='',passwordAttempts=0,passwordLocked=false;
function generatePassword(){passwordAttempts=0;passwordLocked=false;const digits=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,4);secretPassword=digits.join('');const type=Math.floor(Math.random()*3);let clues=[];if(type===0){clues=digits.map((n,i)=>{const add=Math.floor(Math.random()*5)+2;return `第 ${i+1} 位：${n+add} − ${add} = ?`})}else if(type===1){clues=digits.map((n,i)=>`第 ${i+1} 位：${n+2}、${n+1}、?（每次減 1）`)}else{clues=digits.map((n,i)=>`第 ${i+1} 位：比 ${n+3} 小 3`)}$('passwordClue').textContent=['🧮 數學運算','🔢 數字規律','🕵️ 線索推理'][type]+'\n'+clues.join('\n')+'\n四個數字不重複，第一位也可能是 0。';$('passwordAttempts').textContent='剩餘 5 次機會';$('passwordInput').value='';$('passwordInput').disabled=false;$('passwordSubmit').disabled=false;$('passwordFeedback').hidden=false;$('passwordFeedback').textContent='🔐 新密碼已產生，開始破解！';$('guessHistory').replaceChildren()}
$('newPassword').addEventListener('click',generatePassword);
$('passwordForm').addEventListener('submit',e=>{e.preventDefault();if(passwordLocked)return;const value=$('passwordInput').value.trim();if(!/^\d{4}$/.test(value)){$('passwordFeedback').hidden=false;$('passwordFeedback').textContent='⚠️ 請輸入恰好四位數字。';return}if(new Set(value).size!==4){$('passwordFeedback').textContent='⚠️ 四位數字不可重複。';return}passwordAttempts++;if(value===secretPassword){passwordLocked=true;$('passwordFeedback').textContent='🎉 密碼破解成功！準備進入第二關。';nextStage();return}let exact=0;for(let i=0;i<4;i++)if(value[i]===secretPassword[i])exact++;const total=[...value].filter(n=>secretPassword.includes(n)).length;const remaining=5-passwordAttempts;const result=`${value}：${exact} 位數字與位置都正確，${total-exact} 位數字正確但位置錯誤`;const history=document.createElement('div');history.textContent=result;$('guessHistory').prepend(history);$('passwordAttempts').textContent=`剩餘 ${remaining} 次機會`;$('passwordInput').value='';if(remaining===0){passwordLocked=true;$('passwordFeedback').textContent=`❌ 五次機會用完！本局密碼是 ${secretPassword}。點「換一題」重新挑戰。`;$('passwordInput').disabled=true;$('passwordSubmit').disabled=true}else{$('passwordFeedback').textContent='🔎 '+result+'。請再試一次！'}});
// 第二關：BUG 修復
const bugs=[{code:'<h1>歡迎來到我的網站</h2>',options:['將結尾改成 </h1>','將開頭改成 <p>','刪除結尾標籤','將結尾改成 </div>'],answer:0,explain:'HTML 標籤開頭與結尾應配對。'},{code:'body { background-color: #ffffff',options:['把 body 改成 html','在最後補上 ; }','把 background-color 改成 color','刪除大括號'],answer:1,explain:'這段 CSS 缺少規則區塊的結尾。'},{code:"const button = document.getElementById('start');\nbutton.addEventListener('clik', run);",options:['把 const 改成 let','把 run 改成字串','把 clik 改成 click','把 getElementById 改成 alert'],answer:2,explain:'點擊事件名稱是 click。'}];let bugIndex=0,bugAnswered=false;
function showBug(){bugAnswered=false;const bug=bugs[bugIndex];$('bugCount').textContent=`BUG ${bugIndex+1} / ${bugs.length}`;$('bugCode').textContent=bug.code;$('bugOptions').replaceChildren();$('bugFeedback').hidden=true;$('nextBug').hidden=true;bug.options.forEach((option,i)=>{const b=document.createElement('button');b.className='option';b.textContent=option;b.addEventListener('click',()=>answerBug(i));$('bugOptions').appendChild(b)})}
function answerBug(index){if(bugAnswered)return;bugAnswered=true;const bug=bugs[bugIndex],correct=index===bug.answer;Array.from($('bugOptions').children).forEach((b,i)=>{b.disabled=true;if(i===bug.answer)b.classList.add('correct');else if(i===index)b.classList.add('wrong')});$('bugFeedback').hidden=false;$('bugFeedback').textContent=(correct?'✅ 修復成功！':'❌ 修復失敗！')+' '+bug.explain;$('nextBug').hidden=false;$('nextBug').textContent=correct?(bugIndex===bugs.length-1?'完成 BUG 關卡':'下一個 BUG →'):'重新挑戰這題';$('nextBug').dataset.correct=String(correct)}
$('nextBug').addEventListener('click',()=>{if($('nextBug').dataset.correct!=='true'){showBug();return}bugIndex++;if(bugIndex>=bugs.length){bugIndex=0;nextStage()}else showBug()});
// 第三關：記憶晶片
const symbols=['◆','●','▲','■'];let memorySequence=[],memoryInput=[],memoryRound=0,memoryReady=false;
function buildMemoryButtons(){ $('memoryGrid').replaceChildren();symbols.forEach((symbol,i)=>{const b=document.createElement('button');b.className='memory-btn';b.textContent=symbol;b.type='button';b.disabled=!memoryReady;b.addEventListener('click',()=>memoryClick(i));$('memoryGrid').appendChild(b)})}
function prepareMemory(){memoryRound=0;memorySequence=[];memoryReady=false;$('memoryRound').textContent='完成 3 回合即可通關';$('memoryStatus').textContent='按下開始，觀察發亮的晶片。';$('startMemory').hidden=false;$('startMemory').textContent='開始記憶挑戰';buildMemoryButtons()}
async function playMemory(){const token=++labToken;memoryReady=false;memoryInput=[];$('startMemory').hidden=true;$('memoryRound').textContent=`第 ${memoryRound} / 3 回合`;$('memoryStatus').textContent='請觀察亮起順序...';buildMemoryButtons();await sleep(500);if(token!==labToken||stage!==2)return;for(const index of memorySequence){const b=$('memoryGrid').children[index];b.classList.add('flash');await sleep(650);if(token!==labToken||stage!==2)return;b.classList.remove('flash');await sleep(250);if(token!==labToken||stage!==2)return}memoryReady=true;$('memoryStatus').textContent='現在依照剛才順序點擊晶片！';Array.from($('memoryGrid').children).forEach(b=>b.disabled=false)}
function newMemoryRound(){memoryRound++;memorySequence.push(Math.floor(Math.random()*4));playMemory()}
$('startMemory').addEventListener('click',()=>{memoryRound=0;memorySequence=[];newMemoryRound()});
function memoryClick(index){if(!memoryReady)return;memoryInput.push(index);if(index!==memorySequence[memoryInput.length-1]){memoryReady=false;$('memoryStatus').textContent='❌ 順序錯誤！請重新挑戰。';$('startMemory').hidden=false;$('startMemory').textContent='重新開始記憶挑戰';Array.from($('memoryGrid').children).forEach(b=>b.disabled=true);return}if(memoryInput.length===memorySequence.length){memoryReady=false;Array.from($('memoryGrid').children).forEach(b=>b.disabled=true);if(memoryRound===3){$('memoryStatus').textContent='✅ 記憶晶片修復完成！';nextStage()}else{$('memoryStatus').textContent='✅ 本回合成功！準備下一回合...';const token=labToken;setTimeout(()=>{if(token===labToken&&stage===2)newMemoryRound()},900)}}}
// 第四關：能量核心
let energyNext=1,energySeconds=30,energyRunning=false;
function prepareEnergy(){clearInterval(energyTimer);energyRunning=false;energyNext=1;energySeconds=30;$('energyCount').textContent='已啟動 0 / 9';$('energyTimer').textContent='剩餘 30 秒';$('energyStatus').textContent='準備好後按下啟動挑戰。';$('startEnergy').hidden=false;$('startEnergy').textContent='⚡ 啟動挑戰';$('energyGrid').replaceChildren()}
function startEnergy(){clearInterval(energyTimer);energyNext=1;energySeconds=30;energyRunning=true;$('energyCount').textContent='已啟動 0 / 9';$('energyTimer').textContent='剩餘 30 秒';$('energyStatus').textContent='請依照 1 到 9 的順序點擊！';$('startEnergy').hidden=true;$('energyGrid').replaceChildren();shuffle([1,2,3,4,5,6,7,8,9]).forEach(number=>{const b=document.createElement('button');b.className='energy-btn';b.textContent=number;b.addEventListener('click',()=>energyClick(number,b));$('energyGrid').appendChild(b)});energyTimer=setInterval(()=>{energySeconds--;$('energyTimer').textContent=`剩餘 ${energySeconds} 秒`;if(energySeconds<=0){clearInterval(energyTimer);energyRunning=false;$('energyStatus').textContent='⏰ 時間到！請重新挑戰。';$('startEnergy').hidden=false;$('startEnergy').textContent='重新挑戰';Array.from($('energyGrid').children).forEach(b=>b.disabled=true)}},1000)}
function energyClick(number,button){if(!energyRunning)return;if(number!==energyNext){button.classList.add('error');setTimeout(()=>button.classList.remove('error'),350);$('energyStatus').textContent=`❌ 順序錯誤，下一個應該點 ${energyNext}`;return}button.classList.add('active');button.disabled=true;energyNext++;$('energyCount').textContent=`已啟動 ${energyNext-1} / 9`;$('energyStatus').textContent='✅ 能量節點啟動成功！';if(energyNext===10){clearInterval(energyTimer);energyRunning=false;nextStage()}}
$('startEnergy').addEventListener('click',startEnergy);
// 三連點彩蛋
let titleClicks=0,lastTitleClick=0;$('mainTitle').addEventListener('click',()=>{const now=Date.now();if(now-lastTitleClick>1200)titleClicks=0;titleClicks++;lastTitleClick=now;if(titleClicks>=3){titleClicks=0;toast('🎉 恭喜發現隱藏彩蛋！');celebrate()}});

// ===== 入場強制三關（每次重新整理都要挑戰） =====
const gatePages=['entryPassword','entryBug','entryMemory','entrySuccess'];
let gateStep=0, gateCode='',gateTries=0,gateBugList=[],gateBugIndex=0,gateBugCorrect=false;
let gateMemoryRound=0,gateMemoryPattern=[],gateMemoryInput=[],gateMemoryReady=false,gateMemoryToken=0;
const gateMain=[document.querySelector('.navbar'),document.querySelector('main'),document.querySelector('footer')];
gateMain.forEach(el=>{if(el)el.inert=true});
function gateShow(step){
    gateStep=step;
    gatePages.forEach((id,i)=>$(id).hidden=i!==step);
    [...$('entrySteps').children].forEach((el,i)=>{
        el.classList.toggle('finished',i<step);
        el.classList.toggle('current',i===step);
    });
    $('entryGate').scrollTop=0;
}
function gateNewCode(){
    gateTries=0;
    const digits=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,4);
    gateCode=digits.join('');
    $('entryClues').replaceChildren();
    digits.forEach((n,i)=>{
        const mode=Math.floor(Math.random()*3);
        let clue;
        if(mode===0){const add=2+Math.floor(Math.random()*7);clue=`${n+add} − ${add} = ?`}
        else if(mode===1){const add=1+Math.floor(Math.random()*5);clue=`${n} + ${add} − ${add} = ?`}
        else {const factor=2+Math.floor(Math.random()*3);clue=`(${n} × ${factor}) ÷ ${factor} = ?`}
        const item=document.createElement('div');
        item.textContent=`第 ${i+1} 位：${clue}`;
        $('entryClues').appendChild(item);
    });
    $('entryPasswordInput').value='';
    $('entryPasswordMessage').textContent='四位數字不重複，可能以 0 開頭。剩餘 5 次機會。';
}
$('entryNewPassword').addEventListener('click',gateNewCode);
$('entryPasswordForm').addEventListener('submit',e=>{
    e.preventDefault();
    const value=$('entryPasswordInput').value.trim();
    if(!/^\d{4}$/.test(value)||new Set(value).size!==4){
        $('entryPasswordMessage').textContent='請輸入四個不重複的數字。';return;
    }
    if(value===gateCode){
        gateStartBugs();return;
    }
    gateTries++;
    const remaining=5-gateTries;
    if(remaining===0){
        gateNewCode();
        $('entryPasswordMessage').textContent='五次機會用完，已產生新密碼與線索，請重新挑戰。';
    }else{
        const exact=[...value].filter((digit,i)=>digit===gateCode[i]).length;
        const total=[...value].filter(digit=>gateCode.includes(digit)).length;
        $('entryPasswordMessage').textContent=`${exact} 位數字及位置正確，${total-exact} 位數字正確但位置不對。剩餘 ${remaining} 次。`;
    }
    $('entryPasswordInput').value='';
});

// 每一局從 HTML、CSS、JavaScript 各抽一題，並隨機排列選項
const gateBugBank={
    HTML:[
        {code:'<h1>網站標題</h2>',answer:'將 </h2> 改成 </h1>',wrong:['改成 </div>','刪除 <h1>','加上 <br>']},
        {code:'<a herf="home.html">首頁</a>',answer:'將 herf 改成 href',wrong:['將 a 改成 p','將 home.html 改成 home.css','加上 alt']},
        {code:'<img scr="logo.png" alt="Logo">',answer:'將 scr 改成 src',wrong:['將 img 改成 a','將 alt 改成 href','加上 </img>']},
        {code:'<input type="emali">',answer:'將 emali 改成 email',wrong:['將 input 改成 form','加上 href','將 type 刪除']}
    ],
    CSS:[
        {code:'h1 { colr: blue; }',answer:'將 colr 改成 color',wrong:['將 h1 改成 p','將 blue 改成 bold','刪除分號']},
        {code:'.box { display: felx; }',answer:'將 felx 改成 flex',wrong:['將 .box 改成 #box','將 display 改成 position','刪除大括號']},
        {code:'p { font-szie: 20px; }',answer:'將 font-szie 改成 font-size',wrong:['將 px 改成 kg','將 p 改成 div','將 font-szie 改成 margin']},
        {code:'.card { border-raduis: 12px; }',answer:'將 border-raduis 改成 border-radius',wrong:['將 12px 改成 12%','將 card 改成 body','將 border-raduis 改成 padding']}
    ],
    JavaScript:[
        {code:"button.addEventListener('clik', start);",answer:'將 clik 改成 click',wrong:['將 start 改成字串','將 button 改成 window.location','將 addEventListener 改成 alert']},
        {code:"document.getElementByID('title')",answer:'將 getElementByID 改成 getElementById',wrong:['將 document 改成 console','將 title 改成 #title','將括號改成中括號']},
        {code:'const total = [1,2,3].lenght;',answer:'將 lenght 改成 length',wrong:['將 const 改成 function','將陣列改成物件','將 total 改成字串']},
        {code:'console.lgo("Hello");',answer:'將 lgo 改成 log',wrong:['將 console 改成 document','刪除引號','將 Hello 改成數字']}
    ]
};
function gateStartBugs(){
    gateBugList=shuffle(['HTML','CSS','JavaScript'].map(type=>{
        const item=shuffle(gateBugBank[type])[0];return {...item,type};
    }));
    gateBugIndex=0;gateShow(1);gateRenderBug();
}
function gateRenderBug(){
    gateBugCorrect=false;
    const bug=gateBugList[gateBugIndex];
    $('entryBugProgress').textContent=`第 ${gateBugIndex+1} / 3 題｜${bug.type}`;
    $('entryBugCode').textContent=bug.code;
    $('entryBugMessage').textContent='選出正確的修復方式。';
    $('entryBugNext').hidden=true;
    $('entryBugOptions').replaceChildren();
    shuffle([bug.answer,...bug.wrong]).forEach(answer=>{
        const b=document.createElement('button');b.className='option';b.textContent=answer;
        b.addEventListener('click',()=>{
            if(gateBugCorrect)return;
            if(answer===bug.answer){
                gateBugCorrect=true;b.classList.add('correct');
                $('entryBugMessage').textContent='✅ 修復成功！';
                $('entryBugNext').hidden=false;
                [...$('entryBugOptions').children].forEach(el=>el.disabled=true);
            }else{
                b.classList.add('wrong');b.disabled=true;
                $('entryBugMessage').textContent='❌ 再試一次，這題必須答對才能繼續。';
            }
        });
        $('entryBugOptions').appendChild(b);
    });
}
$('entryBugNext').addEventListener('click',()=>{
    if(!gateBugCorrect)return;
    gateBugIndex++;
    if(gateBugIndex===3){gateShow(2);gatePrepareMemory()}
    else gateRenderBug();
});

// 四個不同顏色的燈，三回合依序閃爍 4 / 5 / 6 次
function gatePrepareMemory(){
    gateMemoryToken++;
    gateMemoryRound=0;
    gateMemoryPattern=[];
    gateMemoryReady=false;
    $('entryMemoryStart').hidden=false;
    $('entryMemoryStart').textContent='開始記憶';
    $('entryMemoryRound').textContent='共三回合：4 → 5 → 6 次閃爍';
    $('entryMemoryMessage').textContent='按下開始後，仔細觀察四個燈。';
    gateRenderLights();
}
function gateRenderLights(){
    $('entryLights').replaceChildren();
    ['紅燈','綠燈','藍燈','黃燈'].forEach((name,i)=>{
        const b=document.createElement('button');b.className='entry-light';b.type='button';b.setAttribute('aria-label',name);b.disabled=!gateMemoryReady;
        b.addEventListener('click',()=>gateLightClick(i));$('entryLights').appendChild(b);
    });
}
async function gatePlayMemory(){
    const token=++gateMemoryToken;
    gateMemoryReady=false;gateMemoryInput=[];
    $('entryMemoryStart').hidden=true;
    $('entryMemoryRound').textContent=`第 ${gateMemoryRound} / 3 回合（${gateMemoryPattern.length} 次閃爍）`;
    $('entryMemoryMessage').textContent='觀察閃爍順序...';
    gateRenderLights();
    await sleep(550);
    if(token!==gateMemoryToken)return;
    for(const index of gateMemoryPattern){
        const light=$('entryLights').children[index];
        light.classList.add('lit');
        await sleep(620);
        if(token!==gateMemoryToken)return;
        light.classList.remove('lit');
        await sleep(270);
        if(token!==gateMemoryToken)return;
    }
    gateMemoryReady=true;
    [...$('entryLights').children].forEach(b=>b.disabled=false);
    $('entryMemoryMessage').textContent='請依照剛才順序點擊四個燈！';
}
function gateNextMemoryRound(){
    gateMemoryRound++;
    gateMemoryPattern=Array.from({length:gateMemoryRound+3},()=>Math.floor(Math.random()*4));
    gatePlayMemory();
}
$('entryMemoryStart').addEventListener('click',()=>{
    gateMemoryToken++;gateMemoryRound=0;gateNextMemoryRound();
});
function gateLightClick(index){
    if(!gateMemoryReady)return;
    gateMemoryInput.push(index);
    if(index!==gateMemoryPattern[gateMemoryInput.length-1]){
        gateMemoryReady=false;
        [...$('entryLights').children].forEach(b=>b.disabled=true);
        $('entryMemoryMessage').textContent='❌ 順序錯誤，從第一回合重新挑戰。';
        $('entryMemoryStart').textContent='重新挑戰記憶晶片';
        $('entryMemoryStart').hidden=false;
        return;
    }
    if(gateMemoryInput.length===gateMemoryPattern.length){
        gateMemoryReady=false;
        [...$('entryLights').children].forEach(b=>b.disabled=true);
        if(gateMemoryRound===3){
            gateShow(3);celebrate();
        }else{
            $('entryMemoryMessage').textContent='✅ 本回合成功，準備下一回合！';
            const token=gateMemoryToken;
            setTimeout(()=>{if(token===gateMemoryToken)gateNextMemoryRound()},850);
        }
    }
}
$('entryOpen').addEventListener('click',()=>{
    $('entryGate').hidden=true;
    document.body.classList.remove('gate-locked');
    gateMain.forEach(el=>{if(el)el.inert=false});
    window.scrollTo(0,0);
    $('drawBtn').focus();
});
gateNewCode();gateShow(0);

});
