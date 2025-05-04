const voiceBtn = document.getElementById('voiceBtn');
const responseBox = document.getElementById('aiResponse');
const output = document.getElementById('data-output');

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

// 🔁 Komunikasi ke Backend Render (baru)
async function fetchGroq(messageHistory) {
  try {
    const res = await fetch('https://mybackend-production-d348.up.railway.app/ask-groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: messageHistory })
    });

    const data = await res.json();
    return data.answer || '[❌ Tidak ada jawaban]';
  } catch (err) {
    console.error('Gagal komunikasi dengan backend:', err);
    return '[❌ Gagal menghubungi server]';
  }
}

// 📦 Tombol contoh manual
document.getElementById('tanya-btn')?.addEventListener('click', () => {
  tanyaAsisten('Halo!');
});

function tanyaAsisten(pesan) {
  const messages = [
    { role: "system", content: "Kamu adalah asisten AI pribadi yang menjawab dengan jelas dan ringkas." },
    { role: "user", content: pesan }
  ];

  fetch('https://mybackend-1i48.onrender.com/ask-groq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Respon dari backend:', data);
      if (output) {
        output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    })
    .catch(err => {
      console.error('Gagal mengambil data dari backend:', err);
      if (output) {
        output.innerHTML = `<span style="color:red;">❌ Gagal menghubungi server.</span>`;
      }
    });
}
