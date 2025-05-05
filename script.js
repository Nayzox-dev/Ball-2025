const countdown = document.getElementById('countdown');
const form = document.getElementById('musicForm');
const targetDate = new Date("May 20, 2025 21:00:00").getTime();

// Countdown
setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdown.textContent = "Suggestions terminées.";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  countdown.textContent = `${d}j ${h}h ${m}m ${s}s restants`;
}, 1000);

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = capitalize(document.getElementById("name").value.trim());
  const title = capitalize(document.getElementById("suggestion").value.trim());

  if (!name || !title || isTroll(name)) return;

  const webhook = "https://discord.com/api/webhooks/1368962301750935663/jNyx_6L2Gl7ThcMmg0YjDNZSKFUr8Da3UecNBM4l1EwtKifFnC1oHueVhwJADFbFDSSF";

  const payload = {
    embeds: [
      {
        title: "🎵 Nouvelle suggestion pour le bal",
        color: 14719407,
        fields: [
          { name: "Prénom", value: name, inline: true },
          { name: "Titre", value: title, inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Bal 2025" }
      }
    ]
  };

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Erreur webhook :", err);
  }

  form.innerHTML = `
    <p class="thank-you">Merci pour ta suggestion ✨</p>
    <button id="resetButton" type="button">Refaire une suggestion</button>
  `;

  document.getElementById("resetButton").addEventListener("click", () => {
    form.innerHTML = `
      <div class="input-group">
        <label for="name">Prénom <span class="note">(prénom troll = pas ajouté)</span></label>
        <input type="text" id="name" placeholder="Ton prénom" required />
      </div>
      <div class="input-group">
        <label for="suggestion">Titre</label>
        <input type="text" id="suggestion" placeholder="Titre de la musique" required />
      </div>
      <button type="submit">Envoyer ma suggestion</button>
    `;
  });
});

// Helpers
function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function isTroll(name) {
  const blocked = ["Troll", "Groscon", "Test", "Fake", "Bot"];
  return blocked.includes(name.toLowerCase());
}
