const baseUrl = "http://localhost:3000";
// const baseUrl = "https://shuttleq.onrender.com";
const isValidEmail = (email) => {
  console.log("email: ", email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const containsSpecialCharacters = (userName) => {
  const specialCharacters = "!@#$%^&*()_+<>?:{}|[]-=";
  return Array.from(userName).some((char) => specialCharacters.includes(char));
};

const register = async () => {
  const userName = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const loader = document.getElementById("loader");

  console.log("register clicked");

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
    console.log("valid email check");
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

  console.log(userData);

  try {
    const response = await axios.post(`${baseUrl}/api/register`, userData);
    console.log("Registration successful:", response.data);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error during registration:", error);
  } finally {
    loader.classList.remove("show");
  }
};
