const continueAsGuest = async () => {
  const guestUsernameInput = document.getElementById("guestUsername");
  const guestUsername = guestUsernameInput.value.trim();

  if (!guestUsername) {
    displayErrorMessage("Guest username is required");
    return;
  }

  try {
    showLoader();
    const response = await axios.post(`${baseUrl}/api/v1/loginGuest`, {
      guestName: guestUsername,
    });

    if (response.status === 200 && response.data) {
      const userId = response.data.guest.id;
      localStorage.setItem("userId", userId);

      window.location.href = "home.html";
    } else {
      console.error("Error during login: Unexpected server response", response);
      displayErrorMessage("Unexpected server response during login");
    }
  } catch (error) {
    console.error("Error while registering guest:", error.message);
    displayErrorMessage("Error while registering guest. Please try again.");
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
