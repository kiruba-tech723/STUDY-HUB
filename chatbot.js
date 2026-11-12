// ===== chatbot.js : floating study assistant =====
// The chat window is built with JavaScript so every page only needs this one script tag.

// Keyword -> reply list. The first matching keyword wins.
const replies = [
  { words: ["hello", "hi", "hey"], text: "Hello! I am the StudyHub assistant. Ask me about exam dates, library timing, or how to register." },
  { words: ["exam", "date", "ia"], text: "IA-3 exams start in the third week of November. Check the Deadlines panel on the Home page for exact dates." },
  { words: ["library", "timing", "open"], text: "The library is open Monday to Saturday, 8:00 AM to 8:00 PM." },
  { words: ["register", "registration", "sign up", "signup"], text: "Click 'Register' in the top menu, fill in your name, register ID, email, mobile and division, then press Submit." },
  { words: ["gpa", "cgpa", "grade"], text: "Use the GPA Calculator on the Home page: enter credits and grades for each subject." },
  { words: ["timetable", "schedule", "class"], text: "Your timetable is in the centre of the Home page dashboard." },
  { words: ["password", "forgot"], text: "Passwords need 8+ characters with uppercase, lowercase, a number and a symbol." },
  { words: ["theme", "dark", "light"], text: "Use the moon/sun button in the top bar to switch between light and dark mode." },
  { words: ["bye", "thanks", "thank"], text: "You're welcome! Happy studying." }
];

const fallback = "Sorry, I did not understand that. Try words like exam, library, register, GPA or timetable.";

// Build the chat UI
const fab = document.createElement("button");
fab.className = "chat-fab";
fab.setAttribute("aria-label", "Open chat assistant");
fab.textContent = "💬";

const panel = document.createElement("div");
panel.className = "chat-panel";
panel.innerHTML =
  '<div class="chat-head">StudyHub Assistant</div>' +
  '<div class="chat-log" id="chatLog"></div>' +
  '<form class="chat-input" id="chatForm">' +
  '<input type="text" id="chatText" placeholder="Type your question..." autocomplete="off">' +
  '<button type="submit">Send</button>' +
  "</form>";

document.body.appendChild(fab);
document.body.appendChild(panel);

const log = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatText = document.getElementById("chatText");

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text; // textContent keeps user input safe from HTML injection
  log.appendChild(div);
  log.scrollTop = log.scrollHeight; // auto-scroll to the newest message
}

function getReply(question) {
  const q = question.toLowerCase();
  const tokens = q.split(/\W+/); // the separate words typed by the user
  for (let i = 0; i < replies.length; i++) {
    for (let j = 0; j < replies[i].words.length; j++) {
      const word = replies[i].words[j];
      // short words (hi, ia) must match a whole word, otherwise "this" would match "hi"
      const found = word.length <= 3 ? tokens.includes(word) : q.includes(word);
      if (found) {
        return replies[i].text;
      }
    }
  }
  return fallback;
}

fab.addEventListener("click", function () {
  panel.classList.toggle("open");
  if (panel.classList.contains("open") && log.children.length === 0) {
    addMessage("Hi! Ask me about exam dates, library timing or how to register.", "bot-msg");
  }
  chatText.focus();
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = chatText.value.trim();
  if (text === "") return;
  addMessage(text, "user-msg");
  chatText.value = "";
  setTimeout(function () {
    addMessage(getReply(text), "bot-msg");
  }, 400);
});
