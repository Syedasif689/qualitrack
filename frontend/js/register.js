// =========================================================
// QUALITRACK REGISTRATION — frontend only
// Account creation and Google OAuth will be connected later.
// =========================================================
const $ = (id) => document.getElementById(id);

$("currentYear").textContent = new Date().getFullYear();

function attachPasswordToggle(inputId, buttonId) {
  const input = $(inputId);
  const button = $(buttonId);

  button.addEventListener("click", () => {
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    button.textContent = showing ? "Show" : "Hide";
    button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    button.setAttribute("aria-pressed", String(!showing));
  });
}

attachPasswordToggle("password", "passwordToggle");
attachPasswordToggle("confirmPassword", "confirmToggle");

function setError(inputId, errorId, message) {
  const input = $(inputId);
  $(errorId).textContent = message;
  const wrap = input.closest(".input-wrap");
  if (wrap) wrap.classList.toggle("has-error", Boolean(message));
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
    bar.style.background = index < score ? colors[score - 1] : "rgba(174, 190, 255, .16)";
  });
  label.textContent = score ? labels[score - 1] : "No rating";
  label.style.color = score ? colors[score - 1] : "#77819b";
}

$("password").addEventListener("input", updateStrength);

$("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  ["fullName", "email", "password", "confirmPassword"].forEach((id) => {
    const errorId = {
      fullName: "nameError",
      email: "emailError",
      password: "passwordError",
      confirmPassword: "confirmError"
    }[id];
    setError(id, errorId, "");
  });
  $("termsError").textContent = "";
  $("formMessage").textContent = "";

  const name = $("fullName").value.trim();
  const email = $("email").value.trim();
  const password = $("password").value;
  const confirmPassword = $("confirmPassword").value;
  let valid = true;

  if (name.length < 2) {
    setError("fullName", "nameError", "Enter your name (at least 2 characters).");
    valid = false;
  }

  if (!email) {
    setError("email", "emailError", "Please enter your email address.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "emailError", "Enter a valid email address.");
    valid = false;
  }

  if (password.length < 8 || !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) || !/\d/.test(password)) {
    setError("password", "passwordError",
      "Use 8+ characters with uppercase, lowercase, and at least one number.");
    valid = false;
  }

  if (!confirmPassword) {
    setError("confirmPassword", "confirmError", "Please confirm your password.");
    valid = false;
  } else if (password !== confirmPassword) {
    setError("confirmPassword", "confirmError", "Passwords do not match.");
    valid = false;
  }

  if (!$("acceptTerms").checked) {
    $("termsError").textContent = "Please accept the Terms of Service and Privacy Policy.";
    valid = false;
  }

  if (!valid) return;

  $("formMessage").textContent =
    "Details validated successfully. Connect the backend to create your account.";
});

$("googleButton").addEventListener("click", () => {
  $("formMessage").textContent =
    "Google sign-up will be enabled when OAuth is connected to the backend.";
});

["fullName", "email", "password", "confirmPassword"].forEach((id) => {
  $(id).addEventListener("input", () => {
    const errorId = {
      fullName: "nameError",
      email: "emailError",
      password: "passwordError",
      confirmPassword: "confirmError"
    }[id];
    if ($(errorId).textContent) setError(id, errorId, "");
  });
});

$("acceptTerms").addEventListener("change", () => {
  $("termsError").textContent = "";
});
