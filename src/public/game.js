// let baseUrl = "https://shuttleq.onrender.com";
let baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  const startGameButton = document.getElementById("startGame");
  const endGameButton = document.getElementById("endGame");
  const team1Score = document.getElementById("team1-score");
  const team2Score = document.getElementById("team2-score");
  const teamA = document.getElementById("team1-players");
  const teamB = document.getElementById("team2-players");
  const decrementScoreTeam1 = document.getElementById("decrement-score-team1");
  const decrementScoreTeam2 = document.getElementById("decrement-score-team2");

  const urlParams = new URLSearchParams(window.location.search);
  console.log("urlParams", urlParams);
  const gameId = urlParams.get("gameId");
  const winnerId = urlParams.get("winnerId");

  console.log("Game ID:", gameId);
  console.log("Winner ID:", winnerId);

  axios
    .get(`${baseUrl}/api/games/${gameId}`)
    .then((response) => {
      console.log("response", response);
      const game = response.data.game;
      console.log("game", game);

      // update player names
      if (game.gameType === "SINGLES") {
        teamA.textContent = game.teamAName;
        teamB.textContent = game.teamBName;
      } else {
        const teamAPlayers = game.teamAName.split("/");
        const teamBPlayers = game.teamBName.split("/");
        teamA.textContent = `${teamAPlayers[0]} & ${teamAPlayers[1]}`;
        teamB.textContent = `${teamBPlayers[0]} & ${teamBPlayers[1]}`;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });

  let scoreTeam1 = 0;
  let scoreTeam2 = 0;

  function updateScores() {
    team1Score.textContent = scoreTeam1;
    team2Score.textContent = scoreTeam2;
  }

  // +
  team1Score.addEventListener("click", () => {
    scoreTeam1 += 1;
    updateScores();
  });

  team2Score.addEventListener("click", () => {
    scoreTeam2 += 1;
    updateScores();
  });

  // -
  decrementScoreTeam1.addEventListener("click", () => {
    if (scoreTeam1 > 0) {
      scoreTeam1 -= 1;
      updateScores();
    }
  });

  decrementScoreTeam2.addEventListener("click", () => {
    if (scoreTeam2 > 0) {
      scoreTeam2 -= 1;
      updateScores();
    }
  });

  startGameButton.addEventListener("click", () => {
    console.log("Start Game button clicked");

    axios
      .post(`${baseUrl}/api/games/start`, {
        gameId: gameId,
        winnerId: winnerId 
      })
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });

  endGameButton.addEventListener("click", () => {
    console.log("End Game button clicked");
  });
});

// Remember to handle where the game is over and the winner is declared
// start game button must be clicked if not scoring is blured and end game is somewhat disabled
