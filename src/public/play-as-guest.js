// const baseUrl = "https://shuttleq.onrender.com";
const playAsGuest = async () => {
  const guestUsername = document.getElementById("guestUsernameInput").value;

  try {
    const response = await axios.post(`${baseUrl}/api/v1/guests`, {
      guestName: guestUsername,
    });

    if (response.status === 201 && response.data && response.data.token) {
      localStorage.setItem("jwt", response.data.token);

      const userId = localStorage.setItem("userId", response.data.guest.id);

      window.location.href = "home.html";
    } else {
      console.error("Error during login: Unexpected server response", response);
    }
  } catch (error) {
    console.error("Error whilst registering guest: ", error);
  }
};
