// let baseUrl = "https://shuttleq.onrender.com";
let baseUrl = "http://localhost:3000";
let queueData = [];
let courtSelect = document.getElementById("courtSelect");

document.addEventListener("DOMContentLoaded", function () {
  function fetchQueues(courtId) {
    axios
      .get(`${baseUrl}/api/queue/${courtId}`)
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
      .delete(`${baseUrl}/api/queue/${teamId}`)
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
    .get(`${baseUrl}/api/court`)
    .then((response) => {
      console.log(response);
      const courts = response.data.data;

      courts.forEach((court) => {
        const option = document.createElement("option");
        option.value = court.courtId;
        option.textContent = court.courtName;
        courtSelect.appendChild(option);
      });

      // Listener to handle court selection
      courtSelect.addEventListener("change", (event) => {
        const selectedCourtId = event.target.value;
        fetchQueues(selectedCourtId);
      });
      fetchQueues(courtSelect.value);
    })

    .catch((error) => {
      console.error("Error fetching courts:", error);
    });

  // Create a game
  const createGameButton = document.getElementById("createGame");

  // Create a game
  createGameButton.addEventListener("click", () => {
    console.log("Create game button clicked");
    console.log(queueData);
    if (queueData.length > 0) {
      const gameType = queueData[0].gameType;
      const teamAId = queueData[0].teamId;
      const teamBId = queueData[1].teamId;
      const courtId = queueData[0].courtId;

      const gameData = {
        gameType: gameType,
        teamAId: teamAId,
        teamBId: teamBId,
        courtId: courtId,
      };

      axios
        .post(`${baseUrl}/api/game/create`, gameData)
        .then((response) => {
          if (response.status === 201) {
            console.log("Game created:", response.data);
            const gameId = response.data.game.id;
            const winnerId = response.data.game.winnerId;
            window.location.href = `game.html?gameId=${gameId}&winnerId=${winnerId}`;
          }
        })
        .catch((error) => {
          console.error("Error creating game:", error);
        });
    }
  });

  // http://127.0.0.1:5500/src/public/game.html?gameId=917c89d7-ee4a-4292-a24a-fa19762cbbfd?winnerId=null

  const addPlayerButton = document.getElementById("addPlayer");
  addPlayerButton.addEventListener("click", () => {
    console.log("Add player button clicked");
    window.location.href = "add-player.html";
  });
});
