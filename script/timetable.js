(function () {
    var tableEl = document.getElementById('timetableTable');
    if (!tableEl) return;

    var STORAGE_KEY = 'timetableClasses';

    var DAYS = [
        { key: 'mon', label: '월요일' },
        { key: 'tue', label: '화요일' },
        { key: 'wed', label: '수요일' },
        { key: 'thu', label: '목요일' },
        { key: 'fri', label: '금요일' }
    ];

    var SLOTS = [
        '09:00~10:00', '10:00~11:00', '11:00~12:00', '12:00~13:00',
        '13:00~14:00', '14:00~15:00', '15:00~16:00', '16:00~17:00', '17:00~18:00'
    ];
    var LUNCH_SLOT = 3;

    var DEFAULT_CLASSES = [
        { day: 'mon', start: 0, span: 3, label: 'Vue.js\n웹 프레임워크 🖥️' },
        { day: 'mon', start: 4, span: 4, label: 'UI/UX\n디자인 표준 🎨' },
        { day: 'mon', start: 8, span: 1, label: '취업 창업 특강 💼' },
        { day: 'tue', start: 0, span: 2, label: '네트워크\n보안 기초 🛡️' },
        { day: 'tue', start: 2, span: 1, label: '알고리즘 문제풀이 🧩' },
        { day: 'tue', start: 4, span: 2, label: '리눅스\n시스템 관리 🐧' },
        { day: 'tue', start: 6, span: 3, label: 'Git & GitHub\n버전 관리 🐙' },
        { day: 'wed', start: 0, span: 3, label: '웹 시스템\n설계 및 분석 🏗️' },
        { day: 'wed', start: 4, span: 2, label: '클라우드\nAWS 기초 ☁️' },
        { day: 'wed', start: 6, span: 3, label: '인공지능\n머신러닝 기초 🤖' },
        { day: 'thu', start: 0, span: 1, label: 'IT 트렌드 특강 📰' },
        { day: 'thu', start: 1, span: 2, label: '데이터베이스\nSQL 실습 🗄️' },
        { day: 'thu', start: 4, span: 3, label: '자료구조 📊' },
        { day: 'thu', start: 7, span: 2, label: '빅데이터\n분석 실무 📈' },
        { day: 'fri', start: 0, span: 3, label: '자바스크립트\n심화 실습 ⚡' },
        { day: 'fri', start: 4, span: 1, label: '개인프로젝트 💻' },
        { day: 'fri', start: 5, span: 3, label: '오픈소스\n소프트웨어 🌐' },
        { day: 'fri', start: 8, span: 1, label: '주간 회고 📝' }
    ];

    var editBtn = document.getElementById('editTimetableBtn');
    var resetBtn = document.getElementById('resetTimetableBtn');
    var msgEl = document.getElementById('timetableMsg');
    var tbody = document.getElementById('timetableBody');

    var dialog = document.getElementById('classEditDialog');
    var closeDialogBtn = document.getElementById('closeClassEditBtn');
    var dialogTitle = document.getElementById('classEditTitle');
    var dialogMsg = document.getElementById('classEditMsg');
    var form = document.getElementById('classEditForm');
    var daySelect = document.getElementById('classDaySelect');
    var startSelect = document.getElementById('classStartSelect');
    var spanSelect = document.getElementById('classSpanSelect');
    var labelInput = document.getElementById('classLabelInput');
    var deleteBtn = document.getElementById('deleteClassBtn');

    var classes = loadClasses();
    var editMode = false;
    var editingIndex = -1;

    function loadClasses() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return cloneDefault();
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return cloneDefault();
            return parsed;
        } catch (e) {
            return cloneDefault();
        }
    }

    function cloneDefault() {
        return DEFAULT_CLASSES.map(function (c) {
            return { day: c.day, start: c.start, span: c.span, label: c.label };
        });
    }

    function saveClasses() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function labelToHtml(label) {
        return label.split('\n').map(escapeHtml).join('<br>');
    }

    function buildGrid() {
        var grid = {};
        DAYS.forEach(function (d) {
            grid[d.key] = new Array(SLOTS.length).fill(null);
        });
        classes.forEach(function (cls, idx) {
            for (var s = cls.start; s < cls.start + cls.span; s++) {
                grid[cls.day][s] = idx;
            }
        });
        return grid;
    }

    function hasConflict(day, start, span, excludeIndex) {
        if (start < 0 || span < 1 || start + span > SLOTS.length) return true;
        for (var s = start; s < start + span; s++) {
            if (s === LUNCH_SLOT) return true;
        }
        return classes.some(function (c, i) {
            if (i === excludeIndex || c.day !== day) return false;
            return start < c.start + c.span && start + span > c.start;
        });
    }

    function render() {
        var grid = buildGrid();
        tbody.innerHTML = '';
        tableEl.classList.toggle('tt-editing', editMode);

        for (var r = 0; r < SLOTS.length; r++) {
            var tr = document.createElement('tr');
            var timeTd = document.createElement('td');
            timeTd.textContent = SLOTS[r];
            tr.appendChild(timeTd);

            if (r === LUNCH_SLOT) {
                var lunchTd = document.createElement('td');
                lunchTd.colSpan = DAYS.length;
                lunchTd.textContent = '🍽️ 점심시간 🍽️';
                tr.appendChild(lunchTd);
                tbody.appendChild(tr);
                continue;
            }

            DAYS.forEach(function (day) {
                var occupant = grid[day.key][r];

                if (occupant === null) {
                    var emptyTd = document.createElement('td');
                    emptyTd.className = 'tt-empty';
                    emptyTd.dataset.day = day.key;
                    emptyTd.dataset.start = r;
                    tr.appendChild(emptyTd);
                    return;
                }

                var cls = classes[occupant];
                if (cls.start !== r) return; // 이전 행의 rowspan에 이미 포함됨

                var classTd = document.createElement('td');
                classTd.rowSpan = cls.span;
                classTd.className = 'tt-class';
                classTd.dataset.index = occupant;
                classTd.innerHTML = labelToHtml(cls.label);
                tr.appendChild(classTd);
            });

            tbody.appendChild(tr);
        }
    }

    function populateSelects() {
        daySelect.innerHTML = DAYS.map(function (d) {
            return '<option value="' + d.key + '">' + d.label + '</option>';
        }).join('');

        startSelect.innerHTML = SLOTS.map(function (s, i) {
            if (i === LUNCH_SLOT) return '';
            return '<option value="' + i + '">' + s + '</option>';
        }).join('');

        spanSelect.innerHTML = '';
        for (var n = 1; n <= 5; n++) {
            var opt = document.createElement('option');
            opt.value = String(n);
            opt.textContent = n + '시간';
            spanSelect.appendChild(opt);
        }
    }

    function setDialogMsg(text) {
        dialogMsg.textContent = text || '';
    }

    function openDialogForNew(day, start) {
        editingIndex = -1;
        dialogTitle.textContent = '📚 과목 추가';
        deleteBtn.style.display = 'none';
        setDialogMsg('');
        daySelect.value = day;
        startSelect.value = String(start);
        spanSelect.value = '1';
        labelInput.value = '';
        dialog.showModal();
        labelInput.focus();
    }

    function openDialogForEdit(index) {
        var cls = classes[index];
        editingIndex = index;
        dialogTitle.textContent = '📚 과목 수정';
        deleteBtn.style.display = '';
        setDialogMsg('');
        daySelect.value = cls.day;
        startSelect.value = String(cls.start);
        spanSelect.value = String(cls.span);
        labelInput.value = cls.label;
        dialog.showModal();
        labelInput.focus();
    }

    tbody.addEventListener('click', function (e) {
        if (!editMode) return;

        var classTd = e.target.closest('.tt-class');
        if (classTd) {
            openDialogForEdit(Number(classTd.dataset.index));
            return;
        }

        var emptyTd = e.target.closest('.tt-empty');
        if (emptyTd) {
            openDialogForNew(emptyTd.dataset.day, Number(emptyTd.dataset.start));
        }
    });

    editBtn.addEventListener('click', function () {
        editMode = !editMode;
        editBtn.textContent = editMode ? '✅ 편집 완료' : '✏️ 시간표 편집';
        msgEl.textContent = editMode
            ? '편집 모드예요. 칸을 눌러 과목을 추가·수정하세요.'
            : '편집 버튼을 누르면 칸을 클릭해서 과목을 추가·수정·삭제할 수 있어요.';
        render();
    });

    resetBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        classes = cloneDefault();
        render();
        msgEl.textContent = '시간표를 기본값으로 초기화했어요.';
    });

    closeDialogBtn.addEventListener('click', function () {
        dialog.close();
    });

    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var day = daySelect.value;
        var start = Number(startSelect.value);
        var span = Number(spanSelect.value);
        var label = labelInput.value.trim();

        if (!label) {
            setDialogMsg('⚠️ 과목명을 입력해 주세요.');
            return;
        }

        if (hasConflict(day, start, span, editingIndex)) {
            setDialogMsg('⚠️ 다른 과목/점심시간과 겹치거나 시간표 범위를 벗어나요.');
            return;
        }

        var entry = { day: day, start: start, span: span, label: label };
        if (editingIndex === -1) {
            classes.push(entry);
        } else {
            classes[editingIndex] = entry;
        }

        saveClasses();
        render();
        dialog.close();
        msgEl.textContent = '저장했어요.';
    });

    deleteBtn.addEventListener('click', function () {
        if (editingIndex === -1) return;
        classes.splice(editingIndex, 1);
        saveClasses();
        render();
        dialog.close();
        msgEl.textContent = '과목을 삭제했어요.';
    });

    populateSelects();
    render();
})();
