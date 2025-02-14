// Initialize variables
let selectedNumbers = [];
const ticketList = [];

// Read from local storage and fill ticket list if there are items
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

  // Save the ticket list to local storage
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
      winners.push(ticket);
    }
  });
  return winners;
}

// Function to run the raffle
function runRaffle() {
  const raffleNumbers = generateRaffleNumbers();
  const winners = checkForWinner(raffleNumbers);

  // Display the result in the result box
  const resultBox = document.getElementById("result-box");
  const overlay = document.getElementById("overlay");
  const resultContent = document.getElementById("result-content");

  resultBox.style.display = "block";
  overlay.style.display = "block";

  // Slot machine effect
  resultContent.innerHTML = `
    <div class="slot-machine" style="background-color: #3b2a4f; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
      <span id="slot1" style="background-color: #ff6b6b; color: #ffffff; border-radius: 10px; padding: 10px; font-size: 1.5rem;">?</span>
      <span id="slot2" style="background-color: #ff6b6b; color: #ffffff; border-radius: 10px; padding: 10px; font-size: 1.5rem;">?</span>
      <span id="slot3" style="background-color: #ff6b6b; color: #ffffff; border-radius: 10px; padding: 10px; font-size: 1.5rem;">?</span>
      <span id="slot4" style="background-color: #ff6b6b; color: #ffffff; border-radius: 10px; padding: 10px; font-size: 1.5rem;">?</span>
      <span id="slot5" style="background-color: #ff6b6b; color: #ffffff; border-radius: 10px; padding: 10px; font-size: 1.5rem;">?</span>
    </div>
    <button id="reveal-result-btn" style="margin-top: 20px; padding: 10px 20px; background-color: #ff9ff3; color: #2e1a47; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; display: none;">
      Reveal Result 🎉
    </button>
  `;

  // Roll the numbers one by one
  const slots = ["slot1", "slot2", "slot3", "slot4", "slot5"];
  slots.forEach((slotId, index) => {
    setTimeout(() => {
      rollSlot(slotId, raffleNumbers[index]);
    }, index * 1000); // Delay each slot by 1 second
  });

  // After all slots are rolled, show the reveal button
  setTimeout(() => {
    const revealButton = document.getElementById("reveal-result-btn");
    revealButton.style.display = "block";
    revealButton.addEventListener("click", () => {
      if (winners.length > 0) {
        // Winner message
        resultBox.className = "result-box winner";
        resultContent.innerHTML = `
          <div>🎉🎉🎉 WE HAVE A WINNER! 🎉🎉🎉</div>
          <div>Winner: ${winners[0].user} 🏆</div>
          <div>Winning Numbers: ${raffleNumbers.join(", ")} 🔢</div>
          <div>Congratulations! 🥳🎊</div>
        `;
      } else {
        // No winner message
        resultBox.className = "result-box no-winner";
        resultContent.innerHTML = `
          <div>😢😢😢 No winner this time! 😢😢😢</div>
          <div>Womp womp... 💔</div>
          <div>Better luck next time! 🍀✨</div>
        `;
      }

      // Clear local storage and reset the ticket list
      localStorage.removeItem('ticketList');
      ticketList.length = 0; // Clear the ticket list array
      renderTicketList(); // Re-render the empty ticket list
    });
  }, slots.length * 1000); // Wait for all slots to finish rolling
}

// Roll a single slot
function rollSlot(slotId, finalNumber) {
  const slot = document.getElementById(slotId);
  let currentNumber = 1;
  const interval = setInterval(() => {
    slot.textContent = currentNumber;
    currentNumber = (currentNumber % 45) + 1; // Cycle through numbers 1–45
  }, 100); // Update every 100ms

  // Stop rolling after 1 second and set the final number
  setTimeout(() => {
    clearInterval(interval);
    slot.textContent = finalNumber;
  }, 1000);
}

// Close result box
function closeResultBox() {
  const resultBox = document.getElementById("result-box");
  const overlay = document.getElementById("overlay");
  resultBox.style.display = "none";
  overlay.style.display = "none";
}

// Close result box on Escape key press
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeResultBox();
  }
});

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
