// Main interactivity: cursor, smooth scroll, animations
document.addEventListener('DOMContentLoaded', () => {

  // Custom cursor
document.addEventListener('DOMContentLoaded', () => {
  
  const NUM_PARTICLES = 30;
  const particles = [];
  const center = { 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2 
  };

  // Create comet particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let p = document.createElement('div');
    p.className = 'comet-particle';
    document.body.appendChild(p);
    particles.push({
      el: p,
      x: center.x,
      y: center.y,
      vx: 0,
      vy: 0,
      life: (i / NUM_PARTICLES) * 1.5
    });
  }

  let mouse = { x: center.x, y: center.y };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    particles.forEach((p, i) => {

      // Follow mouse position with delay
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;

      p.vx += dx * 0.02;
      p.vy += dy * 0.02;

      // Black hole gravity
      let gx = center.x - p.x;
      let gy = center.y - p.y;
      p.vx += gx * 0.0009;
      p.vy += gy * 0.0009;

      // Slight drag
      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx;
      p.y += p.vy;

      // Update particle
      p.el.style.left = p.x + "px";
      p.el.style.top = p.y + "px";

      // Fade tail (younger particle = brighter)
      let opacity = 1 - (i / NUM_PARTICLES);
      p.el.style.opacity = opacity;
      p.el.style.scale = 1 + (0.6 * opacity);

    });

    requestAnimationFrame(animate);
  }

  animate();
});
  // Starfield
  const canvas = document.getElementById('starfield');
  window.starfield = window.createStarfield(canvas);

  // Fade-in panels
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add('inview');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.panel').forEach(el => obs.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);

      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Button scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Floating Audio Player
const audio = document.getElementById("audio");
const audioBtn = document.getElementById("audio-btn");

let audioUnlocked = false;

// Auto start muted
window.addEventListener("DOMContentLoaded", () => {
  audio.play().catch(() => {});
});

// Fungsi untuk unmute ketika user berinteraksi pertama kali
function unlockAudio() {
  if (!audioUnlocked) {
    audio.muted = false;
    audio.volume = 1;
    audio.play();
    audioBtn.textContent = "⏸";
    audioUnlocked = true;

    // Setelah unmute, hapus listener supaya hemat
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("scroll", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  }
}

// Trigger unmute oleh gestur apapun
window.addEventListener("click", unlockAudio);
window.addEventListener("scroll", unlockAudio);
window.addEventListener("keydown", unlockAudio);


// Tombol Play/Pause
audioBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    audioBtn.textContent = "⏸";
  } else {
    audio.pause();
    audioBtn.textContent = "⏵";
  }
});

/* ==================================================
      COMET CURSOR — TAIL ONLY GETS PULLED BY BLACKHOLE
   ================================================== */

const NUM_PARTICLES = 10;  // panjang ekor
const particles = [];

const center = { 
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

let mouse = { x: center.x, y: center.y };

// create particles
for (let i = 0; i < NUM_PARTICLES; i++) {
  const p = document.createElement('div');
  p.className = 'comet-particle';
  document.body.appendChild(p);

  particles.push({
    el: p,
    x: center.x,
    y: center.y,
    vx: 0,
    vy: 0
  });
}

// track mouse
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateComet() {

  particles.forEach((p, i) => {

    if (i === 0) {
      /* ============================
            HEAD OF COMET (NO GRAVITY)
         ============================ */
      p.x += (mouse.x - p.x) * 0.25;
      p.y += (mouse.y - p.y) * 0.25;

    } else {
      /* =======================================
            TAIL FOLLOWING PREVIOUS PARTICLE
         ======================================= */
      const prev = particles[i - 1];

      p.x += (prev.x - p.x) * 0.18;
      p.y += (prev.y - p.y) * 0.18;

      /* =======================================
            BLACK HOLE GRAVITY ON TAIL ONLY
         ======================================= */
      let dx = center.x - p.x;
      let dy = center.y - p.y;

      // strength depends on distance from head (i)
      let gravityStrength = i * 0.0008; // makin belakang makin kuat

      p.x += dx * gravityStrength;
      p.y += dy * gravityStrength;
    }

    // render
    p.el.style.left = p.x + 'px';
    p.el.style.top  = p.y + 'px';

    // fade & size tapering
    let fade = 1 - i / NUM_PARTICLES;
    p.el.style.opacity = fade;
    p.el.style.scale   = 0.4 + fade * 0.8;

  });

  requestAnimationFrame(animateComet);
}

animateComet();

/*======================================
  CONTACT FORM — EMAILJS + RECAPTCHA
=======================================*/

const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

/*  
   FUNCTION: Kirim Email + Validasi reCAPTCHA
*/
const sendEmail = (e) => {
    e.preventDefault(); 

    // Ambil token dari Google reCAPTCHA
    const recaptcha = grecaptcha.getResponse();

    if (recaptcha.length === 0) {
        // User belum mencentang captcha
        contactMessage.textContent = '⚠ Please complete the reCAPTCHA verification.';
        contactMessage.style.color = '#ff8c8c';
        contactMessage.style.display = 'block';
        return;
    }

    // Kirim email via EmailJS
    emailjs.sendForm('service_1bi62hw', 'template_3uqt59z', '#contact-form', 'sgePKmZS0MU29l8jU')
        .then(() => {

            contactMessage.textContent = '✓ Message sent successfully!';
            contactMessage.style.color = '#a6ffcc';
            contactMessage.style.display = 'block';

            // Reset form & recaptcha
            contactForm.reset();
            grecaptcha.reset();

            // Hide after 5 seconds
            setTimeout(() => {
                contactMessage.style.display = 'none';
            }, 5000);

        }, (error) => {

            contactMessage.textContent = '❌ Message failed to send (check captcha).';
            contactMessage.style.color = '#ff8c8c';
            contactMessage.style.display = 'block';
        });
};


// EVENT LISTENER
contactForm.addEventListener('submit', sendEmail);

/* ============================
      HAMBURGER MENU LOGIC
   ============================ */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("show");
});

// Auto-close menu when clicking a link
document.querySelectorAll("#nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("show");
  });
});
