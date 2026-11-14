
// =========================================================
// QUALITRACK REGISTRATION — connected to Spring Boot
// =========================================================

const $ = (id) => document.getElementById(id);

const API_BASE_URL = "http://localhost:8080/api";

$("currentYear").textContent = new Date().getFullYear();

const registerForm = $("registerForm");

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

function setError(inputId, errorId, message) {
    const input = $(inputId);
    $(errorId).textContent = message;

    const wrap = input.closest(".input-wrap");

    if (wrap) {
        wrap.classList.toggle("has-error", Boolean(message));
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

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

    const name = $("fullName").value.trim();
    const email = $("email").value.trim();
    const password = $("password").value;
    const confirmPassword = $("confirmPassword").value;

    let valid = true;

    if (name.length < 2) {
        setError(
            "fullName",
            "nameError",
            "Enter your name (at least 2 characters)."
        );
        valid = false;
    }

    if (!email) {
        setError("email", "emailError", "Please enter your email address.");
        valid = false;
    } else if (!isValidEmail(email)) {
        setError("email", "emailError", "Enter a valid email address.");
        valid = false;
    }

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

    if (!$("acceptTerms").checked) {
        $("termsError").textContent =
            "Please accept the Terms of Service and Privacy Policy.";
        valid = false;
    }

    if (!valid) return;

    const submitButton = registerForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    $("formMessage").textContent = "Creating your account...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.detail ||
                "Unable to create your account."
            );
        }

        $("formMessage").textContent =
            "Account created successfully! Please log in.";

        // Registration does not automatically log the user in.
        registerForm.reset();
        updateStrength();

    } catch (error) {
        $("formMessage").textContent =
            error.message || "Unable to connect to the server.";
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

// Google OAuth is not implemented yet.
$("googleButton").addEventListener("click", () => {
    $("formMessage").textContent =
        "Google sign-up will be enabled after OAuth integration.";
});

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

$("acceptTerms").addEventListener("change", () => {
    $("termsError").textContent = "";
});
