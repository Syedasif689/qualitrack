
export function initializeRecommendations() {
    const page = document.querySelector(".recommendations-page");

    if (!page) {
        console.error("Recommendations page not found.");
        return;
    }

    const cards = page.querySelectorAll(".recommendation-card");
    const filters = page.querySelectorAll(".recommendation-filter");

    const totalElement = page.querySelector("#totalRecommendations");
    const highElement = page.querySelector("#highPriorityCount");
    const completedElement = page.querySelector("#completedCount");

    function updateSummary() {
        const completedCards = page.querySelectorAll(
            ".recommendation-card.completed"
        );

        const highPriorityCards = [...cards].filter(card =>
            card.dataset.priority === "high" &&
            !card.classList.contains("completed")
        );

        totalElement.textContent = cards.length;
        highElement.textContent = highPriorityCards.length;
        completedElement.textContent = completedCards.length;
    }

    // Priority filters
    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            filters.forEach(button =>
                button.classList.remove("active")
            );

            filter.classList.add("active");

            const selectedPriority = filter.dataset.filter;

            cards.forEach(card => {
                const matches =
                    selectedPriority === "all" ||
                    card.dataset.priority === selectedPriority;

                card.style.display = matches ? "" : "none";
            });
        });
    });

    // Mark recommendations as completed
    cards.forEach(card => {
        const button = card.querySelector(".mark-completed");

        button.addEventListener("click", () => {
            const isCompleted = card.classList.toggle("completed");

            if (isCompleted) {
                button.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    Completed
                `;
            } else {
                button.innerHTML = `
                    <i class="fa-regular fa-circle-check"></i>
                    Mark as Completed
                `;
            }

            updateSummary();
        });
    });

    updateSummary();

    console.log("Recommendations initialized successfully.");
}
