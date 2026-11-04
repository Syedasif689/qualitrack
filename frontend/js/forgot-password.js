
const form = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();

  emailError.textContent = "";
  formMessage.textContent = "";
  formMessage.className = "forgot-message";

  if (!email || !emailInput.checkValidity()) {
    emailError.textContent = "Please enter a valid email address.";
    return;
  }

  formMessage.textContent =
    "Frontend preview: Password reset will be enabled after backend integration.";

  formMessage.classList.add("success");
});
