const video = document.getElementById('camera');
const pet = document.getElementById('pet');
const buttons = document.querySelectorAll('.pet-buttons .btn');
const feedBtn = document.getElementById('feed-btn');
const food = document.getElementById('food');
const reaction = document.getElementById('reaction');

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
    feedBtn.classList.remove('hidden'); // Afficher le bouton Nourrir

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

// 4. NOUVEAU : Donner à manger
feedBtn.addEventListener('click', () => {
  // Choisir la bonne nourriture
  const currentPet = pet.textContent;
  if (currentPet === '🐶') food.textContent = '🦴';
  else if (currentPet === '🐱') food.textContent = '🐟';
  else if (currentPet === '🐰') food.textContent = '🥕';

  // Placer la nourriture juste en dessous de l'animal
  food.style.left = pet.style.left;
  food.style.top = `calc(${pet.style.top} + 50px)`;
  food.classList.remove('hidden');

  // Lancer l'animation de l'animal qui mange
  pet.classList.add('eating');

  // Après 1.5 seconde : on cache la nourriture, on arrête l'animation et on montre le coeur
  setTimeout(() => {
    food.classList.add('hidden');
    pet.classList.remove('eating');
    
    // Placer et animer le coeur au-dessus de l'animal
    reaction.style.left = pet.style.left;
    reaction.style.top = `calc(${pet.style.top} - 50px)`;
    reaction.classList.remove('hidden');
    
    // Réinitialiser l'animation pour pouvoir re-cliquer plusieurs fois
    reaction.style.animation = 'none';
    reaction.offsetHeight; // Force la mise à jour visuelle
    reaction.style.animation = 'floatUp 1.2s ease-out forwards';
  }, 1500);
});

startCamera();
