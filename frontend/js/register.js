
// =========================================================
// QUALITRACK REGISTRATION — connected to Spring Boot
// =========================================================

const $ = (id) => document.getElementById(id);

const API_BASE_URL = "http://localhost:8080/api";

$("currentYear").textContent = new Date().getFullYear();

const registerForm = $("registerForm");

// =========================================================
// PASSWORD VISIBILITY
// =========================================================

function attachPasswordToggle(inputId, buttonId) {
    const input = $(inputId);
    const button = $(buttonId);

    button.addEventListener("click", () => {
        const showing = input.type === "text";

        input.type = showing ? "password" : "text";
        button.textContent = showing ? "Show" : "Hide";

        button.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );

        button.setAttribute("aria-pressed", String(!showing));
    });
}

attachPasswordToggle("password", "passwordToggle");
attachPasswordToggle("confirmPassword", "confirmToggle");

// =========================================================
// FIELD ERROR HANDLING
// =========================================================

function setError(inputId, errorId, message) {
    const input = $(inputId);
    $(errorId).textContent = message;

    const wrap = input.closest(".input-wrap");

    if (wrap) {
        wrap.classList.toggle("has-error", Boolean(message));
    }
}

// =========================================================
// EMAIL VALIDATION
// =========================================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================================================
// PASSWORD STRENGTH
// =========================================================

function passwordScore(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}

function updateStrength() {
    const password = $("password").value;
    const score = password ? passwordScore(password) : 0;

    const bars = document.querySelectorAll(".strength-track span");
    const label = $("strengthLabel");

    const colors = ["#ff7b83", "#ffbd69", "#64a6ff", "#58dfb0"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    bars.forEach((bar, index) => {
        bar.style.background =
            index < score
                ? colors[score - 1]
                : "rgba(174, 190, 255, .16)";
    });

    label.textContent = score ? labels[score - 1] : "No rating";
    label.style.color = score ? colors[score - 1] : "#77819b";
}

$("password").addEventListener("input", updateStrength);

// =========================================================
// REGISTRATION FORM SUBMISSION
// =========================================================

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous errors
    const fields = {
        fullName: "nameError",
        email: "emailError",
        password: "passwordError",
        confirmPassword: "confirmError"
    };

    Object.entries(fields).forEach(([inputId, errorId]) => {
        setError(inputId, errorId, "");
    });

    $("termsError").textContent = "";
    $("formMessage").textContent = "";

    // Get form values
    const name = $("fullName").value.trim();
    const email = $("email").value.trim();
    const password = $("password").value;
    const confirmPassword = $("confirmPassword").value;

    let valid = true;

    // Name validation
    if (name.length < 2) {
        setError(
            "fullName",
            "nameError",
            "Enter your name (at least 2 characters)."
        );
        valid = false;
    }

    // Email validation
    if (!email) {
        setError(
            "email",
            "emailError",
            "Please enter your email address."
        );
        valid = false;
    } else if (!isValidEmail(email)) {
        setError(
            "email",
            "emailError",
            "Enter a valid email address."
        );
        valid = false;
    }

    // Password validation
    if (
        password.length < 8 ||
        password.length > 72 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password)
    ) {
        setError(
            "password",
            "passwordError",
            "Use 8–72 characters with uppercase, lowercase, and at least one number."
        );
        valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
        setError(
            "confirmPassword",
            "confirmError",
            "Please confirm your password."
        );
        valid = false;
    } else if (password !== confirmPassword) {
        setError(
            "confirmPassword",
            "confirmError",
            "Passwords do not match."
        );
        valid = false;
    }

    // Terms validation
    if (!$("acceptTerms").checked) {
        $("termsError").textContent =
            "Please accept the Terms of Service and Privacy Policy.";

        valid = false;
    }

    if (!valid) return;

    // Disable submit button during API request
    const submitButton = registerForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
    }

    $("formMessage").textContent = "Creating your account...";

    try {
        // Send registration request to Spring Boot
        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: name,
                    email: email,
                    password: password
                })
            }
        );

        // Safely read backend response
        const responseText = await response.text();

        let data = {};

        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch {
            data = {};
        }

        // Handle backend errors
        if (!response.ok) {

            if (response.status === 409) {
                throw new Error(
                    "This email is already registered. Please log in or use another email."
                );
            }

            if (response.status === 400) {
                throw new Error(
                    data.message ||
                    "Please check your registration details."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    "Access denied. Check your backend security and CORS configuration."
                );
            }

            throw new Error(
                data.message ||
                data.detail ||
                `Registration failed (HTTP ${response.status}).`
            );
        }

        // Successful registration
        $("formMessage").textContent =
            data.message || "Account created successfully! Please log in.";

        registerForm.reset();
        updateStrength();

    } catch (error) {
        console.error("Registration error:", error);

        $("formMessage").textContent =
            error.message || "Unable to connect to the server.";

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
});

// =========================================================
// GOOGLE SIGN-UP PLACEHOLDER
// =========================================================

$("googleButton").addEventListener("click", () => {
    $("formMessage").textContent =
        "Google sign-up will be enabled after OAuth integration.";
});

// =========================================================
// CLEAR FIELD ERRORS WHILE TYPING
// =========================================================

["fullName", "email", "password", "confirmPassword"].forEach((id) => {

    $(id).addEventListener("input", () => {

        const errorId = {
            fullName: "nameError",
            email: "emailError",
            password: "passwordError",
            confirmPassword: "confirmError"
        }[id];

        if ($(errorId).textContent) {
            setError(id, errorId, "");
        }
    });
});

// =========================================================
// CLEAR TERMS ERROR
// =========================================================

$("acceptTerms").addEventListener("change", () => {
    $("termsError").textContent = "";
});
