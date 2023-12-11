// const baseUrl = "https://shuttleq.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:3000";
  const addCourtForm = document.getElementById("addCourtForm");
  const goBackButton = document.getElementById("back");

  goBackButton.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  addCourtForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const courtNameInput = document.getElementById("courtName");
    const courtTypeSelect = document.getElementById("courtType");

    const courtData = {
      courtName: courtNameInput.value.trim(),
      courtType: courtTypeSelect.value.trim(),
    };

    if (!courtData.courtName || !courtData.courtType) {
      console.error("Court name and type are required");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/v1/courts`, courtData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (response.status === 201) {
        window.location.href = "home.html";
      } else {
        console.error(
          "Error creating court. Unexpected server response",
          response
        );
      }
    } catch (error) {
      console.error("Error creating court:", error.message);
    }
  });
});
