(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.profile-toc a'));
    if (!links.length) return;

    var sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if (!sections.length) return;

    var THRESHOLD = 120; // 뷰포트 상단에서 이 위치에 가장 가까운 섹션을 "현재 보고 있는 섹션"으로 간주
    var suppressUntil = 0; // 클릭 직후 스크롤 계산이 활성 항목을 덮어쓰는 것을 잠깐 막기 위한 타임스탬프

    function setActive(id) {
        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    function computeActiveId() {
        var best = sections[0];
        var bestDistance = Infinity;

        sections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            var visible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!visible) return;

            var center = rect.top + rect.height / 2;
            var distance = Math.abs(center - THRESHOLD);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = section;
            }
        });

        return best.id;
    }

    function updateActive() {
        if (Date.now() < suppressUntil) return;
        setActive(computeActiveId());
    }

    links.forEach(function (link) {
        link.addEventListener('click', function () {
            setActive(link.getAttribute('href').slice(1));
            suppressUntil = Date.now() + 700; // smooth scroll 애니메이션이 끝날 때까지 계산 결과 무시
        });
    });

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateActive();
            ticking = false;
        });
    });

    updateActive();
})();
