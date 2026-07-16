(function () {
    var subjects = ['HTML', 'CSS', 'JavaScript'];

    var openBtn = document.getElementById('openGradeBtn');
    var closeBtn = document.getElementById('closeGradeBtn');
    var dialog = document.getElementById('gradeDialog');
    var form = document.getElementById('gradeForm');
    var message = document.getElementById('gradeMessage');
    var resetBtn = document.getElementById('resetGradeBtn');
    var scoreInputs = [
        document.getElementById('scoreHtml'),
        document.getElementById('scoreCss'),
        document.getElementById('scoreJs')
    ];
    var submitBtn = form.querySelector('button[type="submit"]');

    function setMessage(text, state) {
        message.textContent = text;
        message.className = 'grade-msg' + (state ? ' ' + state : '');
    }

    function resetForm() {
        form.reset();
        setMessage('과목별 점수를 입력해 주세요 (0~100)');
        scoreInputs.forEach(function (input) {
            input.disabled = false;
        });
        submitBtn.disabled = false;
    }

    openBtn.addEventListener('click', function () {
        dialog.showModal();
        resetForm();
        scoreInputs[0].focus();
    });

    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) {
            dialog.close();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var scores = scoreInputs.map(function (input) {
            return Number(input.value);
        });

        var invalid = scores.some(function (score, i) {
            return !scoreInputs[i].value || isNaN(score) || score < 0 || score > 100;
        });

        if (invalid) {
            setMessage('⚠️ 0~100 사이의 점수를 모두 입력해 주세요.');
            return;
        }

        var total = scores.reduce(function (sum, score) {
            return sum + score;
        }, 0);
        var average = total / subjects.length;
        var pass = average >= 60;

        setMessage(
            '총점 ' + total + '점 · 평균 ' + average.toFixed(1) + '점 — ' +
            (pass ? '🎉 합격입니다!' : '❌ 불합격입니다.'),
            pass ? 'pass' : 'fail'
        );

        scoreInputs.forEach(function (input) {
            input.disabled = true;
        });
        submitBtn.disabled = true;
    });

    resetBtn.addEventListener('click', resetForm);
})();
