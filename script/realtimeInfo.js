import { getLiveWeather } from './weatherAPI.js';
import { searchCity } from './geocodingAPI.js';

const STORAGE_KEY = 'customCities';

const citySelect = document.querySelector('#city-select');
const weatherBox = document.querySelector('#weather-box');
const removeCityBtn = document.querySelector('#removeCityBtn');
const addCityDialog = document.querySelector('#addCityDialog');
const closeAddCityBtn = document.querySelector('#closeAddCityBtn');
const searchForm = document.querySelector('#citySearchForm');
const searchInput = document.querySelector('#citySearchInput');
const resultsList = document.querySelector('#citySearchResults');
const addCityOptionEl = citySelect.querySelector('option[value="add-city"]');

let lastValidSelection = 'none';

function loadCustomCities() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCustomCities(cities) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

function addCityOption(city) {
    const option = document.createElement('option');
    option.value = city.latitude + ',' + city.longitude;
    option.textContent = city.name + (city.country ? ' (' + city.country + ')' : '');
    option.setAttribute('data-custom', 'true');
    citySelect.insertBefore(option, addCityOptionEl); // "도시 추가" 옵션은 항상 맨 아래 유지
    return option;
}

// 페이지 로드 시 저장돼있던 사용자 도시들을 select에 반영
loadCustomCities().forEach(addCityOption);

function updateRemoveButtonVisibility() {
    const selected = citySelect.options[citySelect.selectedIndex];
    removeCityBtn.style.display = selected && selected.hasAttribute('data-custom') ? 'block' : 'none';
}

async function fetchAndRenderWeather() {
    const selectedValue = citySelect.value;

    if (selectedValue === 'none') {
        weatherBox.innerHTML = '<p>도시를 선택하면 날씨 정보가 표시됩니다.</p>';
        return;
    }

    const coords = selectedValue.split(',');
    const cityName = citySelect.options[citySelect.selectedIndex].text;

    weatherBox.innerHTML = '<p>실시간 수신 중... 📡</p>';

    const weatherInfo = await getLiveWeather(coords[0], coords[1]);

    if (weatherInfo) {
        weatherBox.innerHTML = `
            <h4>${weatherInfo.conditionIcon} ${cityName} — ${weatherInfo.conditionLabel}</h4>
            <p>🌡️ 기온: ${weatherInfo.temp}°C (체감 ${weatherInfo.feelsLike}°C)</p>
            <p>💧 습도: ${weatherInfo.humidity}%</p>
            <p>💨 풍속: ${weatherInfo.windSpeed}km/h</p>
        `;
    } else {
        weatherBox.innerHTML = '<p>데이터를 불러오지 못했습니다.</p>';
    }
}

citySelect.addEventListener('change', function () {
    if (citySelect.value === 'add-city') {
        searchInput.value = '';
        resultsList.innerHTML = '';
        addCityDialog.showModal();
        searchInput.focus();
        return;
    }

    lastValidSelection = citySelect.value;
    updateRemoveButtonVisibility();
    fetchAndRenderWeather();
});

// "도시 추가" 선택을 취소(닫기/배경클릭/ESC 등 어떤 방식으로 닫히든)하면 이전 선택값으로 복귀
addCityDialog.addEventListener('close', function () {
    citySelect.value = lastValidSelection;
});

closeAddCityBtn.addEventListener('click', function () {
    addCityDialog.close();
});

addCityDialog.addEventListener('click', function (e) {
    if (e.target === addCityDialog) {
        addCityDialog.close();
    }
});

removeCityBtn.addEventListener('click', function () {
    const selected = citySelect.options[citySelect.selectedIndex];
    if (!selected || !selected.hasAttribute('data-custom')) return;

    const remaining = loadCustomCities().filter(function (city) {
        return (city.latitude + ',' + city.longitude) !== selected.value;
    });
    saveCustomCities(remaining);

    selected.remove();
    citySelect.value = 'none';
    lastValidSelection = 'none';
    updateRemoveButtonVisibility();
    fetchAndRenderWeather();
});

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    resultsList.innerHTML = '<li>검색 중...</li>';

    const results = await searchCity(query);

    resultsList.innerHTML = '';

    if (results.length === 0) {
        resultsList.innerHTML = '<li>검색 결과가 없어요.</li>';
        return;
    }

    results.forEach(function (city) {
        const li = document.createElement('li');

        const label = document.createElement('span');
        label.textContent = city.name + (city.admin1 ? ', ' + city.admin1 : '') + (city.country ? ' (' + city.country + ')' : '');

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'bag-remove';
        addBtn.textContent = '+ 추가';
        addBtn.addEventListener('click', function () {
            const cities = loadCustomCities();
            cities.push({
                name: city.name,
                country: city.country,
                latitude: city.latitude,
                longitude: city.longitude
            });
            saveCustomCities(cities);

            const option = addCityOption(city);
            citySelect.value = option.value;
            lastValidSelection = option.value;

            addCityDialog.close();
            updateRemoveButtonVisibility();
            fetchAndRenderWeather();
        });

        li.appendChild(label);
        li.appendChild(addBtn);
        resultsList.appendChild(li);
    });
});

updateRemoveButtonVisibility();
