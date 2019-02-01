/**
 * @callback AnimationDrawCallback
 * @param {number} passedTime Время, прошедшее со старта анимации в миллисекундах
 * @param {number} duration Длительность анимации в миллисекундах
 */

/**
 * Анимация
 * @param {Object} params Параметры анимации
 * @param {AnimationDrawCallback} params.draw Функция, рисующая анимацию
 * @param {Function} [params.onStart] Вызывается при старте анимации
 * @param {Function} [params.onEnd] Вызвается при окончании анимации
 * @param {number} params.duration Длительность анимации в миллисекундах
 * @constructor
 */
function Animation(params) {
    let draw = params.draw;
    let onStart = params.onStart;
    let onEnd = params.onEnd;
    let duration = params.duration;

    if (draw === undefined) {
        throw new Error("draw is undefined");
    }

    /**
     * Запуск анимации
     */
    this.start = function () {
        if (onStart !== undefined) {
            onStart();
        }

        let startTime = performance.now();
        requestAnimationFrame(function a(time) {
            let passed = time - startTime;
            if (passed > duration) {
                passed = duration;
            }

            draw(passed, duration);

            if (passed < duration) {
                requestAnimationFrame(a);
            } else {
                if (onEnd !== undefined) {
                    onEnd();
                }
            }
        });
    }
}

/* Слайдер */
(function () {
    let slider = document.querySelector(".slider");
    let slidesContainer = slider.querySelector(".slider__slides-container");
    let controlsContainer = slider.querySelector(".slider__controls-container");

    let slides = slider.querySelectorAll(".slider__slide");
    let controls;

    let sliderWidth;
    let currentSlide = 0;
    let interval;

    let scrollX = 0;
    let moveX = 0;
    let touchId = -1;
    let lastTouchX = -1;

    // let currentAnimation;
    let autoScrollTime = 10000;

    /**
     * Установливает слайдер на слайд n
     * @param {number} slideNumber Номер слайда
     */
    function setSlide(slideNumber) {

        if (slideNumber >= slides.length) {
            slideNumber %= slides.length;
        } else if (slideNumber < 0) {
            slideNumber += slides.length;
        }

        let newScrollX = -sliderWidth * slideNumber;
        let diff = newScrollX - scrollX;
        console.log("%cscrollX: " + scrollX + "\nnewScrollX: " + newScrollX + "\ndiff: " + diff, "color: green;");

        new Animation({
            draw: function(passedTime, duration) {
                let translate = Math.floor(scrollX + diff * passedTime/duration);
                slidesContainer.style.transform = "translate(" + translate + "px)";
            },
            onEnd: function () {
                scrollX = newScrollX;
            },
            duration: 1000
        }).start();

        controls[currentSlide].classList.remove("slider__control_active");
        controls[slideNumber].classList.add("slider__control_active");

        currentSlide = slideNumber;
    }

    /**
     * Переключает слайдер на предыдущий слайд
     */
    function prevSlide() {
        setSlide(currentSlide - 1);
    }

    /**
     * Переключает слайдер на следующий слайд
     */
    function nextSlide() {
        setSlide(currentSlide + 1);
    }

    /**
     * Обрабатывает нажатия по элементам управления слайдера
     * @param {MouseEvent} event
     */
    function controlClick(event) {
        let target = event.target;
        let slideId = Number(target.dataset.slideId);
        setSlide(slideId);
    }

    /**
     * Приостанавливает автоматическую прокрутку слайдера
     */
    function pauseSlider() {
        clearInterval(interval)
    }

    /**
     * Возобновляет автоматическую прокрутку слайдера
     */
    function resumeSlider() {
        interval = setInterval(nextSlide, autoScrollTime);
    }

    /**
     * Обрабатывает событие touchstart
     * @param {TouchEvent} event
     */
    function touchStart (event) {
        pauseSlider();

        let touch = event.touches[0];
        touchId = touch.identifier;
        lastTouchX = touch.screenX;
    }

    /**
     * Обрабатывает событие touchmove
     * @param {TouchEvent} event
     */
    function touchMove(event) {
        let touch = event.touches[0];
        moveX += (touch.screenX - lastTouchX);
        lastTouchX = touch.screenX;

        slidesContainer.style.transform = "translate(" + (moveX + scrollX) + "px)";
    }

    /**
     * Обрабатывает событие touchend
     * @param {TouchEvent} event
     */
    function touchEnd(event) {
        touchId = -1;
        lastTouchX = -1;

        if (moveX !== 0) {
            let scrolled = -moveX;
            let slidesScrolled = Math.floor((scrolled + (sliderWidth/2)) / sliderWidth);

            scrollX += moveX;

            if (scrollX > 200) {
                setSlide(0);
            } else if (scrollX < -(sliderWidth * (slides.length-1) + 200)) {
                setSlide(slides.length - 1);
            } else {
                setSlide(currentSlide + slidesScrolled);
            }
        }

        moveX = 0;

        resumeSlider();
    }

    /**
     * Устанавливает размеры слайдера и вложенных элеменов
     */
    function updateSizes() {
        console.log("Update slider sizes");
        sliderWidth = slider.clientWidth;
        slidesContainer.style.width = (slides.length * sliderWidth) + "px";
        for (let i = 0; i < slides.length; i++) {
            let slide = slides[i];
            slide.style.width = sliderWidth + "px";
            slide.style.height = Math.floor(sliderWidth / 2) + "px";
        }
    }

    /**
     * Иниалицирует слайдер
     */
    function init() {
        for (let i = 0; i < slides.length; i++) {
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

        slider.addEventListener("touchstart", touchStart);
        slider.addEventListener("touchmove", touchMove);
        slider.addEventListener("touchend", touchEnd);
        slider.addEventListener("touchcancel", touchEnd);

        window.addEventListener("resize", function () {
            updateSizes();

            let scrollX = -sliderWidth * currentSlide;
            slidesContainer.style.transform = "translate(" + scrollX + "px)";
        });
        updateSizes();

        interval = setInterval(nextSlide, autoScrollTime);
    }

    init();
})();