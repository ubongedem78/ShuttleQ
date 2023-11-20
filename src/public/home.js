document.addEventListener("DOMContentLoaded", async function () {
  const baseUrl = "http://localhost:3000";
  // const baseUrl = "https://shuttleq.onrender.com";
  let queueData = [];
  let courtSelect = document.getElementById("courtSelect");

  async function fetchQueues(courtId) {
    try {
      const response = await axios.get(`${baseUrl}/api/queues/${courtId}`);
      if (response.status === 200) {
        console.log("Queues fetched:", response.data);
        queueData = response.data.data;
        updateQueueUI();
      }
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  }

  function deleteTeam(teamId) {
    axios
      .delete(`${baseUrl}/api/queues/${teamId}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("Team deleted:", teamId);
          fetchQueues(courtSelect.value);
        }
      })
      .catch((error) => {
        console.error("Error deleting team:", error);
      });
  }

  function updateQueueUI() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = "";

    queueData.forEach((entry) => {
      const playerName = entry.playerName;
      const gameType = entry.gameType;

      const queueEntryDiv = document.createElement("div");
      queueEntryDiv.textContent = `${playerName} - ${gameType}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteTeam(entry.id);
      });

      queueEntryDiv.appendChild(deleteButton);
      queueList.appendChild(queueEntryDiv);
    });
    console.log("queueData", queueData);
    if (queueData.length > 0) {
      const gameType = queueData[0].gameType;
      const teamAId = queueData[0].teamId;
      const teamBId = queueData[1].teamId;
      const teamAName = queueData[0].playerName;
      const teamBName = queueData[1].playerName;
      const courtId = queueData[0].courtId;

      const gameData = {
        gameType: gameType,
        teamAId: teamAId,
        teamBId: teamBId,
        teamAName: teamAName,
        teamBName: teamBName,
        courtId: courtId,
      };

      const createGameButton = document.getElementById("createGame");

      // Create a game
      createGameButton.addEventListener("click", () => {
        console.log("Create game button clicked");

        axios
          .post(`${baseUrl}/api/games`, gameData)
          .then((response) => {
            if (response.status === 201) {
              console.log("Game created:", response.data);
              window.location.href = `game.html?gameId=${response.data.game.id}`;
            }
          })
          .catch((error) => {
            console.error("Error creating game:", error);
          });
      });
    }
  }

  // Fetch the list of courts
  try {
    const response = await axios.get(`${baseUrl}/api/courts`);
    console.log(response);
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
    console.error("Error fetching courts:", error);
  }

  const addPlayerButton = document.getElementById("addPlayer");
  addPlayerButton.addEventListener("click", () => {
    console.log("Add player button clicked");
    window.location.href = "add-player.html";
  });
});
