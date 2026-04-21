/* ============================================================
   CITIGEN — main.js
   Handles: Navbar, Mobile Menu, Scroll Reveal, FAQ, Pricing Toggle, Portfolio Filter, Form, Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. NAVBAR — scroll effect
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ──────────────────────────────────────────────
     2. MOBILE MENU
  ────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu .btn');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });


  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────────
     4. PRICING TOGGLE — one-time vs monthly
  ────────────────────────────────────────────── */
  const pricingToggle = document.getElementById('pricing-toggle');
  let isMonthly = false;

  const prices = {
    starter: { onetime: '799', monthly: '79' },
    growth:  { onetime: '1,999', monthly: '199' },
    pro:     { onetime: '4,999', monthly: '499' },
  };

  function updatePricing() {
    const mode = isMonthly ? 'monthly' : 'onetime';

    ['starter', 'growth', 'pro'].forEach(plan => {
      const valueEl = document.querySelector(`#price-${plan} .price-val`);
      const periodEl = document.getElementById(`period-${plan}`);
      if (valueEl) valueEl.textContent = prices[plan][mode];
      if (periodEl) periodEl.textContent = isMonthly ? '/ month' : 'one-time payment';
    });

    const proNote = document.getElementById('note-pro');
    if (proNote) {
      proNote.textContent = isMonthly
        ? 'Custom monthly retainer after discovery call'
        : 'Custom quote after discovery call';
    }
  }

  pricingToggle.addEventListener('click', () => {
    isMonthly = !isMonthly;
    pricingToggle.classList.toggle('active', isMonthly);
    pricingToggle.setAttribute('aria-pressed', isMonthly.toString());
    updatePricing();
  });


  /* ──────────────────────────────────────────────
     5. FAQ ACCORDION
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ──────────────────────────────────────────────
     6. PORTFOLIO FILTER TABS
  ────────────────────────────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = '';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ──────────────────────────────────────────────
     7. CONTACT FORM — client-side
  ────────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !service || !message) {
      shakeForm();
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('cf-email').focus();
      document.getElementById('cf-email').style.borderColor = '#EF4444';
      return;
    }

    // Simulate submission (replace with real endpoint)
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      Sending…
    `;

    await delay(1800);

    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      Send Message
    `;
    formSuccess.style.display = 'block';

    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 7000);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm() {
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => { contactForm.style.animation = ''; }, 400);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Remove red border on email input on input
  const emailInput = document.getElementById('cf-email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.style.borderColor = '';
    });
  }


  /* ──────────────────────────────────────────────
     8. SMOOTH ANCHOR SCROLL (iOS fix)
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────────
     9. HERO — active nav link on scroll
  ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

});


/* ──────────────────────────────────────────────
   INJECT GLOBAL KEYFRAMES (shake + spin)
────────────────────────────────────────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .spin {
    animation: spinIcon 1s linear infinite;
    display: inline-block;
  }
  @keyframes spinIcon {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
