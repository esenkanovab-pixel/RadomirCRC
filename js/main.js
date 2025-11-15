// COLOR BUTTONS

const buttonsColor = document.querySelectorAll('.btn-color')
const javaScript = document.querySelector('#js-color')
const colors = ['#136DB3', '#C477BF', '#F83710', '#905FCC']

buttonsColor.forEach((btn, index) => {
    if (colors[index]) {
        btn.style.backgroundColor = colors[index]
        btn.style.borderRadius = '50%'
        btn.style.width = '40px'
        btn.style.height = '40px'
        btn.style.border = 'none'
        btn.style.cursor = 'pointer'
        btn.style.transition = 'transform 0.2s ease'
        
        btn.onclick = () => {
            javaScript.style.color = colors[index]
        }
        
        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.1)'
        }
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)'
        }
    }
})

// SLIDER BLOCK

const slides = document.querySelectorAll('.slide')
const next = document.querySelector('#next')
const prev = document.querySelector('#prev')
let index = 0

const hideSlide = () => {
    slides.forEach((slide) => {
        slide.style.opacity = 0
        slide.classList.remove('active_slide')
    })
}
const showSlide = (i = 0) => {
    slides[i].style.opacity = 1
    slides[i].classList.add('active_slide')
}

hideSlide()
showSlide(index)


const autoSlider = (i = 0) => {
    setInterval(() => {
        i++
        if (i > slides.length - 1) {
            i = 0
        }
        hideSlide()
        showSlide(i)
    }, 10000)
}

next.onclick = () => {
    index < slides.length - 1 ? index++ : index = 0
    hideSlide()
    showSlide(index)
}

prev.onclick = () => {
    index > 0 ? index-- : index = slides.length - 1
    hideSlide()
    showSlide(index)
}

autoSlider(index)

// MODAL FUNCTIONALITY

const modal = document.querySelector('.modal')
const btnGet = document.querySelector('#btn-get')
const modalClose = document.querySelector('.modal_close')
const modalForm = document.querySelector('form[action="#"]')

if (btnGet && modal) {
    btnGet.addEventListener('click', (e) => {
        e.preventDefault()
        modal.classList.add('open')
        document.body.style.overflow = 'hidden'
    })
}

if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('open')
        document.body.style.overflow = ''
    })
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open')
            document.body.style.overflow = ''
        }
    })
}

if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
        modalForm.reset()
        modal.classList.remove('open')
        document.body.style.overflow = ''
    })
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        modal.classList.remove('open')
        document.body.style.overflow = ''
    }
})

// MOBILE MENU

const navToggle = document.querySelector('#nav_toggle')
const menu = document.querySelector('.menu')

if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
        menu.classList.toggle('open')
        navToggle.classList.toggle('active')
    })
    
    // Close menu when clicking on a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open')
            navToggle.classList.remove('active')
        })
    })
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header')) {
            menu.classList.remove('open')
            navToggle.classList.remove('active')
        }
    })
}
