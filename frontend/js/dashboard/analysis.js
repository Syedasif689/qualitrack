
export function initializeAnalysis() {

    // =====================================
    // DOM ELEMENTS
    // =====================================

    const tabs = document.querySelectorAll(".source-tab");

    const githubSource = document.getElementById("githubSource");
    const uploadSource = document.getElementById("uploadSource");

    const repositoryUrl = document.getElementById("repositoryUrl");
    const repositoryFile = document.getElementById("repositoryFile");

    const browseFileBtn = document.getElementById("browseFileBtn");
    const selectedFileName = document.getElementById("selectedFileName");

    const connectGithubBtn = document.getElementById("connectGithubBtn");
    const githubStatus = document.getElementById("githubStatus");

    const repositorySelection = document.getElementById("repositorySelection");
    const repositoryDropdown = document.getElementById("repositoryDropdown");

    const analyzeButton = document.getElementById("analyzeRepositoryBtn");
    const message = document.getElementById("analysisMessage");

    // =====================================
    // CONFIGURATION
    // =====================================

    let selectedSource = "github";

    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB

    // =====================================
    // MESSAGE HANDLER
    // =====================================

    function showMessage(text, type) {

        if (!message) return;

        message.textContent = text;
        message.className = `analysis-message ${type}`;
    }

    function clearMessage() {

        if (!message) return;

        message.textContent = "";
        message.className = "analysis-message";
    }

    // =====================================
// SOURCE TAB SWITCHING
// =====================================

// Initial state: GitHub visible, ZIP hidden
githubSource.classList.remove("hidden");
uploadSource.classList.remove("hidden");

githubSource.style.display = "block";
uploadSource.style.display = "none";

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        selectedSource = tab.dataset.source;

        // Update active tab
        tabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        // Show only the selected section
        if (selectedSource === "github") {

            githubSource.style.display = "block";
            uploadSource.style.display = "none";

        } else if (selectedSource === "upload") {

            githubSource.style.display = "none";
            uploadSource.style.display = "block";

        }

        clearMessage();

        console.log("Selected:", selectedSource);
        console.log("GitHub:", githubSource.style.display);
        console.log("ZIP:", uploadSource.style.display);

    });

});
    // =====================================
    // GITHUB CONNECTION
    // FRONTEND PLACEHOLDER
    // =====================================

    connectGithubBtn?.addEventListener("click", () => {

        showMessage(
            "GitHub authorization will be available after backend integration.",
            "success"
        );

    });

    // =====================================
    // MANUAL GITHUB REPOSITORY URL
    // =====================================

    repositoryUrl?.addEventListener("input", clearMessage);

    // =====================================
    // REPOSITORY DROPDOWN
    // =====================================

    repositoryDropdown?.addEventListener("change", clearMessage);

    // =====================================
    // ZIP FILE BROWSER
    // =====================================

    browseFileBtn?.addEventListener("click", () => {

        repositoryFile?.click();

    });

    // =====================================
    // ZIP FILE VALIDATION
    // =====================================

    repositoryFile?.addEventListener("change", () => {

        const file = repositoryFile.files[0];

        if (!file) return;

        // Check extension
        if (!file.name.toLowerCase().endsWith(".zip")) {

            showMessage(
                "Invalid file format. Please select a ZIP file.",
                "error"
            );

            repositoryFile.value = "";

            selectedFileName.textContent = "No file selected";

            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {

            showMessage(
                "File size exceeds the maximum 1 GB upload limit.",
                "error"
            );

            repositoryFile.value = "";

            selectedFileName.textContent = "No file selected";

            return;
        }

        // Display selected file
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

        selectedFileName.textContent =
            `${file.name} (${fileSizeMB} MB)`;

        showMessage(
            "ZIP file selected successfully. Ready for validation.",
            "success"
        );

    });

    // =====================================
    // GITHUB URL VALIDATION
    // =====================================

    function validateGitHubURL(url) {

        try {

            const parsedUrl = new URL(url);

            if (
                parsedUrl.protocol !== "https:" ||
                parsedUrl.hostname !== "github.com" ||
                parsedUrl.username ||
                parsedUrl.password
            ) {
                return false;
            }

            const parts = parsedUrl.pathname
                .split("/")
                .filter(Boolean);

            // Expected: github.com/owner/repository
            if (parts.length !== 2) {
                return false;
            }

            // Reject invalid path segments
            if (
                parts.some(part =>
                    part === "." ||
                    part === ".." ||
                    part.includes("\\")
                )
            ) {
                return false;
            }

            return true;

        } catch {

            return false;

        }
    }

    // =====================================
    // ANALYZE BUTTON
    // =====================================

    analyzeButton?.addEventListener("click", () => {

        clearMessage();

        // -----------------------------
        // GITHUB SOURCE
        // -----------------------------

        if (selectedSource === "github") {

            const selectedRepository = repositoryDropdown?.value;

            const url = repositoryUrl?.value.trim();

            // Repository selected from connected account
            if (selectedRepository) {

                showMessage(
                    "Repository selected successfully. Backend analysis integration is pending.",
                    "success"
                );

                return;
            }

            // Manual public repository URL
            if (!url) {

                showMessage(
                    "Please connect GitHub, select a repository, or enter a public repository URL.",
                    "error"
                );

                return;
            }

            if (!validateGitHubURL(url)) {

                showMessage(
                    "Enter a valid GitHub URL in this format: https://github.com/owner/repository",
                    "error"
                );

                return;
            }

            showMessage(
                "GitHub repository URL validated successfully. Backend analysis integration is the next step.",
                "success"
            );

            return;
        }

        // -----------------------------
        // ZIP UPLOAD SOURCE
        // -----------------------------

        if (selectedSource === "upload") {

            const file = repositoryFile?.files[0];

            if (!file) {

                showMessage(
                    "Please select a project ZIP file.",
                    "error"
                );

                return;
            }

            if (!file.name.toLowerCase().endsWith(".zip")) {

                showMessage(
                    "Please upload a valid ZIP file.",
                    "error"
                );

                return;
            }

            if (file.size > MAX_FILE_SIZE) {

                showMessage(
                    "File size exceeds the maximum 1 GB limit.",
                    "error"
                );

                return;
            }

            showMessage(
                "ZIP file validated successfully. Backend upload integration is the next step.",
                "success"
            );

        }

    });

}
