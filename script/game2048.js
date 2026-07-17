(function () {
    var SIZE = 4;
    var TRANSITION_MS = 120;

    var nextId = 1;
    var tilesById = {};
    var grid = [];
    var score = 0;
    var isMoving = false;

    var openBtn = document.getElementById('open2048Btn');
    var closeBtn = document.getElementById('close2048Btn');
    var resetBtn = document.getElementById('reset2048Btn');
    var dialog = document.getElementById('dialog2048');
    var gridEl = document.getElementById('grid2048');
    var scoreEl = document.getElementById('score2048');
    var message = document.getElementById('msg2048');

    function setMessage(text, state) {
        message.textContent = text;
        message.className = 'game-msg' + (state ? ' ' + state : '');
    }

    function emptyGrid() {
        var g = [];
        for (var r = 0; r < SIZE; r++) {
            g.push([null, null, null, null]);
        }
        return g;
    }

    function emptyCells() {
        var cells = [];
        for (var r = 0; r < SIZE; r++) {
            for (var c = 0; c < SIZE; c++) {
                if (!grid[r][c]) cells.push([r, c]);
            }
        }
        return cells;
    }

    function tileEl(id) {
        return gridEl.querySelector('[data-id="' + id + '"]');
    }

    function createTileEl(tile) {
        var el = document.createElement('div');
        el.className = 'tile-2048';
        el.setAttribute('data-id', tile.id);
        el.style.left = (tile.col * 25) + '%';
        el.style.top = (tile.row * 25) + '%';

        var inner = document.createElement('div');
        inner.className = 'tile-2048-inner pop';
        inner.textContent = tile.value;
        inner.setAttribute('data-value', tile.value);

        el.appendChild(inner);
        gridEl.appendChild(el);
    }

    function spawnTile() {
        var cells = emptyCells();
        if (cells.length === 0) return;

        var pick = cells[Math.floor(Math.random() * cells.length)];
        var id = nextId++;
        var tile = { id: id, value: Math.random() < 0.9 ? 2 : 4, row: pick[0], col: pick[1] };

        tilesById[id] = tile;
        grid[pick[0]][pick[1]] = id;
        createTileEl(tile);
    }

    function renderBackgroundCells() {
        for (var r = 0; r < SIZE; r++) {
            for (var c = 0; c < SIZE; c++) {
                var cell = document.createElement('div');
                cell.className = 'cell-2048';
                cell.style.left = (c * 25) + '%';
                cell.style.top = (r * 25) + '%';

                var inner = document.createElement('div');
                inner.className = 'cell-2048-inner';

                cell.appendChild(inner);
                gridEl.appendChild(cell);
            }
        }
    }

    function newGame() {
        gridEl.innerHTML = '';
        tilesById = {};
        grid = emptyGrid();
        score = 0;
        nextId = 1;
        isMoving = false;
        scoreEl.textContent = score;
        setMessage('방향키로 타일을 움직여 2048을 만들어보세요!');
        renderBackgroundCells();
        spawnTile();
        spawnTile();
    }

    // direction별로 "목적지에 가까운 순서"대로 정렬된 좌표 라인들을 만든다
    function getLines(direction) {
        var lines = [];
        var i, order;

        if (direction === 'left' || direction === 'right') {
            order = direction === 'left' ? [0, 1, 2, 3] : [3, 2, 1, 0];
            for (i = 0; i < SIZE; i++) {
                lines.push(order.map(function (c) { return [i, c]; }));
            }
        } else {
            order = direction === 'up' ? [0, 1, 2, 3] : [3, 2, 1, 0];
            for (i = 0; i < SIZE; i++) {
                lines.push(order.map(function (r) { return [r, i]; }));
            }
        }

        return lines;
    }

    function move(direction) {
        var lines = getLines(direction);
        var changed = false;
        var removedIds = [];
        var mergedIds = [];

        lines.forEach(function (positions) {
            var lineTiles = positions
                .map(function (pos) {
                    var id = grid[pos[0]][pos[1]];
                    return id ? tilesById[id] : null;
                })
                .filter(function (t) { return t; });

            var compacted = [];
            var i = 0;
            while (i < lineTiles.length) {
                var current = lineTiles[i];
                var next = lineTiles[i + 1];
                if (next && next.value === current.value) {
                    compacted.push({ id: current.id, value: current.value * 2, removedId: next.id });
                    i += 2;
                } else {
                    compacted.push({ id: current.id, value: current.value, removedId: null });
                    i += 1;
                }
            }

            compacted.forEach(function (entry, slot) {
                var pos = positions[slot];
                var tile = tilesById[entry.id];

                if (tile.row !== pos[0] || tile.col !== pos[1] || entry.value !== tile.value) {
                    changed = true;
                }

                tile.row = pos[0];
                tile.col = pos[1];
                tile.value = entry.value;

                if (entry.removedId) {
                    var removedTile = tilesById[entry.removedId];
                    removedTile.row = pos[0];
                    removedTile.col = pos[1];
                    removedIds.push(entry.removedId);
                    mergedIds.push(entry.id);
                    score += entry.value;
                    changed = true;
                }
            });
        });

        grid = emptyGrid();
        Object.keys(tilesById).forEach(function (id) {
            if (removedIds.indexOf(Number(id)) === -1) {
                var t = tilesById[id];
                grid[t.row][t.col] = t.id;
            }
        });

        return { changed: changed, removedIds: removedIds, mergedIds: mergedIds };
    }

    function updatePositions() {
        Object.keys(tilesById).forEach(function (id) {
            var tile = tilesById[id];
            var el = tileEl(id);
            if (el) {
                el.style.left = (tile.col * 25) + '%';
                el.style.top = (tile.row * 25) + '%';
            }
        });
    }

    function finalizeMove(result) {
        // 1단계: 흡수될 타일까지 포함해서 목적지로 다 같이 슬라이드
        updatePositions();

        setTimeout(function () {
            // 2단계: 흡수된 타일 제거, 살아남은 타일 값 갱신 + 병합 펑 효과
            result.removedIds.forEach(function (id) {
                var el = tileEl(id);
                if (el) el.remove();
                delete tilesById[id];
            });

            result.mergedIds.forEach(function (id) {
                var tile = tilesById[id];
                var el = tileEl(id);
                if (!el) return;
                var inner = el.querySelector('.tile-2048-inner');
                inner.textContent = tile.value;
                inner.setAttribute('data-value', tile.value);
                inner.classList.remove('pop', 'merge-pop');
                void inner.offsetWidth; // 리플로우 강제 → 애니메이션 재시작
                inner.classList.add('merge-pop');
            });

            spawnTile();
            scoreEl.textContent = score;

            if (hasWon()) {
                setMessage('🎉 2048을 만들었습니다!', 'win');
            } else if (!hasMoves()) {
                setMessage('😢 더 이상 움직일 칸이 없어요. 게임 오버!', 'down');
            }

            isMoving = false;
        }, TRANSITION_MS);
    }

    function hasMoves() {
        if (emptyCells().length > 0) return true;

        for (var r = 0; r < SIZE; r++) {
            for (var c = 0; c < SIZE; c++) {
                var id = grid[r][c];
                if (!id) continue;
                var v = tilesById[id].value;
                var rightId = c + 1 < SIZE ? grid[r][c + 1] : null;
                var downId = r + 1 < SIZE ? grid[r + 1][c] : null;
                if (rightId && tilesById[rightId].value === v) return true;
                if (downId && tilesById[downId].value === v) return true;
            }
        }

        return false;
    }

    function hasWon() {
        return Object.keys(tilesById).some(function (id) {
            return tilesById[id].value === 2048;
        });
    }

    var KEY_TO_DIRECTION = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down'
    };

    function handleKey(e) {
        if (!dialog.open) return;

        var direction = KEY_TO_DIRECTION[e.key];
        if (!direction) return;

        e.preventDefault();

        if (isMoving) return;

        var result = move(direction);
        if (result.changed) {
            isMoving = true;
            finalizeMove(result);
        }
    }

    openBtn.addEventListener('click', function () {
        dialog.showModal();
        newGame();
    });

    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) {
            dialog.close();
        }
    });

    resetBtn.addEventListener('click', newGame);

    document.addEventListener('keydown', handleKey);
})();
