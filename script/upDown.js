(function () {
    var target = 0;
    var attempts = 0;

    var openBtn = document.getElementById('openGameBtn');
    var closeBtn = document.getElementById('closeGameBtn');
    var dialog = document.getElementById('gameDialog');
    var form = document.getElementById('gameForm');
    var input = document.getElementById('guessInput');
    var message = document.getElementById('gameMessage');
    var countEl = document.getElementById('attemptCount');
    var resetBtn = document.getElementById('resetBtn');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setMessage(text, state) {
        message.textContent = text;
        message.className = 'game-msg' + (state ? ' ' + state : '');
    }

    function newGame() {
        target = Math.floor(Math.random() * 50) + 1;
        attempts = 0;
        countEl.textContent = attempts;
        setMessage('1~50 사이의 숫자를 맞혀보세요!');
        input.value = '';
        input.disabled = false;
        submitBtn.disabled = false;
    }

    openBtn.addEventListener('click', function () {
        dialog.showModal();
        newGame();
        input.focus();
    });

    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    // 배경(::backdrop) 클릭 시 닫기 — 클릭 대상이 dialog 자기 자신일 때만 닫음
    // (자식 요소를 클릭/Enter로 트리거하면 target이 그 요소이므로 여기서 걸러짐)
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) {
            dialog.close();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var guess = Number(input.value);

        if (!input.value || guess < 1 || guess > 50) {
            setMessage('⚠️ 1~50 사이의 숫자를 입력해 주세요.');
            return;
        }

        attempts++;
        countEl.textContent = attempts;

        if (guess === target) {
            setMessage('🎉 정답입니다! ' + attempts + '번 만에 맞히셨어요!', 'win');
            input.disabled = true;
            submitBtn.disabled = true;
        } else if (guess > target) {
            setMessage('🔽 Down! 더 작은 숫자예요.', 'down');
        } else {
            setMessage('🔼 Up! 더 큰 숫자예요.', 'up');
        }

        input.value = '';
        input.focus();
    });

    resetBtn.addEventListener('click', newGame);
})();
