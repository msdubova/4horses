document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(
        ".participants__slider .slider__track"
    );
    const sliderItems = Array.from(document.querySelectorAll(".slider__item"));
    const prevButton = document.querySelector(".slider__button--prev");
    const nextButton = document.querySelector(".slider__button--next");
    const paginationSpan = document.querySelector(".slider__pagination");

    const itemsPerPage = 3;
    let currentPage = 1;
    const totalPages = Math.ceil(sliderItems.length / itemsPerPage);

    function updateSlider() {
        sliderItems.forEach((item) => (item.style.display = "none"));

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        sliderItems.slice(startIndex, endIndex).forEach((item) => {
            item.style.display = "block";
        });

        paginationSpan.textContent = `${currentPage}/${totalPages}`;
    }

    function goToNextPage() {
        currentPage = currentPage === totalPages ? 1 : currentPage + 1;
        updateSlider();
    }

    function goToPrevPage() {
        currentPage = currentPage === 1 ? totalPages : currentPage - 1;
        updateSlider();
    }

    prevButton.addEventListener("click", goToPrevPage);
    nextButton.addEventListener("click", goToNextPage);

    function startAutoSlide() {
        return setInterval(goToNextPage, 4000);
    }

    let autoSlideInterval = startAutoSlide();

    [prevButton, nextButton].forEach((button) => {
        button.addEventListener("click", () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = startAutoSlide();
        });
    });

    updateSlider();
});
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".stages__slider");
    const gridWrapper = slider.querySelector(".grid__wrapper");
    const gridCards = slider.querySelectorAll(".grid__card");
    const pagination = slider.querySelector(".stages__pagination");
    let sliderInstance = null;

    function initSlider() {
        if (window.innerWidth <= 1200) {
            if (sliderInstance) return;

            gridCards.forEach((card, index) => {
                const dot = document.createElement("button");
                dot.classList.add("stages__dot");
                dot.setAttribute("data-slide", index);

                dot.addEventListener("click", function () {
                    const slideIndex = parseInt(
                        this.getAttribute("data-slide")
                    );

                    slider
                        .querySelectorAll(".stages__dot")
                        .forEach((d) => d.classList.remove("active"));
                    this.classList.add("active");

                    const offset = -slideIndex * 100;
                    gridWrapper.style.transform = `translateX(${offset}%)`;
                });

                pagination.appendChild(dot);
            });

            const firstDot = pagination.querySelector(".stages__dot");
            if (firstDot) firstDot.classList.add("active");

            const styles = `
                .stages__slider {
                    overflow: hidden;
                    width: 100%;
                }
                .grid__wrapper {
                    display: flex;
                    transition: transform 0.5s ease;
                    width: 100%;
                }
                .grid__card {
                    flex: 0 0 100%;
                    width: 100%;
                }
                .stages__pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 15px;
                }
                .stages__dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #ccc;
                    margin: 0 5px;
                    border: none;
                    cursor: pointer;
                }
                .stages__dot.active {
                    background-color: #333;
                }
            `;

            const styleTag = document.createElement("style");
            styleTag.setAttribute("data-slider-styles", "true");
            styleTag.textContent = styles;
            document.head.appendChild(styleTag);

            sliderInstance = true;
        } else {
            if (sliderInstance) {
                pagination.innerHTML = "";
                gridWrapper.style.transform = "translateX(0%)";

                const styleTag = document.querySelector(
                    "style[data-slider-styles]"
                );
                if (styleTag) styleTag.remove();

                gridWrapper.style.display = "";
                gridCards.forEach((card) => {
                    card.style.flex = "";
                    card.style.width = "";
                });

                sliderInstance = null;
            }
        }
    }

    initSlider();

    window.addEventListener("resize", initSlider);
});
