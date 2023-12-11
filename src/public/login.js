// const baseUrl = "https://shuttleq.onrender.com";
const login = async () => {
  const userName = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post(`${baseUrl}/api/v1/login`, {
      userName,
      password,
    });

    if (response.status === 200 && response.data && response.data.token) {
      console.log("Login successful:", response.data);
      localStorage.setItem("jwt", response.data.token);
      console.log("JWT saved to localStorage", localStorage.getItem("jwt"));
      const userId = localStorage.setItem("userId", response.data.user.id);
      console.log("userId", userId);
      window.location.href = "home.html";
    } else {
      console.error("Error during login: Unexpected server response", response);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};
