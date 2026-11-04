
const resetForm = document.getElementById("resetPasswordForm");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const resetMessage = document.getElementById("resetMessage");

// Read token from URL
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get("token");

// Show / hide password
document.querySelectorAll(".password-toggle").forEach(button => {

  button.addEventListener("click", () => {

    const target = document.getElementById(button.dataset.target);

    if (target.type === "password") {
      target.type = "text";
      button.textContent = "Hide";
    } else {
      target.type = "password";
      button.textContent = "Show";
    }

  });

});

// Password strength calculation
function calculateStrength(password) {

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

// Update strength indicator
newPassword.addEventListener("input", () => {

  const password = newPassword.value;
  const score = calculateStrength(password);

  const levels = [
    { width: "0%", text: "Password strength", color: "transparent" },
    { width: "20%", text: "Very weak", color: "#ff6b75" },
    { width: "40%", text: "Weak", color: "#ff9b55" },
    { width: "60%", text: "Fair", color: "#e6c45b" },
    { width: "80%", text: "Strong", color: "#64a6ff" },
    { width: "100%", text: "Very strong", color: "#58dfb0" }
  ];

  const level = levels[score];

  strengthBar.style.width = level.width;
  strengthBar.style.background = level.color;

  strengthText.textContent = level.text;

  passwordError.textContent = "";
  resetMessage.textContent = "";

});

// Validate password
function isPasswordValid(password) {

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );

}

// Form submission
resetForm.addEventListener("submit", (event) => {

  event.preventDefault();

  passwordError.textContent = "";
  confirmError.textContent = "";
  resetMessage.textContent = "";
  resetMessage.className = "form-message";

  const password = newPassword.value;
  const confirmation = confirmPassword.value;

  if (!resetToken) {
    showMessage(
      "Reset token is missing. Please request a new password reset link.",
      "error"
    );
    return;
  }

  if (!isPasswordValid(password)) {
    passwordError.textContent =
      "Please meet all password requirements.";
    return;
  }

  if (password !== confirmation) {
    confirmError.textContent =
      "Passwords do not match.";
    return;
  }

  showMessage(
    "Frontend preview: Password update will work after Spring Boot integration.",
    "success"
  );

});

function showMessage(message, type) {

  resetMessage.textContent = message;
  resetMessage.classList.add(type);

}
