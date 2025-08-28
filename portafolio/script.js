document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let stars = [];
  const numStars = 120;

  function random(min, max) { return Math.random() * (max - min) + min; }

  function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        radius: random(1.5, 3),
        speed: random(0.02, 0.09),
        alpha: random(0.4, 1),
        delta: random(0.004, 0.02)
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      star.y -= star.speed;
      if (star.y < 0) star.y = canvas.height;

      star.alpha += star.delta;
      if (star.alpha >= 1 || star.alpha <= 0.25) star.delta = -star.delta;
    }
    requestAnimationFrame(animateStars);
  }

  window.addEventListener("resize", () => {
    initStars();
  });

  initStars();
  animateStars();


  const cards = Array.from(document.querySelectorAll('.card'));
  const thumbnails = Array.from(document.querySelectorAll('.thumbnails-container img'));
  const thumbnailBar = document.querySelector('.thumbnails-container');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const paypalBtn = document.getElementById('paypal');

  if (!cards.length) return; 

  let current = 0;
  let startX = 0, currentX = 0;
  let isDragging = false;
  let movedWhileDown = false; 


  function updateCards() {
    cards.forEach((card, i) => {
      card.classList.remove('active', 'removed');
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      if (i === current) {
        card.classList.add('active');
        card.style.transform = "translateX(0) rotate(0deg)";
        card.style.opacity = 1;
        card.style.zIndex = 10;
      } else {
        card.style.transform = "translateX(-150px)";
        card.style.opacity = 0;
        card.style.zIndex = 0;
      }
    });
    highlightThumbnail(current);
  }

  function highlightThumbnail(idx) {
    thumbnails.forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
    const active = thumbnailBar.querySelector('.thumbnail.active') || thumbnailBar.querySelector('.active');
    const activeImg = thumbnailBar.querySelector('img.active');
    if (activeImg) {
      activeImg.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function swipeToIndex(targetIndex, dir) {
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    if (targetIndex === current) return;

    const outCard = cards[current];
    outCard.classList.add('removed');
    outCard.style.transition = 'transform 0.28s ease, opacity 0.28s ease';
    outCard.style.transform = `translateX(${dir * 150}%) rotate(${dir * 25}deg)`;
    outCard.style.opacity = 0;

    setTimeout(() => {
      current = targetIndex % cards.length;
      updateCards();
    }, 300);
  }

  function removeCard(direction) {
    const outCard = cards[current];
    outCard.classList.add('removed');
    outCard.style.transform = `translateX(${direction * 150}%) rotate(${direction * 25}deg)`;
    outCard.style.opacity = 0;
    setTimeout(() => {
      current = (current + 1) % cards.length;
      updateCards();
    }, 300);
  }


  function handlePointerDown(e) {
    if (lightbox.classList.contains('show')) return;

    isDragging = true;
    movedWhileDown = false;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    const card = cards[current];
    card.style.transition = 'none';
    card.classList.add('dragging');
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const px = e.type.includes('touch') ? (e.touches[0] && e.touches[0].clientX) : e.clientX;
    if (typeof px !== 'number') return;
    currentX = px;
    const deltaX = (currentX - startX) * 1.25; 
    if (Math.abs(deltaX) > 4) movedWhileDown = true;
    const rotate = deltaX * 0.04;
    const card = cards[current];
    card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
  }

  function handlePointerUp() {
    if (!isDragging) return;
    isDragging = false;
    const card = cards[current];
    card.classList.remove('dragging');

    const deltaReal = currentX - startX;
    const threshold = 50;

    if (deltaReal > threshold) {
      removeCard(1); 
    } else if (deltaReal < -threshold) {
      removeCard(-1); 
    } else {
      card.style.transition = "transform 0.22s ease-out";
      card.style.transform = "translateX(0) rotate(0deg)";
      setTimeout(() => {
        card.style.transition = "transform 0.3s ease";
      }, 220);
    }
  }


  cards.forEach(card => {
    card.addEventListener('mousedown', (e) => {
      e.preventDefault();
      handlePointerDown(e);
    });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    card.addEventListener('touchstart', (e) => { handlePointerDown(e); }, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp, { passive: true });
  });


  cards.forEach(card => {
    const imgWrapper = card.querySelector('.img-wrapper');
    const img = imgWrapper.querySelector('img');

    imgWrapper.addEventListener('click', (e) => {
      if (movedWhileDown) {
        movedWhileDown = false;
        return;
      }
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });


  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIndex = Number(thumb.dataset.index);
      if (Number.isNaN(targetIndex)) return;
      if (targetIndex === current) return;
      const dir = targetIndex > current ? -1 : 1;
      swipeToIndex(targetIndex, dir);
    });
  });


  function initThumbnailsHighlight() {
    thumbnails.forEach((t, i) => t.classList.toggle('active', i === current));
  }


  if (paypalBtn) {
    paypalBtn.addEventListener('click', () => {
      window.open('https://www.paypal.com/tu-link', '_blank');
    });
  }


  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
      if (e.key === 'Escape') lightbox.classList.remove('show');
      return;
    }
    if (e.key === 'ArrowLeft') {
      current = current > 0 ? current - 1 : cards.length - 1;
      updateCards();
    } else if (e.key === 'ArrowRight') {
      current = (current + 1) % cards.length;
      updateCards();
    }
  });


  updateCards();
  initThumbnailsHighlight();

});
