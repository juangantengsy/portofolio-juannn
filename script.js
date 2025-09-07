// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Elements
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const moreBtn = document.getElementById('moreBtn');
const moreMenu = document.getElementById('moreMenu');

// ----- Hamburger -----
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close mobile menu when link clicked + offset scroll
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // Smooth offset scroll (kompensasi tinggi navbar)
    const id = link.getAttribute('href');
    if (id.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - (navHeight - 1);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    navLinks.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ----- More Menu -----
moreBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = moreMenu.style.display === 'block';
  moreMenu.style.display = isOpen ? 'none' : 'block';
  moreBtn.setAttribute('aria-expanded', String(!isOpen));
});
document.addEventListener('click', (e)=>{
  if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
    moreMenu.style.display = 'none';
    moreBtn.setAttribute('aria-expanded', 'false');
  }
});

// ----- Reveal on scroll with stagger (data-delay in ms) -----
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const el = entry.target;
      const d = parseInt(el.dataset.delay || '0', 10);
      el.style.setProperty('--delay', d);
      el.classList.add('show');
      io.unobserve(el);
    }
  }
},{ threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animate skill bars when visible
const barObs = new IntersectionObserver((entries)=>{
  for (const e of entries) {
    if (e.isIntersecting) {
      const bar = e.target;
      // Trigger layout, then animate to --w
      const w = getComputedStyle(bar).getPropertyValue('--w') || '0%';
      bar.style.width = '0%';
      requestAnimationFrame(()=> {
        requestAnimationFrame(()=> bar.style.width = w.trim());
      });
      barObs.unobserve(bar);
    }
  }
},{ threshold: 0.35 });
document.querySelectorAll('.progress .bar').forEach(bar => barObs.observe(bar));

// ----- Scroll Spy (set active nav item) -----
const sections = Array.from(document.querySelectorAll('section, header.hero')).map(s => ({
  id: s.id || 'home',
  el: s
}));
const spy = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting) {
      const id = entry.target.id || 'home';
      document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
},{
  rootMargin: '-50% 0px -45% 0px', // trigger near middle of screen
  threshold: 0
});
sections.forEach(s => spy.observe(s.el));

// ----- Lightbox Sertifikat -----
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');

document.querySelectorAll('.cert-item img').forEach(img=>{
  img.addEventListener('click', ()=>{
    const src = img.dataset.full || img.src;
    lbImg.src = src;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden','false');
  });
});
lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLB(); });
function closeLB(){
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden','true');
  lbImg.src = '';
}

// ----- Contact form demo -----
document.getElementById('contactForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const txt = btn.textContent;
  btn.textContent = 'Mengirim…';
  btn.disabled = true;
  setTimeout(()=>{
    alert('Terkirim! (Demo) — Hubungkan ke backend/Email/WA agar real.');
    btn.textContent = txt;
    btn.disabled = false;
    e.target.reset();
  }, 900);
});

// ----- Theme toggle -----
document.getElementById('themeToggle')?.addEventListener('click', (ev)=>{
  ev.preventDefault();
  document.documentElement.classList.toggle('light');
  moreMenu.style.display = 'none';
});

// Close mobile menu on resize up
window.addEventListener('resize', ()=> {
  if (window.innerWidth > 820) {
    navLinks.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
// Typing effect
const typing = document.querySelector(".typing");
const words = ["Web Developer", "Freelancer", "Programmer"];
let i = 0, j = 0, currentWord = "", isDeleting = false;

function typeEffect() {
  currentWord = words[i];
  if (!isDeleting) {
    typing.textContent = currentWord.substring(0, j + 1);
    j++;
    if (j === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typing.textContent = currentWord.substring(0, j - 1);
    j--;
    if (j === 0) {
      isDeleting = false;
      i = (i + 1) % words.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 80 : 120);
}

typeEffect();
document.querySelectorAll('.circle-skill').forEach(skill => {
  let percent = skill.getAttribute('data-percent');
  let circle = skill.querySelector('circle:last-child');
  circle.style.setProperty('--percent', percent);
});
