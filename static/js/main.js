/* Слайдер */
(function () {
    let slider = document.querySelector(".slider");
    let slidesContainer = slider.querySelector(".slider__slides-container");
    let controlsContainer = slider.querySelector(".slider__controls-container");

    let slides = slider.querySelectorAll(".slider__slide");
    let controls;

    let sliderWidth = slider.clientWidth;
    let currentSlide = 0;
    let interval;

    function setSlide(n) {
        // console.log("Было:", currentSlide, "Стало:", n);
        if (n === currentSlide) {
            return;
        }

        if (n >= slides.length) {
            n %= slides.length;
        } else if (n < 0) {
            n += slides.length;
        }

        let px = -sliderWidth * n + "px";
        slidesContainer.style.transform = "translate(" + px + ")";

        controls[currentSlide].classList.remove("slider__control_active");
        controls[n].classList.add("slider__control_active");

        currentSlide = n;
    }

    function prevSlide() {
        setSlide(currentSlide - 1);
    }

    function nextSlide() {
        setSlide(currentSlide + 1);
    }

    function controlClick(event) {
        let target = event.target;
        let slideId = Number(target.dataset.slideId);
        setSlide(slideId);
    }

    function pauseSlider(event) {
        console.log("STOP!");
        clearInterval(interval)
    }

    function resumeSlider(event) {
        console.log("Продолжаем");
        interval = setInterval(nextSlide, 5000);
    }

    slidesContainer.style.width = (slides.length * sliderWidth) + "px";
    for (let i = 0; i < slides.length; i++) {
        let slide = slides[i];
        slide.style.width = sliderWidth + "px";

        let control = document.createElement("span");
        control.className = "slider__control";
        control.dataset.slideId = i.toString();
        control.addEventListener("click", controlClick);
        controlsContainer.append(control);
    }

    controls = slider.querySelectorAll(".slider__control");
    controls[currentSlide].classList.add("slider__control_active");

    slider.querySelector(".slider__button_prev").addEventListener("click", prevSlide);
    slider.querySelector(".slider__button_next").addEventListener("click", nextSlide);

    slider.addEventListener("mouseenter", pauseSlider);
    slider.addEventListener("mouseleave", resumeSlider);

    interval = setInterval(nextSlide, 5000);
})();