
import { initializeNavigation } from "./navigation.js";
import { initializeOverview } from "./overview.js";
import { initializeAnalysis } from "./analysis.js";
import { initializeMetrics } from "./metrics.js";
import { initializeRecommendations } from "./recommendations.js";
async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load: ${filePath}`);
        }

        container.innerHTML = await response.text();

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p>Could not load ${filePath}</p>`;
    }
}

async function loadPage(pageName) {
    const content = document.getElementById("dashboard-content");

    try {
        const response = await fetch(`pages/${pageName}.html`);

        if (!response.ok) {
            throw new Error(`Failed to load page: ${pageName}`);
        }

        content.innerHTML = await response.text();

        if (pageName === "overview") {
    initializeOverview();
}

if (pageName === "analysis") {
    initializeAnalysis();
}
if (pageName === "metrics") {
    initializeMetrics();
}
if (pageName === "recommendations") {
    initializeRecommendations();
}

    } catch (error) {
        console.error(error);
        content.innerHTML = "<h2>Unable to load this page.</h2>";
    }
}

async function initializeDashboard() {

    await Promise.all([
        loadComponent("sidebar-container", "components/sidebar.html"),
        loadComponent("header-container", "components/header.html")
    ]);

    initializeNavigation(loadPage);

    await loadPage("overview");
}

initializeDashboard();
