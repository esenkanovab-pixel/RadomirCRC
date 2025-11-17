//проверка номера
const phoneInput = document.querySelector('#phone_input');
const phoneButton = document.querySelector('#phone_button');
const phoneSpan = document.querySelector('#phone_result');


// проверка номера (поддержка нескольких блоков на странице)
const phoneForms = document.querySelectorAll('.form_phone');

// Регулярные выражения (более гибкие): допускают разные разделители и скобки
// Кыргызстан: +996 + 9 цифр (принимаем любые пробелы/тире/скобки между цифрами)
const kyrgyzRegex = /^\+996(?:[ \-\(\)]?\d){9}$/;
// Россия: +7 + 10 цифр (принимаем любые пробелы/тире/скобки между цифрами)
const russianRegex = /^\+7(?:[ \-\(\)]?\d){10}$/;

phoneForms.forEach(form => {
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const result = form.querySelector('.checker');

    if (!input || !button || !result) return;

    button.addEventListener('click', () => {
        const val = input.value.trim();
        // определяем по плейсхолдеру или по первому символу
        const isRussian = input.placeholder && input.placeholder.includes('+7');

        let ok = false;
        if (isRussian) {
            ok = russianRegex.test(val);
        } else {
            ok = kyrgyzRegex.test(val);
        }

        if (ok) {
            result.textContent = 'верно';
            result.style.color = 'green';
        } else {
            result.textContent = 'не верный';
            result.style.color = 'red';
        }
    });
});


//TAB SLIDER
const tabsContentCards = document.querySelectorAll('.tab_content_block');
const tabsItems = document.querySelectorAll('.tab_content_item');
const tabsItemsParents =  document.querySelector('.tab_content_items');


const hightTabsContentCards = () =>{
    tabsContentCards.forEach((tabsContentCard)=>{
        tabsContentCard.style.display = 'none'
    })
    tabsItems.forEach((tabItem)=>{
        tabItem.classList.remove('tab_content_item_active')
    })
}

const showTabsContentCards = (indexElement = 0)=>{
    tabsContentCards[indexElement].style.display = 'block';
    tabsItems[indexElement].classList.add('tab_content_item_active')
}

hightTabsContentCards();
showTabsContentCards();


tabsItemsParents.onclick = (event) => {
    if (event.target.classList.contains('tab_content_item')){
        tabsItems.forEach((tabItem, tabItemIndex)=>{
            if(event.target === tabItem){
                hightTabsContentCards()
                showTabsContentCards(tabItemIndex)
            }
        })
    }
}

let curretIndex = 0; // Первая вкладка
let intervalId; //Переменная для хранения интервала

//Ф-ция для автоматического переключения

const startAuthoSlider = ()=>{
    intervalId = setInterval(()=>{
        hightTabsContentCards();
        showTabsContentCards(curretIndex);
        curretIndex = (curretIndex +1) % tabsItems.length;
    }, 2000); // 2сек
}
//Запуск автослайдера
startAuthoSlider();

//Остановка слайдера при клике на вкладку

tabsItemsParents.onclick = (event) => {
    clearInterval(intervalId);
    if (event.target.classList.contains('tab_content_item')){
        tabsItems.forEach((tabItem, tabItemIndex) =>{
            if(event.target === tabItem){
                hightTabsContentCards();
                showTabsContentCards(tabItemIndex);
                curretIndex = tabItemIndex;
                startAuthoSlider();
            }
        })
    }
}

// Получаем input элементы
const somInput = document.querySelector('#som');
const usdInput = document.querySelector('#usd');
const eurInput = document.querySelector('#eur');

// INN elements (Kyrgyzstan)
const innInput = document.getElementById('inn_input');
const innButton = document.getElementById('inn_button');
const innResult = document.getElementById('inn_result');

// Флаг, чтобы предотвратить рекурсивные срабатывания при программном обновлении полей
let isConverting = false;

// Fixed rates (requested)
const USD_RATE = 87; // 1 USD = 87 SOM
const EUR_RATE = 101; // 1 EUR = 101 SOM

// Debug: убедимся, что элементы существуют
if (!somInput || !usdInput || !eurInput) {
    console.warn('Converter inputs missing:', { somInput, usdInput, eurInput });
} else {
    console.log('Converter inputs found:', { somInput, usdInput, eurInput });
}

// Status element (visible on page) to show conversion activity/errors
const converterStatus = document.getElementById('converter_status');
const setStatus = (text, color = 'var(--muted)') => {
    if (converterStatus) {
        converterStatus.textContent = text;
        converterStatus.style.color = color;
    }
};

const converter = (element, target1, target2, currentType) => {
    element.addEventListener('input', () => {
        // Visible feedback for user
        setStatus('Converting...');
        if (isConverting) return; // предотвращаем зацикливание
        isConverting = true;
        try {
            const value = parseFloat(element.value);

            if (!element.value || isNaN(value)) {
                target1.value = '';
                target2.value = '';
                const diffEl = document.getElementById('convert_diff');
                if (diffEl) diffEl.textContent = '';
                setStatus('Введите число', 'var(--muted)');
                return;
            }

            // Local computed values
            let somVal = null;
            let usdVal = null;
            let eurVal = null;

            switch(currentType) {
                case 'som':
                    somVal = value;
                    usdVal = somVal / USD_RATE;
                    eurVal = somVal / EUR_RATE;
                    target1.value = usdVal.toFixed(2);
                    target2.value = eurVal.toFixed(2);
                    break;
                case 'usd':
                    usdVal = value;
                    somVal = usdVal * USD_RATE;
                    eurVal = somVal / EUR_RATE;
                    target1.value = somVal.toFixed(2);
                    target2.value = eurVal.toFixed(2);
                    break;
                case 'eur':
                    eurVal = value;
                    somVal = eurVal * EUR_RATE;
                    usdVal = somVal / USD_RATE;
                    target1.value = somVal.toFixed(2);
                    target2.value = usdVal.toFixed(2);
                    break;
            }

            setStatus(`Rates: 1 USD = ${USD_RATE} сом, 1 EUR = ${EUR_RATE} сом`, 'var(--text)');

            // Обновляем блок с разницей между суммами (в сомах и эквивалентно в USD/EUR)
            const container = document.querySelector('.inner_converter');
            if (container) {
                let diffEl = document.getElementById('convert_diff');
                if (!diffEl) {
                    diffEl = document.createElement('div');
                    diffEl.id = 'convert_diff';
                    diffEl.style.marginTop = '12px';
                    diffEl.style.color = '#1e3a8a';
                    diffEl.style.fontWeight = '600';
                    container.appendChild(diffEl);
                }

                const aSom = parseFloat(somInput.value);
                const aUsd = parseFloat(usdInput.value);
                const aEur = parseFloat(eurInput.value);

                const valsInSom = [];
                if (!isNaN(aSom)) valsInSom.push(aSom);
                if (!isNaN(aUsd)) valsInSom.push(aUsd * USD_RATE);
                if (!isNaN(aEur)) valsInSom.push(aEur * EUR_RATE);

                if (valsInSom.length < 2) {
                    diffEl.textContent = '';
                } else {
                    const max = Math.max(...valsInSom);
                    const min = Math.min(...valsInSom);
                    const diffSom = (max - min);
                    const diffUsd = (diffSom / USD_RATE);
                    const diffEur = (diffSom / EUR_RATE);
                    diffEl.textContent = `Разница между суммами: ${diffSom.toFixed(2)} сом (~${diffUsd.toFixed(2)} USD, ~${diffEur.toFixed(2)} EUR)`;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            isConverting = false;
        }
    });
};

converter(somInput, usdInput, eurInput, 'som');
converter(usdInput, somInput, eurInput, 'usd');
converter(eurInput, somInput, usdInput, 'eur');


//Card Swicher
const card = document.querySelector('.card');
const btnPrev = document.querySelector('#btn-prev');
const btnNext = document.querySelector('#btn-next');

// Texts for the Card Switcher (circular)
const cardTexts = [
    'Welcome to the Card Switcher — use Next / Prev to browse.',
    'Tip: fields and examples are interactive on this page.',
    'You can put any text here: instructions, quotes, or notes.',
    'The cards loop: Next on last goes to first, Prev on first goes to last.',
    'Enjoy building interactive components with vanilla JavaScript!'
];

let cardIndex = 0;

function renderCard() {
    if (!card) return;
    const text = cardTexts[cardIndex];
    card.innerHTML = `
        <div class="card_inner">
            <p class="card_text">${text}</p>
            <div class="card_footer">${cardIndex + 1} / ${cardTexts.length}</div>
        </div>
    `;
}

function showNext() {
    cardIndex = (cardIndex + 1) % cardTexts.length;
    renderCard();
}

function showPrev() {
    cardIndex = (cardIndex - 1 + cardTexts.length) % cardTexts.length;
    renderCard();
}

if (btnNext) btnNext.addEventListener('click', showNext);
if (btnPrev) btnPrev.addEventListener('click', showPrev);

// initialize
renderCard();

// --- Weather lookup (Open-Meteo, no API key required) ---
const cityInput = document.querySelector('.cityName');
const cityOut = document.querySelector('.city');
const tempOut = document.querySelector('.temp');

let weatherTimeout = null;

async function fetchCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    return data.results[0];
}

async function fetchCurrentWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=ms`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather request failed');
    return await res.json();
}

async function lookupWeather(city) {
    if (!city || city.trim().length < 1) return;
    try {
        if (cityOut) cityOut.textContent = 'Поиск...';
        if (tempOut) tempOut.textContent = '';

        const coord = await fetchCoordinates(city);
        if (!coord) {
            if (cityOut) cityOut.textContent = 'Город не найден';
            return;
        }

        const weatherData = await fetchCurrentWeather(coord.latitude, coord.longitude);
        if (!weatherData || !weatherData.current_weather) {
            if (cityOut) cityOut.textContent = `${coord.name}, ${coord.country}`;
            if (tempOut) tempOut.textContent = 'Погода недоступна';
            return;
        }

        const cw = weatherData.current_weather;
        if (cityOut) cityOut.textContent = `${coord.name}, ${coord.country}`;
        if (tempOut) tempOut.textContent = `${cw.temperature.toFixed(1)}°C, wind ${cw.windspeed} m/s`;
    } catch (err) {
        console.error(err);
        if (cityOut) cityOut.textContent = 'Ошибка получения данных';
        if (tempOut) tempOut.textContent = '';
    }
}

if (cityInput) {
    // trigger on Enter
    cityInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            lookupWeather(cityInput.value);
        }
    });

    // optional: debounce on input (live search)
    cityInput.addEventListener('input', () => {
        if (weatherTimeout) clearTimeout(weatherTimeout);
        weatherTimeout = setTimeout(() => {
            lookupWeather(cityInput.value);
        }, 700);
    });
}

// --- INN (Кыргызстан) validation ---
// Простая валидация: убираем все не-цифры и проверяем длину (10 цифр)
function validateKyrgyzINN(value) {
    if (!value) return false;
    const digits = value.replace(/\D/g, '');
    return digits.length === 10;
}

if (innButton && innInput && innResult) {
    function checkInn() {
        const val = innInput.value.trim();
        if (validateKyrgyzINN(val)) {
            innResult.textContent = 'подвержден';
            innResult.style.color = 'green';
        } else {
            innResult.textContent = 'неправильно ввели данные';
            innResult.style.color = 'red';
        }
    }

    innButton.addEventListener('click', checkInn);
    innInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkInn();
    });
}

