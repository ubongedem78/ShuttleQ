document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "https://shuttleq.onrender.com";
  const gameTypeSelect = document.getElementById("gameType");
  const player2NameLabel = document.getElementById("player2NameLabel");
  const player2NameInput = document.getElementById("player2Name");
  const courtIdSelect = document.getElementById("courtId");
  const addPlayerForm = document.getElementById("addPlayerForm");
  const goBackButton = document.getElementById("back");

  goBackButton.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  gameTypeSelect.addEventListener("change", function () {
    const isDoubles = gameTypeSelect.value === "DOUBLES";
    player2NameLabel.style.display = isDoubles ? "block" : "none";
    player2NameInput.style.display = isDoubles ? "block" : "none";
  });

  courtIdSelect.innerHTML = '<option value="">Select Court</option>';

  axios
    .get(`${baseUrl}/api/v1/courts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
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
      displayErrorMessage("Error fetching courts. Please try again.");
    });

  addPlayerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const formData = new FormData(addPlayerForm);
      const gameType = formData.get("gameType");
      const player1Name = formData.get("player1Name");
      const player2Name = formData.get("player2Name");
      const courtId = formData.get("courtId");

      const requestData = {
        gameType,
        playerNames:
          gameType === "DOUBLES"
            ? `${player1Name}, ${player2Name}`
            : player1Name,
        courtId,
      };

      const response = await axios.post(
        `${baseUrl}/api/v1/teams`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      window.location.href = "home.html";
    } catch (error) {
      console.error("Error creating team:", error);
      displayErrorMessage("Error creating team. Please try again.");
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
