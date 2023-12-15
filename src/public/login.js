const login = async () => {
  // const baseUrl = "https://shuttleq.onrender.com";
  const baseUrl = "http://localhost:3000";
  const userName = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!userName || !password) {
    displayErrorMessage("Please fill out all fields");
    return;
  }

  try {
    showLoader();
    const response = await axios.post(`${baseUrl}/api/v1/login`, {
      userName,
      password,
    });

    if (response.status === 200 && response.data && response.data.token) {
      localStorage.setItem("jwt", response.data.token);

      localStorage.setItem("userId", response.data.user.id);

      window.location.href = "home.html";
    } else {
      displayErrorMessage("Unexpected server response");
    }
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error.msg
    ) {
      displayErrorMessage(error.response.data.error.msg);
    } else {
      displayErrorMessage("Error during login. Please try again.");
      console.error("Error during login:", error);
    }
  } finally {
    hideLoader();
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
