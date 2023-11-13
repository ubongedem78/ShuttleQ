// let baseUrl = "https://shuttleq.onrender.com";
let baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  const startGameButton = document.getElementById("startGame");
  const endGameButton = document.getElementById("endGame");
  const team1Score = document.getElementById("team1-score");
  const team2Score = document.getElementById("team2-score");
  const decrementScoreTeam1 = document.getElementById("decrement-score-team1");
  const decrementScoreTeam2 = document.getElementById("decrement-score-team2");

  // Get Data 
  // http://127.0.0.1:5500/src/public/game.html?gameId=917c89d7-ee4a-4292-a24a-fa19762cbbfd?winnerId=null




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
  });

  endGameButton.addEventListener("click", () => {
    console.log("End Game button clicked");
  });
});
