(function () {
    "use strict";
    let isMobile = window.matchMedia('(max-width: 768px)');

    window.addEventListener("resize", function () {
        isMobile = window.matchMedia('(max-width: 768px)');
    });

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

    function scrollTo(x) {
        excursionsPage.scrollLeft = x;
    }

    function scrollToList() {
        scrollTo(0);
    }

    function scrollToExcursion() {
        scrollTo(excursionsPage.clientWidth);
    }

    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", scrollToList);
    }

    for (let i = 0; i < excursionsButtons.length; i++) {
        excursionsButtons[i].addEventListener("click", openExcursion);
    }
})();