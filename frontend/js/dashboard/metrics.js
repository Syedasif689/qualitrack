
export function initializeMetrics() {

    const metricsPage = document.querySelector(".metrics-page");

    if (!metricsPage) {
        console.error("Quality Metrics page not found.");
        return;
    }

    // Animate domain progress bars
    const progressBars = metricsPage.querySelectorAll("[data-progress]");

    progressBars.forEach(bar => {

        const targetProgress = Number(bar.dataset.progress);

        if (
            Number.isNaN(targetProgress) ||
            targetProgress < 0 ||
            targetProgress > 100
        ) {
            return;
        }

        bar.style.width = "0%";

        requestAnimationFrame(() => {
            bar.style.width = `${targetProgress}%`;
        });

    });

    // Animate overall quality score
    const scoreCircle = metricsPage.querySelector(".score-circle");
    const overallScore = metricsPage.querySelector("#overallScore");

    if (scoreCircle && overallScore) {

        const score = Number(scoreCircle.dataset.score);

        if (!Number.isNaN(score) && score >= 0 && score <= 100) {

            scoreCircle.style.background = `
                conic-gradient(
                    #a78bfa 0deg ${score * 3.6}deg,
                    #293247 ${score * 3.6}deg 360deg
                )
            `;

            overallScore.textContent = score;

        }
    }

    console.log("Quality Metrics initialized successfully.");
}
