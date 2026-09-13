/**
 * CAPACITY CONNECT - Core Interactive JavaScript
 * Smart India Hackathon Project
 * Theme: Competency-Driven Learning & Training Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  init3DDashboard();
  initTiltCards();
  initMcqWidget();
  initFeedbackWidget();
  initScrollReveals();
  initAnimatedCounters();
  initReassessmentAnimation();
});

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Menu Interactions
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Frosted Glass on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
      });
    });
  }

  // Active Link on Scroll Spy
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Interactive 3D Dashboard (Mouse Movement Parallax & Gyroscope)
   -------------------------------------------------------------------------- */
function init3DDashboard() {
  const container = document.getElementById('heroVisualContainer');
  const cardWrapper = document.getElementById('dashboard3DWrapper');

  if (!container || !cardWrapper) return;

  const floatCards = cardWrapper.querySelectorAll('.floating-card');

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
    const rotateY = ((x - centerX) / centerX) * 14;  // Max 14 deg

    cardWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Micro parallax for floating badges
    floatCards.forEach((card, idx) => {
      const depth = (idx + 1) * 15;
      const transX = ((x - centerX) / centerX) * depth;
      const transY = ((y - centerY) / centerY) * depth;
      card.style.transform = `translate3d(${transX}px, ${transY}px, ${depth * 1.5}px)`;
    });
  });

  container.addEventListener('mouseleave', () => {
    cardWrapper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    cardWrapper.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    
    floatCards.forEach(card => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    setTimeout(() => {
      cardWrapper.style.transition = 'transform 0.15s ease-out';
      floatCards.forEach(card => card.style.transition = '');
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   3. Generic 3D Tilt for Interactive Cards & Certificate
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const tiltElements = document.querySelectorAll('.tilt-element, .certificate-card-3d');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Interactive MCQ Assessment Widget Simulation
   -------------------------------------------------------------------------- */
const mcqQuestions = [
  {
    id: 5,
    total: 20,
    subject: "Python Assessment",
    question: "Which keyword is used to define a function in Python?",
    options: [
      { text: "function", isCorrect: false },
      { text: "def", isCorrect: true },
      { text: "define", isCorrect: false },
      { text: "func", isCorrect: false }
    ],
    explanation: "In Python, the 'def' keyword marks the start of a function header.",
    currentScore: 16,
    progress: 60
  },
  {
    id: 6,
    total: 20,
    subject: "Python Assessment",
    question: "Which of the following data structures is immutable in Python?",
    options: [
      { text: "List", isCorrect: false },
      { text: "Dictionary", isCorrect: false },
      { text: "Tuple", isCorrect: true },
      { text: "Set", isCorrect: false }
    ],
    explanation: "Tuples cannot be modified after creation, making them immutable.",
    currentScore: 17,
    progress: 65
  },
  {
    id: 7,
    total: 20,
    subject: "Python Assessment",
    question: "What is the output of len({'a': 1, 'b': 2, 'c': 3})?",
    options: [
      { text: "3", isCorrect: true },
      { text: "6", isCorrect: false },
      { text: "1", isCorrect: false },
      { text: "Error", isCorrect: false }
    ],
    explanation: "The len() function returns the number of key-value pairs in a dictionary.",
    currentScore: 18,
    progress: 70
  }
];

let currentQuestionIndex = 0;

function initMcqWidget() {
  const container = document.getElementById('mcqWidgetContainer');
  if (!container) return;

  renderQuestion();

  const prevBtn = document.getElementById('mcqPrevBtn');
  const nextBtn = document.getElementById('mcqNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      } else {
        showToast('You are at the first question.', 'info');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < mcqQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        showToast('Assessment simulation complete! Competencies updated.', 'success');
      }
    });
  }
}

function renderQuestion() {
  const q = mcqQuestions[currentQuestionIndex];
  
  const qNumElem = document.getElementById('mcqQuestionNumber');
  const qTextElem = document.getElementById('mcqQuestionText');
  const optionsList = document.getElementById('mcqOptionsList');
  const progressBar = document.getElementById('mcqProgressBar');
  const progressText = document.getElementById('mcqProgressText');
  const scoreElem = document.getElementById('mcqScoreVal');

  if (qNumElem) qNumElem.textContent = `Question ${q.id} of ${q.total}`;
  if (qTextElem) qTextElem.textContent = q.question;
  if (progressBar) progressBar.style.width = `${q.progress}%`;
  if (progressText) progressText.textContent = `${q.progress}%`;
  if (scoreElem) scoreElem.textContent = `${q.currentScore} / ${q.total}`;

  if (optionsList) {
    optionsList.innerHTML = '';
    q.options.forEach((opt) => {
      const optBtn = document.createElement('div');
      optBtn.className = 'mcq-option';
      optBtn.innerHTML = `
        <div class="mcq-radio-dot"></div>
        <span>${opt.text}</span>
      `;

      optBtn.addEventListener('click', () => {
        // Clear existing selections
        optionsList.querySelectorAll('.mcq-option').forEach(el => {
          el.classList.remove('selected', 'correct');
        });

        if (opt.isCorrect) {
          optBtn.classList.add('correct');
          showToast(`Correct! ${q.explanation}`, 'success');
        } else {
          optBtn.classList.add('selected');
          showToast(`Note: The correct answer is '${q.options.find(o => o.isCorrect).text}'`, 'info');
        }
      });

      optionsList.appendChild(optBtn);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Interactive 5-Star Feedback Widget
   -------------------------------------------------------------------------- */
function initFeedbackWidget() {
  const starButtons = document.querySelectorAll('.star-btn');
  const feedbackForm = document.getElementById('feedbackForm');
  let selectedRating = 5;

  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.rating, 10);
      updateStars(selectedRating);
    });

    btn.addEventListener('mouseenter', () => {
      const hoverRating = parseInt(btn.dataset.rating, 10);
      highlightStars(hoverRating);
    });
  });

  const starsContainer = document.querySelector('.feedback-stars');
  if (starsContainer) {
    starsContainer.addEventListener('mouseleave', () => {
      updateStars(selectedRating);
    });
  }

  function highlightStars(count) {
    starButtons.forEach(btn => {
      const rating = parseInt(btn.dataset.rating, 10);
      if (rating <= count) {
        btn.style.color = '#fbbf24';
      } else {
        btn.style.color = 'rgba(255, 255, 255, 0.2)';
      }
    });
  }

  function updateStars(count) {
    starButtons.forEach(btn => {
      const rating = parseInt(btn.dataset.rating, 10);
      if (rating <= count) {
        btn.classList.add('active');
        btn.style.color = '#fbbf24';
      } else {
        btn.classList.remove('active');
        btn.style.color = 'rgba(255, 255, 255, 0.2)';
      }
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const course = document.getElementById('feedbackCourse').value;
      const comments = document.getElementById('feedbackText').value;

      if (!comments.trim()) {
        showToast('Please write a brief comment before submitting.', 'info');
        return;
      }

      showToast(`Thank you! Your ${selectedRating}★ feedback for "${course}" has been recorded.`, 'success');
      feedbackForm.reset();
      selectedRating = 5;
      updateStars(5);
    });
  }
}

/* --------------------------------------------------------------------------
   6. Re-Assessment Interactive Comparison Animation
   -------------------------------------------------------------------------- */
function initReassessmentAnimation() {
  const reassessSection = document.getElementById('reassessment');
  if (!reassessSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const afterFill = document.getElementById('reassessAfterFill');
        const afterText = document.getElementById('reassessAfterText');
        
        if (afterFill && afterText) {
          afterFill.style.width = '68%';
          let count = 35;
          const target = 68;
          const timer = setInterval(() => {
            count++;
            afterText.textContent = `${count}%`;
            if (count >= target) clearInterval(timer);
          }, 35);
        }
      }
    });
  }, { threshold: 0.4 });

  observer.observe(reassessSection);
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal & Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   8. Animated Counters on Viewport Entry
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target, 10);
        const suffix = entry.target.dataset.suffix || '';
        let start = 0;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
          start += 1;
          entry.target.textContent = `${start}${suffix}`;
          if (start >= target) {
            entry.target.textContent = `${target}${suffix}`;
            clearInterval(timer);
          }
        }, stepTime);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

/* --------------------------------------------------------------------------
   9. Global Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? '✓' 
    : type === 'warning' 
    ? '⚠' 
    : 'ℹ';

  toast.innerHTML = `
    <span style="font-weight:bold; color: ${type === 'success' ? '#10b981' : '#60a5fa'}">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
