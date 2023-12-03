document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:3000";
  // const baseUrl = "https://shuttleq.onrender.com";
  const courtName = document.getElementById("courtName");
  const goBackButton = document.getElementById("back");

  goBackButton.addEventListener("click", () => {
    console.log("Go back button clicked");
    window.location.href = "home.html";
  });

  courtNameData = "xyz";

  axios
    .post(`${baseUrl}/api/courts`, courtNameData)
    .then((response) => {
      console.log("Court created:", response.data);
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("Error creating court:", error);
    });
});
