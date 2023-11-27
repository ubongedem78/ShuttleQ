const baseUrl = "http://localhost:3000";

const register = async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  console.log("register clicked");

  if (!username || !email || !password) {
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

  if (isValidEmail(email)) {
    alert("Please enter a valid email");
    return;
  }

  if (
    username.length < 3 ||
    username.length > 20 ||
    username.includes(" ") ||
    containsSpecialCharacters(username)
  ) {
    alert("Invalid username");
    return;
  }

  const specialCharacters = "!@#$%^&*()_+<>?:{}|[]-=";
  for (let i = 0; i < username.length; i++) {
    if (specialCharacters.includes(username[i])) {
      alert("Username cannot contain special characters");
      return;
    }
  }

  const userData = {
    username,
    email,
    password,
  };

  console.log(userData);

  try {
    const response = await axios.post(`${baseUrl}/api/users`, userData);
    console.log("Registration successful:", response.data);
  } catch (error) {
    console.error("Error during registration:", error);
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const containsSpecialCharacters = (username) => {
    const specialCharacters = "!@#$%^&*()_+<>?:{}|[]-=";
    return Array.from(username).some((char) =>
      specialCharacters.includes(char)
    );
  };
};
