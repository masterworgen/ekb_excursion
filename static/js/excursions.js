(function () {
    "use strict";
    let isMobile = false;
    let excursionIsVisible = false;

    let currentAnimation;

    let excursionsPage = document.querySelector(".excursions");
    let pickMes = excursionsPage.querySelector(".pick-excursion-message");
    let excursionList = excursionsPage.querySelector(".excursions-list");
    let excursionsContainer = excursionsPage.querySelector(".excursions__container");

    let excursions = excursionsPage.querySelectorAll(".excursion");
    let excursionOpenedClass = "excursion_opened";
    let openedExcursion = excursionsPage.querySelector("." + excursionOpenedClass);

    let excursionsButtons = excursionsPage.querySelectorAll(".excursions-list-item");
    let excursionButtonOpenedClass = "excursions-list-item_opened";
    let openedExcursionButton = excursionsPage.querySelector("." + excursionButtonOpenedClass);

    let backButtons = excursionsPage.querySelectorAll(".back-button");

    let formContainer = excursionsPage.querySelector(".form-container");
    let formContainerOpenedClass = "form-container_opened";

    let form = excursionsPage.querySelector(".excursion-form");
    let formFields = form.querySelectorAll("input");
    let formCancelButton = form.querySelector(".excursion-form__cancel");
    let joinExcursionButtons = excursionsPage.querySelectorAll(".join-excursion-button");

    window.addEventListener("popstate", function (event) {
        if (location.pathname !== "" && event.state.excursion) {
            openExcursionFromUrl();
        }
    });

    function resize() {
        isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (!isMobile) {
            return;
        }

        if (excursionIsVisible) {
            scrollToExcursion(false);
            excursionsContainer.classList.remove("excursions__container_hidden");
        } else {
            excursionsContainer.classList.add("excursions__container_hidden");
        }
    }

    window.addEventListener("resize", resize);
    resize();

    function openExcursionFromUrl() {
        let match = location.pathname.match(/excursion\/(\d+)/);
        if (match !== null) {
            openExcursion(Number(match[1]), false);
        }
    }

    function openExcursion(id, addToHistory = true) {
        pickMes.style.display = "none";
        formContainer.classList.remove(formContainerOpenedClass);

        let excursionId = 0;
        let excursionButton;
        if (typeof id === "number") {
            excursionId = id;
            excursionButton = excursionsPage.querySelector(".excursions-list-item[data-excursion-id='" + excursionId + "']")
        } else {
            excursionButton = id.currentTarget;
            if (!excursionButton.classList.contains("excursions-list-item")) {
                return;
            }

            excursionId = Number(excursionButton.dataset.excursionId);
        }

        if (addToHistory) {
            history.pushState({excursion: true}, null, "/excursion/" + excursionId);
            console.log("/excursion/" + excursionId);
        }

        if (openedExcursionButton !== null) {
            openedExcursionButton.classList.remove(excursionButtonOpenedClass);
        }

        excursionButton.classList.add(excursionButtonOpenedClass);
        openedExcursionButton = excursionButton;

        if (openedExcursion !== null) {
            openedExcursion.classList.remove(excursionOpenedClass);
        }

        let excursion = excursionsPage.querySelector(".excursion[data-excursion-id='" + excursionId + "']")
        excursion.classList.add(excursionOpenedClass);
        openedExcursion = excursion;

        if (isMobile) {
            scrollToExcursion();
        } else {
            excursionsContainer.style.display = "block";
            excursionList.style.display = "none";
        }
    }

    function closeExcursion() {
        if (isMobile) {
            scrollToList();
        } else {
            excursionsContainer.style.display = "none";
            excursionList.style.display = "block";
        }
    }

    function openJoinForm(event) {
        let button = event.target;
        let excursionName = button.dataset.excursionName;
        let excursionId = Number(button.dataset.excursionId);

        if (openedExcursion !== null) {
            openedExcursion.classList.remove(excursionOpenedClass);
        }
        openedExcursion = null;

        formContainer.classList.add(formContainerOpenedClass);
        form.querySelector(".excursion-form__excursion-name").textContent = `"${excursionName}"`;
        form.querySelector(".excursion-form__excursion-id-field").value = excursionId;

        formCancelButton.onclick = function () {
            openExcursion(excursionId, false);
        }
    }

    function clearFields() {
        for (let i = 0; i < formFields.length; i++) {
            let field = formFields[i];

            if (!field.classList.contains("input__field")) {
                continue;
            }

            let event = new Event("input");

            field.value = "";
            field.dispatchEvent(event);
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = new FormData();

        for (let i = 0; i < formFields.length; i++) {
            let field = formFields[i];
            formData.append(field.name, field.value);
        }

        let message;

        fetch("/excursions/", {
            method: "POST",
            body: formData
        }).then(function (response) {
            console.log(response.status);
            message = new Message({
                type: Message.TYPE_INFO,
                title: "Отправлено",
                text: "Вы успешно записаны на экскурсию",
                classList: "form-container__message",
                duration: 10000
            });
            message.insertAfter(form).show();

            clearFields();
        }).catch(function () {
            message = new Message({
                type: Message.TYPE_ERROR,
                title: "Ошибка",
                text: ["Что-то пошло не так", "Пожалуйста, попробуйте позже"],
                classList: "form-container__message",
                duration: 10000
            });
            message.insertAfter(form).show();
        })
    });

    function scrollTo(x, animate = false) {
        if (animate) {
            if (currentAnimation !== undefined) {
                currentAnimation.cancel();
            }
            const scrollLeft = excursionsPage.scrollLeft;
            const maxDuration = 200;
            const diff = x - scrollLeft;

            let duration = Math.floor(Math.abs(diff) / excursionsPage.clientWidth * maxDuration);
            if (duration > maxDuration) {
                duration = maxDuration;
            }

            currentAnimation = new Animation({
                draw: function (passedTime, duration) {
                    excursionsPage.scrollLeft = scrollLeft + Math.floor(diff * passedTime / duration);
                },
                duration: duration
            });

            currentAnimation.start();
        } else {
            excursionsPage.scrollLeft = x;
        }
    }

    function scrollToList(animate = true) {
        scrollTo(0, animate);
        excursionIsVisible = false;
        excursionsContainer.classList.add("excursions__container_hidden");
    }

    function scrollToExcursion(animate = true) {
        scrollTo(excursionsPage.clientWidth, animate);
        excursionIsVisible = true;
        excursionsContainer.classList.remove("excursions__container_hidden");
    }

    for (let i = 0; i < excursionsButtons.length; i++) {
        excursionsButtons[i].addEventListener("click", openExcursion);
    }

    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", closeExcursion);
    }

    for (let i = 0; i < joinExcursionButtons.length; i++) {
        joinExcursionButtons[i].addEventListener("click", openJoinForm);
    }

    openExcursionFromUrl();

    (function () {
        let startTouchX = -1;
        let startTouchY = -1;
        let totalMovedX = 0;
        let totalMovedY = 0;

        let startScrollLeft = -1;

        excursionsPage.addEventListener("touchstart", function (event) {
            if (!excursionIsVisible) {
                return;
            }

            const touch = event.touches[0];
            startTouchX = touch.screenX;
            startTouchY = touch.screenY;

            startScrollLeft = excursionsPage.scrollLeft;
        });

        excursionsPage.addEventListener("touchmove", function (event) {
            if (!excursionIsVisible) {
                return;
            }

            const touch = event.touches[0];
            totalMovedX = touch.screenX - startTouchX;
            totalMovedY = touch.screenY - startTouchY;

            if (Math.abs(totalMovedX) > Math.abs(totalMovedY)) {
                excursionsPage.scrollLeft = startScrollLeft - totalMovedX;
            }
        });

        excursionsPage.addEventListener("touchend", function (event) {
            if (!excursionIsVisible) {
                return;
            }

            // Докрутить
            if (Math.abs(totalMovedX) > Math.abs(totalMovedY) && totalMovedX > excursionsPage.clientWidth/6) {
                scrollToList();
            } else {
                scrollToExcursion();
            }

            // Сбросить значения
            startTouchX = -1;
            startScrollLeft = -1;
            totalMovedX = 0;
        })
    })();
})();