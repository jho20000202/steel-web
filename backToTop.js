// 回到頂端按鈕通用功能
(function () {
    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 創建按鈕元素
        const backTopBtn = document.createElement('div');
        backTopBtn.id = 'backTopBtn';

        // 逐個設置樣式屬性，使用 setProperty 和 'important' 優先級
        backTopBtn.style.setProperty('position', 'fixed', 'important');
        backTopBtn.style.setProperty('right', '20px', 'important');
        backTopBtn.style.setProperty('bottom', '30px', 'important');
        backTopBtn.style.setProperty('width', '50px');
        backTopBtn.style.setProperty('height', '50px');
        backTopBtn.style.setProperty('border-radius', '50%');
        backTopBtn.style.setProperty('background', 'rgba(61, 123, 255, 0.8)');
        backTopBtn.style.setProperty('backdrop-filter', 'blur(6px)');
        backTopBtn.style.setProperty('display', 'flex');
        backTopBtn.style.setProperty('justify-content', 'center');
        backTopBtn.style.setProperty('align-items', 'center');
        backTopBtn.style.setProperty('cursor', 'pointer');
        backTopBtn.style.setProperty('z-index', '9999');
        backTopBtn.style.setProperty('opacity', '0');
        backTopBtn.style.setProperty('pointer-events', 'none');
        backTopBtn.style.setProperty('transition', 'all 0.3s ease');
        backTopBtn.style.setProperty('box-shadow', '0 4px 12px rgba(0,0,0,0.3)');

        backTopBtn.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #fff;">
                <path d="M12 4l-8 8h5v8h6v-8h5z"></path>
            </svg>
        `;

        // 添加到頁面
        document.body.appendChild(backTopBtn);

        // 判斷滾動目標
        let target = window;
        let getScrollTop = () => window.scrollY || document.documentElement.scrollTop;
        let scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        // 滾動事件監聽
        target.addEventListener('scroll', () => {
            if (getScrollTop() > 300) {
                backTopBtn.style.setProperty('opacity', '1');
                backTopBtn.style.setProperty('pointer-events', 'auto');
                backTopBtn.style.setProperty('transform', 'translateY(0)');
            } else {
                backTopBtn.style.setProperty('opacity', '0');
                backTopBtn.style.setProperty('pointer-events', 'none');
                backTopBtn.style.setProperty('transform', 'translateY(10px)');
            }
        });

        // 懸停效果
        backTopBtn.addEventListener('mouseenter', () => {
            backTopBtn.style.setProperty('background', 'rgba(61, 123, 255, 1)');
            backTopBtn.style.setProperty('transform', 'translateY(-2px)');
        });

        backTopBtn.addEventListener('mouseleave', () => {
            backTopBtn.style.setProperty('background', 'rgba(61, 123, 255, 0.8)');
            backTopBtn.style.setProperty('transform', 'translateY(0)');
        });

        // 點擊事件監聽
        backTopBtn.addEventListener('click', scrollToTop);
    }
})();
