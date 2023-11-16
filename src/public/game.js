// let baseUrl = "https://shuttleq.onrender.com";
document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:3000";
  const startGameButton = document.getElementById("startGame");
  const endGameButton = document.getElementById("endGame");
  const team1Score = document.getElementById("team1-score");
  const team2Score = document.getElementById("team2-score");
  const decrementScoreTeam1 = document.getElementById("decrement-score-team1");
  const decrementScoreTeam2 = document.getElementById("decrement-score-team2");
  const teamA = document.getElementById("team1-players");
  const teamB = document.getElementById("team2-players");
  const backButton = document.getElementById("back-button");

  let scoreTeam1 = 0;
  let scoreTeam2 = 0;
  let prevScoreTeam1 = 0;
  let prevScoreTeam2 = 0;
  let deuceTimer;
  let winnerId;

  function updateScores() {
    team1Score.textContent = scoreTeam1;
    team2Score.textContent = scoreTeam2;

    if (scoreTeam1 >= 21 && scoreTeam1 - scoreTeam2 >= 2) {
      winnerId = teamA.id;
      handleWinnerConfirmation();
    } else if (scoreTeam2 >= 21 && scoreTeam2 - scoreTeam1 >= 2) {
      winnerId = teamB.id;
      handleWinnerConfirmation();
    }
  }

  function handleWinnerConfirmation() {
    showConfirmationDialog();
    // Blur out scoring after having a winner
    team1Score.blur();
    team2Score.blur();
  }

  function showConfirmationDialog() {
    // Show a confirmation dialog box
    const confirmation = window.confirm(
      `Confirm Team ${winnerId} as the winner?`
    );

    if (confirmation) {
      console.log(`Team ${winnerId} confirmed as the winner`);
      winnerId = winnerId;
    } else {
      // User clicked "Cancel" in the dialog
      // Revert scores to previous state
      // scoreTeam1 = prevScoreTeam1;
      // scoreTeam2 = prevScoreTeam2;
      // updateScores();

      team1Score.focus();
      team2Score.focus();
    }
  }

  function handleDeuce() {
    const deuceMessage = document.createElement("div");
    deuceMessage.textContent = "Deuce!";
    document.body.appendChild(deuceMessage);

    deuceTimer = setTimeout(() => {
      document.body.removeChild(deuceMessage);
    }, 2000);
  }

  function handleScoreIncrement(score, opponentScore) {
    if (
      score >= 20 &&
      opponentScore >= 20 &&
      Math.abs(score - opponentScore) === 0
    ) {
      handleDeuce();
    }
    updateScores();
  }

  // Event listeners for scoring

  team1Score.addEventListener("click", () => {
    if (!winnerId) {
      prevScoreTeam1 = scoreTeam1;
      scoreTeam1 += 1;
      handleScoreIncrement(scoreTeam1, scoreTeam2);
    }
  });

  team2Score.addEventListener("click", () => {
    if (!winnerId) {
      prevScoreTeam2 = scoreTeam2;
      scoreTeam2 += 1;
      handleScoreIncrement(scoreTeam2, scoreTeam1);
    }
  });

  decrementScoreTeam1.addEventListener("click", () => {
    if (scoreTeam1 > 0 && !winnerId) {
      prevScoreTeam1 = scoreTeam1;
      scoreTeam1 -= 1;
      clearTimeout(deuceTimer);
      updateScores();
    }
  });

  decrementScoreTeam2.addEventListener("click", () => {
    if (scoreTeam2 > 0 && !winnerId) {
      prevScoreTeam2 = scoreTeam2;
      scoreTeam2 -= 1;
      clearTimeout(deuceTimer);
      updateScores();
    }
  });

  // Event listener for the start game button

  startGameButton.addEventListener("click", () => {
    console.log("Start Game button clicked");

    axios
      .put(`${baseUrl}/api/games/${gameId}/start`, {
        gameId: gameId,
      })
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });

  // Event listener for the end game button

  endGameButton.addEventListener("click", () => {
    console.log("End Game button clicked");
  });

  // Event listener for the back button

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

// Remember to handle where the game is over and the winner is declared
// start game button must be clicked if not scoring is blured and end game is somewhat disabled

//routes

// router.get("/games/:gameId", fetchGameDetails);
// router.post("/games", createGame);
// router.put("/games/:gameId/start", startGame);
// router.put("/games/:gameId/end", endGame);
