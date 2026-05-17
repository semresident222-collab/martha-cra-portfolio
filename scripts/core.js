/* ============================================================
   MARTHA CRA PORTFOLIO — CORE SCRIPTS
   Shared nervous system: scroll reveals, hover expansions,
   page transitions, graceful degradation
   ============================================================ */

(function() {
  'use strict';

  // —— GRACEFUL DEGRADATION CHECK ——
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js-enabled');

  // —— SCROLL-TRIGGERED REVEALS ——
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.revealDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay * 1000);

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // —— HOVER EXPANSIONS (Tree nodes) ——
  // The CSS handles the visual expansion, but we add
  // a subtle sound cue or haptic feedback if available
  const treeNodes = document.querySelectorAll('.crack-node, .intervention-node');

  treeNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      // Optional: add a subtle glow pulse to parent branch
      const branch = node.closest('.branch');
      if (branch) {
        branch.style.transition = 'filter 0.4s ease';
      }
    });
  });

  // —— SMOOTH SCROLL FOR ANCHOR LINKS ——
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // —— PAGE TRANSITIONS ——
  window.PageTransition = {
    navigate(url) {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--bg-graphite, #1a1a1f);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: all;
      `;
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });

      setTimeout(() => {
        window.location.href = url;
      }, 400);
    }
  };

  // —— DOWNLOAD PDF BUTTON ——
  window.initDownloadButtons = function() {
    document.querySelectorAll('.btn-download, .nav-pdf').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (!href || href === '#' || href === '') {
          e.preventDefault();

          const notice = document.createElement('div');
          notice.textContent = 'PDF coming soon — content in final review';
          notice.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-charcoal, #24242b);
            border: 1px solid var(--amber-border, rgba(196,149,106,0.4));
            color: var(--text-cream, #e8e2d9);
            padding: 1rem 2rem;
            font-family: var(--font-accent, sans-serif);
            font-size: 0.9rem;
            z-index: 10000;
            border-radius: 2px;
            animation: fadeInUp 0.4s ease;
            white-space: nowrap;
          `;
          document.body.appendChild(notice);

          setTimeout(() => {
            notice.style.opacity = '0';
            notice.style.transition = 'opacity 0.4s ease';
            setTimeout(() => notice.remove(), 400);
          }, 3000);
        }
      });
    });
  };

  // Initialize download buttons
  window.initDownloadButtons();

  // —— LOBBY DOOR INTERACTIONS ——
  window.initLobbyDoors = function() {
    const doors = document.querySelectorAll('.door-threshold');

    doors.forEach(door => {
      const status = door.dataset.status;
      const link = door.querySelector('a, .door-link');

      if (status === 'preparing') {
        door.style.opacity = '0.4';
        door.style.pointerEvents = 'none';
        door.style.cursor = 'not-allowed';

        const label = document.createElement('span');
        label.className = 'door-status';
        label.textContent = 'In Preparation';
        label.style.cssText = `
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: var(--text-muted, #9a948a);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        `;
        door.appendChild(label);
      } else if (link) {
        door.classList.add('hover-lift');

        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.getAttribute('href');
          if (url && window.PageTransition) {
            window.PageTransition.navigate(url);
          } else {
            window.location.href = url;
          }
        });
      }
    });
  };

  // —— RESPONSIVE NAVIGATION ——
  function handleResize() {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('is-mobile', isMobile);
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  // —— CONSOLE EASTER EGG ——
  console.log('%c Martha CRA Portfolio ', 'background: #1a1a1f; color: #c4956a; font-size: 14px; font-weight: bold; padding: 4px 8px;');
  console.log('%c Extensions of cognition, not decoration. ', 'color: #9a948a; font-style: italic;');

})();
