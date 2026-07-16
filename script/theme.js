(function () {
    var STORAGE_KEY = 'theme';
    var root = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }
    }

    // 이전에 저장해둔 선택이 있으면 페이지 로드 시 바로 적용 (버튼이 없는 페이지에서도 유지됨)
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        applyTheme(saved);
    }

    var toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) {
        return;
    }

    function isDarkNow() {
        var attr = root.getAttribute('data-theme');
        if (attr) {
            return attr === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateLabel() {
        toggleBtn.textContent = isDarkNow() ? '☀️' : '🌙';
    }

    toggleBtn.addEventListener('click', function () {
        var next = isDarkNow() ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        updateLabel();
    });

    updateLabel();
})();
