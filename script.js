document.addEventListener('DOMContentLoaded', () => {

  /* ─── THEME TOGGLE (Light / Dark) ─── */
  const themeToggle = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  function getCurrentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  if (themeToggle) {
    // Sync the button's a11y state with whatever the pre-paint script already applied
    themeToggle.setAttribute('aria-pressed', getCurrentTheme() === 'light' ? 'true' : 'false');

    themeToggle.addEventListener('click', () => {
      setTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
    });
  }

  // Follow OS theme changes only if the user hasn't picked one explicitly
  if (!localStorage.getItem('theme') && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'light' : 'dark');
    });
  }


  /* ─── NAV TOGGLE (Mobile) ─── */
  const navToggle  = document.getElementById('nav-toggle-btn');
  const navLinks   = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const navItems   = navLinks.querySelectorAll('a');
  let isMenuOpen   = false;

  function openMenu() {
    isMenuOpen = true;
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isMenuOpen ? closeMenu() : openMenu();
  });

  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = targetId ? document.querySelector(targetId) : null;

      // 1. Close menu first — this synchronously restores body overflow
      closeMenu();

      if (targetEl) {
        // 2. Wait for the drawer slide-out transition (300ms) to finish,
        //    then scroll. Using 350ms gives a small buffer above the 300ms CSS transition.
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      }
    });
  });

  navOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });


  /* ─── SCROLL SPY ─── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  function setActiveLink(id) {
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  }

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: '-40% 0px -50% 0px', // fires when section is roughly centered
    threshold: 0,
  });

  sections.forEach(section => spyObserver.observe(section));


  /* ─── SCROLL REVEAL ─── */
  let lastScrollY = window.scrollY;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const currentScrollY = window.scrollY;
      const previousEntryTop = Number(entry.target.dataset.lastEntryTop ?? entry.boundingClientRect.top);
      const isScrollingDown = currentScrollY > lastScrollY || entry.boundingClientRect.top < previousEntryTop;
      const shouldReveal = entry.isIntersecting && (isScrollingDown || currentScrollY === 0);

      if (shouldReveal) {
        entry.target.classList.add('opacity-100', 'translate-y-0', 'blur-none');
        entry.target.querySelectorAll('.reveal-child').forEach(child => {
          child.classList.add('opacity-100', 'translate-y-0', 'blur-none');
        });
        revealObserver.unobserve(entry.target);
      }

      entry.target.dataset.lastEntryTop = entry.boundingClientRect.top;
      lastScrollY = currentScrollY;
    });
  }, {
    threshold: 0.08,
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ─── PROJECT GALLERY MODAL ─── */
  const galleryData = {
    'ictc-tracker': {
      title: 'ICTS Contribution Tracker',
      tag: 'UI / UX Designer & Backend Developer',
      images: [
        { src: 'images/projects/ictc-tracker/1.jpg', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/ictc-tracker/2.jpg', caption: 'Screenshot 2 — replace with a real screenshot' },
        { src: 'images/projects/ictc-tracker/3.jpg', caption: 'Screenshot 3 — replace with a real screenshot' },
      ],
    },
    'task-manager': {
      title: 'Task Management System',
      tag: 'Full Stack Developer',
      images: [
        { src: 'images/projects/task-manager/1.png', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/task-manager/2.png', caption: 'Screenshot 2 — replace with a real screenshot' },
        { src: 'images/projects/task-manager/3.png', caption: 'Screenshot 3 — replace with a real screenshot' },
      ],
    },
    'lunas-sa-katas': {
      title: 'Lunas sa Katas Documentary Short Film',
      tag: 'Film Director',
      images: [
        { src: 'images/projects/lunas-sa-katas/1.png', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/lunas-sa-katas/2.png', caption: 'Screenshot 2 — replace with a real screenshot' },
      ],
    },
    'deped-tracker': {
      title: 'DepEd Training Tracker & Information System',
      tag: 'Full Stack Developer',
      images: [
        { src: 'images/projects/deped-tracker/1.png', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/deped-tracker/2.png', caption: 'Screenshot 2 — replace with a real screenshot' },
        { src: 'images/projects/deped-tracker/3.png', caption: 'Screenshot 3 — replace with a real screenshot' },
        { src: 'images/projects/deped-tracker/4.png', caption: 'Screenshot 4 — replace with a real screenshot' },
        { src: 'images/projects/deped-tracker/5.png', caption: 'Screenshot 5 — replace with a real screenshot' },
      ],
    },

    'iponph': {
      title: 'Ipon.ph Website',
      tag: 'Full Stack Developer',
      images: [
        { src: 'images/projects/iponph/1.png', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/iponph/2.png', caption: 'Screenshot 2 — replace with a real screenshot' },
        { src: 'images/projects/iponph/3.png', caption: 'Screenshot 3 — replace with a real screenshot' },

      ],
    },
      'graphics': {
      title: 'Freelance Graphic Design Portfolio',
      tag: 'Layout Artist',
      images: [
        { src: 'images/projects/graphics/1.png', caption: 'Screenshot 1 — replace with a real screenshot' },
        { src: 'images/projects/graphics/2.png', caption: 'Screenshot 2 — replace with a real screenshot' },
        { src: 'images/projects/graphics/3.png', caption: 'Screenshot 3 — replace with a real screenshot' },
        { src: 'images/projects/graphics/4.png', caption: 'Screenshot 4 — replace with a real screenshot' },
        { src: 'images/projects/graphics/5.png', caption: 'Screenshot 5 — replace with a real screenshot' },
      ],
    },
  };

  const galleryModal    = document.getElementById('gallery-modal');
  const galleryBackdrop = document.getElementById('gallery-backdrop');
  const galleryClose    = document.getElementById('gallery-close');
  const galleryPrev     = document.getElementById('gallery-prev');
  const galleryNext     = document.getElementById('gallery-next');
  const galleryImage    = document.getElementById('gallery-image');
  const galleryCounter  = document.getElementById('gallery-counter');
  const galleryStage    = document.querySelector('.gallery-stage');

  let currentImages = [];
  let currentIndex  = 0;
  let lastFocusedEl = null;

  function renderGallerySlide() {
    const item = currentImages[currentIndex];
    galleryImage.classList.remove('loaded');
    galleryImage.src = item.src;
    galleryImage.alt = item.caption || '';
    galleryCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    galleryPrev.disabled = currentImages.length <= 1;
    galleryNext.disabled = currentImages.length <= 1;
  }

  galleryImage.addEventListener('load', () => galleryImage.classList.add('loaded'));

  function openGallery(slug, triggerEl) {
    const data = galleryData[slug];
    if (!data || !data.images.length) return;

    currentImages = data.images;
    currentIndex = 0;
    lastFocusedEl = triggerEl || document.activeElement;

    renderGallerySlide();

    galleryModal.hidden = false;
    // Force reflow so the transition runs
    void galleryModal.offsetWidth;
    galleryModal.classList.add('active');
    document.body.classList.add('gallery-open');
    galleryClose.focus();
  }

  function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.classList.remove('gallery-open');
    setTimeout(() => { galleryModal.hidden = true; }, 300);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function showPrev() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderGallerySlide();
  }

  function showNext() {
    if (currentImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderGallerySlide();
  }

  document.querySelectorAll('.project-item--gallery').forEach(item => {
    item.addEventListener('click', () => openGallery(item.dataset.project, item));
  });

  galleryClose.addEventListener('click', closeGallery);
  galleryBackdrop.addEventListener('click', closeGallery);
  galleryPrev.addEventListener('click', showPrev);
  galleryNext.addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (galleryModal.hidden) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Basic swipe support on touch devices
  let touchStartX = null;
  galleryStage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  galleryStage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx > 0 ? showPrev() : showNext();
    touchStartX = null;
  }, { passive: true });

});