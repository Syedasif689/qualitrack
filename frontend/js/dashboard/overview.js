
export function initializeOverview() {

    const analyzeButton = document.getElementById("startAnalysisBtn");
    const quickAnalyze = document.getElementById("quickAnalyze");
    const quickMetrics = document.getElementById("quickMetrics");

    function navigateTo(page) {
        const navButton = document.querySelector(
            `.nav-item[data-page="${page}"]`
        );

        if (navButton) {
            navButton.click();
        }
    }

    analyzeButton?.addEventListener("click", () => {
        navigateTo("analysis");
    });

    quickAnalyze?.addEventListener("click", () => {
        navigateTo("analysis");
    });

    quickMetrics?.addEventListener("click", () => {
        navigateTo("metrics");
    });
}
