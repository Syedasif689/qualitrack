
import { initializeNavigation } from "./navigation.js";
import { initializeOverview } from "./overview.js";
import { initializeAnalysis } from "./analysis.js";
import { initializeMetrics } from "./metrics.js";
import { initializeRecommendations } from "./recommendations.js";

// Backend configuration
const API_BASE_URL = "http://localhost:8080/api";

// Get logged-in session
function getSession() {
    const token = sessionStorage.getItem("qualitrackToken");
    const userData = sessionStorage.getItem("qualitrackUser");

    if (!token || !userData) {
        return null;
    }

    try {
        return {
            token,
            user: JSON.parse(userData)
        };
    } catch (error) {
        console.error("Invalid session data:", error);
        return null;
    }
}

// Validate JWT with protected backend endpoint
async function validateSession() {
    const session = getSession();

    if (!session) {
        window.location.replace("login.html");
        return null;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/test/protected`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${session.token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("qualitrackToken");
            sessionStorage.removeItem("qualitrackUser");

            window.location.replace("login.html");
            return null;
        }

        if (!response.ok) {
            throw new Error("Unable to verify your session.");
        }

        const data = await response.json();

        // Confirm that the token belongs to the stored user.
        if (data.email !== session.user.email) {
            sessionStorage.removeItem("qualitrackToken");
            sessionStorage.removeItem("qualitrackUser");

            window.location.replace("login.html");
            return null;
        }

        return session;

    } catch (error) {
        console.error("Session verification failed:", error);

        document.body.innerHTML = `
            <div style="padding:40px;text-align:center">
                <h2>Unable to connect to QualiTrack</h2>
                <p>Please check whether the backend is running.</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;

        return null;
    }
}

// Display actual user information
function initializeProfile(user) {
    const nameElement = document.getElementById("profileName");
    const emailElement = document.getElementById("profileEmail");
    const avatarElement = document.getElementById("profileAvatar");

    if (nameElement) {
        nameElement.textContent = user.fullName || "User";
    }

    if (emailElement) {
        emailElement.textContent = user.email || "";
    }

    if (avatarElement) {
        avatarElement.textContent =
            (user.fullName || "U").trim().charAt(0).toUpperCase();
    }
}

// Load HTML components
async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(`Container not found: ${containerId}`);
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(`Failed to load: ${filePath}`);
    }

    container.innerHTML = await response.text();
}

// Load dashboard pages
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

// Initialize dashboard
async function initializeDashboard() {

    // Verify authentication before loading dashboard
    const session = await validateSession();

    if (!session) {
        return;
    }

    try {
        await Promise.all([
            loadComponent(
                "sidebar-container",
                "components/sidebar.html"
            ),
            loadComponent(
                "header-container",
                "components/header.html"
            )
        ]);

        // Display logged-in user
        initializeProfile(session.user);

        // Initialize navigation
        initializeNavigation(loadPage);

        // Load default page
        await loadPage("overview");

    } catch (error) {
        console.error("Dashboard initialization failed:", error);

        document.getElementById("dashboard-content").innerHTML =
            "<h2>Unable to initialize dashboard.</h2>";
    }
}

initializeDashboard();
