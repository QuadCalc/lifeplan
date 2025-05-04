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

async function fetchGroq(messages) {
  try {
    const response = await fetch('https://mybackend-production-d348.up.railway.app/ask-groq', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt: "Halo!" }) // Sesuaikan dengan backend kamu
})
  .then(res => res.json())
  .then(data => {
    console.log('Respon dari backend:', data);
    const output = document.getElementById('data-output');
    if (output) {
      output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  })
  .catch(err => {
    console.error('Gagal mengambil data dari backend:', err);
  });


    const data = await response.json();
    return data.answer || "Maaf, tidak ada jawaban dari AI.";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Terjadi kesalahan saat menghubungi server.";
  }
}
