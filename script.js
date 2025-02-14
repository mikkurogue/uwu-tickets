// Initialize variables
let selectedNumbers = [];
const ticketList = [];

// Generate number buttons
const numberGrid = document.getElementById("number-grid");
for (let i = 1; i <= 45; i++) {
  const button = document.createElement("button");
  button.className = "number-button";
  button.textContent = i;
  button.addEventListener("click", () => toggleNumberSelection(i, button));
  numberGrid.appendChild(button);
}

// Toggle number selection
function toggleNumberSelection(number, button) {
  if (selectedNumbers.includes(number)) {
    // Deselect number
    selectedNumbers = selectedNumbers.filter((n) => n !== number);
    button.classList.remove("selected");
  } else {
    // Select number (if less than 5 are selected)
    if (selectedNumbers.length < 5) {
      selectedNumbers.push(number);
      button.classList.add("selected");
    } else {
      alert("You can only select 5 numbers per ticket!");
    }
  }
}

// Add ticket to list
function addTicketToList() {
  const userName = document.getElementById("user_name_input").value.trim();
  if (selectedNumbers.length !== 5 || !userName) {
    alert("Please select exactly 5 numbers and enter a user name!");
    return;
  }

  // Add ticket to the list
  ticketList.push({
    user: userName,
    numbers: [...selectedNumbers],
  });

  // Render the updated ticket list
  renderTicketList();

  // Clear selections and input
  clearSelections();
  document.getElementById("user_name_input").value = "";
  document.getElementById("user_name_input").focus();
}

// Render ticket list
function renderTicketList() {
  const ticketListElement = document.getElementById("ticket-list");
  ticketListElement.innerHTML = ticketList
    .map(
      (ticket) => `
      <li>
        <strong>${ticket.user}</strong>: ${ticket.numbers.join(", ")}
      </li>
    `
    )
    .join("");
}

// Clear selected numbers
function clearSelections() {
  selectedNumbers = [];
  document.querySelectorAll(".number-button.selected").forEach((button) => {
    button.classList.remove("selected");
  });
}

// Add "Enter" key event listener
document.getElementById("user_name_input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTicketToList();
  }
});
