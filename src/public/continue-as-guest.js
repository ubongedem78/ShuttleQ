// const baseUrl = "https://shuttleq.onrender.com";

const continueAsGuest = async () => {
  const guestUsernameInput = document.getElementById("guestUsername");
  const guestUsername = guestUsernameInput.value.trim();

  if (!guestUsername) {
    console.error("Guest username is required");
    return;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/v1/loginGuest`, {
      guestName: guestUsername,
    });

    if (response.status === 200 && response.data && response.data.token) {
      localStorage.setItem("jwt", response.data.token);

      const userId = response.data.guest.id;
      localStorage.setItem("userId", userId);

      window.location.href = "home.html";
    } else {
      console.error("Error during login: Unexpected server response", response);
    }
  } catch (error) {
    console.error("Error while registering guest:", error.message);
  }
};
