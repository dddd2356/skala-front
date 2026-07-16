(function () {
    var form = document.querySelector('form');
    var pwInput = document.getElementById('userPw');
    var pwConfirmInput = document.getElementById('userPwConfirm');
    var msgEl = document.getElementById('pwMatchMsg');

    function checkMatch() {
        if (!pwConfirmInput.value) {
            msgEl.textContent = '';
            msgEl.className = 'pw-match-msg';
            return true;
        }

        var isMatch = pwInput.value === pwConfirmInput.value;

        if (isMatch) {
            msgEl.textContent = '✅ 비밀번호가 일치합니다';
            msgEl.className = 'pw-match-msg match';
        } else {
            msgEl.textContent = '❌ 비밀번호가 일치하지 않습니다';
            msgEl.className = 'pw-match-msg mismatch';
        }

        return isMatch;
    }

    pwInput.addEventListener('input', checkMatch);
    pwConfirmInput.addEventListener('input', checkMatch);

    form.addEventListener('submit', function (e) {
        if (!checkMatch()) {
            e.preventDefault();
            pwConfirmInput.focus();
        }
    });
})();
