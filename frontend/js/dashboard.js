/**
 * CAPACITY CONNECT - Trainee Dashboard Interactive Controller
 * Smart India Hackathon Project
 * Modular Architecture covering all Trainee Problem Statement Capabilities:
 * A. Professional Profile
 * B. Enrolled Courses (My Learning)
 * C. Learning Resources
 * D. Subject-Wise MCQ Assessments (Interactive Simulator)
 * E. Course & Training Feedback
 * + Skill Gap Analysis & Recommendations
 */

// Display logged-in user's name
document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const welcomeUserName = document.getElementById("welcomeUserName");

    if (welcomeUserName && userName) {
        welcomeUserName.textContent = userName;
    }
});


/* --------------------------------------------------------------------------
   1. Structured Trainee Prototype Data
   (Easily replaceable with Supabase / REST API endpoints later)
   -------------------------------------------------------------------------- */
   
const TRAINEE_DATA = {
  profile: {
    name: "Muneeb Ahmad",
    role: "TRAINEE",
    email: "muneeb.ahmad@capacityconnect.in",
    avatarInitials: "MA",
    tagline: "Aspiring AI Engineer & Full-Stack Developer",
    enrolledDomain: "Artificial Intelligence & Data Science",
    institution: "Smart India Hackathon Trainee Portal",
    completionPercentage: 85,
    qualifications: "B.Tech in Computer Science & Engineering (Final Year) &bull; National Institute of Technology",
    workExperience: "AI &amp; Data Science Intern @ TechCorp Labs (6 Months, Jan 2026 - Jun 2026)",
    interests: ["Machine Learning", "Deep Learning", "Cloud Systems", "Database Optimization", "NLP", "Open Source"],
    skills: ["Python", "SQL", "PyTorch", "C++", "Data Structures", "FastAPI", "Docker", "Git"],
    certificates: [
      { name: "Python Programming Fundamentals", date: "August 20, 2026", id: "CC-PY-2026-9182" },
      { name: "Database Essentials", date: "August 15, 2026", id: "CC-DB-2026-7451" },
      { name: "Agile Software Development", date: "July 28, 2026", id: "CC-AG-2026-3310" }
    ]
  },
  metrics: {
    totalCourses: 12,
    completedCourses: 7,
    averageScore: 78,
    certificatesEarned: 4
  },
  skills: [
    { id: "prog", name: "Programming", score: 75, icon: "💻", category: "Core", status: "Strong" },
    { id: "db", name: "Database", score: 55, icon: "🗄️", category: "Data Systems", status: "Developing" },
    { id: "aiml", name: "AI / ML", score: 35, icon: "🤖", category: "Advanced", status: "Needs Improvement" },
    { id: "comm", name: "Communication", score: 80, icon: "💬", category: "Soft Skills", status: "Strong" }
  ],
  skillGaps: [
    {
      id: "gap-aiml",
      skill: "AI / ML",
      current: 35,
      target: 80,
      gap: 45,
      status: "Major Skill Gap",
      levelClass: "danger",
      recommendedAction: "Complete Machine Learning Fundamentals & AI Search Optimization."
    },
    {
      id: "gap-db",
      skill: "Database Systems",
      current: 55,
      target: 80,
      gap: 25,
      status: "Needs Improvement",
      levelClass: "warning",
      recommendedAction: "Focus on Indexing, ACID compliance, and SQL query tuning."
    }
  ],
  enrolledCourses: [
    {
      id: "enrolled-1",
      title: "Python Programming Mastery",
      trainer: "Dr. Neha Verma",
      progress: 85,
      difficulty: "Beginner",
      duration: "6 Weeks",
      currentModule: "Module 5: Concurrency & AsyncIO",
      enrolledDate: "July 12, 2026",
      resourcesCount: 14
    },
    {
      id: "enrolled-2",
      title: "Modern Web Architecture & APIs",
      trainer: "Karan Malhotra",
      progress: 60,
      difficulty: "Intermediate",
      duration: "8 Weeks",
      currentModule: "Module 4: REST & GraphQL Design",
      enrolledDate: "August 1, 2026",
      resourcesCount: 18
    },
    {
      id: "enrolled-3",
      title: "Data Structures & Algorithms in C++",
      trainer: "Prof. Rajesh Kumar",
      progress: 40,
      difficulty: "Advanced",
      duration: "10 Weeks",
      currentModule: "Module 3: Graph Traversal & Dijkstra",
      enrolledDate: "August 15, 2026",
      resourcesCount: 22
    }
  ],
  courseResources: {
    "enrolled-1": {
      courseName: "Python Programming Mastery",
      resources: [
        { type: "lecture", title: "Lecture 05: Asynchronous Programming with AsyncIO & Tasks", format: "HD Video &bull; 52 mins", icon: "🎥" },
        { type: "slides", title: "Week 5 Slides: Memory Management, GIL, and Thread Pools", format: "PDF &bull; 42 slides", icon: "📊" },
        { type: "notes", title: "Python Advanced Design Patterns & Cheatsheet", format: "Reference Guide &bull; PDF", icon: "📝" },
        { type: "code", title: "AsyncIO Jupyter Notebooks & Practice Exercises", format: "Code Bundle &bull; .zip (4.2 MB)", icon: "📁" }
      ]
    },
    "enrolled-2": {
      courseName: "Modern Web Architecture & APIs",
      resources: [
        { type: "lecture", title: "Lecture 04: Designing High-Throughput RESTful APIs", format: "HD Video &bull; 45 mins", icon: "🎥" },
        { type: "slides", title: "Week 4 Slides: Caching Strategies with Redis & Edge CDNs", format: "PDF &bull; 38 slides", icon: "📊" },
        { type: "notes", title: "API Security Best Practices & OWASP Top 10 Guide", format: "Security Checklist &bull; PDF", icon: "📝" },
        { type: "code", title: "FastAPI & Node.js Production Starter Templates", format: "Repository &bull; .zip (5.1 MB)", icon: "📁" }
      ]
    },
    "enrolled-3": {
      courseName: "Data Structures & Algorithms in C++",
      resources: [
        { type: "lecture", title: "Lecture 03: Graph Traversals (BFS, DFS) and Shortest Paths", format: "HD Video &bull; 58 mins", icon: "🎥" },
        { type: "slides", title: "Week 3 Slides: Adjacency Lists vs. Matrices & Dijkstra Proofs", format: "PDF &bull; 46 slides", icon: "📊" },
        { type: "notes", title: "Graph Algorithms Problem Set with C++17 Solutions", format: "Practice PDF &bull; 20 Problems", icon: "📝" },
        { type: "code", title: "Header-Only Graph Library Implementation & Tests", format: "Source Code &bull; .zip (3.8 MB)", icon: "📁" }
      ]
    }
  },
  recommendedCourses: [
    {
      id: "course-1",
      title: "Introduction to Artificial Intelligence",
      description: "Master foundational AI principles, search algorithms, heuristic evaluation, and knowledge representation designed to bridge early ML gaps.",
      skill: "AI / ML",
      difficulty: "Beginner",
      duration: "6 Weeks",
      enrolled: false
    },
    {
      id: "course-2",
      title: "Machine Learning Fundamentals",
      description: "Learn supervised learning, regression, classification, decision trees, and model evaluation techniques with hands-on Python notebooks.",
      skill: "AI / ML",
      difficulty: "Intermediate",
      duration: "8 Weeks",
      enrolled: false
    },
    {
      id: "course-3",
      title: "Database Management Essentials",
      description: "Relational schema modeling, normalization, advanced SQL queries, indexing strategies, and database concurrency optimization.",
      skill: "Database",
      difficulty: "Beginner",
      duration: "4 Weeks",
      enrolled: false
    }
  ],
  recommendedTrainers: [
    {
      id: "trainer-1",
      name: "Dr. Arjun Sharma",
      expertise: "Artificial Intelligence & Machine Learning",
      experience: "8 Years",
      rating: "4.8/5",
      avatarInitials: "AS",
      bio: "Senior AI Researcher specializing in Deep Learning, Computer Vision, and Neural Architecture Optimization.",
      skills: ["AI / ML", "Python", "Deep Learning", "TensorFlow"]
    },
    {
      id: "trainer-2",
      name: "Priya Mehta",
      expertise: "Database Systems",
      experience: "6 Years",
      rating: "4.7/5",
      avatarInitials: "PM",
      bio: "Lead Data Architect with extensive background in distributed databases, PostgreSQL scaling, and query optimization.",
      skills: ["Database", "SQL", "PostgreSQL", "Data Modeling"]
    }
  ],
  upcomingAssessment: {
    title: "AI & Machine Learning Fundamentals MCQ Assessment",
    subject: "Artificial Intelligence",
    deadline: "September 8, 2026",
    questions: 20,
    timeLimit: 20,
    previousScore: "74% (Attempt 1 - Aug 2026)",
    sampleQuestions: []
  },
  certificates: [
    {
      id: "cert-1",
      course: "Python Programming Fundamentals",
      issued: "August 20, 2026",
      code: "CC-PY-2026-9182",
      grade: "92% Distinction"
    },
    {
      id: "cert-2",
      course: "Database Essentials",
      issued: "August 15, 2026",
      code: "CC-DB-2026-7451",
      grade: "88% Excellence"
    }
  ],
  reassessments: [
    {
      skill: "AI / ML",
      previousScore: 35,
      newScore: 68,
      improvement: "+33%",
      status: "Great Progress"
    },
    {
      skill: "Database Systems",
      previousScore: 55,
      newScore: 72,
      improvement: "+17%",
      status: "Target Achieved"
    }
  ]
};

/* --------------------------------------------------------------------------
   2. DOM Initializer
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initProfileDropdown();
  initDashboardSearch();
  renderSkillsAndGaps(); // builds the Skills + Skill Gap cards from TRAINEE_DATA (also runs bar animation)
  initModalHandlers();
  initTiltCardsDashboard();
  initFeedbackForm();
  loadCoursesAndEnrollments();
  loadAssessmentCardFromAPI(3);
});

/* --------------------------------------------------------------------------
   3. Profile Dropdown Interaction
   -------------------------------------------------------------------------- */
function initProfileDropdown() {
  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');

  if (!profileTrigger || !profileDropdown) return;

  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShowing = profileDropdown.classList.contains('show');
    profileDropdown.classList.toggle('show', !isShowing);
    profileTrigger.classList.toggle('active', !isShowing);
  });

  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
      profileDropdown.classList.remove('show');
      profileTrigger.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Search Filter Engine
   -------------------------------------------------------------------------- */
function initDashboardSearch() {
  const searchInput = document.getElementById('dashSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filterDashboardContent(query);
  });
}

function filterDashboardContent(query) {
  const searchableCards = document.querySelectorAll('[data-searchable]');

  searchableCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (!query || text.includes(query)) {
      card.style.display = '';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   5. Animated Progress Bars on Viewport Entry
   -------------------------------------------------------------------------- */
function initSkillBarAnimations() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  
  setTimeout(() => {
    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-target-width') || '0%';
      bar.style.width = targetWidth;
    });
  }, 250);
}

/* --------------------------------------------------------------------------
   5b. Data-Driven Sync: Skills Overview & Skill Gap Analysis
   These patch the EXISTING hand-built cards in the HTML (matched via
   data-skill-id / data-gap-id) so the displayed numbers always match
   TRAINEE_DATA, instead of the static text that was baked into the markup.
   Call renderSkillsAndGaps() any time TRAINEE_DATA.skills / .skillGaps changes.
   -------------------------------------------------------------------------- */
const LEVEL_COLOR_VAR = {
  danger: 'var(--accent-rose)',
  warning: 'var(--accent-amber)',
  success: 'var(--accent-emerald)'
};

const LEVEL_BADGE_ICON = {
  danger: '<span class="pulse-warning-dot"></span>',
  warning: '<span>⚠️</span>',
  success: '<span>✅</span>'
};

function statusToSkillBadgeClass(status) {
  if (status === 'Strong') return 'badge-strong';
  if (status === 'Developing') return 'badge-developing';
  return 'badge-danger';
}

function syncSkillRowUI(skill) {
  const row = document.querySelector(`.skill-row-item[data-skill-id="${skill.id}"]`);
  if (!row) return;

  const valueBadge = row.querySelector('.skill-val-badge');
  if (valueBadge) valueBadge.textContent = `${skill.score}%`;

  const statusBadge = row.querySelector('.comp-badge');
  if (statusBadge) {
    statusBadge.textContent = skill.status;
    statusBadge.className = `comp-badge ${statusToSkillBadgeClass(skill.status)}`;
  }

  const bar = row.querySelector('.skill-progress-bar');
  if (bar) {
    bar.setAttribute('data-target-width', `${skill.score}%`);
    bar.style.width = `${skill.score}%`;
  }
}

function syncGapCardUI(gap) {
  const card = document.querySelector(`.gap-card-item[data-gap-id="${gap.id}"]`);
  if (!card) return;

  const level = gap.levelClass; // 'danger' | 'warning' | 'success'
  const color = LEVEL_COLOR_VAR[level] || LEVEL_COLOR_VAR.danger;

  card.classList.remove('danger', 'warning', 'success');
  card.classList.add(level);

  const badgePill = card.querySelector('.gap-badge-pill');
  if (badgePill) {
    badgePill.className = `gap-badge-pill ${level}`;
    badgePill.innerHTML = `${LEVEL_BADGE_ICON[level] || ''}${gap.status}`;
  }

  const currentVal = card.querySelector('.gap-endpoint-info.current .gap-endpoint-val');
  if (currentVal) {
    currentVal.className = `gap-endpoint-val current-${level}`;
    currentVal.textContent = `${gap.current}%`;
  }

  const targetVal = card.querySelector('.gap-endpoint-info.target .gap-endpoint-val');
  if (targetVal) targetVal.textContent = `${gap.target}% 🎯`;

  const callout = card.querySelector('.gap-callout-center');
  if (callout) {
    callout.classList.remove('warning', 'success');
    if (level !== 'danger') callout.classList.add(level);
    callout.innerHTML = `<span>${gap.gap > 0 ? '▲' : '✓'}</span><span>${gap.gap}% SKILL GAP</span>`;
  }

  const segCurrent = card.querySelector('.gap-segment-current');
  if (segCurrent) {
    segCurrent.className = `gap-segment-current ${level}`;
    segCurrent.style.width = `${gap.current}%`;
  }

  const segBridge = card.querySelector('.gap-segment-bridge');
  if (segBridge) segBridge.className = `gap-segment-bridge ${level}`;

  const milestone = card.querySelector('.gap-target-milestone');
  if (milestone) milestone.setAttribute('title', `Target Benchmark: ${gap.target}%`);

  const chips = card.querySelectorAll('.gap-mini-chip strong');
  if (chips.length === 4) {
    chips[0].textContent = `${gap.current}%`;
    chips[0].style.color = color;
    chips[1].textContent = `${gap.target}%`; // target stays emerald
    chips[2].textContent = `${gap.gap}% Gap`;
    chips[2].style.color = color;
    chips[3].textContent = gap.status;
    chips[3].style.color = color;
  }

  const actionText = card.querySelector('.gap-action-footer span');
  if (actionText) actionText.textContent = `Identified Action: ${gap.recommendedAction}`;
}

function renderSkillsAndGaps() {
  TRAINEE_DATA.skills.forEach(syncSkillRowUI);
  TRAINEE_DATA.skillGaps.forEach(syncGapCardUI);
  initSkillBarAnimations(); // (re)trigger the width transition with the new values
}

/* --------------------------------------------------------------------------
   6. 3D Tilt for Dashboard Cards
   -------------------------------------------------------------------------- */
function initTiltCardsDashboard() {
  const cards = document.querySelectorAll('.dash-course-card, .enrolled-course-card, .dash-trainer-card, .metric-card, .cert-mini-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   7. Capability A: Professional Profile Modal
   -------------------------------------------------------------------------- */
function handleOpenProfileModal() {
  const prof = TRAINEE_DATA.profile;

  const content = `
    <div style="text-align: center; margin-bottom: 24px; position: relative;">
      <div style="width: 84px; height: 84px; border-radius: 50%; background: var(--grad-primary); display: flex; align-items: center; justify-content: center; font-size: 1.85rem; font-weight: 800; color: #fff; margin: 0 auto 12px; border: 3px solid rgba(255,255,255,0.15); box-shadow: 0 4px 20px rgba(59,130,246,0.4);">
        ${prof.avatarInitials}
      </div>
      <h3 style="font-size: 1.45rem; color: #fff; margin-bottom: 2px;">${prof.name}</h3>
      <p style="color: var(--primary-light); font-weight: 600; font-size: 0.92rem; margin-bottom: 6px;">${prof.tagline}</p>
      <span class="live-badge" style="display: inline-flex;">&bull; Active Trainee</span>
    </div>

    <!-- Profile Completion Meter -->
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 14px 18px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
        <span style="color: var(--text-secondary); font-weight: 600;">Profile Completion</span>
        <strong style="color: var(--accent-emerald);">${prof.completionPercentage}% Complete</strong>
      </div>
      <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;">
        <div style="width: ${prof.completionPercentage}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 999px;"></div>
      </div>
    </div>

    <!-- Profile Sections List -->
    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; font-size: 0.88rem;">
      <!-- Qualifications -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: 12px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 2px;">🎓 Qualifications</span>
        <strong style="color: #ffffff; line-height: 1.4;">${prof.qualifications}</strong>
      </div>

      <!-- Work Experience -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: 12px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 2px;">💼 Work Experience</span>
        <strong style="color: #ffffff; line-height: 1.4;">${prof.workExperience}</strong>
      </div>

      <!-- Interests -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: 12px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 8px;">🎯 Interests &amp; Focus Areas</span>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${prof.interests.map(i => `<span class="skill-pill" style="font-size: 0.78rem; background: rgba(59,130,246,0.12); color: var(--primary-light); border-color: rgba(59,130,246,0.3);">${i}</span>`).join('')}
        </div>
      </div>

      <!-- Skills -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: 12px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 8px;">⚡ Verified Skills</span>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${prof.skills.map(s => `<span class="skill-pill" style="font-size: 0.78rem; background: rgba(16,185,129,0.12); color: var(--accent-emerald); border-color: rgba(16,185,129,0.3);">${s}</span>`).join('')}
        </div>
      </div>

      <!-- Certificates -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 12px 16px; border-radius: 12px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); display: block; margin-bottom: 6px;">🏆 Earned Certificates</span>
        ${prof.certificates.map(c => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.82rem;">
            <span style="color: #ffffff;">★ ${c.name}</span>
            <span style="color: var(--text-muted); font-size: 0.76rem;">${c.date}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 12px;">
      <button type="button" class="btn btn-primary" style="flex: 1;" onclick="handleEditProfile();">
        ✏️ Edit Professional Profile
      </button>
      <button type="button" class="btn btn-secondary" onclick="closeModal();">
        Close
      </button>
    </div>
  `;

  openModal(`My Professional Profile`, content);
}

function handleEditProfile() {
  const prof = TRAINEE_DATA.profile;

  const content = `
    <form id="editProfileForm" onsubmit="event.preventDefault(); saveEditedProfile();">

      <!-- Full Name -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Full Name
        </label>
        <input
          type="text"
          id="editProfName"
          value="${prof.name}"
          class="auth-input"
          required
        >
      </div>

      <!-- Professional Tagline -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Professional Tagline
        </label>
        <input
          type="text"
          id="editProfTagline"
          value="${prof.tagline}"
          class="auth-input"
          required
        >
      </div>

      <!-- Qualifications -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Qualifications
        </label>
        <input
          type="text"
          id="editProfQual"
          value="${prof.qualifications.replace(/&bull;/g, '•')}"
          class="auth-input"
          required
        >
      </div>

      <!-- Work Experience -->
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Work Experience / Internships
        </label>
        <input
          type="text"
          id="editProfExp"
          value="${prof.workExperience.replace(/&amp;/g, '&')}"
          class="auth-input"
          required
        >
      </div>

      <!-- Interests -->
      <div style="margin-bottom: 18px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Interests (Comma separated)
        </label>
        <input
          type="text"
          id="editProfInterests"
          value="${prof.interests.join(', ')}"
          class="auth-input"
          required
        >
      </div>

      <!-- Skills -->
      <div style="margin-bottom: 22px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">
          Skills
        </label>

        <!-- Skill Tags -->
        <div
          id="editSkillsContainer"
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            min-height: 52px;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            margin-bottom: 10px;
          "
        >
          ${prof.skills.map((skill, index) => `
            <span
              class="skill-pill"
              style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 0.78rem;
                background: rgba(16,185,129,0.12);
                color: var(--accent-emerald);
                border-color: rgba(16,185,129,0.3);
              "
            >
              ${skill}
              <button
                type="button"
                onclick="removeEditSkill(${index});"
                style="
                  border: none;
                  background: transparent;
                  color: inherit;
                  cursor: pointer;
                  font-size: 1rem;
                  padding: 0;
                  line-height: 1;
                "
                aria-label="Remove ${skill}"
              >
                &times;
              </button>
            </span>
          `).join('')}
        </div>

        <!-- Add Skill -->
        <div style="display: flex; gap: 8px;">
          <input
            type="text"
            id="newSkillInput"
            class="auth-input"
            placeholder="Enter a new skill..."
            style="flex: 1;"
            onkeydown="if(event.key === 'Enter'){ event.preventDefault(); addEditSkill(); }"
          >

          <button
            type="button"
            class="btn btn-secondary"
            onclick="addEditSkill();"
            style="white-space: nowrap;"
          >
            + Add
          </button>
        </div>

        <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 7px;">
          Add the skills you currently have. Assessment scores determine your actual competency level.
        </p>
      </div>

      <!-- Save -->
      <button
        type="submit"
        class="btn btn-primary"
        style="width: 100%;"
      >
        Save Profile Changes &rarr;
      </button>

    </form>
  `;

  openModal(`Edit Professional Profile`, content);
}

function addEditSkill() {
  const input = document.getElementById('newSkillInput');

  if (!input) return;

  const skill = input.value.trim();

  if (!skill) {
    showToast('Please enter a skill first.', 'info');
    return;
  }

  // Prevent duplicate skills
  const alreadyExists = TRAINEE_DATA.profile.skills.some(
    existingSkill => existingSkill.toLowerCase() === skill.toLowerCase()
  );

  if (alreadyExists) {
    showToast(`"${skill}" is already in your skills.`, 'info');
    input.value = '';
    return;
  }

  TRAINEE_DATA.profile.skills.push(skill);

  input.value = '';

  // Re-open the editor so the new skill appears immediately
  handleEditProfile();
}

function removeEditSkill(index) {
  if (
    index < 0 ||
    index >= TRAINEE_DATA.profile.skills.length
  ) {
    return;
  }

  const removedSkill = TRAINEE_DATA.profile.skills.splice(index, 1)[0];

  showToast(`"${removedSkill}" removed from your skills.`, 'info');

  // Re-open editor so the change appears immediately
  handleEditProfile();
}

function saveEditedProfile() {
  const nameInput = document.getElementById('editProfName');
  const taglineInput = document.getElementById('editProfTagline');
  const qualInput = document.getElementById('editProfQual');
  const expInput = document.getElementById('editProfExp');
  const interestsInput = document.getElementById('editProfInterests');

  if (!nameInput || !taglineInput || !qualInput || !expInput || !interestsInput) {
    return;
  }

  // Save profile information
  TRAINEE_DATA.profile.name = nameInput.value.trim();
  TRAINEE_DATA.profile.tagline = taglineInput.value.trim();
  TRAINEE_DATA.profile.qualifications = qualInput.value.trim();
  TRAINEE_DATA.profile.workExperience = expInput.value.trim();

  // Convert comma-separated interests into an array
  TRAINEE_DATA.profile.interests = interestsInput.value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Update name wherever it appears in the dashboard
  const nameDisplays = document.querySelectorAll('.dash-user-name');

  nameDisplays.forEach(el => {
    el.textContent = TRAINEE_DATA.profile.name;
  });

  showToast(
    'Professional Profile updated successfully!',
    'success'
  );

  closeModal();
}

/* --------------------------------------------------------------------------
   8. Capability B & C: Enrolled Courses & Learning Resources Modal
   -------------------------------------------------------------------------- */
function handleContinueLearning(courseId) {
  const numericId = parseInt(courseId, 10);
  const enrolledItem = (apiEnrollments || []).find(e => Number(e.course_id || (e.course && e.course.id)) === numericId);
  const course = (enrolledItem && enrolledItem.course)
    || (apiCourses || []).find(c => c.id === numericId)
    || TRAINEE_DATA.enrolledCourses.find(c => c.id === courseId);
  if (!course) return;

  showToast(`Resuming "${course.title}" at ${course.currentModule || 'Module 1'}...`, 'info');
}

function handleAccessResources(courseId) {
  const numericId = parseInt(courseId, 10);
  const enrolledItem = (apiEnrollments || []).find(e => Number(e.course_id || (e.course && e.course.id)) === numericId);
  const course = (enrolledItem && enrolledItem.course)
    || (apiCourses || []).find(c => c.id === numericId)
    || TRAINEE_DATA.enrolledCourses.find(c => c.id === courseId);

  const resourceData = TRAINEE_DATA.courseResources[courseId] || {
    courseName: course ? course.title : "Selected Course",
    resources: [
      { type: "lecture", title: "Recorded Video Lecture", format: "HD Video &bull; 45 mins", icon: "🎥" },
      { type: "slides", title: "Lecture Presentation Slides", format: "PDF &bull; 35 slides", icon: "📊" },
      { type: "notes", title: "Comprehensive Study Material & Notes", format: "PDF Document", icon: "📝" },
      { type: "code", title: "Practice Files & Datasets", format: "Archive &bull; .zip", icon: "📁" }
    ]
  };

  const content = `
    <div style="margin-bottom: 18px;">
      <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--primary-light); font-weight: 700; letter-spacing: 0.06em;">Digital Resource Vault</span>
      <h3 style="font-size: 1.25rem; color: #fff; margin-top: 2px;">${resourceData.courseName}</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary);">Access all official recorded lectures, slide decks, study guides, and code bundles.</p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
      ${resourceData.resources.map(res => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px 16px; border-radius: 14px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.4rem;">${res.icon}</span>
            <div>
              <h5 style="color: #ffffff; font-size: 0.9rem; margin-bottom: 2px;">${res.title}</h5>
              <span style="color: var(--text-muted); font-size: 0.78rem;">${res.format}</span>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="showToast('Opening ${res.title}...', 'success');">
            Open &darr;
          </button>
        </div>
      `).join('')}
    </div>

    <button type="button" class="btn btn-secondary" style="width: 100%;" onclick="closeModal();">
      Close Resources
    </button>
  `;

  openModal(`Course Learning Resources`, content);
}

/* --------------------------------------------------------------------------
   9. Capability D: Subject-Wise MCQ Assessment Simulator
   -------------------------------------------------------------------------- */
/* ============================================================
   SECTION 9: AI / ML MCQ ASSESSMENT
   ============================================================ */

let currentMcqStep = 0;
let userMcqAnswers = {};
let assessmentTimerInterval = null;
let assessmentEndTime = null;
let apiAssessment = null;
let apiAssessmentQuestions = [];
let assessmentSubmitting = false;


/* ------------------------------------------------------------
   LOAD UPCOMING ASSESSMENT CARD FROM BACKEND
   ------------------------------------------------------------ */

async function loadAssessmentCardFromAPI(assessmentId = 3) {
  const titleElement = document.getElementById("upcomingAssessmentTitle");
  const subjectElement = document.getElementById("upcomingAssessmentSubject");
  const questionCountElement = document.getElementById(
    "upcomingAssessmentQuestionCount"
  );

  try {
    // ==============================
    // 1. LOAD ASSESSMENT
    // ==============================
    const assessmentResponse = await fetch(
      `${API_BASE_URL}/assessments/${assessmentId}`
    );

    if (!assessmentResponse.ok) {
      throw new Error(
        `Assessment API failed: ${assessmentResponse.status}`
      );
    }

    const assessmentData = await assessmentResponse.json();

    const assessment = Array.isArray(assessmentData)
      ? assessmentData[0]
      : assessmentData;

    if (!assessment) {
      throw new Error("Assessment 3 was not found.");
    }

    console.log("Assessment loaded:", assessment);

    // Show assessment title immediately
    if (titleElement) {
      titleElement.textContent =
        assessment.title || "Assessment";
    }


    // ==============================
    // 2. LOAD SKILLS
    // ==============================
    try {
      const skillsResponse = await fetch(
        `${API_BASE_URL}/skills`
      );

      if (!skillsResponse.ok) {
        throw new Error(
          `Skills API failed: ${skillsResponse.status}`
        );
      }

      const skills = await skillsResponse.json();

      console.log("Skills loaded:", skills);

      const skill = skills.find(
        s => Number(s.id) === Number(assessment.skill_id)
      );

      if (subjectElement) {
        subjectElement.textContent =
          skill?.name || "Subject unavailable";
      }

    } catch (skillError) {
      console.error("Could not load skill:", skillError);

      if (subjectElement) {
        subjectElement.textContent = "Subject unavailable";
      }
    }


    // ==============================
    // 3. LOAD QUESTIONS
    // ==============================
    try {
      const questionsResponse = await fetch(
        `${API_BASE_URL}/questions`
      );

      if (!questionsResponse.ok) {
        throw new Error(
          `Questions API failed: ${questionsResponse.status}`
        );
      }

      const allQuestions = await questionsResponse.json();

      console.log("All questions loaded:", allQuestions);

      const assessmentQuestions = allQuestions.filter(
        q => Number(q.assessment_id) === Number(assessmentId)
      );

      console.log(
        `Assessment ${assessmentId} questions:`,
        assessmentQuestions
      );

      if (questionCountElement) {
        questionCountElement.textContent =
          `${assessmentQuestions.length} MCQs`;
      }

    } catch (questionError) {
      console.error(
        "Could not load assessment questions:",
        questionError
      );

      if (questionCountElement) {
        questionCountElement.textContent =
          "Questions unavailable";
      }
    }

  } catch (error) {
    console.error(
      "Could not load assessment:",
      error
    );

    // IMPORTANT:
    // Don't overwrite the title with "Unable to load assessment"
    // unless the actual assessment request failed.

    if (titleElement) {
      titleElement.textContent =
        "Assessment unavailable";
    }
  }
}

/* ------------------------------------------------------------
   LIVE ASSESSMENT QUESTIONS COME FROM THE BACKEND API.
   Hardcoded question banks (including correctIndex) are not used.
   ------------------------------------------------------------ */

async function loadAssessmentFromAPI(assessmentId = 3) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    showToast("User session not found. Please log in again.", "error");
    return false;
  }

  try {
    const assessmentResponse = await fetch(
      `${API_BASE_URL}/assessments/${assessmentId}`
    );

    if (!assessmentResponse.ok) {
      throw new Error(
        `Assessment request failed: ${assessmentResponse.status}`
      );
    }

    const assessmentData = await assessmentResponse.json();

    const assessment = Array.isArray(assessmentData)
      ? assessmentData[0]
      : assessmentData;

    if (!assessment) {
      throw new Error("Assessment not found.");
    }

    const questionsResponse = await fetch(
      `${API_BASE_URL}/questions`
    );

    if (!questionsResponse.ok) {
      throw new Error(
        `Questions request failed: ${questionsResponse.status}`
      );
    }

    const allQuestions = await questionsResponse.json();

    const questions = allQuestions.filter(
      q => Number(q.assessment_id) === Number(assessmentId)
    );

    if (questions.length === 0) {
      throw new Error("No questions found for this assessment.");
    }

    // IMPORTANT:
    // Do NOT include correct_option or correctIndex.
    const frontendQuestions = questions.map(q => ({
      id: Number(q.id),
      question: q.question_text,
      options: [
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d
      ]
    }));

    apiAssessment = {
      id: Number(assessment.id),
      title: assessment.title,
      description: assessment.description,
      totalQuestions: Number(
        assessment.total_questions || questions.length
      ),
      deadline: assessment.deadline,
      skillId: assessment.skill_id,

      // Keep the existing UI's 20-minute timer.
      timeLimit: 20,

      sampleQuestions: frontendQuestions
    };

    apiAssessmentQuestions = frontendQuestions;

    // Preserve existing dashboard structure.
    TRAINEE_DATA.upcomingAssessment = {
      ...TRAINEE_DATA.upcomingAssessment,
      ...apiAssessment,
      questions: frontendQuestions.length,
      sampleQuestions: frontendQuestions
    };

    return true;

  } catch (error) {
    console.error("Assessment API load failed:", error);

    showToast(
      error.message || "Unable to load assessment.",
      "error"
    );

    return false;
  }
}


/* ------------------------------------------------------------
   START ASSESSMENT
   ------------------------------------------------------------ */

async function handleStartAssessment() {

  const loaded = await loadAssessmentFromAPI(3);

  if (!loaded) {
    return;
  }

  const assess = TRAINEE_DATA.upcomingAssessment;

  currentMcqStep = 0;
  userMcqAnswers = {};
  assessmentSubmitting = false;

  clearAssessmentTimer();

  assessmentEndTime =
    Date.now() + (assess.timeLimit * 60 * 1000);

  renderMcqQuestionModal(assess);
  startAssessmentTimer();
}


/* ------------------------------------------------------------
   TIMER
   ------------------------------------------------------------ */

function startAssessmentTimer() {

    clearAssessmentTimer();

    assessmentTimerInterval = setInterval(() => {

        const backdrop = document.getElementById("dashModalBackdrop");

        // Stop timer if modal has been closed
        if (!backdrop || !backdrop.classList.contains("open")) {
            clearAssessmentTimer();
            return;
        }

        updateAssessmentTimer();

    }, 1000);

    updateAssessmentTimer();
}


function updateAssessmentTimer() {

    const timerElement =
        document.getElementById("mcqTimer");

    if (!timerElement || !assessmentEndTime) {
        return;
    }

    const remaining =
        Math.max(0, assessmentEndTime - Date.now());

    const totalSeconds =
        Math.floor(remaining / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (totalSeconds <= 60) {

        timerElement.style.color = "#ef4444";
        timerElement.style.fontWeight = "800";

    } else {

        timerElement.style.color = "var(--accent-amber)";
        timerElement.style.fontWeight = "700";
    }


    // Time finished
    if (remaining <= 0) {

        clearAssessmentTimer();

        showToast(
            "Time is up. Your assessment has been submitted automatically.",
            "info"
        );

        submitMcqAssessment(true);
    }
}


function clearAssessmentTimer() {

    if (assessmentTimerInterval) {

        clearInterval(assessmentTimerInterval);
        assessmentTimerInterval = null;
    }

    assessmentEndTime = null;
}


/* ------------------------------------------------------------
   SAVE ANSWER
   ------------------------------------------------------------ */

function handleAssessmentAnswer(questionId, index) {

    userMcqAnswers[questionId] = index;
}


/* ------------------------------------------------------------
   RENDER QUESTION
   ------------------------------------------------------------ */

function renderMcqQuestionModal(assess) {

    const questions = assess.sampleQuestions;

    const q = questions[currentMcqStep];

    const total = questions.length;

    const selectedAnswer =
        userMcqAnswers[q.id];


    const progress =
        Math.round(((currentMcqStep + 1) / total) * 100);


    const content = `

        <!-- Assessment Header -->

        <div style="
            background: rgba(59,130,246,0.08);
            border: 1px solid rgba(59,130,246,0.25);
            border-radius: 14px;
            padding: 14px 18px;
            margin-bottom: 20px;
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
            ">

                <div>

                    <span style="
                        font-size:0.72rem;
                        text-transform:uppercase;
                        color:var(--primary-light);
                        font-weight:700;
                    ">
                        Artificial Intelligence & Machine Learning
                    </span>

                    <h4 style="
                        color:#fff;
                        font-size:0.95rem;
                        margin-top:4px;
                    ">
                        ${assess.title}
                    </h4>

                </div>


                <div style="
                    text-align:right;
                    min-width:80px;
                ">

                    <div id="mcqTimer" style="
                        font-size:1rem;
                        color:var(--accent-amber);
                        font-weight:700;
                    ">
                        20:00
                    </div>

                    <div style="
                        font-size:0.75rem;
                        color:var(--text-muted);
                        margin-top:3px;
                    ">
                        Time Remaining
                    </div>

                </div>

            </div>


            <!-- Progress -->

            <div style="
                margin-top:14px;
                height:6px;
                background:rgba(255,255,255,0.08);
                border-radius:10px;
                overflow:hidden;
            ">

                <div style="
                    width:${progress}%;
                    height:100%;
                    background:var(--primary);
                    border-radius:10px;
                    transition:width 0.3s ease;
                "></div>

            </div>


            <div style="
                display:flex;
                justify-content:space-between;
                margin-top:8px;
                font-size:0.75rem;
                color:var(--text-muted);
            ">

                <span>
                    Question ${currentMcqStep + 1} of ${total}
                </span>

                <span>
                    ${progress}% complete
                </span>

            </div>

        </div>



        <!-- Question -->

        <div style="margin-bottom:22px;">

            <h4 style="
                font-size:1.08rem;
                color:#ffffff;
                line-height:1.55;
                margin-bottom:17px;
            ">

                <span style="
                    color:var(--primary-light);
                    font-weight:800;
                ">
                    Q${currentMcqStep + 1}.
                </span>

                ${q.question}

            </h4>



            <!-- Options -->

            <div style="
                display:flex;
                flex-direction:column;
                gap:10px;
            ">

                ${q.options.map((opt, idx) => `

                    <label style="
                        display:flex;
                        align-items:center;
                        gap:12px;
                        background:${
                            selectedAnswer === idx
                                ? "rgba(59,130,246,0.14)"
                                : "rgba(255,255,255,0.03)"
                        };
                        border:1px solid ${
                            selectedAnswer === idx
                                ? "rgba(59,130,246,0.55)"
                                : "var(--border-subtle)"
                        };
                        padding:13px 16px;
                        border-radius:12px;
                        cursor:pointer;
                        transition:all 0.2s;
                    ">

                        <input
                            type="radio"
                            name="mcqOption"
                            value="${idx}"
                            ${
                                selectedAnswer === idx
                                    ? "checked"
                                    : ""
                            }
                            onchange="
                                handleAssessmentAnswer(${q.id}, ${idx});
                                renderMcqQuestionModal(
                                    TRAINEE_DATA.upcomingAssessment
                                );
                            "
                            style="
                                accent-color:var(--primary);
                                width:18px;
                                height:18px;
                                flex-shrink:0;
                            "
                        >

                        <span style="
                            color:#ffffff;
                            font-size:0.9rem;
                            line-height:1.45;
                        ">
                            ${opt}
                        </span>

                    </label>

                `).join("")}

            </div>

        </div>



        <!-- Controls -->

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
            border-top:1px solid var(--border-subtle);
            padding-top:18px;
        ">


            <button
                type="button"
                class="btn btn-secondary btn-sm"
                ${
                    currentMcqStep === 0
                        ? `
                            disabled
                            style="
                                opacity:0.4;
                                cursor:not-allowed;
                            "
                        `
                        : ""
                }
                onclick="prevMcqQuestion();"
            >
                &larr; Previous
            </button>



            ${
                currentMcqStep === total - 1

                ?

                `
                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="submitMcqAssessment();"
                    >
                        Submit Assessment &check;
                    </button>
                `

                :

                `
                    <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        onclick="nextMcqQuestion();"
                    >
                        Next Question &rarr;
                    </button>
                `
            }

        </div>

    `;


    openModal(
        "AI / ML Competency Assessment",
        content
    );


    // Re-apply timer immediately after modal rendering
    updateAssessmentTimer();
}


/* ------------------------------------------------------------
   NEXT QUESTION
   ------------------------------------------------------------ */

function nextMcqQuestion() {

    const assess =
        TRAINEE_DATA.upcomingAssessment;

    const currentQuestion =
        assess.sampleQuestions[currentMcqStep];


    // Don't allow unanswered questions
    if (
        userMcqAnswers[currentQuestion.id] === undefined
    ) {

        showToast(
            "Please select an answer before continuing.",
            "info"
        );

        return;
    }


    if (
        currentMcqStep <
        assess.sampleQuestions.length - 1
    ) {

        currentMcqStep++;

        renderMcqQuestionModal(assess);
    }
}


/* ------------------------------------------------------------
   PREVIOUS QUESTION
   ------------------------------------------------------------ */

function prevMcqQuestion() {

    if (currentMcqStep > 0) {

        currentMcqStep--;

        renderMcqQuestionModal(
            TRAINEE_DATA.upcomingAssessment
        );
    }
}


/* ------------------------------------------------------------
   SUBMIT ASSESSMENT
   ------------------------------------------------------------ */

async function submitMcqAssessment(isAutoSubmit = false) {

  const assess = TRAINEE_DATA.upcomingAssessment;
  const questions = assess.sampleQuestions;

  if (assessmentSubmitting) {
    return;
  }

  if (!isAutoSubmit) {

    const unansweredIndex = questions.findIndex(
      q => userMcqAnswers[q.id] === undefined
    );

    if (unansweredIndex !== -1) {

      currentMcqStep = unansweredIndex;
      renderMcqQuestionModal(assess);

      showToast(
        "Please answer all questions before submitting.",
        "info"
      );

      return;
    }
  }

  const userId = localStorage.getItem("userId");

  if (!userId) {
    showToast(
      "User session not found. Please log in again.",
      "error"
    );
    return;
  }

  clearAssessmentTimer();

  assessmentSubmitting = true;

  try {

    const optionLetters = ["A", "B", "C", "D"];

    const answers = questions.map(q => ({
      question_id: Number(q.id),
      selected_option: optionLetters[userMcqAnswers[q.id]]
    }));

    const response = await fetch(
      `${API_BASE_URL}/assessments/${assess.id}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          answers: answers
        })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {

      const message =
        data?.detail ||
        data?.message ||
        `Assessment submission failed (${response.status})`;

      throw new Error(message);
    }

    console.log(
      "Assessment submitted successfully:",
      data
    );

    window.lastAssessmentResult = data;

    showAssessmentResultsFromAPI(
      data,
      isAutoSubmit
    );

  } catch (error) {

    console.error(
      "Assessment submission failed:",
      error
    );

    showToast(
      error.message ||
      "Unable to submit assessment.",
      "error"
    );

  } finally {

    assessmentSubmitting = false;

  }
}


function showAssessmentResultsFromAPI(
  data,
  isAutoSubmit = false
) {

  const result = data.result || {};
  const skillGap = data.skill_gap || {};

  const score = Number(result.score || 0);
  const totalMarks = Number(result.total_marks || 0);
  const percentage = Number(result.percentage || 0);

  const correctAnswers =
    Number(data.correct_answers || 0);

  const totalQuestions =
    Number(
      data.total_questions ||
      TRAINEE_DATA.upcomingAssessment.sampleQuestions.length
    );

  const attemptNumber =
    Number(result.attempt_number || 1);

  const currentGap =
    Number(skillGap.gap_score || 0);

  const target =
    Number(skillGap.target_score || 80);

  const status =
    skillGap.status || "Not Available";

  let gapLevelClass = "danger";

  if (status === "Target Achieved") {
    gapLevelClass = "success";
  } else if (status === "Needs Improvement") {
    gapLevelClass = "warning";
  }

  const content = `
    <div style="
      text-align:center;
      margin-bottom:22px;
    ">

      <div style="
        font-size:3rem;
        font-weight:900;
        color:var(--accent-emerald);
        margin-bottom:5px;
      ">
        ${percentage}%
      </div>

      <div style="
        color:var(--text-secondary);
        font-size:0.9rem;
      ">
        ${score} / ${totalMarks} Marks
      </div>

    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-bottom:20px;
    ">

      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid var(--border-subtle);
        border-radius:12px;
        padding:14px;
      ">

        <div style="
          color:var(--text-muted);
          font-size:0.72rem;
          text-transform:uppercase;
        ">
          Correct Answers
        </div>

        <div style="
          color:#fff;
          font-size:1.2rem;
          font-weight:800;
          margin-top:4px;
        ">
          ${correctAnswers} / ${totalQuestions}
        </div>

      </div>

      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid var(--border-subtle);
        border-radius:12px;
        padding:14px;
      ">

        <div style="
          color:var(--text-muted);
          font-size:0.72rem;
          text-transform:uppercase;
        ">
          Attempt
        </div>

        <div style="
          color:#fff;
          font-size:1.2rem;
          font-weight:800;
          margin-top:4px;
        ">
          ${attemptNumber}
        </div>

      </div>

    </div>

    <div style="
      background:rgba(255,255,255,0.03);
      border:1px solid var(--border-subtle);
      border-radius:12px;
      padding:16px;
      margin-bottom:20px;
    ">

      <div style="
        color:var(--text-muted);
        font-size:0.72rem;
        text-transform:uppercase;
        margin-bottom:4px;
      ">
        Skill Gap
      </div>

      <div style="
        color:#fff;
        font-size:1.15rem;
        font-weight:800;
      ">
        ${currentGap}% Gap
      </div>

      <div style="
        margin-top:5px;
        color:var(--text-secondary);
        font-size:0.82rem;
      ">
        Current: ${percentage}% &nbsp; | &nbsp; Target: ${target}%
      </div>

      <div style="
        margin-top:10px;
        font-weight:800;
      ">
        ${status}
      </div>

    </div>

    ${
      isAutoSubmit
        ? `
          <div style="
            background:rgba(245,158,11,0.08);
            border:1px solid rgba(245,158,11,0.25);
            border-radius:12px;
            padding:10px;
            margin-bottom:18px;
            color:#fbbf24;
            font-size:0.82rem;
          ">
            ⏱️ The assessment was automatically submitted because the time limit expired.
          </div>
        `
        : ""
    }

    <button
      type="button"
      class="btn btn-primary"
      style="width:100%;"
      onclick="
        closeModal();
        renderSkillsAndGaps();
        showToast(
          'Assessment result saved successfully.',
          'success'
        );
      "
    >
      Return to Dashboard ✓
    </button>
  `;

  openModal(
    "Assessment Results",
    content
  );
}

/* --------------------------------------------------------------------------
   10. Capability E: Course & Training Feedback
   -------------------------------------------------------------------------- */
let selectedRatingStars = 5;

function initFeedbackForm() {
  const form = document.getElementById('feedbackInlineForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! Your feedback has been submitted.', 'success');
    form.reset();
    setFeedbackRating(5);
  });
}

function setFeedbackRating(stars) {
  selectedRatingStars = stars;
  const starElements = document.querySelectorAll('.interactive-star');
  starElements.forEach((s, idx) => {
    if (idx < stars) {
      s.classList.add('selected');
      s.textContent = '★';
    } else {
      s.classList.remove('selected');
      s.textContent = '☆';
    }
  });
}

function handleOpenFeedbackModal(targetItem) {
  selectedRatingStars = 5;

  const content = `
    <form id="feedbackModalForm" onsubmit="event.preventDefault(); showToast('Thank you! Your feedback has been submitted.', 'success'); closeModal();">
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Course or Trainer</label>
        <select class="auth-input" style="background: #111a2e; color: #fff; cursor: pointer;" required>
          <option value="python">${targetItem || 'Python Programming Mastery (Dr. Neha Verma)'}</option>
          <option value="web">Modern Web Architecture &amp; APIs (Karan Malhotra)</option>
          <option value="dsa">Data Structures &amp; Algorithms in C++ (Prof. Rajesh Kumar)</option>
          <option value="trainer-arjun">Dr. Arjun Sharma (AI / ML Mentor)</option>
          <option value="trainer-priya">Priya Mehta (Database Mentor)</option>
        </select>
      </div>

      <div style="margin-bottom: 18px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">Rating</label>
        <div style="display: flex; gap: 8px; font-size: 1.8rem; color: #fbbf24; cursor: pointer;">
          <span class="interactive-star-modal" onclick="setModalRating(1);">★</span>
          <span class="interactive-star-modal" onclick="setModalRating(2);">★</span>
          <span class="interactive-star-modal" onclick="setModalRating(3);">★</span>
          <span class="interactive-star-modal" onclick="setModalRating(4);">★</span>
          <span class="interactive-star-modal" onclick="setModalRating(5);">★</span>
        </div>
      </div>

      <div style="margin-bottom: 22px;">
        <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Feedback &amp; Constructive Comments</label>
        <textarea class="auth-input" rows="4" placeholder="Share your experience regarding course pacing, conceptual depth, and mentorship effectiveness..." required style="resize: vertical;"></textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">
        Submit Feedback &check;
      </button>
    </form>
  `;

  openModal(`Submit Course &amp; Training Feedback`, content);
}

function setModalRating(stars) {
  const starElements = document.querySelectorAll('.interactive-star-modal');
  starElements.forEach((s, idx) => {
    if (idx < stars) {
      s.textContent = '★';
    } else {
      s.textContent = '☆';
    }
  });
}

/* --------------------------------------------------------------------------
   11. Other Action Handlers (Enroll, View Trainer, Certificates, Reassess)
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Course & Enrollment API Integration
   -------------------------------------------------------------------------- */
const API_BASE_URL = "https://capacity-connect-backend-ejbl.onrender.com";
let apiCourses = [];
let apiEnrollments = [];

function applyEnrolledStyle(buttonElem) {
  if (!buttonElem) return;
  buttonElem.dataset.enrolled = "true";
  buttonElem.textContent = "✓ Enrolled";
  buttonElem.classList.remove('btn-primary');
  buttonElem.classList.add('btn-secondary');
  buttonElem.style.borderColor = 'var(--accent-emerald)';
  buttonElem.style.color = 'var(--accent-emerald)';
}

async function loadCoursesAndEnrollments() {
  const userId = localStorage.getItem("userId");

  // 1. Load Courses from API (GET /courses)
  try {
    const resCourses = await fetch(`${API_BASE_URL}/courses`);
    if (resCourses.ok) {
      apiCourses = await resCourses.json();

      const enrolledCoursesElement = document.getElementById("enrolledCoursesCount");

      if (enrolledCoursesElement) {
        enrolledCoursesElement.textContent = apiEnrollments.length;
      }
      const totalCoursesElement = document.getElementById("totalCoursesCount");

      if (totalCoursesElement) {
        totalCoursesElement.textContent = apiCourses.length;
      }
    }
  } catch (err) {
    console.error("Failed to load courses from API:", err);
  }

  // Fallback courses with real database IDs if API request fails
  if (!apiCourses || apiCourses.length === 0) {
    apiCourses = [
      {
        id: 7,
        title: "Introduction to Artificial Intelligence",
        description: "Master foundational AI principles, search algorithms, heuristic evaluation, and knowledge representation designed to bridge early ML gaps.",
        difficulty: "Beginner",
        duration: "6 Weeks",
        skill: "AI / ML"
      },
      {
        id: 8,
        title: "Machine Learning Fundamentals",
        description: "Learn supervised learning, regression, classification, decision trees, and model evaluation techniques with hands-on Python notebooks.",
        difficulty: "Intermediate",
        duration: "8 Weeks",
        skill: "AI / ML"
      },
      {
        id: 9,
        title: "Database Management Essentials",
        description: "Relational schema modeling, normalization, advanced SQL queries, indexing strategies, and database concurrency optimization.",
        difficulty: "Beginner",
        duration: "4 Weeks",
        skill: "Database"
      }
    ];
  }

  // 2. Load Existing User Enrollments from API (GET /enrollments/{user_id})
  if (userId) {
    try {
      const resEnroll = await fetch(`${API_BASE_URL}/enrollments/${userId}`);
      if (resEnroll.ok) {
        apiEnrollments = await resEnroll.json();

        // Update Enrolled Courses metric
        const enrolledCoursesElement =
        document.getElementById("enrolledCoursesCount");

        if (enrolledCoursesElement) {
          enrolledCoursesElement.textContent = apiEnrollments.length;
        }
  }
    } catch (err) {
      console.error("Failed to load user enrollments:", err);
    }
  }

  renderRecommendedCourses();
  renderMyCourses();
}

function renderRecommendedCourses() {
  const container = document.getElementById('recommendedCoursesGrid') || document.querySelector('#recommended-courses-section .dash-courses-grid');
  if (!container) return;

  const enrolledCourseIds = new Set((apiEnrollments || []).map(e => Number(e.course_id || (e.course && e.course.id))));

  if (apiCourses && apiCourses.length > 0) {
    container.innerHTML = apiCourses.map(course => {
      const isEnrolled = enrolledCourseIds.has(Number(course.id));
      const skillName = course.skill || (course.title && course.title.toLowerCase().includes('database') ? 'Database' : 'AI / ML');
      const isDb = skillName.toLowerCase().includes('database');
      const tagStyle = isDb ? ' style="background: rgba(6,182,212,0.12); color: var(--accent-cyan); border-color: rgba(6,182,212,0.3);"' : '';

      return `
        <div class="dash-course-card" data-searchable>
          <div>
            <span class="dash-course-tag"${tagStyle}>Skill: ${skillName}</span>
            <h3 class="dash-course-title">${course.title}</h3>
            <p class="dash-course-desc">${course.description}</p>
          </div>
          <div>
            <div class="dash-course-meta-row">
              <span>Difficulty: <strong>${course.difficulty || 'Beginner'}</strong></span>
              <span>Duration: <strong>${course.duration || '6 Weeks'}</strong></span>
            </div>
            <button 
              type="button" 
              class="btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'} btn-sm" 
              style="width: 100%;${isEnrolled ? ' border-color: var(--accent-emerald); color: var(--accent-emerald);' : ''}" 
              data-course-id="${course.id}"
              ${isEnrolled ? 'data-enrolled="true"' : ''}
              onclick="handleCourseEnroll(${course.id}, this)">
              ${isEnrolled ? '✓ Enrolled' : 'Enroll in Course'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // If cards were rendered statically, sync button states
    container.querySelectorAll('button[data-course-id]').forEach(btn => {
      const cId = Number(btn.dataset.courseId);
      if (enrolledCourseIds.has(cId)) {
        applyEnrolledStyle(btn);
      }
    });
  }

  initTiltCardsDashboard();
}

function renderMyCourses() {
  const container = document.getElementById('myCoursesGrid');
  if (!container) return;

  if (!apiEnrollments || apiEnrollments.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: 20px;" data-searchable>
        <div style="font-size: 2rem; margin-bottom: 10px;">📚</div>
        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 6px;">No Enrolled Courses Yet</h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 16px;">
          You haven't enrolled in any courses yet. Select a recommended course below to start learning.
        </p>
        <a href="#recommended-courses-section" class="btn btn-outline btn-sm">Explore Recommended Courses &darr;</a>
      </div>
    `;
    return;
  }

  container.innerHTML = apiEnrollments.map(item => {
    const course = item.course || apiCourses.find(c => c.id == item.course_id) || {
      id: item.course_id,
      title: `Course #${item.course_id}`,
      description: "Enrolled active course module.",
      difficulty: "Beginner",
      duration: "6 Weeks"
    };

    const skillName = course.skill || (course.title && course.title.toLowerCase().includes('database') ? 'Database' : 'AI / ML');
    const isDb = skillName.toLowerCase().includes('database');
    const tagStyle = isDb ? ' style="background: rgba(6,182,212,0.12); color: var(--accent-cyan); border-color: rgba(6,182,212,0.3);"' : '';

    return `
      <div class="dash-course-card" data-searchable>
        <div>
          <span class="dash-course-tag"${tagStyle}>Skill: ${skillName}</span>
          <h3 class="dash-course-title">${course.title}</h3>
          <p class="dash-course-desc">${course.description || 'Active enrolled curriculum covering core and advanced concepts.'}</p>
        </div>
        <div>
          <div class="dash-course-meta-row">
            <span>Difficulty: <strong>${course.difficulty || 'Beginner'}</strong></span>
            <span>Duration: <strong>${course.duration || '6 Weeks'}</strong></span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-outline btn-sm" style="flex: 1;" onclick="handleContinueLearning(${course.id})">
              Resume Learning &rarr;
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="handleAccessResources(${course.id})">
              Resources 📁
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initTiltCardsDashboard();
}

// Enroll Action
async function handleCourseEnroll(courseId, buttonElem) {
  // Prevent double-clicking while the request is being sent
  if (buttonElem.disabled || buttonElem.dataset.loading === "true") {
    return;
  }

  if (buttonElem.dataset.enrolled === "true") {
    showToast("You are already enrolled in this course.", 'info');
    return;
  }

  // 1. Get the logged-in user UUID
  const userId = localStorage.getItem("userId");

  // 2. If userId is missing, show an error toast and stop
  if (!userId) {
    showToast("User session not found. Please log in to enroll.", 'error');
    return;
  }

  // Identify course from API-loaded courses
  const numericCourseId = parseInt(courseId, 10);
  const course = apiCourses.find(c => c.id === numericCourseId) || { id: numericCourseId, title: `Course #${numericCourseId}` };

  // 8. Prevent double-clicking while request is being sent
  buttonElem.disabled = true;
  buttonElem.dataset.loading = "true";
  const originalText = buttonElem.textContent;
  buttonElem.textContent = "Enrolling...";

  try {
    // 3. Send POST https://capacity-connect-backend-ejbl.onrender.com/enrollments
    const response = await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        course_id: course.id
      })
    });

    const data = await response.json().catch(() => null);

    // 5. If response.status === 201:
    if (response.status === 201) {
      applyEnrolledStyle(buttonElem);
      showToast(`Successfully enrolled in "${course.title}"!`, 'success');

      // Update local enrollments and refresh My Courses
      const newEnrollment = (data && data.enrollment) ? { ...data.enrollment, course } : { course_id: course.id, course };
      if (!apiEnrollments.some(e => Number(e.course_id || (e.course && e.course.id)) === Number(course.id))) {
        apiEnrollments.push(newEnrollment);
      }
      renderMyCourses();
      return;
    }

    // 6. If response.status === 409:
    if (response.status === 409) {
      applyEnrolledStyle(buttonElem);
      showToast("You are already enrolled in this course.", 'info');

      if (!apiEnrollments.some(e => Number(e.course_id || (e.course && e.course.id)) === Number(course.id))) {
        apiEnrollments.push({ course_id: course.id, course });
        renderMyCourses();
      }
      return;
    }

    // 7. For other errors: DO NOT mark the course as enrolled, show error toast
    const errorMsg = (data && (data.detail || data.message)) || "Failed to enroll in course. Please try again.";
    showToast(errorMsg, 'error');
    buttonElem.textContent = originalText;

  } catch (err) {
    console.error("Enrollment request failed:", err);
    showToast("Network error while connecting to enrollment service.", 'error');
    buttonElem.textContent = originalText;
  } finally {
    buttonElem.dataset.loading = "false";
    if (buttonElem.dataset.enrolled !== "true") {
      buttonElem.disabled = false;
    }
  }
}

// View Trainer Modal
function handleViewTrainer(trainerId) {
  const trainer = TRAINEE_DATA.recommendedTrainers.find(t => t.id === trainerId);
  if (!trainer) return;

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 80px; height: 80px; border-radius: 20px; background: var(--grad-primary); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0 auto 12px; border: 2px solid rgba(255,255,255,0.15);">
        ${trainer.avatarInitials}
      </div>
      <h3 style="font-size: 1.35rem; color: #fff; margin-bottom: 4px;">${trainer.name}</h3>
      <p style="color: var(--primary-light); font-weight: 600; font-size: 0.9rem;">${trainer.expertise}</p>
      <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-top: 8px;">
        ★ ${trainer.rating} Rating &bull; ${trainer.experience} Experience
      </div>
    </div>

    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 16px; margin-bottom: 20px;">
      <h5 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Biography &amp; Focus</h5>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${trainer.bio}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h5 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">Matched Competencies</h5>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${trainer.skills.map(s => `<span class="skill-pill" style="font-size: 0.8rem; background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.3); color: var(--primary-light);">${s}</span>`).join('')}
      </div>
    </div>

    <button type="button" class="btn btn-primary" style="width: 100%;" onclick="showToast('Mentorship request sent to ${trainer.name}!', 'success'); closeModal();">
      Schedule 1-on-1 Mentorship &rarr;
    </button>
  `;

  openModal(`Trainer Profile`, content);
}

// View Certificate Modal
function handleViewCertificate(certId) {
  const cert = TRAINEE_DATA.certificates.find(c => c.id === certId);
  if (!cert) return;

  const content = `
    <div style="background: linear-gradient(135deg, #0d1527 0%, #16223e 100%); border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 18px; padding: 28px; text-align: center; position: relative; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="font-size: 0.8rem; letter-spacing: 0.15em; color: var(--primary-light); font-weight: 800; text-transform: uppercase;">CAPACITY CONNECT</div>
      <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: #fff; margin: 10px 0 4px;">Certificate of Completion</h3>
      <p style="font-size: 0.82rem; color: var(--text-muted);">Awarded to Trainee:</p>
      <h2 style="font-size: 1.6rem; color: var(--primary-light); font-weight: 800; margin: 4px 0 12px;">${TRAINEE_DATA.profile.name}</h2>
      <p style="font-size: 0.95rem; color: #fff; margin-bottom: 16px;">
        For successfully achieving mastery in <strong style="color: #60a5fa;">${cert.course}</strong>.
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-size: 0.78rem; color: var(--text-secondary);">
        <span>ID: <strong>${cert.code}</strong></span>
        <span>Issued: <strong>${cert.issued}</strong></span>
        <span style="color: #fbbf24; font-weight: bold;">★ Verified</span>
      </div>
    </div>

    <button type="button" class="btn btn-outline" style="width: 100%;" onclick="showToast('Certificate PDF downloaded successfully.', 'success'); closeModal();">
      📥 Download Official PDF Certificate
    </button>
  `;

  openModal(`Verified Credential`, content);
}

// Take Re-Assessment Modal
function handleTakeReassessment(skillName) {
  const content = `
    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 8px;">Competency Re-Assessment (${skillName || 'All Skills'})</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
        Validate the competency acquired from recommended courses and mentorship. Re-assessment benchmarks will dynamically update your Skill Gap Analysis matrix.
      </p>
    </div>

    <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 16px; margin-bottom: 24px;">
      <h5 style="color: var(--accent-emerald); font-size: 0.95rem; margin-bottom: 4px;">Target Goal</h5>
      <p style="font-size: 0.85rem; color: var(--text-secondary);">Target baseline competency is set at 80%. Closing this gap unlocks certified mastery badges.</p>
    </div>

    <button type="button" class="btn btn-primary" style="width: 100%;" onclick="closeModal(); handleStartAssessment();">
      Launch Re-assessment Diagnostic &rarr;
    </button>
  `;

  openModal(`Re-assessment Launcher`, content);
}

// Settings Modal
function handleOpenSettingsModal() {
  const content = `
    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: 14px;">
        <div>
          <h5 style="color: #fff; font-size: 0.92rem;">Competency Gap Alerts</h5>
          <p style="color: var(--text-muted); font-size: 0.78rem;">Notify when gap exceeds 30%</p>
        </div>
        <input type="checkbox" checked style="accent-color: var(--primary); width: 18px; height: 18px;">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: 14px;">
        <div>
          <h5 style="color: #fff; font-size: 0.92rem;">Trainer Recommendations</h5>
          <p style="color: var(--text-muted); font-size: 0.78rem;">Match mentor updates weekly</p>
        </div>
        <input type="checkbox" checked style="accent-color: var(--primary); width: 18px; height: 18px;">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: 14px;">
        <div>
          <h5 style="color: #fff; font-size: 0.92rem;">Public Credential Verification</h5>
          <p style="color: var(--text-muted); font-size: 0.78rem;">Allow employers to verify certificates</p>
        </div>
        <input type="checkbox" checked style="accent-color: var(--primary); width: 18px; height: 18px;">
      </div>
    </div>

    <button type="button" class="btn btn-primary" style="width: 100%;" onclick="showToast('Dashboard preferences saved!', 'success'); closeModal();">
      Save Preferences
    </button>
  `;

  openModal(`Dashboard Settings`, content);
}

/* --------------------------------------------------------------------------
   12. Generic Modal Management
   -------------------------------------------------------------------------- */
function initModalHandlers() {
  const backdrop = document.getElementById('dashModalBackdrop');
  const closeBtn = document.getElementById('dashModalClose');

  if (!backdrop) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(title, htmlContent) {
  const backdrop = document.getElementById('dashModalBackdrop');
  const modalTitle = document.getElementById('dashModalTitle');
  const modalBody = document.getElementById('dashModalBody');

  if (!backdrop || !modalTitle || !modalBody) return;

  modalTitle.innerHTML = title;
  modalBody.innerHTML = htmlContent;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const backdrop = document.getElementById('dashModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}
