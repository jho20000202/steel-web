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

        // 僅保留必要的 JS 行為控制，樣式由 CSS 處理
        // 移除所有 inline style，除了 JS 邏輯控制的 opacity/pointer-events (在下面 scroll 事件處理)

        backTopBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
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

        // 懸停效果由 CSS 處理
        /* 
        backTopBtn.addEventListener('mouseenter', () => { ... });
        backTopBtn.addEventListener('mouseleave', () => { ... });
        */

        // 點擊事件監聽
        backTopBtn.addEventListener('click', scrollToTop);
    }
})();
