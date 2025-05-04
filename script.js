// 🎥 Matrix Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const katakana = "アカサタナハマヤラワ0123456789";
const chars = katakana.split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }, () => 1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ccff"; // warna biru neon
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, x) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, x * fontSize, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.975) {
      drops[x] = 0;
    }

    drops[x]++;
  });
}
setInterval(drawMatrix, 50);

// 🔊 Musik Background
const bgmusic = document.getElementById('bgmusic');
if (bgmusic) bgmusic.volume = 0.2;

// 🌗 Dark/Light Mode Toggle
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.body.classList.add('light');
  }
});

document.getElementById('planForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const goal = document.getElementById('goal').value;
  const prioritas = document.getElementById('prioritas').value;

  alert(`📌 Rencana Terkirim!\n\nTujuan: ${goal}\nPrioritas Utama: ${prioritas}`);
});

const modal = document.getElementById('modal');
const modalName = document.getElementById('modal-name');
const modalNim = document.getElementById('modal-nim');
const modalDesc = document.getElementById('modal-desc');
const closeModal = document.querySelector('.close');

const members = [
  {
    name: "Nama Anggota 1",
    nim: "247006111124",
    desc: "Ahli frontend dan UX design LifePlanCalc."
  },
  {
    name: "Nama Anggota 2",
    nim: "247006111128",
    desc: "Developer backend, penghubung ke sistem AI."
  },
  {
    name: "Nama Anggota 3",
    nim: "247006111138",
    desc: "Spesialis keamanan dan integrasi data."
  },
  {
    name: "Nama Anggota 4",
    nim: "247006111139",
    desc: "Koordinator tim dan dokumentasi proyek."
  },
  {
    name: "Nama Anggota 5",
    nim: "247006111142",
    desc: "UI animator dan pengelola efek visual."
  },
];

document.querySelectorAll('.member-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const m = members[index];
    modalName.textContent = m.name;
    modalNim.textContent = `NIM: ${m.nim}`;
    modalDesc.textContent = m.desc;
    modal.style.display = 'block';
  });
});

closeModal.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

// Animasi ketik untuk kontak
const kontakText = `📧 Email: lifeplancalc.team@gmail.com
📱 Instagram: @lifeplancalc
🌐 Website: www.lifeplancalc.id`;

let i = 0;
const speed = 40;
function typeWriter() {
  if (i < kontakText.length) {
    document.getElementById("kontak-text").innerHTML += kontakText.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
window.addEventListener("DOMContentLoaded", typeWriter);

const slider = document.querySelector('.menu-slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // Geser dua kali lebih cepat
  slider.scrollLeft = scrollLeft - walk;
});

// 🔁 Ambil data dari backend API dan tampilkan ke elemen HTML
fetch('https://mybackend-production-d348.up.railway.app')
  .then(res => res.json())
  .then(data => {
    console.log('Data dari backend:', data);

    // Contoh: tampilkan data di elemen dengan id="data-output"
    const output = document.getElementById('data-output');
    if (output) {
      output.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
  })
  .catch(err => {
    console.error('Gagal mengambil data dari backend:', err);
  });

  document.addEventListener('DOMContentLoaded', function () {
    const mic = document.getElementById('mic');
    if (mic) {
      mic.onclick = startListening;
    } else {
      console.warn('Element #mic tidak ditemukan.');
    }
  });
  


