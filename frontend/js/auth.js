
// =========================================================
// QUALITRACK AUTH — connected to Spring Boot backend
// =========================================================

const $ = (id) => document.getElementById(id);

const API_BASE_URL = "http://localhost:8080/api";

$("currentYear").textContent = new Date().getFullYear();

const passwordInput = $("password");
const passwordToggle = $("passwordToggle");
const loginForm = $("loginForm");

passwordToggle.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    passwordToggle.textContent = showing ? "Show" : "Hide";
    passwordToggle.setAttribute(
        "aria-label",
        showing ? "Show password" : "Hide password"
    );
    passwordToggle.setAttribute("aria-pressed", String(!showing));
});

function setError(inputId, errorId, message) {
    const input = $(inputId);
    const error = $(errorId);

    error.textContent = message;
    input.closest(".input-wrap").classList.toggle(
        "has-error",
        Boolean(message)
    );
}

function clearErrors() {
    setError("email", "emailError", "");
    setError("password", "passwordError", "");
    $("formMessage").textContent = "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const email = $("email").value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!email) {
        setError("email", "emailError", "Please enter your email address.");
        valid = false;
    } else if (!isValidEmail(email)) {
        setError("email", "emailError", "Enter a valid email address.");
        valid = false;
    }

    if (!password) {
        setError("password", "passwordError", "Please enter your password.");
        valid = false;
    }

    if (!valid) return;

    const submitButton = loginForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) submitButton.disabled = true;

    const formMessage = $("formMessage");
    formMessage.textContent = "Signing in...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.detail ||
                "Invalid email or password."
            );
        }

        if (!data.token) {
            throw new Error("Login succeeded but no token was returned.");
        }

        // Store the token for this browser session.
        sessionStorage.setItem("qualitrackToken", data.token);

        // Store basic user information for dashboard display.
        sessionStorage.setItem(
            "qualitrackUser",
            JSON.stringify({
                id: data.id,
                fullName: data.fullName,
                email: data.email,
                role: data.role
            })
        );

        formMessage.textContent = "Login successful! Opening dashboard...";

        window.location.href = "dashboard.html";

    } catch (error) {
        formMessage.textContent =
            error.message || "Unable to connect to the server.";
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});

// Google OAuth is not implemented yet.
$("googleButton").addEventListener("click", () => {
    $("formMessage").textContent =
        "Google sign-in will be enabled after OAuth integration.";
});

["email", "password"].forEach((id) => {
    $(id).addEventListener("input", () => {
        const errorId = id === "email" ? "emailError" : "passwordError";

        if ($(errorId).textContent) {
            setError(id, errorId, "");
        }
    });
});
