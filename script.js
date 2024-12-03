
const homeLink = document.getElementById("home-link");
const adminLink = document.getElementById("admin-link");
const adminPage = document.getElementById("admin-page");
const homeSections = Array.from(document.querySelectorAll("section, .intro-text"));
const adminForm = document.getElementById("admin-form");
let sessionTotal = 0;
let sessionPlaced = 0;
let sessionUnplaced = 0;
const totalStudentsCounter = document.getElementById("total-students");
const placedStudentsCounter = document.getElementById("placed-students");
const unplacedStudentsCounter = document.getElementById("unplaced-students");
const displayContainer = document.createElement("div");
displayContainer.id = "display-container";
adminPage.appendChild(displayContainer);
function resetSessionCounters() {
    sessionTotal = 0;
    sessionPlaced = 0;
    sessionUnplaced = 0;

    totalStudentsCounter.textContent = sessionTotal;
    placedStudentsCounter.textContent = sessionPlaced;
    unplacedStudentsCounter.textContent = sessionUnplaced;
}
adminLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleView("admin");
});

homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleView("home");
});

adminForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const course = document.getElementById("course").value;
    const status = document.getElementById("status").value;

    fetch("http://localhost:3000/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, course, status }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Student added successfully!") {
                const detailCard = document.createElement("div");
                detailCard.className = "detail-card";
                detailCard.dataset.id = data.newStudentId; // Save the student's ID for deletion

                detailCard.innerHTML = `
                    <div class="card-header">
                        <div class="avatar">${name.charAt(0).toUpperCase()}</div>
                        <h3>${name}</h3>
                    </div>
                    <div class="card-body">
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone Number:</strong> ${phone}</p>
                        <p><strong>Course:</strong> ${course}</p>
                        <p><strong>Status:</strong> ${status}</p>
                    </div>
                    <button class="delete-button">Delete</button>
                `;

                const deleteButton = detailCard.querySelector(".delete-button");
                deleteButton.addEventListener("click", () => {
                    fetch(`http://localhost:3000/delete-student/${data.newStudentId}`, {
                        method: "DELETE",
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message === "Student deleted successfully!") {
                                detailCard.remove();

                                // Adjust session counters
                                sessionTotal--;
                                if (status === "Placed") sessionPlaced--;
                                if (status === "Unplaced") sessionUnplaced--;

                                // Update frontend session-based counters
                                totalStudentsCounter.textContent = sessionTotal;
                                placedStudentsCounter.textContent = sessionPlaced;
                                unplacedStudentsCounter.textContent = sessionUnplaced;
                            } else {
                                console.error("Error deleting student");
                            }
                        })
                        .catch((error) => console.error("Error:", error));
                });

                displayContainer.appendChild(detailCard);

                adminForm.reset();

    
                sessionTotal++;
                if (status === "Placed") sessionPlaced++;
                if (status === "Unplaced") sessionUnplaced++;

        
                totalStudentsCounter.textContent = sessionTotal;
                placedStudentsCounter.textContent = sessionPlaced;
                unplacedStudentsCounter.textContent = sessionUnplaced;
            } else {
                console.error("Error adding student");
            }
        })
        .catch((error) => console.error("Error:", error));
});

function toggleView(view) {
    if (view === "admin") {
        homeSections.forEach((section) => (section.style.display = "none"));
        adminPage.style.display = "block";
    } else if (view === "home") {
        adminPage.style.display = "none";
        homeSections.forEach((section) => (section.style.display = ""));
    }
}
document.addEventListener("DOMContentLoaded", resetSessionCounters);
