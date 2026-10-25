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
    feedBtn.classList.remove('hidden'); // Affiche le bouton Nourrir
    photoBtn.classList.remove('hidden'); // Affiche l'appareil photo

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

// 4. Donner à manger (CORRIGÉ POUR TOUS LES ÉCRANS)
feedBtn.addEventListener('click', () => {
  const currentPet = pet.textContent;
  if (currentPet === '🐶') food.textContent = '🦴';
  else if (currentPet === '🐱') food.textContent = '🐟';
  else if (currentPet === '🐰') food.textContent = '🥕';

  // Calculer la position exacte de l'animal en pixels
  const rect = pet.getBoundingClientRect();
  const petX = rect.left + (rect.width / 2);
  const petY = rect.top + (rect.height / 2);

  // Placer la nourriture exactement en dessous
  food.style.left = `${petX}px`;
  food.style.top = `${petY + 60}px`;
  food.classList.remove('hidden');
  
  // Lancer l'animation
  pet.classList.add('eating');

  setTimeout(() => {
    food.classList.add('hidden');
    pet.classList.remove('eating');
    
    // Placer le coeur exactement au-dessus
    reaction.style.left = `${petX}px`;
    reaction.style.top = `${petY - 60}px`;
    reaction.classList.remove('hidden');
    
    // Relancer l'animation du coeur
    reaction.style.animation = 'none';
    reaction.offsetHeight; 
    reaction.style.animation = 'floatUp 1.2s ease-out forwards';
  }, 1500);
});

// 5. Prendre une photo
photoBtn.addEventListener('click', () => {
  flash.classList.remove('hidden');
  flash.style.opacity = '1';
  setTimeout(() => { flash.style.opacity = '0'; }, 50);
  setTimeout(() => { flash.classList.add('hidden'); }, 250);

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

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

  function drawEmoji(element, fontSize) {
    if (element.classList.contains('hidden') || element.style.opacity === '0') return;
    const rect = element.getBoundingClientRect();
    ctx.font = `${fontSize}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(element.textContent, rect.left + rect.width / 2, rect.top + rect.height / 2 + (fontSize * 0.1));
  }

  drawEmoji(pet, 110);
  drawEmoji(food, 60);
  drawEmoji(reaction, 50);

  const link = document.createElement('a');
  link.download = 'mon-animal-virtuel.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

startCamera();
