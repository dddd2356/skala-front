// 도시 이름으로 위도/경도를 찾아주는 지오코딩 모듈 (weatherAPI.js와 같은 Open-Meteo 제공)
export async function searchCity(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=ko&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('지오코딩 서버 응답 불안정');

        const data = await response.json();
        if (!data.results) return [];

        return data.results.map(function (item) {
            return {
                name: item.name,
                country: item.country || '',
                admin1: item.admin1 || '',
                latitude: item.latitude,
                longitude: item.longitude
            };
        });
    } catch (error) {
        console.error('지오코딩 API 에러:', error);
        return [];
    }
}

// 좌표 → 지명 변환 (역지오코딩, BigDataCloud 무료 API, 키 불필요)
export async function reverseGeocode(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('역지오코딩 서버 응답 불안정');

        const data = await response.json();

        return {
            city: data.city || data.locality || '',
            region: data.principalSubdivision || ''
        };
    } catch (error) {
        console.error('역지오코딩 API 에러:', error);
        return null;
    }
}
