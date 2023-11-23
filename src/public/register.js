const baseUrl = "http://localhost:3000";

const register = async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  console.log("register clicked");
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const userData = {
    username,
    email,
    password,
  };

  console.log(userData);
  axios.post(`${baseUrl}/api/users`, {
    userData,
  });
};
