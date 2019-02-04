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
 * @param {Function} [params.onCancel] Вызывается при отмене анимации
 * @param {Function} [params.onEnd] Вызвается при окончании анимации
 * @param {number} [params.duration=1000] Длительность анимации в миллисекундах
 * @constructor
 */
function Animation(params) {
    if (params === undefined) {
        throw new Error("Missing required parameter");
    }

    const draw = params.draw;
    const onStart = params.onStart;
    const onCancel = params.onCancel;
    const onEnd = params.onEnd;
    const duration = params.duration || 1000;

    if (draw === undefined) {
        throw new Error("draw is undefined");
    }

    let playing = false;
    let canceled = false;

    /**
     * Запуск анимации
     */
    this.start = function () {
        playing = true;
        if (onStart !== undefined) {
            onStart();
        }

        const startTime = performance.now();
        let passed = 0;
        requestAnimationFrame(function a(time) {
            if (canceled) {
                return;
            }

            passed = time - startTime;
            if (passed > duration) {
                passed = duration;
            }

            draw(passed, duration);

            if (passed < duration) {
                requestAnimationFrame(a);
            } else if (onEnd !== undefined) {
                playing = false;
                onEnd();
            } else {
                playing = false;
            }
        });
    };

    /**
     * Отмена анимации
     */
    this.cancel = function () {
        if (playing) {
            canceled = true;
            onCancel();
        }
    };
}

/* Слайдер */
(function () {
    const autoScroll = true;
    const autoScrollTime = 10000;

    const slider = document.querySelector(".slider");
    const slidesContainer = slider.querySelector(".slider__slides-container");
    const controlsContainer = slider.querySelector(".slider__controls-container");

    const slides = slider.querySelectorAll(".slider__slide");
    let controls;

    let sliderWidth;
    let currentSlide = 0;
    let interval;

    let scrollX = 0;

    let totalMoveX = 0;
    let lastTouchX = -1;
    let touchId = -1;

    let currentAnimation;

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

        const newScrollX = -sliderWidth * slideNumber;
        scrollTo(newScrollX, true);

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
     * Устанавливает прокрутку слайдера на px
     * @param {number} px Пиксели
     * @param {boolean} [animate=false] Нужно ли анимировать прокрутку
     */
    function scrollTo(px, animate = false) {
        if (currentAnimation !== undefined) {
            currentAnimation.cancel();
        }

        if (animate) {
            const maxDuration = 1000;
            const diff = px - scrollX;
            let tmpScrollX = scrollX;

            let duration = Math.floor(Math.abs(diff)/sliderWidth * maxDuration);
            if (duration > maxDuration) {
                duration = maxDuration;
            }

            currentAnimation = new Animation({
                draw: function(passedTime, duration) {
                    tmpScrollX = scrollX + Math.floor(diff * passedTime/duration);
                    slidesContainer.style.transform = "translate(" + tmpScrollX + "px)";
                },
                onCancel: function () {
                    scrollX = tmpScrollX;
                },
                onEnd: function () {
                    scrollX = px;
                },
                duration: duration
            });

            currentAnimation.start();
        } else {
            scrollX = px;
            slidesContainer.style.transform = "translate(" + scrollX + "px)";
        }
    }

    /**
     * Увеличивает прокрутку слайдера на px
     * @param {number} px Пиксели
     * @param {boolean} [animate=false] Нужно ли анимировать прокрутку
     */
    function scrollBy(px, animate = false) {
        scrollTo(scrollX + px, animate);
    }

    /**
     * Обрабатывает нажатия по элементам управления слайдера
     * @param {MouseEvent} event
     */
    function controlClick(event) {
        const target = event.target;
        const slideId = Number(target.dataset.slideId);
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
        if (autoScroll) {
            interval = setInterval(nextSlide, autoScrollTime);
        }
    }

    /**
     * Обрабатывает событие touchstart
     * @param {TouchEvent} event
     */
    function touchStart (event) {
        pauseSlider();

        const touch = event.touches[0];
        touchId = touch.identifier;
        lastTouchX = touch.screenX;
    }

    /**
     * Обрабатывает событие touchmove
     * @param {TouchEvent} event
     */
    function touchMove(event) {
        const touch = event.touches[0];
        const moveX = (touch.screenX - lastTouchX);
        lastTouchX = touch.screenX;
        totalMoveX += moveX;

        scrollBy(Math.floor(moveX));
    }

    /**
     * Обрабатывает событие touchend
     * @param {TouchEvent} event
     */
    function touchEnd(event) {
        if (scrollX > 0 || scrollX < -sliderWidth * (slides.length - 1)) {
            setSlide(currentSlide)
        } else if (totalMoveX > sliderWidth/6) {
            prevSlide();
        } else if (totalMoveX < -sliderWidth/6) {
            nextSlide();
        } else {
            setSlide(currentSlide);
        }

        totalMoveX = 0;
        lastTouchX = -1;
        touchId = -1;

        resumeSlider();
    }

    /**
     * Устанавливает размеры слайдера и вложенных элеменов
     */
    function updateSizes() {
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

            const newScrollX = -sliderWidth * currentSlide;
            scrollTo(newScrollX);
        });
        updateSizes();

        if (autoScroll) {
            interval = setInterval(nextSlide, autoScrollTime);
        }
    }

    init();
})();