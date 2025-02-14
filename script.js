// Initialize variables
let selectedNumbers = [];
const ticketList = [];

// read from local storage and fill ticket list if there are items
localStorage.getItem('ticketList') && JSON.parse(localStorage.getItem('ticketList')).forEach(ticket => {
  ticketList.push(ticket);
  renderTicketList();
});

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

  // save the ticket list to local storage
  localStorage.setItem('ticketList', JSON.stringify(ticketList));
}

// Render ticket list
function renderTicketList() {
  const ticketListElement = document.getElementById("ticket-list");
  ticketListElement.innerHTML = ticketList
    .map(
      (ticket) => `
      <li>
        <strong>${ticket.user}</strong>
        <div class="numbers">
          ${ticket.numbers.map((num) => `<span>${num}</span>`).join("")}
        </div>
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


// Raffle number generator and winner checker
function generateRaffleNumbers() {
  const raffleNumbers = [];
  while (raffleNumbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    if (!raffleNumbers.includes(randomNumber)) {
      raffleNumbers.push(randomNumber);
    }
  }
  return raffleNumbers.sort((a, b) => a - b); // Sort numbers for easier comparison
}

function checkForWinner(raffleNumbers) {
  const winners = [];
  ticketList.forEach((ticket) => {
    const matchedNumbers = ticket.numbers.filter((num) => raffleNumbers.includes(num));
    if (matchedNumbers.length === 5) {
      winners.push(ticket.user);
    }
  });
  return winners;
}

// Function to run the raffle
function runRaffle() {
  const raffleNumbers = generateRaffleNumbers();
  const winners = checkForWinner(raffleNumbers);

  // Display the raffle numbers
  alert(`Raffle Numbers: ${raffleNumbers.join(", ")}`);

  // Display the winners (if any)
  if (winners.length > 0) {
    alert(`Winners: ${winners.join(", ")}`);
  } else {
    alert("No winners this time! Better luck next time!");
  }
  // Clear local storage and reset the ticket list
  localStorage.removeItem('ticketList');
  ticketList.length = 0; // Clear the ticket list array
  renderTicketList(); // Re-render the empty ticket list
}

// Add a button to run the raffle
const raffleButton = document.createElement("button");
raffleButton.textContent = "Run Raffle";
raffleButton.style.marginTop = "20px";
raffleButton.style.padding = "10px 20px";
raffleButton.style.backgroundColor = "#ff6b6b";
raffleButton.style.color = "#ffffff";
raffleButton.style.border = "none";
raffleButton.style.borderRadius = "8px";
raffleButton.style.cursor = "pointer";
raffleButton.addEventListener("click", runRaffle);

// Add the raffle button to the user input section
document.querySelector(".user-input").appendChild(raffleButton);
