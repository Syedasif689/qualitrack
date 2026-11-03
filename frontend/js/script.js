// =========================================================
// THEME TOGGLE — runs first so the UI stays in sync
// =========================================================
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }

  // Sync UI with the theme already set by the inline head script
  apply(root.getAttribute('data-theme') || 'dark');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// =========================================================
// DASHBOARD PREVIEW ROTATION
// (illustrative values only — not real analysis results)
// =========================================================
const demoProjects = [
  {
    name: 'Payment Service',
    language: 'Java · Spring Boot',
    score: 82, bugs: 12, security: 3, smells: 28,
    title: 'Improve maintainability',
    recommendation: 'Review high-priority findings and simplify complex methods.'
  },
  {
    name: 'E-Commerce App',
    language: 'JavaScript · Node.js',
    score: 91, bugs: 4, security: 1, smells: 13,
    title: 'Strengthen security checks',
    recommendation: 'Review the remaining security finding and verify dependency updates.'
  },
  {
    name: 'Inventory API',
    language: 'Python · FastAPI',
    score: 68, bugs: 21, security: 7, smells: 36,
    title: 'Address high-priority issues',
    recommendation: 'Prioritize security findings, then resolve the most frequent bugs.'
  },
  {
    name: 'Student Portal',
    language: 'Java · Spring Boot',
    score: 76, bugs: 9, security: 2, smells: 19,
    title: 'Reduce code complexity',
    recommendation: 'Refactor long methods and add tests around critical workflows.'
  }
];

const $ = (id) => document.getElementById(id);
const dashboard = $('dashboardCard');
const ring = $('scoreRing');
const circumference = 2 * Math.PI * 48;

let activeProject = 0;
let animationTimer = null;
let transitionTimer = null;
let countAnimationFrame = null;

ring.style.strokeDasharray = String(circumference);

function animateNumber(element, target, duration = 650) {
  const startTime = performance.now();
  if (countAnimationFrame) cancelAnimationFrame(countAnimationFrame);

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) countAnimationFrame = requestAnimationFrame(frame);
  }

  element.textContent = '0';
  countAnimationFrame = requestAnimationFrame(frame);
}

function showProject(project, animate = true) {
  if (animate) dashboard.classList.add('is-changing');
  if (transitionTimer) clearTimeout(transitionTimer);

  transitionTimer = setTimeout(() => {
    $('projectName').textContent = project.name;
    $('projectLanguage').textContent = project.language;
    $('qualityScore').textContent = String(project.score);
    $('scorePercentage').textContent = project.score + '%';
    $('bugCount').textContent = String(project.bugs);
    $('securityCount').textContent = String(project.security);
    $('smellCount').textContent = String(project.smells);
    $('recommendationTitle').textContent = project.title;
    $('recommendationText').textContent = project.recommendation;
    $('scoreCaption').textContent = 'Illustrative quality score';

    ring.style.strokeDashoffset = String(circumference * (1 - project.score / 100));

    if (animate) {
      animateNumber($('qualityScore'), project.score);
      animateMetric($('bugCount'), project.bugs);
      animateMetric($('securityCount'), project.security);
      animateMetric($('smellCount'), project.smells);
      $('scorePercentage').textContent = project.score + '%';
    }

    dashboard.classList.remove('is-changing');
  }, animate ? 420 : 0);
}

function animateMetric(element, target, duration = 650) {
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = String(
      Math.round(target * (1 - Math.pow(1 - progress, 3)))
    );
    if (progress < 1) requestAnimationFrame(frame);
  }

  element.textContent = '0';
  requestAnimationFrame(frame);
}

function rotateDashboard() {
  activeProject = (activeProject + 1) % demoProjects.length;
  showProject(demoProjects[activeProject], true);
}

// =========================================================
// INIT
// =========================================================
$('currentYear').textContent = new Date().getFullYear();
showProject(demoProjects[0], false);
animationTimer = setInterval(rotateDashboard, 4200);

// =========================================================
// NAV DRAWER
// The nav links are parked behind the logo. Clicking the logo
// (or the ☰ button) toggles them. Dragging from the left edge —
// or dragging the open drawer back left — opens/closes it with
// a live rubber-band follow, then snaps on release.
// =========================================================
(function initNavDrawer() {
  const drawer   = $('navLinks');
  const brand    = $('brandToggle');
  const backdrop = $('navBackdrop');
  const menuBtn  = $('menuToggle');

  if (!drawer || !brand) return;

  const EDGE_PX   = 26;    // how close to the left screen edge a drag must start
  const THRESHOLD = 0.5;   // fraction of drawer width needed to commit the gesture
  const FLICK_V   = 0.45;  // px/ms — a fast flick commits regardless of distance

  let open = false;
  let drag = null;

  const drawerWidth = () => drawer.offsetWidth || 320;

  /* ---------- open / close ---------- */
  function setOpen(next) {
    open = next;

    // Hand control back to CSS so it animates from the current drag position.
    drawer.style.transition = '';
    drawer.style.transform  = '';

    if (backdrop) {
      backdrop.style.transition    = '';
      backdrop.style.opacity       = '';
      backdrop.style.pointerEvents = '';
    }

    document.body.classList.toggle('nav-open', open);
    brand.setAttribute('aria-expanded', String(open));

    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '×' : '☰';
    }
  }

  function toggle(next) {
    setOpen(typeof next === 'boolean' ? next : !open);
  }

  /* ---------- triggers ---------- */
  brand.addEventListener('click', (e) => {
    e.preventDefault();        // the logo toggles the drawer instead of jumping to #home
    toggle();
  });

  brand.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggle();
    }
  });

  if (menuBtn) menuBtn.addEventListener('click', () => toggle());
  if (backdrop) backdrop.addEventListener('click', () => toggle(false));

  // picking a link inside the drawer closes it, then the anchor scrolls
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) toggle(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) toggle(false);
  });

  /* ---------- drag / swipe ---------- */
  function onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.navbar')) return;   // let header controls behave normally

    const fromEdge   = e.clientX <= EDGE_PX;
    const fromDrawer = drawer.contains(e.target);

    if (!open && !fromEdge) return;              // closed → only an edge swipe opens
    if (open && !(fromDrawer || fromEdge)) return;

    drag = {
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      axis: null,
      active: false,
      vx: 0,
      t: performance.now()
    };
  }

  function onMove(e) {
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    // lock the axis once the finger has moved enough
    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'y') { drag = null; return; }   // let the page scroll

      drag.active = true;
      drawer.style.transition = 'none';
      if (backdrop) backdrop.style.transition = 'none';
      document.body.classList.add('is-dragging');
    }

    const w    = drawerWidth();
    const base = open ? 0 : -w;
    const x    = Math.max(-w, Math.min(0, base + dx));

    drawer.style.transform = `translateX(${x}px)`;

    if (backdrop) {
      const o = 1 - Math.abs(x) / w;
      backdrop.style.opacity       = String(o);
      backdrop.style.pointerEvents = o > 0.01 ? 'auto' : 'none';
    }

    const now = performance.now();
    const dt  = now - drag.t;
    if (dt > 0) drag.vx = (x - drag.x) / dt;
    drag.x = x;
    drag.t = now;

    if (e.cancelable) e.preventDefault();
  }

  function onUp() {
    if (!drag) return;

    const wasActive = drag.active;
    const vx        = drag.vx;
    const currentX  = drag.x;

    drag = null;
    document.body.classList.remove('is-dragging');

    if (!wasActive) return;   // it was a tap, not a drag

    const w        = drawerWidth();
    const openness = 1 - Math.abs(currentX) / w;   // 0 = closed, 1 = open

    let next;
    if (Math.abs(vx) > FLICK_V) {
      next = vx > 0;                                // rightward flick opens
    } else {
      next = openness > THRESHOLD;
    }

    setOpen(next);
  }

  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointermove', onMove, { passive: false });
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);

  // keep state tidy if the viewport changes while the drawer is closed
  window.addEventListener('resize', () => {
    if (!open) drawer.style.transform = '';
  });
})();

// =========================================================
// CLEANUP
// =========================================================
window.addEventListener('pagehide', () => {
  clearInterval(animationTimer);
  clearTimeout(transitionTimer);
  if (countAnimationFrame) cancelAnimationFrame(countAnimationFrame);
});