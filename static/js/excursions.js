(function () {
    "use strict";
    let isMobile = window.matchMedia('(max-width: 768px)').matches;
    let excursionIsVisible = false;

    window.addEventListener("resize", function () {
        isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && excursionIsVisible) {
            scrollToExcursion(false);
        }
    });

    let currentAnimation;

    let excursionsPage = document.querySelector(".excursions");

    let excursions = document.querySelectorAll(".excursion");
    let excursionOpenedClass = "excursion_opened";
    let openedExcursion = document.querySelector("." + excursionOpenedClass);

    let excursionsButtons = document.querySelectorAll(".excursions-list-item");
    let excursionButtonOpenedClass = "excursions-list-item_opened";
    let openedExcursionButton = document.querySelector("." + excursionButtonOpenedClass);

    let backButtons = document.querySelectorAll(".back-button");

    function openExcursion(event) {
        let clickedExcursionButton = event.currentTarget;
        if (!clickedExcursionButton.classList.contains("excursions-list-item")) {
            return;
        }

        let excursionId = Number(clickedExcursionButton.dataset.excurtionId);

        openedExcursionButton.classList.remove(excursionButtonOpenedClass);
        clickedExcursionButton.classList.add(excursionButtonOpenedClass);
        openedExcursionButton = clickedExcursionButton;

        openedExcursion.classList.remove(excursionOpenedClass);
        excursions[excursionId].classList.add(excursionOpenedClass);
        openedExcursion = excursions[excursionId];

        if (isMobile) {
            scrollToExcursion();
        }
    }

    function scrollTo(x, animate = false) {
        if (animate) {
            if (currentAnimation !== undefined) {
                currentAnimation.cancel();
            }
            const scrollLeft = excursionsPage.scrollLeft;
            const maxDuration = 300;
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

    function closeExcursion() {
        if (isMobile) {
            scrollToList();
        }
    }

    function scrollToList(animate = true) {
        scrollTo(0, animate);
        excursionIsVisible = false;
    }

    function scrollToExcursion(animate = true) {
        scrollTo(excursionsPage.clientWidth, animate);
        excursionIsVisible = true;
    }

    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", closeExcursion);
    }

    for (let i = 0; i < excursionsButtons.length; i++) {
        excursionsButtons[i].addEventListener("click", openExcursion);
    }
})();