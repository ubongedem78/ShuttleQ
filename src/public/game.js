document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:3000";
  // const baseUrl = "https://shuttleq.onrender.com";
  const decrementScoreTeam1 = document.getElementById("decrement-score-team1");
  const incrementScoreTeam1 = document.getElementById("team1-score");
  const decrementScoreTeam2 = document.getElementById("decrement-score-team2");
  const incrementScoreTeam2 = document.getElementById("team2-score");
  let teamA = document.getElementById("team1-players");
  let teamB = document.getElementById("team2-players");
  const endGameButton = document.getElementById("endGame");
  const backButton = document.getElementById("back-button");

  const gameId = new URLSearchParams(window.location.search).get("gameId");
  let winnerId = null;
  let deuce = false;
  let confirmWinnerCheck = false;
  let game;

  const WINNING_SCORE = 21;
  const DEUCE_THRESHOLD = 20;
  const MAX_SCORE = 30;

  axios
    .get(`${baseUrl}/api/v1/games/${gameId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
      game = response.data.game;
      teamA.textContent = game.teamAName;
      teamB.textContent = game.teamBName;

      let team1Score = 0;
      let team2Score = 0;

      incrementScoreTeam1.addEventListener("click", () => {
        if (confirmWinnerCheck) {
          return;
        }
        team1Score++;
        updateScores();
      });

      incrementScoreTeam2.addEventListener("click", () => {
        if (confirmWinnerCheck) {
          return;
        }
        team2Score++;
        updateScores();
      });

      decrementScoreTeam1.addEventListener("click", () => {
        if (confirmWinnerCheck) {
          return;
        }
        if (team1Score > 0) {
          team1Score--;
        }
        //check for deuce condition when decrementing
        if (deuce && team1Score >= DEUCE_THRESHOLD && team2Score < team1Score) {
          deuce = false;
        }
        updateScores();
      });

      decrementScoreTeam2.addEventListener("click", () => {
        if (confirmWinnerCheck) {
          return;
        }
        if (team2Score > 0) {
          team2Score--;
        }
        //check for deuce condition when decrementing
        if (deuce && team1Score >= DEUCE_THRESHOLD && team2Score < team1Score) {
          deuce = false; // Exiting deuce condition
        }
        updateScores();
      });

      function updateScores() {
        if (
          (team1Score === WINNING_SCORE || team2Score === WINNING_SCORE) &&
          !deuce
        ) {
          determineWinner();
        } else if (
          team1Score >= DEUCE_THRESHOLD &&
          team2Score >= DEUCE_THRESHOLD &&
          Math.abs(team1Score - team2Score) === 2
        ) {
          determineWinner();
        } else if (
          team1Score >= DEUCE_THRESHOLD &&
          team2Score >= DEUCE_THRESHOLD &&
          Math.abs(team1Score - team2Score) === 0 &&
          team1Score !== 29
        ) {
          displayDeuceMessage();
        } else if (team1Score === MAX_SCORE || team2Score === MAX_SCORE) {
          determineWinner();
        }

        updateScoresUI();
      }

      function determineWinner() {
        const confirmWinner = confirm(
          `Confirm ${
            team1Score > team2Score ? game.teamAName : game.teamBName
          } as the winner?`
        );

        if (!confirmWinner) {
          team1Score > team2Score ? team1Score-- : team2Score--;
          return;
        } else {
          winnerId = team1Score > team2Score ? game.teamAId : game.teamBId;
          console.log("winnerId", winnerId);
          confirmWinnerCheck = true;
        }
      }

      function updateScoresUI() {
        document.getElementById("team1-score").textContent = team1Score;
        document.getElementById("team2-score").textContent = team2Score;
      }

      function displayDeuceMessage() {
        deuce = true;
        const deuceMessage = document.getElementById("deuce-message");
        deuceMessage.textContent = "Deuce!";
        deuceMessage.style.display = "block";

        setTimeout(() => {
          deuceMessage.style.display = "none";
        }, 2000);
      }

      endGameButton.addEventListener("click", () => {
        if (winnerId) {
          showLoader();

          axios
            .put(
              `${baseUrl}/api/v1/games/${gameId}`,
              {
                winnerId: winnerId,
                teamAScore: team1Score,
                teamBScore: team2Score,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              }
            )
            .then((response) => {
              console.log("response", response);
              if (response.status === 200) {
                window.location.href = "home.html";
              }
            })
            .catch((error) => {
              console.error("error", error);
              displayErrorMessage("Error ending the game. Please try again.");
            })
            .finally(() => {
              hideLoader();
            });
        } else {
          displayErrorMessage(
            "Please confirm the winner before ending the game."
          );
        }
      });
    })
    .catch((error) => {
      console.error("error", error);
      displayErrorMessage("Error fetching game information. Please try again.");
    });

  backButton.addEventListener("click", () => {
    window.location.href = "home.html";
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
