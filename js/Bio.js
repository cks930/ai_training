"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化 WOW.js 動畫
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }

  // 2. Hero 背景輪播與點擊切換
  let currentIdx = 1;
  const totalBgs = 3;

  function switchBg(idx) {
    currentIdx = idx;
    for (let i = 1; i <= totalBgs; i++) {
      const bg = document.getElementById(`bg${i}`);
      if (bg) bg.classList.remove('active');
    }
    const targetBg = document.getElementById(`bg${idx}`);
    if (targetBg) targetBg.classList.add('active');

    const cards = document.querySelectorAll('.thumb-card');
    cards.forEach((card) => {
      const cardBgIndex = parseInt(card.getAttribute('data-bg'));
      if (cardBgIndex === idx) card.classList.add('active');
      else card.classList.remove('active');
    });
  }

  // 綁定縮圖點擊事件
  document.querySelectorAll('.thumb-card').forEach((card) => {
    card.addEventListener('click', function () {
      const bgIdx = parseInt(this.getAttribute('data-bg'));
      if (bgIdx) switchBg(bgIdx);
    });
  });

  // 自動輪播
  setInterval(() => {
    currentIdx = (currentIdx % totalBgs) + 1;
    switchBg(currentIdx);
  }, 5000);

  // 3. Counter-Up 動態數字
  const startCounter = () => {
    const counters = document.querySelectorAll('.counter01, .counter02, .counter03, .counter04');
    
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
          const el = entry.target;
          el.classList.add('is-visible');

          if (window.counterUp && window.counterUp.default) {
            window.counterUp.default(el, { duration: 2000, delay: 16 });
          } else {
            const target = parseInt(el.innerText, 10);
            let start = 0;
            const step = Math.ceil(target / 50);
            const timer = setInterval(() => {
              start += step;
              if (start >= target) {
                el.innerText = target;
                clearInterval(timer);
              } else {
                el.innerText = start;
              }
            }, 30);
          }
        }
      });
    };

    const IO = new IntersectionObserver(callback, { threshold: 0.2 });
    counters.forEach((el) => IO.observe(el));
  };

  startCounter();
});