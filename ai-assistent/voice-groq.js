const voiceBtn = document.getElementById('voiceBtn');
const responseBox = document.getElementById('aiResponse');

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'id-ID';

let messageHistory = [
  { role: "system", content: "Kamu adalah asisten AI pribadi yang menjawab dengan jelas dan ringkas." }
];

voiceBtn?.addEventListener('click', () => {
  recognition.start();
  voiceBtn.textContent = '🎙️ Mendengarkan...';
});

recognition.onresult = async (event) => {
  const userText = event.results[0][0].transcript;
  responseBox.innerHTML += `<br><strong>Kamu:</strong> ${userText}`;

  messageHistory.push({ role: "user", content: userText });

  const aiReply = await fetchGroq(messageHistory);

  messageHistory.push({ role: "assistant", content: aiReply });

  responseBox.innerHTML += `<br><strong>CyberAI:</strong> ${aiReply}`;
  speak(aiReply);
  voiceBtn.textContent = '🎙️ Tanya Asisten';
};

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'id-ID';
  synth.speak(utter);
}

// 🔁 Komunikasi ke Backend Railway
const output = document.getElementById('data-output');

async function fetchGroq(messages) {
  try {
    const res = await fetch('https://mybackend-production-d348.up.railway.app/ask-groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messageHistory })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Respon dari backend:", errText);
      throw new Error("Gagal merespon: " + res.status);
    }

    const data = await res.json();
    return data.reply || "Maaf, tidak ada balasan dari AI.";
  } catch (err) {
    console.error("Fetch error:", err);
    return "CyberAI: Terjadi kesalahan saat menghubungi server.";
  }
}

// 📦 Contoh trigger tombol
document.getElementById('tanya-btn')?.addEventListener('click', () => {
  tanyaAsisten('Halo!');
});
