/* ============================================================
   MARTHA CRA PORTFOLIO — CORE SCRIPTS
   Shared nervous system: scroll reveals, diagram sequences,
   hover tooltips, graceful degradation
   ============================================================ */

(function() {
  'use strict';

  // —— GRACEFUL DEGRADATION CHECK ——
  // If JS fails or is disabled, add .no-js class for CSS fallbacks
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js-enabled');

  // —— SCROLL-TRIGGERED REVEALS ——
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add small delay based on element's position for staggered effect
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 1000);

        // Unobserve after revealing
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // —— DIAGRAM SEQUENCE SYSTEM (Door 2 Hourglass) ——
  window.DiagramSequence = {
    // Configuration for the 6-step reveal
    steps: [
      { selector: '.diagram-root', delay: 0, duration: 600 },
      { selector: '.diagram-spine', delay: 500, duration: 800 },
      { selector: '.diagram-crack', delay: 1000, duration: 600 },
      { selector: '.diagram-intervention', delay: 1600, duration: 600 },
      { selector: '.diagram-regulatory', delay: 2200, duration: 500 },
      { selector: '.diagram-foundation', delay: 2800, duration: 800 }
    ],

    init(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      // Check if already animated (don't re-run on scroll back)
      if (container.dataset.animated === 'true') return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.play(container);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(container);
    },

    play(container) {
      container.dataset.animated = 'true';

      this.steps.forEach(step => {
        setTimeout(() => {
          const elements = container.querySelectorAll(step.selector);
          elements.forEach(el => {
            el.classList.add('active');
            el.style.opacity = '1';

            // Special handling for border trace animation
            if (el.classList.contains('border-trace')) {
              el.style.animation = `traceBorder ${step.duration}ms ease forwards`;
            }

            // Special handling for line draw
            if (el.classList.contains('line-draw')) {
              el.style.animation = `drawLine ${step.duration}ms ease forwards`;
            }
          });
        }, step.delay);
      });

      // Total sequence time ~4 seconds
      console.log('Diagram sequence initiated');
    }
  };

  // —— HOVER TOOLTIP ENHANCEMENTS ——
  // Ensure tooltips stay within viewport
  const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');

  tooltipTriggers.forEach(trigger => {
    const tooltip = trigger.querySelector('.tooltip');
    if (!tooltip) return;

    trigger.addEventListener('mouseenter', () => {
      const rect = tooltip.getBoundingClientRect();

      // If tooltip goes off top of viewport, flip to bottom
      if (rect.top < 10) {
        tooltip.style.bottom = 'auto';
        tooltip.style.top = 'calc(100% + 8px)';
        tooltip.style.transform = 'translateX(-50%)';
      }

      // If tooltip goes off left/right, adjust
      if (rect.left < 10) {
        tooltip.style.left = '0';
        tooltip.style.transform = 'translateX(0)';
      } else if (rect.right > window.innerWidth - 10) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '0';
        tooltip.style.transform = 'translateX(0)';
      }
    });

    trigger.addEventListener('mouseleave', () => {
      // Reset positioning for next hover
      setTimeout(() => {
        tooltip.style.bottom = '';
        tooltip.style.top = '';
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.transform = '';
      }, 300);
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

  // —— NAVIGATION FADE TRANSITIONS ——
  window.PageTransition = {
    navigate(url) {
      // Create overlay
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

      // Fade in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });

      // Navigate after fade
      setTimeout(() => {
        window.location.href = url;
      }, 400);
    }
  };

  // —— DOWNLOAD PDF BUTTON ——
  window.initDownloadButtons = function() {
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // If href is # or empty, show placeholder message
        const href = btn.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();

          // Create temporary notification
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

  // Initialize download buttons on load
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

        // Add "In Preparation" label
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
        // Active door - add hover glow
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
  handleResize(); // Initial check

  // —— CONSOLE EASTER EGG ——
  console.log('%c Martha CRA Portfolio ', 'background: #1a1a1f; color: #c4956a; font-size: 14px; font-weight: bold; padding: 4px 8px;');
  console.log('%c Extensions of cognition, not decoration. ', 'color: #9a948a; font-style: italic;');

})();
