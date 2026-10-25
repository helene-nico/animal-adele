const video = document.getElementById('camera');
const pet = document.getElementById('pet');
const buttons = document.querySelectorAll('.pet-buttons .btn');

// 1. Démarrer la caméra arrière (smartphone) ou la webcam
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    alert('Impossible d’accéder à la caméra. Vérifie les autorisations.');
  }
}

// 2. Sélectionner l'animal
buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    pet.textContent = button.dataset.pet;
    pet.classList.remove('hidden');

    if (!pet.style.left) {
      pet.style.left = '50%';
      pet.style.top = '60%';
    }
  });
});

// 3. Déplacer l'animal au doigt ou à la souris
let isDragging = false;

function onStart() {
  isDragging = true;
}

function onMove(e) {
  if (!isDragging) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  pet.style.left = `${clientX}px`;
  pet.style.top = `${clientY}px`;
}

function onEnd() {
  isDragging = false;
}

pet.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onEnd);

pet.addEventListener('touchstart', onStart, { passive: true });
window.addEventListener('touchmove', onMove, { passive: true });
window.addEventListener('touchend', onEnd);

startCamera();