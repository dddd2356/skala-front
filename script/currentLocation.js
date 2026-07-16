import { reverseGeocode } from './geocodingAPI.js';

const locationEl = document.querySelector('#currentLocation');

function showError(message) {
    locationEl.textContent = '📍 ' + message;
}

if (navigator.geolocation) {
    locationEl.textContent = '📍 위치 확인 중...';

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            const { latitude, longitude } = position.coords;
            const place = await reverseGeocode(latitude, longitude);

            if (place && (place.city || place.region)) {
                locationEl.textContent = '현재 위치: ' + [place.region, place.city].filter(Boolean).join(' ');
            } else {
                showError('지명을 찾을 수 없어요');
            }
        },
        function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showError('위치 권한이 꺼져있어요');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showError('위치를 찾을 수 없어요');
                    break;
                case error.TIMEOUT:
                    showError('위치 확인 시간 초과');
                    break;
                default:
                    showError('위치를 가져오지 못했어요');
            }
        }
    );
} else {
    showError('위치 기능 미지원');
}
