// WMO 날씨 코드를 사람이 읽을 수 있는 상태(아이콘+설명)로 변환
const WEATHER_CODE_MAP = {
    0: { icon: '☀️', label: '맑음' },
    1: { icon: '🌤️', label: '대체로 맑음' },
    2: { icon: '⛅', label: '구름 조금' },
    3: { icon: '☁️', label: '흐림' },
    45: { icon: '🌫️', label: '안개' },
    48: { icon: '🌫️', label: '짙은 안개' },
    51: { icon: '🌦️', label: '이슬비' },
    53: { icon: '🌦️', label: '이슬비' },
    55: { icon: '🌦️', label: '강한 이슬비' },
    61: { icon: '🌧️', label: '비' },
    63: { icon: '🌧️', label: '비' },
    65: { icon: '🌧️', label: '강한 비' },
    71: { icon: '🌨️', label: '눈' },
    73: { icon: '🌨️', label: '눈' },
    75: { icon: '❄️', label: '강한 눈' },
    80: { icon: '🌦️', label: '소나기' },
    81: { icon: '🌦️', label: '소나기' },
    82: { icon: '⛈️', label: '강한 소나기' },
    95: { icon: '⛈️', label: '뇌우' },
    96: { icon: '⛈️', label: '우박 동반 뇌우' },
    99: { icon: '⛈️', label: '강한 우박 동반 뇌우' }
};

function describeWeatherCode(code) {
    return WEATHER_CODE_MAP[code] || { icon: '🌡️', label: '정보 없음' };
}

// 외부에서 가져다 쓸 수 있도록 export를 함수 맨 앞에 붙입니다.
export async function getLiveWeather(lat, lon) {
    const params = [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'weather_code',
        'wind_speed_10m'
    ].join(',');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${params}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("서버 응답 불안정");

        const data = await response.json();
        const condition = describeWeatherCode(data.current.weather_code);

        // 필요한 데이터만 깔끔한 객체로 패킹해서 리턴
        return {
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            conditionIcon: condition.icon,
            conditionLabel: condition.label
        };
    } catch (error) {
        console.error("API 모듈 에러:", error);
        return null; // 에러 시 빈 값 던지기
    }
}