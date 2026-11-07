
export function initializeNavigation(loadPage) {

    const sidebar = document.getElementById("dashboardSidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");
    const navItems = document.querySelectorAll(".nav-item[data-page]");
    const pageTitle = document.getElementById("pageTitle");

    const pageNames = {
        overview: "Overview",
        analysis: "Repository Analysis",
        metrics: "Quality Metrics",
        recommendations: "Recommendations",
        history: "Analysis History",
        settings: "Settings"
    };

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const page = item.dataset.page;

            navItems.forEach(nav => nav.classList.remove("active"));

            item.classList.add("active");

            pageTitle.textContent = pageNames[page] || "Dashboard";

            sidebar.classList.remove("open");

            loadPage(page);
        });
    });

    menuToggle?.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    sidebarClose?.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
}
