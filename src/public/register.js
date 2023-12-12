const baseUrl = "http://localhost:3000";
// const baseUrl = "https://shuttleq.onrender.com";
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
  const loader = document.getElementById("loader");

  loader.classList.add("show");

  if (!userName || !email || !password) {
    loader.classList.remove("show");
    alert("Please fill out all fields");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email");
    return;
  }

  if (
    userName.length < 3 ||
    userName.length > 20 ||
    userName.includes(" ") ||
    containsSpecialCharacters(userName)
  ) {
    alert("Invalid userName");
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
    if (error.response && error.response.data && error.response.data.msg) {
      showError(error.response.data.msg);
    } else {
      console.error("Error during registration:", error);
    }
  } finally {
    loader.classList.remove("show");
  }
};

const showError = (message) => {
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-container";
  errorContainer.textContent = message;

  // Styling for the error container
  errorContainer.style.position = "fixed";
  errorContainer.style.top = "10px";
  errorContainer.style.left = "50%";
  errorContainer.style.transform = "translateX(-50%)";
  errorContainer.style.backgroundColor = "#ffc4c4";
  errorContainer.style.color = "#721c24";
  errorContainer.style.padding = "10px";
  errorContainer.style.borderRadius = "5px";
  errorContainer.style.textAlign = "center";
  errorContainer.style.zIndex = "9999";

  document.body.appendChild(errorContainer);

  // Remove the error message after 3 seconds (adjust the time as needed)
  setTimeout(() => {
    errorContainer.remove();
  }, 3000);
};
