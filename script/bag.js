(function () {
    var myBag = [
        { name: '여권 ✈️', count: 1 },
        { name: '스마트폰 📱', count: 2 },
        { name: '지갑 💳', count: 1 }
    ];

    var openBtn = document.getElementById('openBagBtn');
    var closeBtn = document.getElementById('closeBagBtn');
    var dialog = document.getElementById('bagDialog');
    var listEl = document.getElementById('bagList');
    var form = document.getElementById('bagForm');
    var nameInput = document.getElementById('bagItemName');
    var countInput = document.getElementById('bagItemCount');

    function renderBag() {
        listEl.innerHTML = '';

        if (myBag.length === 0) {
            var empty = document.createElement('li');
            empty.className = 'bag-empty';
            empty.textContent = '가방이 비어있어요.';
            listEl.appendChild(empty);
            return;
        }

        myBag.forEach(function (item, index) {
            var li = document.createElement('li');

            var label = document.createElement('span');
            label.textContent = item.name + ' : ' + item.count + '개';

            var removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'bag-remove';
            removeBtn.textContent = '✕';
            removeBtn.setAttribute('aria-label', item.name + ' 삭제');
            removeBtn.addEventListener('click', function () {
                myBag.splice(index, 1);
                renderBag();
            });

            li.appendChild(label);
            li.appendChild(removeBtn);
            listEl.appendChild(li);
        });
    }

    openBtn.addEventListener('click', function () {
        renderBag();
        dialog.showModal();
        nameInput.focus();
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

        var name = nameInput.value.trim();
        var count = Number(countInput.value);

        if (!name || !count || count < 1) {
            return;
        }

        var existing = myBag.find(function (item) {
            return item.name === name;
        });

        if (existing) {
            existing.count += count;
        } else {
            myBag.push({ name: name, count: count });
        }

        renderBag();
        form.reset();
        countInput.value = 1;
        nameInput.focus();
    });
})();
