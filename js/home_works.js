const input = document.getElementById('gmail_input');
const button = document.getElementById('gmail_button');
const result = document.getElementById('gmail_result');

const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


button.addEventListener('click', ()=>{
    const value = input.value.trim();
    if (gmailRegExp.test(value)){
        result.textContent = 'Почта верна';
        result.style.color = 'green';
    }else{
         result.textContent = 'Почта не верна';
         result.style.color = 'red';
    }
});

// --- IIN (ИНН/ИИН) checker for second block ---
const iinInput = document.getElementById('iin_input');
const iinButton = document.getElementById('iin_button');
const iinResult = document.getElementById('iin_result');

function validateIIN(val) {
    if (!val) return false;
    const digits = val.replace(/\D/g, '');
    return digits.length === 10; // simple rule: exactly 10 digits
}

if (iinButton && iinInput && iinResult) {
    iinButton.addEventListener('click', () => {
        const raw = iinInput.value.trim();
        const digits = raw.replace(/\D/g, '');
        console.log('IIN check', { raw, digits });
        if (validateIIN(raw)) {
            iinResult.textContent = 'подтвержден';
            iinResult.style.color = 'green';
        } else {
            iinResult.textContent = 'неправильно ввели данные';
            iinResult.style.color = 'red';
        }
    });

    iinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') iinButton.click();
    });
} else {
    console.warn('IIN elements missing on this page', { iinInput, iinButton, iinResult });
}


//движение квадрата по квадрату
const parentBlock = document.querySelector('.parent_block')
const childBlock = document.querySelector('.child_block')

let x = 0
let y = 0

let directionX = 1;
let directionY = 0;

const speed = 3;


function move(){
    const maxWidth = parentBlock.offsetWidth - childBlock.offsetWidth
    const maxHeight = parentBlock.offsetHeight - childBlock.offsetHeight

    x+= directionX*speed
    y+= directionY*speed

    childBlock.style.left = x + 'px'
    childBlock.style.top = y + 'px'

    if (x>maxWidth && directionX === 1){
        directionX = 0
        directionY = 1
    }else if (y>=maxHeight && directionY===1){
        directionX = -1
        directionY = 0
    }else if (x<=0 && directionX === -1){
        directionX = 0;
        directionY = -1
    }else if (y<=0 && directionY === -1){
        directionX = 1
        directionY = 0
    }
    setTimeout(move, 10)
}
move()


//Секундомер
let milliseconds = 0;
let intervalId;
let running = false;

function updateTimer() {
    milliseconds++;
    
    // Рассчитываем минуты, секунды и миллисекунды
    const minutes = Math.floor(milliseconds / 6000); // 6000 = 60 сек * 100 десятых долей
    const seconds = Math.floor((milliseconds % 6000) / 100);
    const tenths = milliseconds % 100;
    
    // Обновляем все элементы
    document.getElementById('minutesS').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('secondsS').innerText = seconds.toString().padStart(2, '0');
    document.getElementById('ml-secondsS').innerText = tenths.toString().padStart(2, '0');
}

// Функция сброса таймера
function resetTimer() {
    milliseconds = 0;
    document.getElementById('minutesS').innerText = '00';
    document.getElementById('secondsS').innerText = '00';
    document.getElementById('ml-secondsS').innerText = '00';
    
    if (running) {
        clearInterval(intervalId);
        running = false;
    }
}

// Обработчики событий
document.getElementById('start').addEventListener('click', function() {
    if (!running) {
        intervalId = setInterval(updateTimer, 10); // 10ms = 0.01 секунды
        running = true;
    }
});

document.getElementById('stop').addEventListener('click', function() {
    if (running) {
        clearInterval(intervalId);
        running = false;
    }
});

document.getElementById('reset').addEventListener('click', resetTimer);