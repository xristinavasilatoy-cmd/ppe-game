// Βρίσκουμε τον καμβά μέσα στο HTML.
const canvas = document.getElementById("game");

// Παίρνουμε τα εργαλεία για δισδιάστατη σχεδίαση.
const ctx = canvas.getContext("2d");

// Οι τρεις εργάτες και αυτό που ζητά ο καθένας.
const workers = [
  { x: 40,  y: 410, needs: "Helmet" },
  { x: 120, y: 410, needs: "Gloves" },
  { x: 200, y: 410, needs: "Glasses" }
];

// Τα διαθέσιμα αντικείμενα.
const items = [
  { name: "Helmet", symbol: "⛑️" },
  { name: "Gloves", symbol: "🧤" },
  { name: "Glasses", symbol: "🥽" }
];

// Το αντικείμενο που πέφτει τώρα.
const equipment = {
  x: 120,
  y: 50,
  name: "Helmet",
  symbol: "⛑️"
};

// Η κατάσταση του παιχνιδιού.
let score = 0;
let gameOver = false;

// Βρίσκουμε τα κείμενα που θα ενημερώνουμε στο HTML.
const scoreText = document.getElementById("score");
const message = document.getElementById("message");

// Σχεδιάζουμε ολόκληρη τη σκηνή.
function draw() {
  // Καθαρίζουμε ό,τι είχε σχεδιαστεί πριν.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Κεντράρουμε τα κείμενα στις θέσεις τους.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Σχεδιάζουμε κάθε εργάτη.
  for (const worker of workers) {
    // Το αντικείμενο που ζητά.
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(worker.needs, worker.x, worker.y - 55);

    // Το κεφάλι.
    ctx.fillStyle = "#f1c27d";
    ctx.beginPath();
    ctx.arc(worker.x, worker.y - 20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Το σώμα.
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(worker.x - 15, worker.y - 5, 30, 35);
  }

  // Σχεδιάζουμε το κράνος.
  ctx.font = "30px Arial";
  ctx.fillText(equipment.symbol, equipment.x, equipment.y);
}

// Καλούμε τη σχεδίαση για να εμφανιστεί η σκηνή.
draw();

// Ακούμε τα πατήματα του πληκτρολογίου.
document.addEventListener("keydown", event => {
  // Μας ενδιαφέρουν μόνο το αριστερό και το δεξί βελάκι.
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  // Αποτρέπουμε την κύλιση της σελίδας από τα βελάκια.
  event.preventDefault();

  // Όταν το κράνος φτάσει κάτω, σταματά ο χειρισμός.
  if (equipment.y >= 370) {
    return;
  }

  if (event.key === "ArrowLeft" && equipment.x > 40) {
    equipment.x = equipment.x - 80;
  }

  if (event.key === "ArrowRight" && equipment.x < 200) {
    equipment.x = equipment.x + 80;
  }

  draw();
});

// Ετοιμάζουμε ένα τυχαίο αντικείμενο.
function newEquipment() {
  const randomIndex = Math.floor(Math.random() * items.length);
  const chosenItem = items[randomIndex];

  equipment.name = chosenItem.name;
  equipment.symbol = chosenItem.symbol;
  equipment.x = 120;
  equipment.y = 50;
}

// Ελέγχουμε σε ποιον εργάτη έφτασε το αντικείμενο.
function checkDelivery() {
  const worker = workers.find(worker => worker.x === equipment.x);

  if (equipment.name === worker.needs) {
    // Σωστή παράδοση!
    score = score + 1;
    scoreText.textContent = score;
    message.textContent = "Correct! Keep going!";

    newEquipment();
  } else {
    // Λάθος παράδοση.
    gameOver = true;
    message.textContent =
      "False! This worker needs: " + worker.needs +
      ". Start a new game.";
  }
}

// Η αυτόματη πτώση.
setInterval(() => {
  // Αν χάσαμε, δεν κάνουμε τίποτα.
  if (gameOver) {
    return;
  }

  equipment.y = equipment.y + 2;

  // Το αντικείμενο έφτασε στον εργάτη.
  if (equipment.y >= 370) {
    checkDelivery();
  }

  draw();
}, 30);

document.getElementById("restart").addEventListener("click", () => {
  score = 0;
  gameOver = false;

  scoreText.textContent = score;
  message.textContent = "Every worker needs his equipment.";

  newEquipment();
  draw();
});