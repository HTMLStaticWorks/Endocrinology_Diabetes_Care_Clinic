/**
 * ENDOCRINOLOGY & DIABETES CARE CLINIC - MAIN JAVASCRIPT
 * Comprehensive interactive behaviors for public pages
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initTimelineStepper();
  initAppointmentBookingModal();
  initInsuranceChecker();
  initFAQAccordion();
});

/* --------------------------------------------------------------------------
   THEME TOGGLER (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('clinic_theme') || 'light';
  
  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('clinic_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
      icon.className = 'bi bi-sun-fill';
    });
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
      icon.className = 'bi bi-moon-stars-fill';
    });
  }
}

/* --------------------------------------------------------------------------
   RTL TOGGLER (Left-to-Right / Right-to-Left Layout)
   -------------------------------------------------------------------------- */
function initRTL() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('clinic_direction') || 'ltr';
  
  applyDirection(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('clinic_direction', newDir);
    });
  });
}

function applyDirection(dir) {
  if (dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.querySelectorAll('.rtl-toggle-btn .rtl-text-label').forEach(label => {
      label.textContent = 'LTR';
    });
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.querySelectorAll('.rtl-toggle-btn .rtl-text-label').forEach(label => {
      label.textContent = 'RTL';
    });
  }
}

/* --------------------------------------------------------------------------
   FLOATING CAPSULE & FULLSCREEN NAVIGATION OVERLAY
   -------------------------------------------------------------------------- */
function initNavbar() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const fullscreenNav = document.getElementById('fullscreenNav');
  const fullscreenCloseBtn = document.getElementById('fullscreenCloseBtn');
  const header = document.querySelector('.site-header');

  // Sticky floating header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  function openFullscreenMenu() {
    fullscreenNav?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFullscreenMenu() {
    fullscreenNav?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openFullscreenMenu);
  fullscreenCloseBtn?.addEventListener('click', closeFullscreenMenu);

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenNav?.classList.contains('active')) {
      closeFullscreenMenu();
    }
  });

  // Close when clicking any navigation link
  const navLinks = document.querySelectorAll('.fullscreen-link-item');
  navLinks.forEach(link => {
    link.addEventListener('click', closeFullscreenMenu);
  });
}

/* --------------------------------------------------------------------------
   SIGNATURE DESIGN FEATURE: METABOLIC HEALTH TIMELINE
   Consultation -> Lab Testing -> Diagnosis -> Treatment -> Monitoring -> Follow-up
   -------------------------------------------------------------------------- */
function initTimelineStepper() {
  const stepButtons = document.querySelectorAll('.timeline-step-btn');
  const stagePanes = document.querySelectorAll('.timeline-stage-pane');
  const progressBar = document.getElementById('timelineProgressBar');

  if (!stepButtons.length) return;

  stepButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Deactivate all
      stepButtons.forEach(b => b.classList.remove('active'));
      stagePanes.forEach(p => p.classList.remove('active'));

      // Activate current
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Update progress bar width
      if (progressBar) {
        const total = stepButtons.length;
        const progressPercentage = (index / (total - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   INTERACTIVE APPOINTMENT BOOKING MODAL & WIZARD
   -------------------------------------------------------------------------- */
function initAppointmentBookingModal() {
  const bookForm = document.getElementById('quickBookingForm');
  const toastContainer = document.getElementById('toastNotification');

  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const specialty = document.getElementById('bookSpecialty')?.value || 'General Endocrinology';
      const doctor = document.getElementById('bookDoctor')?.value || 'Any Specialist';
      const date = document.getElementById('bookDate')?.value || 'Next Available';

      // Feedback to patient
      alert(`Appointment Request Confirmed!\nSpecialty: ${specialty}\nDoctor: ${doctor}\nRequested Date: ${date}\nOur patient care coordinator will call to confirm your biometric preparation.`);
      
      const modalEl = document.getElementById('bookingModal');
      if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }
      bookForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   INSURANCE CHECKER COMPONENT
   -------------------------------------------------------------------------- */
function initInsuranceChecker() {
  const searchInput = document.getElementById('insuranceSearch');
  const providerCards = document.querySelectorAll('.insurance-card-item');

  if (!searchInput || !providerCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    providerCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(term)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ ACCORDION INTERACTION
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header-btn');

  faqHeaders.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      const wasActive = parent.classList.contains('active');
      
      // Close all other faqs in same group
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const body = item.querySelector('.faq-body-content');
        if (body) body.style.maxHeight = null;
      });

      if (!wasActive) {
        parent.classList.add('active');
        const body = parent.querySelector('.faq-body-content');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
