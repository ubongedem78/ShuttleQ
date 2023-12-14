// const baseUrl = "https://shuttleq.onrender.com";
const baseUrl = "http://localhost:3000";
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const containsSpecialCharacters = (userName) => {
  const specialCharacters = "!@#$%^&*()_+<>?:{}|[]-=";
  return Array.from(userName).some((char) => specialCharacters.includes(char));
};

const register = async () => {
  const userName = document.getElementById("registerUsername").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!userName || !email || !password) {
    displayErrorMessage("Please fill out all fields");
    return;
  }

  if (password.length < 8) {
    displayErrorMessage("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    displayErrorMessage("Passwords do not match");
    return;
  }

  if (!isValidEmail(email)) {
    displayErrorMessage("Please enter a valid email");
    return;
  }

  if (
    userName.length < 3 ||
    userName.length > 20 ||
    userName.includes(" ") ||
    containsSpecialCharacters(userName)
  ) {
    displayErrorMessage("Invalid userName");
    return;
  }

  const userData = {
    userName,
    email,
    password,
  };

  try {
    const response = await axios.post(`${baseUrl}/api/v1/register`, userData);

    localStorage.setItem("jwt", response.data.token);

    const userId = localStorage.setItem("userId", response.data.user.id);
    window.location.href = "home.html";
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error.msg
    ) {
      displayErrorMessage(error.response.data.error.msg);
    } else {
      console.error("Error during registration:", error);
    }
  }
};

function displayErrorMessage(message) {
  const errorMessageElement = document.createElement("div");
  errorMessageElement.classList.add("error-message");
  errorMessageElement.innerText = message;
  document.body.appendChild(errorMessageElement);

  setTimeout(() => {
    errorMessageElement.remove();
  }, 2000);
}
