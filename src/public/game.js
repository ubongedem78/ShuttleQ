document.addEventListener("DOMContentLoaded", function () {
  const startGameButton = document.getElementById("startGame");
  const decrementScoreTeam1 = document.getElementById("decrement-score-team1");
  const incrementScoreTeam1 = document.getElementById("team1-score");
  const decrementScoreTeam2 = document.getElementById("decrement-score-team2");
  const incrementScoreTeam2 = document.getElementById("team2-score");
  const endGameButton = document.getElementById("endGame");
  const backButton = document.getElementById("back-button");
  // let baseUrl = "https://shuttleq.onrender.com";

  const gameId = window.location.pathname.split("/")[2];
  console.log("gameId", gameId);
  const baseUrl = "http://localhost:3000";
  let winnerId = null;
  let deuce = false;
  let confirmWinnerCheck = false;

  const WINNING_SCORE = 21;
  const DEUCE_THRESHOLD = 20;
  const MAX_SCORE = 30;

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
      `Is Team ${team1Score > team2Score ? "A" : "B"} the winner?`
    );

    if (!confirmWinner) {
      team1Score > team2Score ? team1Score-- : team2Score--;
      return;
    } else {
      winnerId = team1Score > team2Score ? "teamAId" : "teamBId";
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
    console.log("Deuce!");

    setTimeout(() => {
      deuceMessage.style.display = "none";
    }, 2000);
  }

  endGameButton.addEventListener("click", () => {
    console.log("End Game button clicked");

    if (winnerId) {
      axios
        .put(`${baseUrl}/api/games/${gameId}/end`, {
          winnerId: winnerId,
        })
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      alert("Please confirm the winner before ending the game.");
    }
  });

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
