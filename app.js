const video = document.getElementById('camera');
const pet = document.getElementById('pet');
const buttons = document.querySelectorAll('.pet-buttons .btn');
const feedBtn = document.getElementById('feed-btn');
const food = document.getElementById('food');
const reaction = document.getElementById('reaction');
const photoBtn = document.getElementById('photo-btn');
const flash = document.getElementById('flash');

// 1. Démarrer la caméra
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
    feedBtn.classList.remove('hidden');
    photoBtn.classList.remove('hidden'); // Afficher l'appareil photo

    if (!pet.style.left) {
      pet.style.left = '50%';
      pet.style.top = '60%';
    }
  });
});

// 3. Déplacer l'animal
let isDragging = false;
function onStart() { isDragging = true; }
function onEnd() { isDragging = false; }
function onMove(e) {
  if (!isDragging) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  pet.style.left = `${clientX}px`;
  pet.style.top = `${clientY}px`;
}

pet.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onEnd);
pet.addEventListener('touchstart', onStart, { passive: true });
window.addEventListener('touchmove', onMove, { passive: true });
window.addEventListener('touchend', onEnd);

// 4. Donner à manger
feedBtn.addEventListener('click', () => {
  const currentPet = pet.textContent;
  if (currentPet === '🐶') food.textContent = '🦴';
  else if (currentPet === '🐱') food.textContent = '🐟';
  else if (currentPet === '🐰') food.textContent = '🥕';

  food.style.left = pet.style.left;
  food.style.top = `calc(${pet.style.top} + 50px)`;
  food.classList.remove('hidden');
  pet.classList.add('eating');

  setTimeout(() => {
    food.classList.add('hidden');
    pet.classList.remove('eating');
    
    reaction.style.left = pet.style.left;
    reaction.style.top = `calc(${pet.style.top} - 50px)`;
    reaction.classList.remove('hidden');
    reaction.style.animation = 'none';
    reaction.offsetHeight; 
    reaction.style.animation = 'floatUp 1.2s ease-out forwards';
  }, 1500);
});

// 5. NOUVEAU : Prendre une photo
photoBtn.addEventListener('click', () => {
  // Effet de flash
  flash.classList.remove('hidden');
  flash.style.opacity = '1';
  setTimeout(() => { flash.style.opacity = '0'; }, 50);
  setTimeout(() => { flash.classList.add('hidden'); }, 250);

  // Créer un canevas invisible de la taille de l'écran
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  // Dessiner la vidéo (recadrée pour correspondre à l'écran)
  const videoRatio = video.videoWidth / video.videoHeight;
  const screenRatio = canvas.width / canvas.height;
  let sWidth = video.videoWidth, sHeight = video.videoHeight, sx = 0, sy = 0;

  if (screenRatio > videoRatio) {
    sHeight = video.videoWidth / screenRatio;
    sy = (video.videoHeight - sHeight) / 2;
  } else {
    sWidth = video.videoHeight * screenRatio;
    sx = (video.videoWidth - sWidth) / 2;
  }
  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

  // Fonction pour dessiner les emojis au bon endroit
  function drawEmoji(element, fontSize) {
    if (element.classList.contains('hidden') || element.style.opacity === '0') return;
    const rect = element.getBoundingClientRect();
    ctx.font = `${fontSize}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.textContent, rect.left + rect.width / 2, rect.top + rect.height / 2 + (fontSize * 0.1));
  }

  // Dessiner l'animal, la nourriture et la réaction
  drawEmoji(pet, 110);
  drawEmoji(food, 60);
  drawEmoji(reaction, 50);

  // Télécharger la photo
  const link = document.createElement('a');
  link.download = 'mon-animal-virtuel.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

startCamera();
