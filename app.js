/* ==========================================================================
   SAAIT Enterprise Platform - Interactive Command Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initAnimatedCounters();
  initConsoleWorkspace();
  initFaqAccordion();
  initRoiCalculator();
  initLeadModal();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   0. Scroll Reveal Observer Engine
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   1. Navbar Drawer & Observer
   -------------------------------------------------------------------------- */
function initNavbar() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isActive = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isActive ? '&#215;' : '&#9776;';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '&#9776;';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Animated Count-Up Stats
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.count-up');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
        
        animateCounter(el, targetVal, prefix, suffix, decimals, 1800);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

function animateCounter(el, targetVal, prefix, suffix, decimals, duration) {
  let startTime = null;
  const startVal = 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = startVal + (targetVal - startVal) * easeProgress;
    
    el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
    }
  }

  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   3. Live SaaS Command Console Workspaces (3 Portals)
   -------------------------------------------------------------------------- */
function initConsoleWorkspace() {
  const tabBtns = document.querySelectorAll('.console-tab-btn');
  const panelViews = document.querySelectorAll('.console-panel-view');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-console');

      tabBtns.forEach(b => b.classList.remove('active'));
      panelViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`console-${targetId}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // Interactive Buttons in preview cards
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('portal-interactive-btn')) {
      const btn = e.target;
      if (btn.classList.contains('approved')) {
        btn.classList.remove('approved');
        btn.innerHTML = 'Approve Waiver';
      } else {
        btn.classList.add('approved');
        btn.innerHTML = '&#10003; Waiver Approved';
      }
    }

    if (e.target.id === 'liveTimerBtn') {
      const btn = e.target;
      const display = document.getElementById('liveTimerDisplay');
      if (btn.getAttribute('data-running') === 'true') {
        btn.setAttribute('data-running', 'false');
        btn.textContent = 'Start Project Timer';
        btn.style.background = 'var(--emerald-roi)';
      } else {
        btn.setAttribute('data-running', 'true');
        btn.textContent = 'Pause Timer (Active)';
        btn.style.background = 'var(--amber-warning)';
        if (display) display.textContent = '6.6 hrs (Ticking)';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion Logic
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.faq-content');
        if (c) c.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive ROI Savings Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const empSlider = document.getElementById('empCountSlider');
  const costSlider = document.getElementById('costPerEmpSlider');
  const empValDisplay = document.getElementById('empCountVal');
  const costValDisplay = document.getElementById('costPerEmpVal');
  
  const annualSavingsOutput = document.getElementById('annualSavingsVal');
  const hoursSavedOutput = document.getElementById('hoursSavedVal');

  if (!empSlider || !costSlider) return;

  function calculateROI() {
    const empCount = parseInt(empSlider.value);
    const costPerEmp = parseInt(costSlider.value);

    empValDisplay.textContent = empCount;
    costValDisplay.textContent = `$${costPerEmp}`;

    const currentAnnualSpend = empCount * costPerEmp * 12;
    const saaitAnnualSpend = empCount * 16 * 12;
    const netSavings = Math.max(currentAnnualSpend - saaitAnnualSpend, 0);
    const hoursSaved = empCount * 14;

    annualSavingsOutput.textContent = `$${netSavings.toLocaleString()}`;
    hoursSavedOutput.textContent = `${hoursSaved.toLocaleString()} hrs/yr`;
  }

  empSlider.addEventListener('input', calculateROI);
  costSlider.addEventListener('input', calculateROI);
  calculateROI();
}

/* --------------------------------------------------------------------------
   6. Lead Modal Logic
   -------------------------------------------------------------------------- */
function initLeadModal() {
  const modal = document.getElementById('leadModal');
  const openBtns = document.querySelectorAll('.open-demo-modal');
  const closeBtn = document.getElementById('closeModalBtn');
  const demoForm = document.getElementById('demoLeadForm');
  const formStatus = document.getElementById('modalFormStatus');

  if (!modal) return;

  // Dynamic API endpoint: Uses localhost during local development, and live server IP/domain when deployed
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const CMS_ENQUIRY_URL = isLocal
    ? 'http://localhost:5000/api/public/enquiry'
    : 'http://58.84.14.54:5000/api/public/enquiry'; // Live SAAIT Backend API

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Securing Demo Spot...';

      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const workEmail = (document.getElementById('workEmail')?.value || '').trim();
      const companySize = document.getElementById('companySize')?.value || '';
      const primaryGoal = document.getElementById('primaryGoal')?.value || '';

      const payload = {
        site_source: "Track",
        name: fullName,
        email: workEmail,
        company_size: companySize,
        primary_goal: primaryGoal,
        subject: "Track Enterprise Demo Walkthrough",
        message: `Company Size: ${companySize}; Primary Goal: ${primaryGoal}`,
        source_page: "/#leadModal"
      };

      fetch(CMS_ENQUIRY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        demoForm.style.display = 'none';
        formStatus.style.display = 'block';
        formStatus.innerHTML = `
          <div style="text-align: center; padding: 1.5rem 0;">
            <div style="width: 56px; height: 56px; background: var(--emerald-roi-light, #e6f4ea); color: var(--emerald-roi, #137333); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.5rem;">&#10003;</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--text-dark-primary); margin-bottom: 0.5rem;">Demo Confirmed!</h3>
            <p style="font-size: 0.9rem; color: var(--text-dark-muted); line-height: 1.6;">Our Enterprise Director will send a calendar invite to your work email shortly.</p>
            <button onclick="document.getElementById('leadModal').classList.remove('active'); document.body.style.overflow='';" class="btn btn-navy" style="margin-top: 1.5rem;">Close Window</button>
          </div>
        `;
      })
      .catch(err => {
        console.error('CMS submission error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Secure Live Demo Spot';
        alert('Submission failed. Please try again or check your network connection.');
      });
    });
  }
}


/* --------------------------------------------------------------------------
   7. Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
