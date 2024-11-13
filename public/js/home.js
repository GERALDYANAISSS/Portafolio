let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide img');
const totalSlides = slides.length;

function showSlide(index) {
    const slideContainer = document.querySelector('.carousel-slide');
    slideContainer.style.transform = `translateX(-${index * 100}%)`;
}

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    showSlide(currentIndex);
}

// Desplazamiento automático cada 3 segundos
setInterval(() => {
    moveSlide(1);
}, 3000);
