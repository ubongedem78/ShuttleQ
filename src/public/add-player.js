document.addEventListener("DOMContentLoaded", function () {
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "https://shuttleq.onrender.com";
  const gameTypeSelect = document.getElementById("gameType");
  const playerFields = document.getElementById("playerFields");
  const player2NameLabel = document.getElementById("player2NameLabel");
  const player2NameInput = document.getElementById("player2Name");
  const courtIdSelect = document.getElementById("courtId");
  const addPlayerForm = document.getElementById("addPlayerForm");
  const goBackButton = document.getElementById("back");

  goBackButton.addEventListener("click", () => {
    console.log("Go back button clicked");
    window.location.href = "index.html";
  });

  gameTypeSelect.addEventListener("change", function () {
    if (gameTypeSelect.value === "DOUBLES") {
      player2NameLabel.style.display = "block";
      player2NameInput.style.display = "block";
    } else {
      player2NameLabel.style.display = "none";
      player2NameInput.style.display = "none";
    }
  });

  courtIdSelect.innerHTML = '<option value="">Select Court</option>';

  axios
    .get(`${baseUrl}/api/courts`)
    .then((response) => {
      console.log(response);
      const courts = response.data.data;

      courts.forEach((court) => {
        const option = document.createElement("option");
        option.value = court.courtId;
        option.textContent = court.courtName;
        courtIdSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching courts:", error);
    });

  addPlayerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(addPlayerForm);
    const gameType = formData.get("gameType");
    const player1Name = formData.get("player1Name");
    const player2Name = formData.get("player2Name");
    const courtId = formData.get("courtId");

    const requestData = {
      gameType,
      playerNames:
        gameType === "DOUBLES" ? `${player1Name}, ${player2Name}` : player1Name,
      courtId,
    };

    axios
      .post(`${baseUrl}/api/teams`, requestData)
      .then((response) => {
        console.log("Team created:", response.data);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error creating team:", error);
      });
  });
});
