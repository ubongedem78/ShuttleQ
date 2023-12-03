document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:3000";
  // const baseUrl = "https://shuttleq.onrender.com";
  const addCourtForm = document.getElementById("addCourtForm");
  const goBackButton = document.getElementById("back");

  goBackButton.addEventListener("click", () => {
    console.log("Go back button clicked");
    window.location.href = "home.html";
  });

  addCourtForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const courtNameInput = document.getElementById("courtName");
    const courtTypeSelect = document.getElementById("courtType");

    const courtData = {
      courtName: courtNameInput.value,
      courtType: courtTypeSelect.value,
    };

    axios
      .post(`${baseUrl}/api/courts`, courtData)
      .then((response) => {
        console.log("Court created:", response.data);
        window.location.href = "home.html";
      })
      .catch((error) => {
        console.error("Error creating court:", error);
      });
  });
});
