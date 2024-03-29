/* Ввод */
let inputsManager = (function () {
    "use strict";

    let inputHasTextClass = "input__field_has-text";
    let inputIsListeningClass = "input__field_is-listening";
    let inputInvalidValueClass = "input__field_invalid-value";

    /**
     * Валидация значения поля
     * @param {HTMLInputElement} input
     * @return {boolean}
     */
    function isValidField(input) {
        if (input.value === "") {
            return true;
        }

        if (input.type === "number") {
            return isNaN(input.value);
        } else if (input.type === "tel") {
            let tel = input.value;
            tel = tel.replace(/\+|\s|-|\(|\)/g, "");
            return /^\d*$/.test(tel);
        }

        return true
    }

    /**
     * Обработка ввода текста в поле ввода (input)
     * @param event
     */
    function onInput(event) {
        let field = event.target;
        let text = field.value;

        if (text.length === 0) {
            field.classList.remove(inputHasTextClass);
        } else {
            field.classList.add(inputHasTextClass);
        }

        if (isValidField(field)) {
            field.classList.remove(inputInvalidValueClass);
        } else {
            field.classList.add(inputInvalidValueClass);
        }
    }

    function initInputs() {
        let inputs = document.querySelectorAll(`.input:not(${inputIsListeningClass})`);
        for (let i = 0, inputsLength = inputs.length; i < inputsLength; i++) {
            let field = inputs[i].querySelector(".input__field");

            field.addEventListener("input", onInput);
            field.classList.add(inputIsListeningClass);
        }
    }

    return {
        initInputs: initInputs
    };
})();
inputsManager.initInputs();

/* Навигация */
let navigation = (function () {
    "use strict";

    function initMenu() {
        let menuButton = document.querySelector(".menu-button");
        let menuContainer = document.querySelector(".menu-container");
        let menu = document.querySelector(".menu");

        let menuContainerOpenedClass = "menu-container_opened";
        let menuButtonOpenedClass = "menu-button_opened";

        if (window.matchMedia("(max-width: 768px)").matches) {
            let menuOpened = false;
            let menuHeight = menu.clientHeight;

            let closeMenu = function () {
                menuContainer.style.maxHeight = "0";
                menuContainer.classList.remove(menuContainerOpenedClass);
                menuButton.classList.remove(menuButtonOpenedClass);
            };

            let openMenu = function () {
                menuContainer.style.maxHeight = `${menuHeight}px`;
                menuContainer.classList.add(menuContainerOpenedClass);
                menuButton.classList.add(menuButtonOpenedClass);
            };

            let toggleMenu = function () {
                if (menuOpened) {
                    // закрыть
                    closeMenu();
                } else {
                    // открыть
                    openMenu();
                }

                menuOpened = !menuOpened;
            };

            menuButton.addEventListener("click", toggleMenu);
        } else {
            menuContainer.style.maxHeight = "";
            menuContainer.classList.remove(menuContainerOpenedClass);
        }
    }
    window.addEventListener("resize", initMenu);
    initMenu();

    let contentContainer = document.querySelector(".content-container");

    /**
     * Обрабатывает событие навигации по истории
     */
    window.addEventListener("popstate", function (event) {
        if (location.pathname !== "" && event.state.page) {
            openPage(location.pathname, contentContainer, false);
        }
    });

    /**
     * Обработка клика по ссылке
     * @param {MouseEvent} event
     */
    function onLinkClick(event) {
        event.preventDefault();
        let target = event.target;
        let url = target.href;

        if (url !== "") {
            console.log(`Opening.. ${url}`);
            openPage(url, contentContainer);
        }
    }

    function initNavigationButtons() {
        let links = document.querySelectorAll(".navigation-button_not-inited");
        for (let i = 0, linksCount = links.length; i < linksCount; i++) {
            links[i].addEventListener("click", onLinkClick);
            links[i].classList.remove("navigation-button_not-inited");
        }
    }
    initNavigationButtons();

    return {
        initNavigationButtons: initNavigationButtons
    }
})();

/**
 * Преобразует объект params в строку параметров url. Например, {c: "hello", lang: "ru"} станет "?c=hello&lang=ru"
 * @param {object} params Парамерты
 * @param {string} [url=""] URL, к которому нужно добавить параметры
 * @return {string}
 */
function addQueryParams(params, url) {
    "use strict";
    if (url === undefined) {
        url = "";
    }
    
    const paramsKeys = Object.keys(params);
    const paramsCount = paramsKeys.length;
    let paramsString = "";

    for (let i = 0; i < paramsCount; i++) {
        let key = paramsKeys[i];
        let param = `${key}=${params[key]}`;

        if (paramsString === "") {
            paramsString += param;
        } else {
            paramsString += '&' + param;
        }
    }

    return url + (url.includes("?") ? "&":"?") + paramsString;
}

function openPage(url, contentContainer, addToHistory = true) {
    let head = document.querySelector("head");
    let contentElement = contentContainer.querySelector(".content");
    let errorElement = contentContainer.querySelector(".error");

    fetch(url + addQueryParams({content: true}))
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            if (addToHistory) {
                history.pushState({page: true}, null, url);
            }

            contentElement.innerHTML = body;
            let scripts = contentElement.querySelectorAll("script");
            for (let i = 0; i < scripts.length; i++) {
                let scriptElem = document.createElement("script");
                scriptElem.src = scripts[i].src;
                head.append(scriptElem);
            }

            inputsManager.initInputs();
            navigation.initNavigationButtons();

            if (errorElement !== null) {
                errorElement.classList.remove("error_shown");
            }
        })
        .catch(function (error) {
            if (errorElement !== null) {
                errorElement.classList.add("error_shown");
                contentElement.innerHTML = "";
            }
        });
}

/* Слайдер */
(function () {
    "use strict";
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

        const newScrollX = sliderWidth * slideNumber;
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
        if (animate) {
            if (currentAnimation !== undefined) {
                currentAnimation.cancel();
            }

            const maxDuration = 600;
            const diff = px - scrollX;
            let tmpScrollX = scrollX;

            let duration = Math.floor(Math.abs(diff)/sliderWidth * maxDuration);
            if (duration > maxDuration) {
                duration = maxDuration;
            }

            currentAnimation = new Animation({
                draw: function(passedTime, duration) {
                    tmpScrollX = scrollX + Math.floor(diff * passedTime/duration);
                    // slidesContainer.style.transform = "translate(" + tmpScrollX + "px)";
                    slidesContainer.scrollLeft = tmpScrollX;
                },
                onCancel: function () {
                    scrollX = tmpScrollX;
                    console.log("canceled");
                },
                onEnd: function () {
                    scrollX = px;
                },
                duration: duration
            });

            currentAnimation.start();
        } else {
            scrollX = px;
            // slidesContainer.style.transform = "translate(" + scrollX + "px)";
            slidesContainer.scrollLeft = scrollX;
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
        clearInterval(interval);
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
        console.log(totalMoveX);

        scrollBy(Math.floor(-moveX));
    }

    /**
     * Обрабатывает событие touchend
     * @param {TouchEvent} event
     */
    function touchEnd(event) {
        if (scrollX < 0 || scrollX > sliderWidth * (slides.length - 1)) {
            setSlide(currentSlide);
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
        slidesContainer.style.width = sliderWidth + "px";
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

        let slidesCount = slides.length;
        if (slidesCount === 0) {
            slider.style.display = "none";
            return;
        }

        console.log(performance.now());
        updateSizes();

        for (let i = 0; i < slidesCount; i++) {

            let control = document.createElement("span");
            control.className = "slider__control";
            control.tabIndex = 0;
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

            const newScrollX = sliderWidth * currentSlide;
            scrollTo(newScrollX);
        });

        if (autoScroll) {
            interval = setInterval(nextSlide, autoScrollTime);
        }
    }

    init();
})();