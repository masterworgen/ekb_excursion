(function () {
    "use strict";
    let isMobile = window.matchMedia('(max-width: 768px)').matches;
    let excursionOpened = false;

    window.addEventListener("resize", function () {
        isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && excursionOpened) {
            scrollToExcursion(false);
        }
    });

    let currentAnimation;

    let excursionsPage = document.querySelector(".excursions");

    let excursions = document.querySelectorAll(".excursion");
    let excursionOpenedClass = "excursion_opened";

    let excursionsButtons = document.querySelectorAll(".excursions-list-item");
    let excursionButtonOpenedClass = "excursions-list-item_opened";

    let backButtons = document.querySelectorAll(".back-button");

    function openExcursion(event) {
        let clickedExcursionButton = event.currentTarget;
        if (!clickedExcursionButton.classList.contains("excursions-list-item")) {
            return;
        }

        let excursionId = Number(clickedExcursionButton.dataset.excurtionId);

        for (let i = 0; i < excursionsButtons.length; i++) {
            excursionsButtons[i].classList.remove(excursionButtonOpenedClass);
        }
        clickedExcursionButton.classList.add(excursionButtonOpenedClass);

        for (let i = 0; i < excursions.length; i++) {
            excursions[i].classList.remove(excursionOpenedClass);
        }
        excursions[excursionId].classList.add(excursionOpenedClass);

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
        excursionOpened = false;
    }

    function scrollToExcursion(animate = true) {
        scrollTo(excursionsPage.clientWidth, animate);
        excursionOpened = true;
    }

    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", closeExcursion);
    }

    for (let i = 0; i < excursionsButtons.length; i++) {
        excursionsButtons[i].addEventListener("click", openExcursion);
    }
})();