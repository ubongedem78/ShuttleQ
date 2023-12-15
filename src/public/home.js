const baseUrl = "https://shuttleq.onrender.com";


document.addEventListener("DOMContentLoaded", async function () {
  let queueData = [];
  let courtSelect = document.getElementById("courtSelect");
  let gameData;

  async function fetchQueues(courtId) {
    try {
      showLoader();
      const response = await axios.get(`${baseUrl}/api/v1/queues/${courtId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (response.status === 200) {
        queueData = response.data.data;
        updateQueueUI();
      }
    } catch (error) {
      console.error("Error fetching queues:", error);
      displayErrorMessage("Error fetching queues. Please try again.");
    } finally {
      hideLoader();
    }
  }

  function deleteTeam(teamId) {
    axios
      .delete(`${baseUrl}/api/v1/queues/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          fetchQueues(courtSelect.value);
        }
      })
      .catch((error) => {
        console.error("Error deleting team:", error);
        displayErrorMessage(error.response.data.error.msg);
      });
  }

  function updateQueueUI() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = "";

    queueData.forEach((entry) => {
      const playerName = entry.playerName;
      const gameType = entry.gameType;

      const queueEntryDiv = document.createElement("div");
      queueEntryDiv.classList.add("queue-entry-container");
      queueEntryDiv.textContent = `${playerName}`;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteTeam(entry.id);
      });

      queueEntryDiv.appendChild(deleteButton);
      queueList.appendChild(queueEntryDiv);
    });

    if (queueData.length > 0) {
      const gameType = queueData[0].gameType;
      const teamAId = queueData[0].teamId;
      const teamBId = queueData[1] ? queueData[1].teamId : null;
      const teamAName = queueData[0].playerName;
      const teamBName = queueData[1] ? queueData[1].playerName : null;
      const courtId = queueData[0].courtId;

      gameData = {
        gameType: gameType,
        teamAId: teamAId,
        teamBId: teamBId,
        teamAName: teamAName,
        teamBName: teamBName,
        courtId: courtId,
      };

      const createGameButton = document.getElementById("createGame");

      // Create a game
      createGameButton.addEventListener("click", async () => {
        showLoader();
        try {
          const response = await axios.post(
            `${baseUrl}/api/v1/games`,
            gameData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );

          if (response.status === 201 && response.data && response.data.game) {
            const gameId = response.data.game.id;

            // Redirect to the game page
            window.location.href = `game.html?gameId=${gameId}`;
          } else {
            displayErrorMessage(error.response.data.error.msg);
            console.error(
              "Error creating game: Unexpected server response",
              response
            );
          }
        } catch (error) {
          displayErrorMessage(error.response.data.error.msg);
          console.error("Error creating game:", error);
        } finally {
          hideLoader();
        }
      });
    }
  }

  // Fetch the list of courts
  try {
    showLoader();
    const response = await axios.get(`${baseUrl}/api/v1/courts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    const courts = response.data.data;

    courts.forEach((court) => {
      const option = document.createElement("option");
      option.value = court.courtId;
      option.textContent = court.courtName;
      courtSelect.appendChild(option);
    });

    courtSelect.addEventListener("change", (event) => {
      const selectedCourtId = event.target.value;
      fetchQueues(selectedCourtId);
    });

    fetchQueues(courtSelect.value);
  } catch (error) {
    displayErrorMessage(error.response.data.error.msg);
    console.error("Error fetching courts:", error);
  } finally {
    hideLoader();
  }

  const addPlayerButton = document.getElementById("addPlayer");
  addPlayerButton.addEventListener("click", () => {
    window.location.href = "add-player.html";
  });
  const addCourtButton = document.getElementById("addCourt");
  addCourtButton.addEventListener("click", () => {
    window.location.href = "court.html";
  });

  async function fetchUserData() {
    try {
      showLoader();
      const id = localStorage.getItem("userId");
      const response = await axios.get(`${baseUrl}/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const user = response.data.user;
      const guest = response.data.guest;

      if (user) {
        const userGreeting = document.getElementById("userGreeting");
        userGreeting.textContent = `Hello, ${user.userName}!`;
      } else if (guest) {
        const userGreeting = document.getElementById("userGreeting");
        userGreeting.textContent = `Hello, ${guest.userName}!`;
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
      displayErrorMessage("Error fetching user information. Please try again.");
    } finally {
      hideLoader();
    }
  }
  await fetchUserData();

  async function logout() {
    showLoader();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/logout`);

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("userId");
        window.location.href = "index.html";
      } else {
        displayErrorMessage(error.response.data.error.msg);
        console.error("Error during logout:", response);
      }
    } catch (error) {
      displayErrorMessage(error.response.data.error.msg);
      console.error("Error during logout:", error);
    } finally {
      hideLoader();
    }
  }

  // Fetch user information and update the greeting
  try {
    showLoader();
    const id = localStorage.getItem("userId");
    const response = await axios.get(`${baseUrl}/api/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const user = response.data.user;

    if (user) {
      const userGreeting = document.getElementById("userGreeting");
      userGreeting.textContent = `Hello, ${user.userName}!`;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    displayErrorMessage("Error during logout. Please try again.");
  } finally {
    hideLoader();
  }

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });

  const endSession = document.getElementById("endSession");
  endSession.addEventListener("click", async () => {
    try {
      showLoader();
      // end session for a particular court
      const courtId = courtSelect.value;

      const response = await axios.delete(
        `${baseUrl}/api/v1/sessions/${courtId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.href = "home.html";
      }
    } catch (error) {
      displayErrorMessage("Failed to end session. Please try again");
    } finally {
      hideLoader();
    }
  });
});

function displayErrorMessage(message) {
  const errorMessageElement = document.createElement("div");
  errorMessageElement.classList.add("error-message");
  errorMessageElement.innerText = message;
  document.body.appendChild(errorMessageElement);

  setTimeout(() => {
    errorMessageElement.remove();
  }, 2000);
}

function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}
