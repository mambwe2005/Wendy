/* ==========================================================
   Can You Hack My Heart?
   NOTE: this is a game, not real security. Anyone who views
   the page source can see the password below.
   ========================================================== */

/* ---------- EDIT THIS SECTION ---------- */
const CONFIG = {
  herName: "Wendy",
  hisName: "Mambwe",

  // Accepted passwords (not case-sensitive, spaces at the ends are ignored).
  // CHANGE THESE to something only Wendy would know, e.g. a date like "14022025".
  passwords: ["wendy"],

  hint: "Hint: The password is something only you would know.",

  // After this many wrong tries, show an extra hint. Set to 0 to turn off.
  extraHintAfter: 3,
  extraHint: "Extra hint: think about the first thing that made you smile with me.",

  // Optional media. Put files in the assets/ folder and write the path, e.g. "assets/wendy.jpg"
  photo: "",   // leave "" to hide
  music: "",   // e.g. "assets/music.mp3", leave "" to hide

  // Message shown after ACCESS GRANTED
  revealLine: "Congratulations. You successfully hacked my heart. There is no logout button. ❤️",
  message: [
    "Wendy, I may spend my days writing code, fixing bugs and learning about technology, but somehow you became the one thing in my life I never want to debug or change.",
    "You are my favorite person, my favorite notification and my favorite connection.",
    "I love you. ❤️",
  ],

  // Hidden file behind the final button
  secret: [
    "No firewall. No encryption. No two-factor authentication.",
    "Your access level: ADMINISTRATOR. Permanent. Cannot be revoked.",
  ],
};
/* ---------- END OF EDIT SECTION ---------- */

const $ = (id) => document.getElementById(id);
const out = $("output"), form = $("authForm"), pw = $("pw"), feedback = $("feedback");
const pill = $("statusPill"), granted = $("granted"), terminal = $("terminal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let wrongTries = 0;
let runId = 0;                 // lets "restart" cancel an old animation
let audio = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
const setStatus = (text, state) => { pill.textContent = text; pill.dataset.state = state; };

/* ---------- Typed lines ---------- */
async function typeLine(text, cls, myRun, speed = 22) {
  const p = document.createElement("p");
  p.className = "line" + (cls ? " " + cls : "");
  out.appendChild(p);
  const caret = document.createElement("span");
  caret.className = "caret";
  p.appendChild(caret);

  if (reduceMotion) { p.textContent = text; return; }
  for (const ch of text) {
    if (myRun !== runId) return;
    p.insertBefore(document.createTextNode(ch), caret);
    await sleep(speed);
  }
  caret.remove();
}

async function boot() {
  const myRun = ++runId;
  out.innerHTML = "";
  feedback.textContent = ""; feedback.className = "feedback";
  granted.hidden = true; form.hidden = true; $("secret").hidden = true;
  setStatus("SCANNING", "scanning");
  wrongTries = 0;

  const name = CONFIG.herName, him = CONFIG.hisName.toUpperCase();
  const steps = [
    ["SECURE SYSTEM v1.0", "dim"],
    ["Initializing Heart Security System...", ""],
    ["Scanning user...", ""],
    [`User detected: ${name} ❤️`, "pink"],
    [`WARNING: ACCESS TO ${him}'S HEART: RESTRICTED.`, "warn"],
    ["Can you hack my heart?", "pink"],
    [CONFIG.hint, "dim"],
  ];
  for (const [text, cls] of steps) {
    if (myRun !== runId) return;
    await typeLine(text, cls, myRun);
    await sleep(260);
  }
  if (myRun !== runId) return;
  setStatus("LOCKED", "locked");
  form.hidden = false;
  pw.focus({ preventScroll: true });
}

/* ---------- Password check ---------- */
const normalise = (s) => s.trim().toLowerCase();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = normalise(pw.value);

  if (!value) {
    feedback.className = "feedback info";
    feedback.textContent = "ENTER A PASSWORD FIRST.";
    pw.focus();
    return;
  }

  if (CONFIG.passwords.map(normalise).includes(value)) {
    accessGranted();
  } else {
    accessDenied();
  }
});

function accessDenied() {
  wrongTries++;
  feedback.className = "feedback denied";
  feedback.textContent = "ACCESS DENIED. Nice try, hacker. ❤️";
  if (CONFIG.extraHintAfter && wrongTries >= CONFIG.extraHintAfter) {
    feedback.textContent += "\n" + CONFIG.extraHint;
    feedback.style.whiteSpace = "pre-line";
  }
  pw.value = "";
  pw.focus();
  if (!reduceMotion) {
    terminal.classList.remove("shake", "flash-red");
    void terminal.offsetWidth;            // restart the animation
    terminal.classList.add("shake", "flash-red");
  }
}

function accessGranted() {
  form.hidden = true;
  feedback.textContent = ""; feedback.className = "feedback";
  setStatus("ACCESS OPEN", "open");

  $("welcome").textContent = `Welcome, ${CONFIG.herName}.`;
  $("revealLine").textContent = CONFIG.revealLine;

  const msg = $("message");
  msg.innerHTML = "";
  CONFIG.message.forEach((t) => { const p = document.createElement("p"); p.textContent = t; msg.appendChild(p); });
  const sign = document.createElement("p");
  sign.className = "sign"; sign.textContent = "— " + CONFIG.hisName;
  msg.appendChild(sign);

  const photo = $("photo");
  if (CONFIG.photo) { photo.src = CONFIG.photo; photo.alt = `${CONFIG.herName} and ${CONFIG.hisName}`; photo.hidden = false; }
  else photo.hidden = true;
  $("musicBtn").hidden = !CONFIG.music;

  granted.hidden = false;
  $("secretBtn").hidden = false;
  $("card").focus({ preventScroll: true });
  granted.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  floatHearts(26);
}

/* ---------- Secret file, music, restart ---------- */
$("secretBtn").addEventListener("click", (e) => {
  const box = $("secret");
  box.innerHTML = '<span class="file">secret_file.txt — decrypted</span>';
  CONFIG.secret.forEach((t) => { const p = document.createElement("p"); p.textContent = t; p.style.margin = "0 0 .6em"; box.appendChild(p); });
  box.hidden = false;
  e.currentTarget.hidden = true;
  floatHearts(18);
  box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
});

$("musicBtn").addEventListener("click", (e) => {
  if (!CONFIG.music) return;
  if (!audio) { audio = new Audio(CONFIG.music); audio.loop = true; }
  if (audio.paused) { audio.play().catch(() => {}); e.currentTarget.textContent = "❚❚ pause music"; }
  else { audio.pause(); e.currentTarget.textContent = "♪ play music"; }
});

$("restartBtn").addEventListener("click", () => {
  if (audio) { audio.pause(); audio = null; $("musicBtn").textContent = "♪ play music"; }
  pw.value = "";
  window.scrollTo({ top: 0 });
  boot();
});

$("toggle").addEventListener("click", (e) => {
  const showing = pw.type === "text";
  pw.type = showing ? "password" : "text";
  e.currentTarget.textContent = showing ? "show" : "hide";
  e.currentTarget.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

/* ---------- Floating hearts ---------- */
function floatHearts(n) {
  if (reduceMotion) return;
  const host = $("hearts");
  const glyphs = ["❤️", "💖", "💕", "💗"];
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = glyphs[i % glyphs.length];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 16 + Math.random() * 20 + "px";
    h.style.setProperty("--d", 4 + Math.random() * 4 + "s");
    h.style.setProperty("--x", Math.random() * 120 - 60 + "px");
    h.style.animationDelay = Math.random() * 1.5 + "s";
    host.appendChild(h);
    setTimeout(() => h.remove(), 9500);
  }
}

boot();
