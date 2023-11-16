document.addEventListener("DOMContentLoaded", function () {
  // let baseUrl = "https://shuttleq.onrender.com";
  let baseUrl = "http://localhost:3000";
  let queueData = [];
  let courtSelect = document.getElementById("courtSelect");
  function fetchQueues(courtId) {
    axios
      .get(`${baseUrl}/api/queues/${courtId}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("Queues fetched:", response.data);
          const queueList = document.getElementById("queueList");
          queueList.innerHTML = "";

          queueData = response.data.data;
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
        }
      })
      .catch((error) => {
        console.error("Error fetching queues:", error);
      });
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

  // Fetch the list of courts
  axios
    .get(`${baseUrl}/api/courts`)
    .then((response) => {
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
    })

    .catch((error) => {
      console.error("Error fetching courts:", error);
    });

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
    console.log(queueData);

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

  const addPlayerButton = document.getElementById("addPlayer");
  addPlayerButton.addEventListener("click", () => {
    console.log("Add player button clicked");
    window.location.href = "add-player.html";
  });
});
