// =========================================================
// QUALITRACK AUTH — frontend interactions only
// Real authentication will be connected to Spring Boot later.
// =========================================================

const $ = (id) => document.getElementById(id);

$("currentYear").textContent = new Date().getFullYear();

const passwordInput = $("password");
const passwordToggle = $("passwordToggle");

passwordToggle.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  passwordToggle.textContent = showing ? "Show" : "Hide";
  passwordToggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  passwordToggle.setAttribute("aria-pressed", String(!showing));
});

function setError(inputId, errorId, message) {
  const input = $(inputId);
  const error = $(errorId);
  error.textContent = message;
  input.closest(".input-wrap").classList.toggle("has-error", Boolean(message));
}

function clearErrors() {
  setError("email", "emailError", "");
  setError("password", "passwordError", "");
  $("formMessage").textContent = "";
}

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const email = $("email").value.trim();
  const password = passwordInput.value;
  let valid = true;

  if (!email) {
    setError("email", "emailError", "Please enter your email address.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "emailError", "Enter a valid email address.");
    valid = false;
  }

  if (!password) {
    setError("password", "passwordError", "Please enter your password.");
    valid = false;
  }

  if (!valid) return;

  $("formMessage").textContent =
    "Frontend validation successful. Connect the backend to sign in.";
});

// Google OAuth is intentionally not simulated in the frontend.
$("googleButton").addEventListener("click", () => {
  $("formMessage").textContent =
    "Google sign-in will be enabled when OAuth is connected to the backend.";
});

["email", "password"].forEach((id) => {
  $(id).addEventListener("input", () => {
    const errorId = id === "email" ? "emailError" : "passwordError";
    if ($(errorId).textContent) setError(id, errorId, "");
  });
});
