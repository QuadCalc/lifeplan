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
    const response = await fetch('http://localhost:3001/ask-groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return data.answer || "Maaf, tidak ada jawaban dari AI.";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Terjadi kesalahan saat menghubungi server.";
  }
}
