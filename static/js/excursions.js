(function () {
    "use strict";
    let isMobile = false;
    let excursionIsVisible = false;

    let currentAnimation;

    let excursionsPage = document.querySelector(".excursions");
    let excursionsContainer = excursionsPage.querySelector(".excursions__container");

    let excursions = document.querySelectorAll(".excursion");
    let excursionOpenedClass = "excursion_opened";
    let openedExcursion = document.querySelector("." + excursionOpenedClass);

    let excursionsButtons = document.querySelectorAll(".excursions-list-item");
    let excursionButtonOpenedClass = "excursions-list-item_opened";
    let openedExcursionButton = document.querySelector("." + excursionButtonOpenedClass);

    let backButtons = document.querySelectorAll(".back-button");

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

    function openExcursion(event) {
        let clickedExcursionButton = event.currentTarget;
        if (!clickedExcursionButton.classList.contains("excursions-list-item")) {
            return;
        }

        let excursionId = Number(clickedExcursionButton.dataset.excurtionId);
        //history.pushState()

        if (openedExcursionButton !== null) {
            openedExcursionButton.classList.remove(excursionButtonOpenedClass);
        }
        clickedExcursionButton.classList.add(excursionButtonOpenedClass);
        openedExcursionButton = clickedExcursionButton;

        let excursion = document.getElementById("excursion_id_" + excursionId);
        openedExcursion.classList.remove(excursionOpenedClass);
        excursion.classList.add(excursionOpenedClass);
        openedExcursion = excursion;

        if (isMobile) {
            scrollToExcursion();
        }
    }

    function closeExcursion() {
        if (isMobile) {
            scrollToList();
        }
    }

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