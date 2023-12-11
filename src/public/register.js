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
    console.error("Error during registration:", error);
  } finally {
    loader.classList.remove("show");
  }
};
