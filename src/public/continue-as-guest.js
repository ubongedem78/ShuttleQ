// const baseUrl = "https://shuttleq.onrender.com";
const continueAsGuest = async () => {
  const guestUsername = document.getElementById("guestUsername").value;

  console.log(`Playing as guest with username: ${guestUsername}`);

  try {
    const response = await axios.post(`${baseUrl}/api/v1/loginGuest`, {
      guestName: guestUsername,
    });

    if (response.status === 200 && response.data && response.data.token) {
      console.log("Login successful:", response.data);
      localStorage.setItem("jwt", response.data.token);
      console.log("JWT saved to localStorage", localStorage.getItem("jwt"));
      const userId = localStorage.setItem("userId", response.data.guest.id);
      console.log("userId", userId);
      window.location.href = "home.html";
    } else {
      console.error("Error during login: Unexpected server response", response);
    }
  } catch (error) {
    console.log("Error whilst registering guest: ", error);
  }
};
