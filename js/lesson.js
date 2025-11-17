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

// Флаг, чтобы предотвратить рекурсивные срабатывания при программном обновлении полей
let isConverting = false;

const converter = (element, target1, target2, currentType) => {
    element.addEventListener('input', async () => {
        if (isConverting) return; // предотвращаем зацикливание
        // Блокируем дальнейшие срабатывания пока идёт обновление
        isConverting = true;
        try {
            const response = await fetch('../data/converter.json');
            if (!response.ok) throw new Error('Не удалось загрузить данные');

            const data = await response.json();
            const value = parseFloat(element.value);

            if (!element.value || isNaN(value)) {
                target1.value = '';
                target2.value = '';
                // очистим разницу
                const diffEl = document.getElementById('convert_diff');
                if (diffEl) diffEl.textContent = '';
                return;
            }

            switch(currentType) {
                case 'som':
                    target1.value = (value / data.usd).toFixed(2);
                    target2.value = (value / data.eur).toFixed(2);
                    break;
                case 'usd':
                    target1.value = (value * data.usd).toFixed(2);
                    target2.value = ((value * data.usd) / data.eur).toFixed(2);
                    break;
                case 'eur':
                    target1.value = (value * data.eur).toFixed(2);
                    target2.value = ((value * data.eur) / data.usd).toFixed(2);
                    break;
            }

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

                const somVal = parseFloat(somInput.value);
                const usdVal = parseFloat(usdInput.value);
                const eurVal = parseFloat(eurInput.value);

                const valsInSom = [];
                if (!isNaN(somVal)) valsInSom.push(somVal);
                if (!isNaN(usdVal)) valsInSom.push(usdVal * data.usd);
                if (!isNaN(eurVal)) valsInSom.push(eurVal * data.eur);

                if (valsInSom.length < 2) {
                    diffEl.textContent = '';
                } else {
                    const max = Math.max(...valsInSom);
                    const min = Math.min(...valsInSom);
                    const diffSom = (max - min);
                    const diffUsd = (diffSom / data.usd);
                    const diffEur = (diffSom / data.eur);
                    diffEl.textContent = `Разница между суммами: ${diffSom.toFixed(2)} сом (~${diffUsd.toFixed(2)} USD, ~${diffEur.toFixed(2)} EUR)`;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Разблокируем после завершения обновления
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

let count = 1
const totalCards = 200

async function getCardData(cardNumber){
    try{

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${cardNumber}`);
        if(!response.ok){
            throw new Error('Error in server')
        }
        return await response.json()

    }catch (error){
        console.log('errrr data: ', error);
        return null;
        
    }
}

function updateCard(cardData){
    card.innerHTML = `
    <p>${cardData.title}</p>
    <p style='color: ${cardData.completed ? "green": "yellow"}'> ${cardData.completed}
    <span>${cardData.id}</span>
    `
}

