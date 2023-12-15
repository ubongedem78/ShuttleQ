const playAsGuest = async () => {
  const guestUsername = document.getElementById("guestUsernameInput").value;

  if (!guestUsername) {
    displayErrorMessage("Please enter a username");
    return;
  }

  try {
    showLoader();
    const response = await axios.post(`${baseUrl}/api/v1/guests`, {
      guestName: guestUsername,
    });

    if (response.status === 201 && response.data && response.data.token) {
      localStorage.setItem("jwt", response.data.token);

      localStorage.setItem("userId", response.data.guest.id);

      window.location.href = "home.html";
    } else {
      displayErrorMessage(error.response.data.error.msg);
      console.error("Error during login: Unexpected server response", response);
    }
  } catch (error) {
    displayErrorMessage(error.response.data.error.msg);
    console.error("Error whilst registering guest: ", error);
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
