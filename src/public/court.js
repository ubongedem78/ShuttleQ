document.addEventListener("DOMContentLoaded", function () {
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "https://shuttleq.onrender.com";
  const addCourtForm = document.getElementById("addCourtForm");
  const courtNameInput = document.getElementById("courtName");
  const courtTypeSelect = document.getElementById("courtType");
  const courtList = document.getElementById("queueList");
  const backButton = document.getElementById("back");

  async function fetchCourts() {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/courts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      if (response.status === 200) {
        courtList.innerHTML = "";

        response.data.data.forEach((court) => {
          const courtName = court.courtName;
          const courtType = court.courtType;

          // Create a container for text and buttons
          const courtEntryContainer = document.createElement("div");
          courtEntryContainer.classList.add("queue-entry-container");

          // Create a div for court text
          const courtTextDiv = document.createElement("div");
          courtTextDiv.classList.add("court-text");
          courtTextDiv.textContent = `${courtName} - ${courtType}`;

          // Create Edit Button
          const editButton = document.createElement("button");
          editButton.classList.add("edit-button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            populateEditForm(court);
          });

          // Create Delete Button
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => {
            deleteCourt(court.courtId);
          });

          // Append elements to the container
          courtEntryContainer.appendChild(courtTextDiv);
          courtEntryContainer.appendChild(editButton);
          courtEntryContainer.appendChild(deleteButton);

          // Append the container to the courtList
          courtList.appendChild(courtEntryContainer);
        });
      }
    } catch (error) {
      console.error("Error fetching courts:", error);
      displayErrorMessage("Error fetching courts. Please try again.");
    }
  }

  function populateEditForm(court) {
    addCourtForm.dataset.mode = "edit";
    addCourtForm.dataset.courtId = court.courtId;
    courtNameInput.value = court.courtName;
    courtTypeSelect.value = court.courtType;
  }

  addCourtForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const courtData = {
      courtName: courtNameInput.value.trim(),
      courtType: courtTypeSelect.value.trim(),
    };

    // Check if it's an edit or add operation
    const isEdit = addCourtForm.dataset.mode === "edit";
    const url = isEdit
      ? `${baseUrl}/api/v1/courts/${addCourtForm.dataset.courtId}`
      : `${baseUrl}/api/v1/courts`;

    try {
      const response = isEdit
        ? await axios.patch(url, courtData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          })
        : await axios.post(url, courtData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          });

      if (response.status === 201 || response.status === 200) {
        fetchCourts();
        resetForm();
      } else {
        console.error(
          "Error creating/editing court. Unexpected server response",
          response
        );
        displayErrorMessage(
          "Unexpected server response while creating/editing court"
        );
      }
    } catch (error) {
      console.error("Error creating/editing court:", error.message);
      displayErrorMessage("Error creating/editing court. Please try again.");
    }
  });

  function deleteCourt(courtId) {
    axios
      .delete(`${baseUrl}/api/v1/courts/${courtId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          fetchCourts();
        }
      })
      .catch((error) => {
        console.error("Error deleting court:", error);
        displayErrorMessage("Error deleting court. Please try again.");
      });
  }

  function resetForm() {
    addCourtForm.dataset.mode = "add";
    addCourtForm.dataset.courtId = "";
    courtNameInput.value = "";
    courtTypeSelect.value = "";
  }

  fetchCourts();

  backButton.addEventListener("click", function () {
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
