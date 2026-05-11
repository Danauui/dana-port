const reveals = document.querySelectorAll('.reveal, .reveal-item');
const nav = document.querySelector('.nav');
const links = document.querySelector('.links');
const toggle = document.querySelector('.menu-toggle');
const progress = document.querySelector('.scroll-progress');
const railFill = document.querySelector('.rail-fill');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.12 });
reveals.forEach((el) => observer.observe(el));

const mouseLight = document.querySelector('.mouse-light');
window.addEventListener('mousemove', (event) => {
  if (!mouseLight) return;
  mouseLight.style.left = `${event.clientX}px`;
  mouseLight.style.top = `${event.clientY}px`;
});
window.addEventListener('mouseleave', () => mouseLight && (mouseLight.style.opacity = '0'));
window.addEventListener('mouseenter', () => mouseLight && (mouseLight.style.opacity = '.9'));

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 950);
});

function updateScrollUI(){
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (window.scrollY / height) * 100 : 0;
  if(progress) progress.style.width = `${pct}%`;
  if(railFill) railFill.style.height = `${pct}%`;
  if(nav) nav.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateScrollUI, { passive:true });
updateScrollUI();

if(toggle && links){
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
window.addEventListener('scroll', () => {
  let current = sections[0]?.id;
  sections.forEach(sec => { if(window.scrollY >= sec.offsetTop - 160) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive:true });

const tiltCards = document.querySelectorAll('.tilt');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - .5) * -8;
    const ry = ((x / r.width) - .5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});



/* ===== Dana Future Full Upgrade Interactions ===== */
const dockLinks = [...document.querySelectorAll('.glass-dock a')];
function syncDock(){
  let current = sections[0]?.id;
  sections.forEach(sec => { if(window.scrollY >= sec.offsetTop - 170) current = sec.id; });
  dockLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', syncDock, { passive:true });
syncDock();

// parallax depth without adding custom cursor/magnetic behavior
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('.depth-one').forEach(el => el.style.transform = `translateY(${y * -0.018}px)`);
  document.querySelectorAll('.depth-two').forEach(el => el.style.transform = `translateY(${y * 0.028}px)`);
}, { passive:true });

// animated counters
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = '1';
    const end = Number(entry.target.dataset.count || 0);
    let start = 0;
    const duration = 1100;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      entry.target.textContent = Math.round(start + (end - start) * eased);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold:.45 });
counters.forEach(c => counterObserver.observe(c));

// case study modal
const caseData = {
  ahhl:{title:'Ahhl Fellowship 2.0',overview:'A selective consulting-focused fellowship bringing high-potential students across Saudi Arabia into a professional development journey with exposure to leading consulting and professional services firms.',role:'Media Team member, contributing to the fellowship’s presence, storytelling, and communication quality.',outcome:'Strengthened the project’s professional visibility and supported a six-month talent-development experience.'},
  road:{title:'Road to CFO Program',overview:'A three-day finance initiative with workshops and sessions led by CFOs and finance leaders, designed to expose students to financial leadership and executive decision-making.',role:'Media Team member, supporting coverage, positioning, and professional presentation of the program.',outcome:'Helped present the program as a premium finance-development experience connected to Riyad Capital and Ethmar Financial.'},
  ethmar:{title:'Best Student Initiative at KSU 2025',overview:'Ethmar Financial Initiative was recognized as one of the top student initiatives within the Student Partnership Program at King Saud University.',role:'Contributed through finance/design/media-related initiative work and program visibility.',outcome:'Recognition reinforced the initiative’s quality, execution, and student impact.'},
  portfolio:{title:'Personal Portfolio Website',overview:'A bilingual luxury portfolio designed to present finance, investment, leadership, and project work through a future-facing digital identity.',role:'Personal brand owner and creative direction lead.',outcome:'A premium digital presence that turns a CV into an interactive executive-style experience.'}
};
const modal = document.querySelector('.case-modal');
const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
document.querySelectorAll('.case-btn').forEach(btn => btn.addEventListener('click', () => {
  const data = caseData[btn.dataset.case] || caseData.portfolio;
  setText('case-title', data.title); setText('case-overview', data.overview); setText('case-role', data.role); setText('case-outcome', data.outcome);
  modal?.classList.add('open'); modal?.setAttribute('aria-hidden','false');
}));
document.querySelectorAll('[data-close-case]').forEach(el => el.addEventListener('click', () => { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true'); }));
window.addEventListener('keydown', e => { if(e.key === 'Escape') { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true'); }});

// Dana AI bubble — scripted profile guide, no external API
const aiBubble = document.querySelector('.ai-bubble');
const aiToggle = document.querySelector('.ai-toggle');
const aiClose = document.querySelector('.ai-close');
const aiAnswer = document.querySelector('.ai-answer');
const answers = {
  experience:'Dana combines investment analysis, startup screening, market sizing, financial content, and student leadership across King Saud University and Jaree.',
  projects:'Her selected work includes Ahhl Fellowship 2.0, Road to CFO, Ethmar Financial Initiative recognition, and this bilingual luxury portfolio.',
  strengths:'Core strengths: financial analysis, private markets curiosity, deal sourcing, economic thinking, leadership, and strategic communication.'
};
aiToggle?.addEventListener('click', () => aiBubble?.classList.toggle('open'));
aiClose?.addEventListener('click', () => aiBubble?.classList.remove('open'));
document.querySelectorAll('[data-ai]').forEach(btn => btn.addEventListener('click', () => {
  const key = btn.dataset.ai; if(aiAnswer) aiAnswer.textContent = answers[key] || answers.experience;
}));
