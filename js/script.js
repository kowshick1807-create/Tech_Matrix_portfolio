/**
 * TECH MATRIX — Agile–DevOps Team Portfolio Website
 * Client-Side JavaScript Logic
 * Form validation, interactive pipeline simulation, and scroll tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year
  initCopyrightYear();

  // 2. Navbar Scroll Behavior & Mobile Collapse
  initNavbarBehavior();

  // 3. ScrollSpy Active Link Tracking
  initScrollSpy();

  // 4. Contact Form Validation & Demo Feedback
  initContactForm();

  // 5. Back-to-Top Button
  initBackToTop();

  // 6. Illustrative CI/CD Pipeline Interactive Walkthrough
  initPipelineSimulator();
});

/**
 * Automatically sets the current year in the footer
 */
function initCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Handles navbar appearance on scroll and collapses mobile menu on link click
 */
function initNavbarBehavior() {
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom, .navbar-brand-custom');
  const navCollapse = document.getElementById('navbarNav');

  // Change navbar styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Auto-close hamburger menu on mobile upon clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          navCollapse.classList.remove('show');
        }
      }
    });
  });
}

/**
 * ScrollSpy implementation to highlight active section in the navbar
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link-custom');

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

/**
 * Validates the contact form with custom validation messages and demo feedback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');

  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation helper
  function validateField(input, isValid, errorMsg = '') {
    const feedback = input.parentElement.querySelector('.invalid-feedback-ref, .invalid-feedback-custom');
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedback) feedback.style.display = 'none';
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (feedback) {
        if (errorMsg) feedback.textContent = errorMsg;
        feedback.style.display = 'block';
      }
      return false;
    }
  }

  // Field blur validation events
  fullNameInput?.addEventListener('blur', () => {
    const val = fullNameInput.value.trim();
    validateField(fullNameInput, val.length >= 2, 'Please enter your full name (at least 2 characters).');
  });

  emailInput?.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    validateField(emailInput, emailRegex.test(val), 'Please provide a valid email address (e.g. name@domain.com).');
  });

  subjectInput?.addEventListener('blur', () => {
    const val = subjectInput.value.trim();
    validateField(subjectInput, val.length >= 3, 'Please provide a subject line (at least 3 characters).');
  });

  messageInput?.addEventListener('blur', () => {
    const val = messageInput.value.trim();
    validateField(messageInput, val.length >= 10, 'Please write a message with at least 10 characters.');
  });

  // On form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(fullNameInput, fullNameInput.value.trim().length >= 2, 'Please enter your full name.');
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'Please provide a valid email address.');
    const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3, 'Please provide a subject line.');
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'Please write a message (min 10 characters).');

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      const senderName = fullNameInput.value.trim();

      // Show professional demonstration success message
      if (alertBox) {
        alertBox.className = 'contact-alert-box success';
        alertBox.innerHTML = `
          <div class="d-flex align-items-start gap-3">
            <i class="bi bi-check-circle-fill fs-4 text-success flex-shrink-0"></i>
            <div>
              <h6 class="fw-bold mb-1 text-success">Message Validated Successfully!</h6>
              <p class="mb-1 text-dark">Thank you, <strong>${escapeHtml(senderName)}</strong>! Your input has been verified through our client-side validation logic.</p>
              <div class="small text-muted mt-2 p-2 bg-white rounded border">
                <i class="bi bi-info-circle-fill text-primary me-1"></i>
                <strong>Academic Portfolio Notice:</strong> This website is an educational front-end showcase. No backend server or email delivery pipeline is attached, and no personal information has been transmitted or stored.
              </div>
            </div>
          </div>
        `;
        alertBox.style.display = 'block';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form and validation markers
      form.reset();
      [fullNameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input?.classList.remove('is-valid', 'is-invalid');
      });
    } else {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
}

/**
 * Safe HTML string escaping for demo display
 */
function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

/**
 * Controls the floating Back-to-Top button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Interactive Illustrative CI/CD Pipeline Simulator
 */
function initPipelineSimulator() {
  const runSimBtn = document.getElementById('runPipelineSimBtn');
  const simStatus = document.getElementById('pipelineSimStatus');
  const nodes = document.querySelectorAll('.sim-node, .pipeline-node');
  const ribbonSteps = document.querySelectorAll('.pipeline-step-item');

  if (!runSimBtn) return;

  let isSimulating = false;

  const stageDescriptions = [
    { name: 'Plan', tool: 'Jira / GitHub Projects', detail: 'Sprint backlog created and user stories prioritized.' },
    { name: 'Code', tool: 'Feature Branch', detail: 'Frontend and architecture components authored collaboratively.' },
    { name: 'Commit', tool: 'Git & GitHub', detail: 'Descriptive commit history recorded and Pull Request initiated.' },
    { name: 'Build', tool: 'GitHub Actions / Jenkins', detail: 'Automated build process verified with zero compilation errors.' },
    { name: 'Test', tool: 'Automated Testing', detail: 'Unit, syntax, and layout regression test suites executed.' },
    { name: 'Review', tool: 'Peer Review', detail: 'Code review approved by team leads and checklist validated.' },
    { name: 'Deliver', tool: 'Release Package', detail: 'Artifact staged and validated for academic demonstration.' }
  ];

  // Make ribbon items clickable to inspect stage
  ribbonSteps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      ribbonSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      if (simStatus && stageDescriptions[idx]) {
        simStatus.innerHTML = `
          <div class="d-inline-flex align-items-center gap-2 text-info">
            <i class="bi bi-info-circle-fill"></i>
            <span><strong>Stage ${idx + 1} (${stageDescriptions[idx].name}):</strong> ${stageDescriptions[idx].detail} <span class="badge bg-secondary ms-1">${stageDescriptions[idx].tool}</span></span>
          </div>
        `;
      }
    });
  });

  // Run simulation walkthrough
  runSimBtn.addEventListener('click', () => {
    if (isSimulating) return;
    isSimulating = true;
    runSimBtn.disabled = true;
    runSimBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Simulating...';

    let currentStep = 0;

    function stepNext() {
      if (currentStep < nodes.length) {
        nodes.forEach((node, i) => {
          const badge = node.querySelector('.sim-node-badge, .pipeline-node-status');
          if (i === currentStep) {
            node.style.borderColor = '#38bdf8';
            node.style.background = 'rgba(56, 189, 248, 0.2)';
            if (badge) {
              badge.textContent = 'RUNNING';
              badge.style.background = 'rgba(56, 189, 248, 0.3)';
              badge.style.color = '#38bdf8';
            }
          } else if (i < currentStep) {
            node.style.borderColor = '#10b981';
            node.style.background = 'rgba(16, 185, 129, 0.15)';
            if (badge) {
              badge.textContent = 'PASSED';
              badge.style.background = 'rgba(16, 185, 129, 0.3)';
              badge.style.color = '#34d399';
            }
          } else {
            node.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            node.style.background = 'rgba(255, 255, 255, 0.06)';
            if (badge) {
              badge.textContent = 'QUEUED';
              badge.style.background = 'rgba(255, 255, 255, 0.1)';
              badge.style.color = '#9ca3af';
            }
          }
        });

        if (simStatus && stageDescriptions[currentStep]) {
          simStatus.innerHTML = `
            <span class="text-warning">
              <i class="bi bi-gear-fill me-1"></i> [Stage ${currentStep + 1}/7]: ${stageDescriptions[currentStep].name} &mdash; ${stageDescriptions[currentStep].detail}
            </span>
          `;
        }

        currentStep++;
        setTimeout(stepNext, 700);
      } else {
        nodes.forEach(node => {
          node.style.borderColor = '#10b981';
          node.style.background = 'rgba(16, 185, 129, 0.15)';
          const badge = node.querySelector('.sim-node-badge, .pipeline-node-status');
          if (badge) {
            badge.textContent = 'PASSED';
            badge.style.background = 'rgba(16, 185, 129, 0.3)';
            badge.style.color = '#34d399';
          }
        });

        if (simStatus) {
          simStatus.innerHTML = `
            <span class="text-success fw-bold">
              <i class="bi bi-check-all me-1"></i> Illustrative Pipeline Complete: All 7 stages successfully executed.
            </span>
          `;
        }

        runSimBtn.disabled = false;
        runSimBtn.innerHTML = '<i class="bi bi-arrow-repeat me-1"></i> Re-run Simulation';
        isSimulating = false;
      }
    }

    stepNext();
  });
}