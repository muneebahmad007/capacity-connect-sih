
/* --------------------------------------------------------------------------
   TRAINEE DASHBOARD AUTHENTICATION & ROLE GUARD
   -------------------------------------------------------------------------- */

(function protectTraineeDashboard() {
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    // No valid login session
    if (!authToken || !userId || !userRole) {
        window.location.replace("login.html");
        return;
    }

    // Only Trainees are allowed on this dashboard
    if (userRole.toLowerCase() !== "trainer") {
        window.location.replace("login.html");
        return;
    }
})();

/* --------------------------------------------------------------------------
   LOGOUT
   -------------------------------------------------------------------------- */

function logoutUser() {
    // Remove all login/session information
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    // Redirect to login page
    window.location.replace("login.html");
}

/* =========================================================
   CAPACITY CONNECT — Trainer Dashboard (vanilla JS)
   No build step. No dependencies. Works via file://
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- storage keys ---------------- */
  var KEYS = {
    courses: "capacityConnectTrainerCourses",
    assessments: "capacityConnectTrainerAssessments",
    questionBank: "capacityConnectQuestionBank",
    resources: "capacityConnectResources",
    profile: "capacityConnectTrainerProfile",
    trainees: "capacityConnectTrainees",
    notifications: "capacityConnectNotifications",
    settings: "capacityConnectSettings",
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — fail silently, app still works in-memory */
    }
  }
  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- seed data ---------------- */

  var TRAINER_API_BASE_URL =
    "https://capacity-connect-backend-ejbl.onrender.com";

  var SEED_COURSES = [
    { id: uid("c"), title: "Machine Learning Fundamentals", category: "AI / ML", level: "Intermediate", duration: "8 weeks", description: "Core concepts of supervised and unsupervised learning.", objectives: "Understand ML pipelines, evaluate models, apply algorithms", trainees: 42, completion: 78, status: "Published", color: "violet" },
    { id: uid("c"), title: "Python for Data Analysis", category: "Programming", level: "Beginner", duration: "6 weeks", description: "Hands-on Python for cleaning and analysing data.", objectives: "Use pandas, numpy and visualise datasets", trainees: 67, completion: 85, status: "Published", color: "cyan" },
    { id: uid("c"), title: "Database Management Essentials", category: "Database", level: "Intermediate", duration: "5 weeks", description: "Relational database design and SQL fundamentals.", objectives: "Design schemas, write SQL queries, optimise joins", trainees: 35, completion: 72, status: "Draft", color: "amber" },
  ];

  var SEED_TRAINEES = [
    { id: uid("t"), name: "Muneeb Ahmad", initials: "MA", email: "muneeb.ahmad@example.com", course: "AI / ML", score: 68, status: "Needs improvement", progress: 72, last: "2 hours ago", tone: "warning" },
    { id: uid("t"), name: "Daksh Jain", initials: "DJ", email: "daksh.jain@example.com", course: "AI / ML", score: 82, status: "Strong", progress: 91, last: "Today", tone: "success" },
    { id: uid("t"), name: "Yash Jain", initials: "YJ", email: "yash.jain@example.com", course: "AI / ML", score: 54, status: "Needs improvement", progress: 65, last: "Yesterday", tone: "warning" },
    { id: uid("t"), name: "Priya Nair", initials: "PN", email: "priya.nair@example.com", course: "Python for Data Analysis", score: 88, status: "Strong", progress: 95, last: "Today", tone: "success" },
    { id: uid("t"), name: "Rohan Mehta", initials: "RM", email: "rohan.mehta@example.com", course: "Database Management Essentials", score: 61, status: "Needs improvement", progress: 58, last: "3 days ago", tone: "warning" },
  ];

  var SEED_ASSESSMENTS = [
    { id: uid("a"), title: "AI & ML Fundamentals", subject: "Machine Learning", questions: [], numQuestions: 20, time: "20 min", deadline: "Sep 08, 2026", completed: "32 / 45", progress: 71, status: "Active" },
    { id: uid("a"), title: "Python Fundamentals", subject: "Programming", questions: [], numQuestions: 20, time: "15 min", deadline: "Sep 12, 2026", completed: "18 / 30", progress: 60, status: "Active" },
    { id: uid("a"), title: "Database Essentials", subject: "Database", questions: [], numQuestions: 20, time: "20 min", deadline: "Sep 15, 2026", completed: "24 / 35", progress: 69, status: "Active" },
  ];

  var SEED_QUESTION_BANK = [
    { id: uid("q"), question: "Which metric best measures classification accuracy on an imbalanced dataset?", subject: "Machine Learning", difficulty: "Medium", options: ["Accuracy", "F1 score", "Mean squared error", "R-squared"], correctIndex: 1 },
    { id: uid("q"), question: "What does the SQL JOIN clause do?", subject: "Database", difficulty: "Easy", options: ["Deletes rows", "Combines rows from two or more tables", "Sorts a table", "Creates an index"], correctIndex: 1 },
    { id: uid("q"), question: "Which Python library is primarily used for dataframes?", subject: "Programming", difficulty: "Easy", options: ["numpy", "pandas", "matplotlib", "requests"], correctIndex: 1 },
  ];

  var SEED_RESOURCES = [
    { id: uid("r"), name: "Introduction to Machine Learning.pdf", type: "PDF", url: "", meta: "PDF · 2.4 MB", icon: "filetext", color: "rose" },
    { id: uid("r"), name: "Linear Regression Lecture", type: "Video", url: "", meta: "Video · 42 min", icon: "activity", color: "violet" },
    { id: uid("r"), name: "ML Algorithms.pptx", type: "Presentation", url: "", meta: "Presentation · 4.8 MB", icon: "briefcase", color: "amber" },
  ];

  var SEED_FEEDBACK = [
    { quote: "Very clear explanations and practical examples.", name: "Muneeb Ahmad" },
    { quote: "Good course structure. More assignments would help.", name: "Daksh Jain" },
    { quote: "Excellent explanation of machine learning concepts.", name: "Yash Jain" },
  ];

  var SEED_COMPETENCY = [
    { skill: "AI / Machine Learning", strong: 18, developing: 31, gap: 24, major: 9, action: "Schedule a hands-on ML workshop focused on model evaluation." },
    { skill: "Database & SQL", strong: 22, developing: 35, gap: 18, major: 6, action: "Assign extra SQL join and query-optimisation practice sets." },
    { skill: "Python", strong: 52, developing: 28, gap: 12, major: 4, action: "Pair struggling trainees with peer mentors for code reviews." },
  ];

  var SEED_NOTIFICATIONS = [
    { id: uid("n"), text: "12 trainees completed AI & ML Fundamentals.", time: "Just now", read: false },
    { id: uid("n"), text: "5 new trainees enrolled in Machine Learning.", time: "1 hour ago", read: false },
    { id: uid("n"), text: "AI & ML assessment deadline is approaching.", time: "3 hours ago", read: false },
    { id: uid("n"), text: "Database Essentials feedback average rose to 4.6.", time: "Yesterday", read: false },
  ];

  var SEED_PROFILE = {
    name: "Dr. Arjun Sharma",
    role: "AI / ML Trainer",
    email: "arjun.sharma@capacityconnect.io",
    phone: "+91 98765 43210",
    skill: "Artificial Intelligence / Machine Learning",
    bio: "AI/ML trainer focused on helping trainees close real-world skill gaps through project-based learning.",
  };

  var SEED_SETTINGS = {
    notifPrefs: {
      assessmentDeadlines: true,
      newEnrolments: true,
      feedbackAlerts: true,
      weeklyDigest: false,
    },
    timezone: "Asia/Kolkata (IST)",
    timeLimit: 20,
  };

  /* ---------------- state ---------------- */
  var state = {
    courses: [],
    skills: [],
    assessments: load(KEYS.assessments, SEED_ASSESSMENTS),
    questionBank: load(KEYS.questionBank, SEED_QUESTION_BANK),
    resources: load(KEYS.resources, SEED_RESOURCES),
    trainees: load(KEYS.trainees, SEED_TRAINEES),
    dashboardStats: null,
    notifications: load(KEYS.notifications, SEED_NOTIFICATIONS),
    profile: load(KEYS.profile, SEED_PROFILE),
    settings: load(KEYS.settings, SEED_SETTINGS),
    feedback: SEED_FEEDBACK,
    competency: SEED_COMPETENCY,
    active: "dashboard",
    query: "",
  };

  function persist(which) {
    save(KEYS[which], state[which]);
  }

  /* ---------------- icons ---------------- */
  var ICONS = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    filetext: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v6h6"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    filequestion: '<circle cx="11" cy="11" r="8"/><path d="M8 11a3 3 0 0 1 5.5-1.5c0 2-2.5 1.5-2.5 3.5"/><path d="M11 15h.01"/><path d="m21 21-4.35-4.35"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    upload: '<path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    folder: '<path d="M4 20V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2"/><path d="M4 20a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    sparkle: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    arrowUp: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  };
  function svg(name, size) {
    size = size || 15;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function notify(message) {
    var el = document.getElementById("toast");
    el.innerHTML = svg("check", 15) + " " + esc(message);
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.add("hidden");
    }, 2600);
  }

  /* ---------------- nav / view switching ---------------- */
  var VIEW_TITLES = {
    dashboard: "Dashboard",
    courses: "My Courses",
    "create-course": "Create Course",
    assessments: "Assessments",
    "question-bank": "Question Bank",
    trainees: "My Trainees",
    performance: "Performance",
    competency: "Competency & Skill Gaps",
    resources: "Resource Library",
    feedback: "Feedback",
    analytics: "Analytics",
    notifications: "Notifications",
    profile: "My Profile",
    settings: "Settings",
  };

  function setActive(view) {
    if (view === "create-course") {
      openModal("course");
      return;
    }
    state.active = view;
    document.querySelectorAll(".view").forEach(function (sec) {
      sec.classList.toggle("hidden", sec.id !== "view-" + view);
    });
    document.querySelectorAll(".nav-item[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === view);
    });
    var crumb = document.getElementById("crumbActive");
    if (crumb) crumb.textContent = VIEW_TITLES[view] || view;
    closePanels();
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("mobileOverlay").classList.remove("show");
    renderView(view);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function renderView(view) {
    if (view === "dashboard") renderDashboard();
    else if (view === "courses") renderCoursesView();
    else if (view === "assessments") renderAssessmentsView();
    else if (view === "question-bank") renderQuestionBankView();
    else if (view === "trainees") renderTraineesView();
    else if (view === "performance") renderPerformanceView();
    else if (view === "competency") renderCompetencyView();
    else if (view === "resources") renderResourcesView();
    else if (view === "feedback") renderFeedbackView();
    else if (view === "analytics") renderAnalyticsView();
    else if (view === "notifications") renderNotificationsView();
    else if (view === "profile") renderProfileView();
    else if (view === "settings") renderSettingsView();
  }

  /* ================= DASHBOARD ================= */

  async function loadTrainerDashboardStats() {
    var trainerId = localStorage.getItem("userId");

    if (!trainerId) {
      console.error("Trainer user ID not found in localStorage.");
      state.dashboardStats = null;
      return;
    }

    try {
      var response = await fetch(
        TRAINER_API_BASE_URL +
        "/trainers/" +
        encodeURIComponent(trainerId) +
        "/dashboard/stats"
      );

      if (!response.ok) {
        throw new Error(
          "Trainer dashboard API returned " + response.status
        );
      }

      var data = await response.json();

      state.dashboardStats = data;

      if (data.trainer_name) {
        state.profile.name = data.trainer_name;
      }

      console.log(
        "Trainer Dashboard Stats:",
        data
      );

    } catch (error) {
      console.error(
        "Failed to load trainer dashboard stats:",
        error
      );

      state.dashboardStats = null;
    }
  }
async function loadTrainerSkills() {
  try {
    var response = await fetch(
      TRAINER_API_BASE_URL + "/skills"
    );

    if (!response.ok) {
      throw new Error("Skills API returned " + response.status);
    }

    var skills = await response.json();

    if (!Array.isArray(skills)) {
      throw new Error("Invalid skills response");
    }

    state.skills = skills;

    console.log("Trainer Skills:", state.skills);

  } catch (error) {
    console.error("Failed to load skills:", error);
    state.skills = [];
  }
}


  async function loadTrainerCourses() {
    var trainerId = localStorage.getItem("userId");

    if (!trainerId) {
      console.error("Trainer user ID not found.");
      state.courses = [];
      return;
    }

    try {
      var response = await fetch(
        TRAINER_API_BASE_URL +
        "/trainers/" +
        encodeURIComponent(trainerId) +
        "/courses"
      );

      if (!response.ok) {
        throw new Error(
          "Trainer courses API returned " + response.status
        );
      }

      var courses = await response.json();

      if (!Array.isArray(courses)) {
        throw new Error("Invalid courses response");
      }

      state.courses = courses.map(function (course, index) {

        var skill = null;

        if (Array.isArray(state.skills)) {
          skill = state.skills.find(function (s) {
            return Number(s.id) === Number(course.skill_id);
          });
        }

        return {
          id: course.id,
          title: course.title || "Untitled Course",
          description: course.description || "",
          category: skill
            ? skill.name
            : "General",
          level: course.difficulty || "Beginner",
          duration: course.duration || "—",
          resource_url: course.resource_ur1 || "",
          skill_id: course.skill_id,
          trainer_id: course.trainer_id,
          trainees: Number(course.enrollment_count || 0),
          completion: 0,
          status: "Published",
          color: ["violet", "cyan", "amber", "blue", "emerald", "rose"]
            [index % 6]
        };
      });

      console.log(
        "Trainer Courses:",
        state.courses
      );

    } catch (error) {

      console.error(
        "Failed to load trainer courses:",
        error
      );

      state.courses = [];
    }
  }

  async function loadTrainerAssessments() {
    var trainerId = localStorage.getItem("userId");

    if (!trainerId) {
      console.error("Trainer user ID not found.");
      state.assessments = [];
      return;
    }

    try {
      var response = await fetch(
        TRAINER_API_BASE_URL + "/assessments"
      );

      if (!response.ok) {
        throw new Error(
          "Assessments API returned " + response.status
        );
      }

      var assessments = await response.json();

      if (!Array.isArray(assessments)) {
        throw new Error("Invalid assessments response");
      }

      var trainerAssessments = assessments.filter(function (assessment) {
        return String(assessment.trainer_id) === String(trainerId);
      });

      state.assessments = trainerAssessments.map(function (assessment) {
        var skill = Array.isArray(state.skills)
          ? state.skills.find(function (s) {
              return Number(s.id) === Number(assessment.skill_id);
            })
          : null;

        return {
          id: assessment.id,
          title: assessment.title || "Untitled Assessment",
          subject: skill ? skill.name : "General",
          skill_id: assessment.skill_id,
          trainer_id: assessment.trainer_id,
          numQuestions: Number(assessment.total_questions || 0),
          questions: [],
          time: "20 min",
          deadline: assessment.deadline || "TBD",
          completed: "0 / 0",
          progress: 0,
          status: "Active",
          description: assessment.description || ""
        };
      });

      console.log(
        "Trainer Assessments:",
        state.assessments
      );

    } catch (error) {
      console.error(
        "Failed to load trainer assessments:",
        error
      );

      state.assessments = [];
    }
  }
  async function loadTrainerTrainees() {
    var trainerId = localStorage.getItem("userId");

    if (!trainerId) {
      console.error("Trainer user ID not found.");
      state.trainees = [];
      return;
    }

    try {
      var response = await fetch(
        TRAINER_API_BASE_URL +
        "/trainer/trainees/" +
        encodeURIComponent(trainerId)
      );

      if (!response.ok) {
        throw new Error(
          "Trainer trainees API returned " + response.status
        );
      }

      var trainees = await response.json();

      if (!Array.isArray(trainees)) {
        throw new Error("Invalid trainees response");
      }

      state.trainees = trainees.map(function (trainee) {
        var score = Number(trainee.average_score || 0);

        var courseName =
          trainee.enrolled_courses &&
          trainee.enrolled_courses.length > 0
            ? trainee.enrolled_courses[0].title
            : "No course";

        return {
          id: trainee.trainee_id,
          name: trainee.name || "Unknown Trainee",
          initials: (trainee.name || "T")
            .split(" ")
            .map(function (part) {
              return part.charAt(0);
            })
            .join("")
            .substring(0, 2)
            .toUpperCase(),
          email: trainee.email || "",
          course: courseName,
          score: Math.round(score),
          status: score >= 80 ? "Strong" : "Needs improvement",
          progress: Math.round(score),
          last:
            trainee.assessment_attempts > 0
              ? "Assessment completed"
              : "No assessment yet",
          tone: score >= 80 ? "success" : "warning",
          enrolled_courses: trainee.enrolled_courses || [],
          assessment_attempts: trainee.assessment_attempts || 0,
          average_score: score,
          skill_gaps: trainee.skill_gaps || [],
          competency: trainee.competency || [],
          enrollment_date: trainee.enrollment_date,
          trainee_status: trainee.status
        };
      });

      console.log("Trainer Trainees:", state.trainees);

    } catch (error) {
      console.error(
        "Failed to load trainer trainees:",
        error
      );

      state.trainees = [];
    }
  }

  function statCards() {
    var stats = state.dashboardStats;

    if (!stats) {
      return [
        {
          label: "Total Courses",
          value: "—",
          sub: "Loading...",
          icon: "book",
          color: "blue"
        },
        {
          label: "Total Trainees",
          value: "—",
          sub: "Loading...",
          icon: "users",
          color: "violet"
        },
        {
          label: "Active Assessments",
          value: "—",
          sub: "Loading...",
          icon: "filequestion",
          color: "cyan"
        },
        {
          label: "Average Trainee Score",
          value: "—",
          sub: "Loading...",
          icon: "trending",
          color: "emerald"
        }
      ];
    }

    return [
      {
        label: "Total Courses",
        value: String(stats.total_courses ?? 0),
        sub: "Courses managed",
        icon: "book",
        color: "blue"
      },
      {
        label: "Total Trainees",
        value: String(stats.total_trainees ?? 0),
        sub: "Enrolled trainees",
        icon: "users",
        color: "violet"
      },
      {
        label: "Active Assessments",
        value: String(stats.active_assessments ?? 0),
        sub: "Currently active",
        icon: "filequestion",
        color: "cyan"
      },
      {
        label: "Average Trainee Score",
        value: Math.round(Number(stats.average_trainee_score ?? 0)) + "%",
        sub: "Average performance",
        icon: "trending",
        color: "emerald"
      }
    ];
  }

  function renderStatGrid(targetId) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = statCards().map(function (s) {
      var positive = s.sub.indexOf("+") === 0;
      return (
        '<div class="stat-card"><div class="stat-icon-row"><div class="stat-icon bg-' + s.color + '">' + svg(s.icon, 18) + '</div><span class="more-btn">' + svg("more", 17) + "</span></div>" +
        '<div class="stat-value">' + esc(s.value) + '</div>' +
        '<div class="stat-meta"><span class="stat-label">' + esc(s.label) + '</span><span class="stat-sub' + (positive ? " positive" : "") + '">' + esc(s.sub) + "</span></div></div>"
      );
    }).join("");
  }

  function renderDashboard() {
    document.getElementById("todayDate").textContent = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    renderStatGrid("statGrid");

    // quick actions
    document.getElementById("quickActions").innerHTML = [
      { label: "Create Course", icon: "plus", color: "blue", action: function () { openModal("course"); } },
      { label: "Create Assessment", icon: "filequestion", color: "violet", action: function () { openModal("assessment"); } },
      { label: "Upload Resource", icon: "upload", color: "cyan", action: function () { openModal("resource"); } },
      { label: "View Trainees", icon: "users", color: "emerald", action: function () { setActive("trainees"); } },
    ].map(function (qa, i) {
      return '<button class="qa-btn" data-qa="' + i + '"><span class="qa-icon bg-' + qa.color + '">' + svg(qa.icon, 15) + '</span><span class="qa-label">' + esc(qa.label) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#quickActions .qa-btn"), function (btn, i) {
      var actions = [function () { openModal("course"); }, function () { openModal("assessment"); }, function () { openModal("resource"); }, function () { setActive("trainees"); }];
      btn.addEventListener("click", actions[i]);
    });

    // perf bars (static illustrative trend + live avg as last bar)
    var trend = [42, 48, 45, 58, 62, 74];
    var avg = Math.round(state.trainees.reduce(function (s, t) { return s + t.score; }, 0) / Math.max(1, state.trainees.length));
    trend.push(avg > 0 ? avg + 10 > 100 ? 96 : avg + 10 : 88);
    var last6 = trend.slice(-6);
    document.getElementById("perfBars").innerHTML = last6.map(function (h, i) {
      return '<div class="bar' + (i === last6.length - 1 ? " is-last" : "") + '" style="height:' + h + '%"><span class="bar-tip">' + h + '%</span></div>';
    }).join("");

    // active assessments (top 3)
    document.getElementById("dashAssessmentsList").innerHTML = renderAssessmentRows(state.assessments.slice(0, 3));

    // competency mini
    document.getElementById("dashCompetencyList").innerHTML = renderCompetencyRows(state.competency);

    // trainees table (dashboard preview, respects search)
    renderTraineeTable("dashTraineeRows", filteredTrainees());

    // resources preview
    document.getElementById("dashResourceList").innerHTML = renderResourceRows(state.resources.slice(0, 3));

    // feedback preview
    document.getElementById("dashFeedbackList").innerHTML = renderFeedbackRows(state.feedback.slice(0, 3));
  }

  function filteredTrainees() {
    var q = state.query.trim().toLowerCase();
    if (!q) return state.trainees;
    return state.trainees.filter(function (t) {
      return t.name.toLowerCase().indexOf(q) !== -1 || t.course.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderAssessmentRows(list) {
    if (!list.length) return '<div class="empty-state">No assessments yet. Create one to get started.</div>';
    return list.map(function (a) {
      return (
        '<div class="list-row"><div class="row-left"><div class="row-icon bg-violet">' + svg("filetext", 15) + '</div><div><div class="row-title">' + esc(a.title) + '</div>' +
        '<div class="row-meta"><span>' + (a.questions && a.questions.length ? a.questions.length : a.numQuestions) + ' questions</span><span>&bull;</span><span>' + esc(a.time) + '</span><span>&bull;</span><span>Due ' + esc(a.deadline) + '</span></div></div></div>' +
        '<div class="row-right"><div class="prog-flex"><div class="row-progress-label">' + esc(a.completed) + '</div><div class="progress"><span class="bar-violet" style="width:' + a.progress + '%"></span></div></div>' +
        '<button class="more-btn" data-view-results="' + esc(a.title) + '">' + svg("more", 16) + "</button></div></div>"
      );
    }).join("");
  }

  function renderCompetencyRows(list) {
    var colors = ["emerald", "blue", "amber", "rose"];
    var labels = ["Strong", "Developing", "Gap"];
    return list.map(function (c) {
      var total = c.strong + c.developing + c.gap + c.major;
      return (
        '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">' + esc(c.skill) + '</span><span class="skill-count">' + total + ' trainees</span></div>' +
        '<div class="skill-stack"><div class="bar-emerald" style="width:' + c.strong + '%"></div><div class="bar-blue" style="width:' + c.developing + '%"></div><div class="bar-amber" style="width:' + c.gap + '%"></div><div class="bar-rose" style="width:' + c.major + '%"></div></div>' +
        '<div class="skill-legend"><span><i class="legend-dot bar-emerald"></i>Strong ' + c.strong + '</span><span><i class="legend-dot bar-blue"></i>Developing ' + c.developing + '</span><span><i class="legend-dot bar-amber"></i>Gap ' + c.gap + "</span></div></div>"
      );
    }).join("");
  }

  function renderTraineeTable(targetId, list) {
    var el = document.getElementById(targetId);
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<tr><td colspan="7"><div class="empty-state">No trainees match your search.</div></td></tr>';
      return;
    }
    el.innerHTML = list.map(function (t) {
      var badgeClass = t.tone === "success" ? "badge-success" : "badge-warning";
      var isFull = targetId === "traineesFullRows";
      return (
        '<tr><td><div class="trainee-cell"><div class="trainee-initials">' + esc(t.initials) + '</div><span class="trainee-name">' + esc(t.name) + '</span></div></td>' +
        (isFull ? '<td class="stat-label">' + esc(t.email) + "</td>" : "") +
        '<td class="stat-label">' + esc(t.course) + '</td><td style="font-weight:600;color:#cbd5e1">' + t.score + '%</td>' +
        '<td><span class="badge ' + badgeClass + '">' + esc(t.status) + '</span></td>' +
        '<td><div class="progress-cell"><div class="progress"><span class="bar-blue" style="width:' + t.progress + '%"></span></div><span class="progress-pct">' + t.progress + '%</span></div></td>' +
        '<td class="stat-sub">' + esc(t.last) + '</td><td><button class="row-action-btn" data-trainee-id="' + t.id + '">View profile</button></td></tr>'
      );
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll("[data-trainee-id]"), function (btn) {
      btn.addEventListener("click", function () { openTraineeProfile(btn.getAttribute("data-trainee-id")); });
    });
  }

  function renderResourceRows(list) {
    if (!list.length) return '<div class="empty-state">No resources yet.</div>';
    return list.map(function (r) {
      return (
        '<div class="list-row" style="align-items:center"><div class="row-left" style="align-items:center"><div class="row-icon bg-' + esc(r.color || "blue") + '">' + svg(r.icon || "filetext", 15) + '</div>' +
        '<div style="min-width:0;flex:1"><div class="row-title" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px">' + esc(r.name) + '</div><div class="resource-meta">' + esc(r.meta) + '</div></div></div>' +
        '<button class="more-btn">' + svg("more", 15) + "</button></div>"
      );
    }).join("");
  }

  function renderFeedbackRows(list) {
    if (!list.length) return '<div class="empty-state">No feedback yet.</div>';
    return list.map(function (f) {
      return '<div class="feedback-row"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="feedback-quote">&ldquo;' + esc(f.quote) + '&rdquo;</p><div class="feedback-name">' + esc(f.name) + "</div></div>";
    }).join("");
  }

  function openManageCourseModal(course) {
    if (!course) {
      notify("Course not found");
      return;
    }

    var body =
      '<div class="form-grid">' +

      '<div class="field wide">' +
        '<span>Course title</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#fff">' +
          esc(course.title) +
        '</div>' +
      '</div>' +

      '<div class="field">' +
        '<span>Skill / Subject</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#e2e8f0">' +
          esc(course.category || "General") +
        '</div>' +
      '</div>' +

      '<div class="field">' +
        '<span>Difficulty</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#e2e8f0">' +
          esc(course.level || "—") +
        '</div>' +
      '</div>' +

      '<div class="field">' +
        '<span>Duration</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#e2e8f0">' +
          esc(course.duration || "—") +
        '</div>' +
      '</div>' +

      '<div class="field">' +
        '<span>Enrolled trainees</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#e2e8f0">' +
          Number(course.trainees || 0) +
        '</div>' +
      '</div>' +

      '<div class="field wide">' +
        '<span>Description</span>' +
        '<div style="padding:12px 14px;min-height:70px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);color:#cbd5e1">' +
          esc(course.description || "No description provided.") +
        '</div>' +
      '</div>' +

      '<div class="field wide">' +
        '<span>Learning resource</span>' +
        '<div style="padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);overflow:hidden">' +
          (
            course.resource_url
              ? '<a href="' + esc(course.resource_url) + '" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:none;word-break:break-all">' +
                  esc(course.resource_url) +
                '</a>'
              : '<span style="color:#94a3b8">No resource URL</span>'
          ) +
        '</div>' +
      '</div>' +

      '</div>' +

      '<div class="modal-footer">' +
        '<button type="button" class="btn btn-ghost" id="mcClose">Close</button>' +
        '<button type="button" class="btn btn-outline" id="mcEdit">Edit course</button>' +
        '<button type="button" class="btn btn-primary" id="mcTrainees">View trainees</button>' +
      '</div>';

    showModal({
      eyebrow: "Course management",
      title: course.title,
      body: body,
      wide: true,

      onMount: function () {

        document
          .getElementById("mcClose")
          .addEventListener("click", closeModal);

        document
          .getElementById("mcEdit")
          .addEventListener("click", function () {
            closeModal();
            openModal("course", course);
          });

        document
          .getElementById("mcTrainees")
          .addEventListener("click", function () {
            closeModal();
            setActive("trainees");
          });
      }
    });
  }
    /* ================= MY COURSES ================= */
  function renderCoursesView() {
    var el = document.getElementById("coursesGrid");
    if (!state.courses.length) {
      el.innerHTML = '<div class="empty-state">No courses yet. Click &ldquo;Create Course&rdquo; to add your first one.</div>';
      return;
    }
    el.innerHTML = state.courses.map(function (c) {
      var statusClass = c.status === "Published" ? "badge-success" : "badge-draft";
      return (
        '<div class="course-card"><div class="course-card-top"><div class="course-icon bg-' + c.color + '">' + svg("book", 18) + '</div><span class="badge ' + statusClass + '">' + esc(c.status) + '</span></div>' +
        '<h3 class="course-title">' + esc(c.title) + '</h3><div class="course-meta"><span>' + esc(c.category) + '</span><span>&bull;</span><span>' + esc(c.level) + '</span></div>' +
        '<div class="course-stats"><span class="l">' + Number(c.trainees || 0) + ' trainees</span><span class="n">' + Number(c.completion || 0) + '% complete</span></div>' +
        '<div class="progress" style="margin-top:8px"><span class="bar-' + (c.color === "violet" ? "violet" : c.color === "cyan" ? "cyan" : "amber") + '" style="width:' + c.completion + '%"></span></div>' +
        '<div class="course-actions"><button class="btn btn-outline" data-manage="' + c.id + '">Manage course</button><button class="btn btn-ghost" data-view-trainees="' + c.id + '">View trainees</button></div>' +
        '<div class="course-actions" style="margin-top:8px"><button class="btn btn-outline" data-edit-course="' + c.id + '">Edit</button><button class="btn btn-outline" data-delete-course="' + c.id + '" style="color:#fb7185">Delete</button></div></div>'
      );
    }).join("");

    Array.prototype.forEach.call( el.querySelectorAll("[data-manage]"), function (b) { b.addEventListener("click", function () { var course = courseById( b.getAttribute("data-manage") ); openManageCourseModal(course); }); } );
    Array.prototype.forEach.call(el.querySelectorAll("[data-view-trainees]"), function (b) { b.addEventListener("click", function () { setActive("trainees"); }); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-edit-course]"), function (b) { b.addEventListener("click", function () { openModal("course", courseById(b.getAttribute("data-edit-course"))); }); });
    Array.prototype.forEach.call(
      el.querySelectorAll("[data-delete-course]"),
      function (b) {

        b.addEventListener("click", async function () {

          var id =
            b.getAttribute("data-delete-course");

          if (
            !confirm(
              "Delete this course? This cannot be undone."
            )
          ) {
            return;
          }

          try {

            var response = await fetch(
              TRAINER_API_BASE_URL +
              "/courses/" +
              encodeURIComponent(id),
              {
                method: "DELETE"
              }
            );

            if (!response.ok) {
              throw new Error(
                "Delete API returned " +
                response.status +
                ": " +
                await response.text()
              );
            }

            await loadTrainerCourses();

            renderCoursesView();

            notify("Course deleted successfully");

          } catch (error) {

            console.error(
              "Failed to delete course:",
              error
            );

            notify(
              "Could not delete course: " + error.message
            );
          }
        });
      }
    );
  }
  function courseById(id) {

    var found = null;

    state.courses.forEach(function (c) {

      if (String(c.id) === String(id)) {
        found = c;
      }

    });

    return found;
  }

  /* ================= ASSESSMENTS ================= */
  function renderAssessmentsView() {
    var el = document.getElementById("assessmentsFullList");
    if (!state.assessments.length) {
      el.innerHTML = '<div class="empty-state">No assessments yet. Click &ldquo;Create Assessment&rdquo; to add your first one.</div>';
      return;
    }
    el.innerHTML = state.assessments.map(function (a) {
      return (
        '<div class="list-row"><div class="row-left"><div class="row-icon bg-violet">' + svg("filetext", 15) + '</div><div><div class="row-title">' + esc(a.title) + ' <span class="stat-sub">&middot; ' + esc(a.subject || "") + '</span></div>' +
        '<div class="row-meta"><span>' + (a.questions && a.questions.length ? a.questions.length : a.numQuestions) + ' questions</span><span>&bull;</span><span>' + esc(a.time) + '</span><span>&bull;</span><span>Due ' + esc(a.deadline) + '</span><span>&bull;</span><span>' + esc(a.status || "Active") + '</span></div></div></div>' +
        '<div class="row-right" style="gap:16px"><div class="prog-flex"><div class="row-progress-label">' + esc(a.completed) + '</div><div class="progress"><span class="bar-violet" style="width:' + a.progress + '%"></span></div></div>' +
        '<button class="row-action-btn" data-results="' + a.id + '">Results</button><button class="more-btn" data-del-assessment="' + a.id + '">' + svg("x", 15) + "</button></div></div>"
      );
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll("[data-results]"), function (b) { b.addEventListener("click", function () { notify("Viewing results"); }); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-del-assessment]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del-assessment");
        if (!confirm("Delete this assessment?")) return;
        state.assessments = state.assessments.filter(function (a) { return a.id !== id; });
        persist("assessments");
        renderAssessmentsView();
        notify("Assessment deleted");
      });
    });
  }

  /* ================= QUESTION BANK ================= */
  function populateSubjectFilter() {
    var sel = document.getElementById("qbSubjectFilter");
    var subjects = Array.from(new Set(state.questionBank.map(function (q) { return q.subject; })));
    var current = sel.value;
    sel.innerHTML = '<option value="">All subjects</option>' + subjects.map(function (s) { return '<option' + (s === current ? " selected" : "") + '>' + esc(s) + "</option>"; }).join("");
  }
  function renderQuestionBankView() {
    populateSubjectFilter();
    var subjectFilter = document.getElementById("qbSubjectFilter").value;
    var difficultyFilter = document.getElementById("qbDifficultyFilter").value;
    var list = state.questionBank.filter(function (q) {
      return (!subjectFilter || q.subject === subjectFilter) && (!difficultyFilter || q.difficulty === difficultyFilter);
    });
    var el = document.getElementById("questionBankList");
    if (!list.length) {
      el.innerHTML = '<div class="empty-state">No questions match. Try a different filter or add a new question.</div>';
      return;
    }
    el.innerHTML = list.map(function (q) {
      return (
        '<div class="qb-row"><div style="min-width:0;flex:1"><div class="qb-q">' + esc(q.question) + '</div>' +
        '<div class="qb-meta"><span class="badge bg-blue">' + esc(q.subject) + '</span><span class="badge bg-amber">' + esc(q.difficulty) + '</span><span class="stat-sub">Correct: ' + esc(q.options[q.correctIndex] || "") + '</span></div></div>' +
        '<div class="qb-actions"><button data-edit-q="' + q.id + '">Edit</button><button class="danger" data-del-q="' + q.id + '">Delete</button></div></div>'
      );
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll("[data-edit-q]"), function (b) {
      b.addEventListener("click", function () { openModal("question", questionById(b.getAttribute("data-edit-q"))); });
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-del-q]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del-q");
        if (!confirm("Delete this question?")) return;
        state.questionBank = state.questionBank.filter(function (q) { return q.id !== id; });
        persist("questionBank");
        renderQuestionBankView();
        notify("Question deleted");
      });
    });
  }
  function questionById(id) {
    var found = null;
    state.questionBank.forEach(function (q) { if (q.id === id) found = q; });
    return found;
  }

  /* ================= TRAINEES ================= */
  function renderTraineesView() {
    var q = (document.getElementById("traineesSearch").value || "").trim().toLowerCase();
    var list = !q ? state.trainees : state.trainees.filter(function (t) { return t.name.toLowerCase().indexOf(q) !== -1 || t.course.toLowerCase().indexOf(q) !== -1 || t.email.toLowerCase().indexOf(q) !== -1; });
    renderTraineeTable("traineesFullRows", list);
  }

  function openTraineeProfile(id) {
    var t = null;
    state.trainees.forEach(function (x) { if (x.id === id) t = x; });
    if (!t) return;
    var skills = [
      ["AI / ML", Math.min(100, t.score)],
      ["Database", Math.min(100, t.score + 4)],
      ["Programming", Math.min(100, t.score + 7)],
      ["Communication", Math.min(100, t.score + 17)],
    ];
    var body =
      '<div class="profile-modal-top"><div class="avatar avatar-grad" style="width:48px;height:48px;font-size:16px">' + esc(t.initials) + '</div>' +
      '<div><div class="profile-modal-name">' + esc(t.name) + '</div><div class="profile-modal-meta">' + esc(t.course) + ' &middot; ' + esc(t.email) + '</div></div>' +
      '<div class="profile-modal-score"><div class="n">' + t.score + '%</div><div class="stat-sub' + (t.tone === "success" ? " positive" : "") + '">' + esc(t.status) + '</div></div></div>' +
      '<div class="skill-mini-grid">' + skills.map(function (s) {
        var val = Math.round(s[1]);
        return '<div class="skill-mini"><div class="skill-mini-top"><span class="stat-label">' + esc(s[0]) + '</span><span style="font-weight:600;color:#e2e8f0">' + val + '%</span></div><div class="progress"><span class="' + (val >= 80 ? "bar-emerald" : "bar-amber") + '" style="width:' + val + '%"></span></div><div class="skill-mini-gap">Target: 80% &middot; Gap: ' + Math.max(0, 80 - val) + '%</div></div>';
      }).join("") + "</div>" +
      '<div class="history-box"><div class="history-title">Recent assessment history</div>' +
      state.assessments.slice(0, 2).map(function (a) {
        return '<div class="history-row"><span class="stat-label">' + esc(a.title) + '</span><span style="font-weight:600;color:#e2e8f0">' + t.score + '%</span><span class="stat-sub">' + esc(a.deadline) + '</span></div>';
      }).join("") + "</div>";
    showModal({ eyebrow: "Trainee profile", title: t.name, body: body, wide: false });
  }

  /* ================= PERFORMANCE ================= */
  function renderPerformanceView() {
    renderStatGrid("perfStatGrid");
    document.getElementById("perfCourseProgress").innerHTML = state.courses.map(function (c) {
      return '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">' + esc(c.title) + '</span><span class="skill-count">' + c.trainees + ' trainees</span></div><div class="progress"><span class="bar-blue" style="width:' + c.completion + '%"></span></div></div>';
    }).join("") || '<div class="empty-state">No courses yet.</div>';
    document.getElementById("perfAssessmentPerf").innerHTML = state.assessments.map(function (a) {
      return '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">' + esc(a.title) + '</span><span class="skill-count">' + esc(a.completed) + '</span></div><div class="progress"><span class="bar-violet" style="width:' + a.progress + '%"></span></div></div>';
    }).join("") || '<div class="empty-state">No assessments yet.</div>';
  }

  /* ================= COMPETENCY ================= */
  function renderCompetencyView() {
    document.getElementById("competencyFullList").innerHTML = renderCompetencyRows(state.competency);
    document.getElementById("competencyActions").innerHTML = state.competency.map(function (c) {
      var majorGap = c.gap + c.major;
      var statusBadge = majorGap > 30 ? '<span class="badge badge-warning">Needs attention</span>' : '<span class="badge badge-success">On track</span>';
      return '<div class="list-row"><div class="row-left"><div class="row-icon bg-rose">' + svg("target", 15) + '</div><div><div class="row-title">' + esc(c.skill) + '</div><div class="row-meta">' + esc(c.action) + '</div></div></div><div class="row-right">' + statusBadge + '</div></div>';
    }).join("");
  }

  /* ================= RESOURCES ================= */
  function renderResourcesView() {
    var el = document.getElementById("resourcesGrid");
    if (!state.resources.length) {
      el.innerHTML = '<div class="empty-state">No resources yet. Click &ldquo;Add Resource&rdquo; to upload one.</div>';
      return;
    }
    el.innerHTML = state.resources.map(function (r) {
      var wrapped = r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:flex;align-items:center;gap:12px;flex:1;min-width:0">' : '<div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">';
      var closeTag = r.url ? "</a>" : "</div>";
      return (
        '<div class="resource-card">' + wrapped + '<div class="resource-icon bg-' + (r.color || "blue") + '">' + svg(r.icon || "filetext", 16) + '</div>' +
        '<div style="min-width:0"><div class="resource-name">' + esc(r.name) + '</div><div class="resource-meta">' + esc(r.meta) + '</div></div>' + closeTag +
        '<button class="resource-del" data-del-resource="' + r.id + '">' + svg("x", 16) + "</button></div>"
      );
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll("[data-del-resource]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del-resource");
        if (!confirm("Delete this resource?")) return;
        state.resources = state.resources.filter(function (r) { return r.id !== id; });
        persist("resources");
        renderResourcesView();
        if (state.active === "dashboard") renderDashboard();
        notify("Resource deleted");
      });
    });
  }

  /* ================= FEEDBACK ================= */
  function renderFeedbackView() {
    document.getElementById("feedbackFullList").innerHTML = renderFeedbackRows(state.feedback);
  }

  /* ================= ANALYTICS ================= */
  function renderAnalyticsView() {
    renderStatGrid("statGrid2");
    var trend = [42, 48, 45, 58, 62, 74, 69, 77, 74, 82, 78, 88];
    var last6 = trend.slice(-6);
    document.getElementById("analyticsBars").innerHTML = last6.map(function (h, i) {
      return '<div class="bar' + (i === last6.length - 1 ? " is-last" : "") + '" style="height:' + h + '%"><span class="bar-tip">' + h + '%</span></div>';
    }).join("");

    var strong = state.trainees.filter(function (t) { return t.score >= 80; }).length;
    var developing = state.trainees.filter(function (t) { return t.score >= 60 && t.score < 80; }).length;
    var gap = state.trainees.filter(function (t) { return t.score < 60; }).length;
    var total = Math.max(1, state.trainees.length);
    var dist = [
      { label: "Strong (80%+)", n: strong, color: "emerald" },
      { label: "Developing (60-79%)", n: developing, color: "blue" },
      { label: "Needs support (<60%)", n: gap, color: "rose" },
    ];
    document.getElementById("analyticsSkillDist").innerHTML = dist.map(function (d) {
      var pct = Math.round((d.n / total) * 100);
      return '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">' + d.label + '</span><span class="skill-count">' + d.n + ' trainees</span></div><div class="progress"><span class="bar-' + d.color + '" style="width:' + pct + '%"></span></div></div>';
    }).join("");

    document.getElementById("analyticsCourseCompletion").innerHTML = state.courses.map(function (c) {
      return '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">' + esc(c.title) + '</span><span class="skill-count">' + c.completion + '%</span></div><div class="progress"><span class="bar-' + (c.color === "violet" ? "violet" : c.color === "cyan" ? "cyan" : "amber") + '" style="width:' + c.completion + '%"></span></div></div>';
    }).join("") || '<div class="empty-state">No courses yet.</div>';
  }

  /* ================= NOTIFICATIONS ================= */
  function unreadCount() {
    return state.notifications.filter(function (n) { return !n.read; }).length;
  }
  function updateNotifBadge() {
    var badge = document.getElementById("navNotifBadge");
    var count = unreadCount();
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count ? "" : "none";
    }
    var dot = document.querySelector(".notif-dot");
    if (dot) dot.style.display = count ? "" : "none";
  }
  function renderNotifPanel() {
    var list = document.getElementById("notifPanelList");
    list.innerHTML = state.notifications.slice(0, 5).map(function (n) {
      return '<div class="notif-item">' + esc(n.text) + '<div class="notif-time">' + esc(n.time) + "</div></div>";
    }).join("") || '<div class="empty-state">You&rsquo;re all caught up.</div>';
  }
  function renderNotificationsView() {
    var el = document.getElementById("notificationsFullList");
    el.innerHTML = state.notifications.map(function (n) {
      return (
        '<div class="list-row" style="align-items:center"><div class="row-left" style="align-items:center"><div class="row-icon bg-blue">' + svg("zap", 15) + '</div>' +
        '<div><div class="row-title">' + esc(n.text) + (n.read ? "" : ' <span class="badge bg-blue" style="margin-left:6px">New</span>') + '</div><div class="row-meta">' + esc(n.time) + "</div></div></div></div>"
      );
    }).join("") || '<div class="empty-state">No notifications.</div>';
  }
  function markAllRead() {
    state.notifications.forEach(function (n) { n.read = true; });
    persist("notifications");
    updateNotifBadge();
    renderNotifPanel();
    if (state.active === "notifications") renderNotificationsView();
    notify("All notifications marked as read");
  }

  /* ================= PROFILE ================= */
  function renderProfileView() {
    var p = state.profile;
    var initials = (p.name || "").split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
    document.getElementById("profileAvatarLg").textContent = initials || "TR";
    document.getElementById("profileCardName").textContent = p.name || "";
    document.getElementById("profileCardRole").textContent = p.role || "";
    document.getElementById("pfName").value = p.name || "";
    document.getElementById("pfRole").value = p.role || "";
    document.getElementById("pfEmail").value = p.email || "";
    document.getElementById("pfPhone").value = p.phone || "";
    document.getElementById("pfSkill").value = p.skill || "";
    document.getElementById("pfBio").value = p.bio || "";

    document.getElementById("profileSnapshot").innerHTML =
      '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">Courses managed</span><span class="skill-count">' + state.courses.length + '</span></div></div>' +
      '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">Trainees</span><span class="skill-count">' + state.trainees.length + '</span></div></div>' +
      '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">Active assessments</span><span class="skill-count">' + state.assessments.length + '</span></div></div>' +
      '<div class="skill-row"><div class="skill-row-top"><span class="skill-name">Resources shared</span><span class="skill-count">' + state.resources.length + '</span></div></div>';

    updateHeaderProfile();
  }
  function updateHeaderProfile() {
    var p = state.profile;
    var initials = (p.name || "").split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase() || "TR";
    Array.prototype.forEach.call(document.querySelectorAll(".profile-name, .footer-profile-name"), function (el) { el.textContent = p.name || ""; });
    Array.prototype.forEach.call(document.querySelectorAll(".profile-role, .footer-profile-role"), function (el) { el.textContent = p.role || ""; });
    Array.prototype.forEach.call(document.querySelectorAll("#profileBtn .avatar, #footerProfileBtn .avatar"), function (el) { el.textContent = initials; });
    var welcomeName = document.getElementById("welcomeTrainerName");
    if (welcomeName) {
      welcomeName.textContent = p.name || "";
    }
  }

  /* ================= SETTINGS ================= */
  function renderSettingsView() {
    var s = state.settings;
    document.getElementById("stTimezone").value = s.timezone || "";
    document.getElementById("stTimeLimit").value = s.timeLimit || "";
    var prefs = [
      ["assessmentDeadlines", "Assessment deadlines", "Get notified as deadlines approach"],
      ["newEnrolments", "New enrolments", "When a trainee joins one of your courses"],
      ["feedbackAlerts", "Feedback alerts", "When trainees leave new feedback"],
      ["weeklyDigest", "Weekly digest", "A weekly summary of workspace activity"],
    ];
    document.getElementById("settingsToggles").innerHTML = prefs.map(function (p) {
      var on = !!s.notifPrefs[p[0]];
      return (
        '<div class="toggle-row"><div><div class="toggle-label">' + p[1] + '</div><div class="toggle-desc">' + p[2] + '</div></div>' +
        '<button class="switch' + (on ? " on" : "") + '" data-toggle="' + p[0] + '" aria-pressed="' + on + '"></button></div>'
      );
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("#settingsToggles .switch"), function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-toggle");
        state.settings.notifPrefs[key] = !state.settings.notifPrefs[key];
        persist("settings");
        btn.classList.toggle("on");
      });
    });
  }

  /* ---------------- MODALS ---------------- */
  function showModal(opts) {
    var root = document.getElementById("modalRoot");
    root.innerHTML =
      '<div class="modal-shell' + (opts.wide ? " wide" : "") + '"><div class="modal-header"><div><p class="modal-eyebrow">' + esc(opts.eyebrow) + '</p><h2 class="modal-title">' + esc(opts.title) + '</h2></div>' +
      '<button class="modal-close" id="modalCloseBtn">' + svg("x", 18) + '</button></div><div class="modal-body">' + opts.body + "</div></div>";
    root.classList.remove("hidden");
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    root.addEventListener("mousedown", function (e) {
      if (e.target === root) closeModal();
    });
    document.addEventListener("keydown", escCloseHandler);
    if (typeof opts.onMount === "function") opts.onMount(root);
  }
  function escCloseHandler(e) {
    if (e.key === "Escape") closeModal();
  }
  function closeModal() {
    var root = document.getElementById("modalRoot");
    root.classList.add("hidden");
    root.innerHTML = "";
    document.removeEventListener("keydown", escCloseHandler);
  }

  function openModal(type, payload) {
    if (type === "course") openCourseModal(payload);
    else if (type === "assessment") openAssessmentModal(payload);
    else if (type === "question") openQuestionModal(payload);
    else if (type === "resource") openResourceModal(payload);
  }

  function field(id, label, placeholder, wide, type, value) {
    type = type || "text";
    return (
      '<label class="field' + (wide ? " wide" : "") + '"><span>' + esc(label) + '</span><input id="' + id + '" type="' + type + '" placeholder="' + esc(placeholder || "") + '" value="' + esc(value || "") + '" /></label>'
    );
  }

  /* ---- Create / Edit Course ---- */
  function openCourseModal(existing) {

    var isEdit = !!existing;

    var skillOptions = '<option value="">Select skill / subject</option>';

    if (Array.isArray(state.skills)) {

      state.skills.forEach(function (skill) {

        var selected =
          existing &&
          Number(existing.skill_id) === Number(skill.id)
            ? " selected"
            : "";

        skillOptions +=
          '<option value="' +
          esc(skill.id) +
          '"' +
          selected +
          '>' +
          esc(skill.name) +
          '</option>';
      });
    }

    var body =
      '<div class="form-grid">' +

      field(
        "cfTitle",
        "Course title",
        "e.g. Deep Learning with PyTorch",
        true,
        "text",
        existing && existing.title
      ) +

      '<label class="field">' +
        '<span>Skill / subject</span>' +
        '<select id="cfSkill">' +
          skillOptions +
        '</select>' +
      '</label>' +

      field(
        "cfLevel",
        "Difficulty",
        "Intermediate",
        true,
        "text",
        existing && existing.level
      ) +

      field(
        "cfDuration",
        "Duration",
        "8 weeks",
        true,
        "text",
        existing && existing.duration
      ) +

      field(
        "cfResourceUrl",
        "Learning resource URL",
        "https://...",
        true,
        "url",
        existing && existing.resource_url
      ) +

      '<label class="field wide">' +
        '<span>Description</span>' +
        '<textarea id="cfDescription" rows="3" placeholder="What will trainees learn?">' +
          esc(existing && existing.description) +
        '</textarea>' +
      '</label>' +

      '</div>' +

      '<div class="upload-box">' +
        '<div class="upload-box-row">' +
          svg("upload", 17) +
          '<div>' +
            '<div class="upload-title">Learning resources</div>' +
            '<div class="upload-sub">Use the resource URL above for the prototype</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="modal-footer">' +
        '<button type="button" class="btn btn-ghost" id="cfCancel">Cancel</button>' +
        '<button type="button" class="btn btn-primary" id="cfSave">' +
          (isEdit ? "Save changes" : "Create course") +
        '</button>' +
      '</div>';

    showModal({
      eyebrow: "Course builder",
      title: isEdit
        ? "Edit course"
        : "Create a new course",
      body: body,

      onMount: function () {

        document
          .getElementById("cfCancel")
          .addEventListener("click", closeModal);

        document
          .getElementById("cfSave")
          .addEventListener("click", function () {
            saveCourse(existing);
          });
      }
    });
  }
  async function saveCourse(existing) {

    var title =
      document.getElementById("cfTitle").value.trim();

    var description =
      document.getElementById("cfDescription").value.trim();

    var skillId =
      Number(document.getElementById("cfSkill").value);

    var difficulty =
      document.getElementById("cfLevel").value.trim();

    var duration =
      document.getElementById("cfDuration").value.trim();

    var resourceUrl =
      document.getElementById("cfResourceUrl").value.trim();

    var trainerId =
      localStorage.getItem("userId");

    if (!title) {
      notify("Please enter a course title");
      return;
    }

    if (!skillId) {
      notify("Please select a skill / subject");
      return;
    }

    if (!difficulty) {
      notify("Please enter the difficulty");
      return;
    }

    if (!duration) {
      notify("Please enter the duration");
      return;
    }

    if (!resourceUrl) {
      notify("Please enter a resource URL");
      return;
    }

    if (!trainerId) {
      notify("Trainer session not found");
      return;
    }

    var payload = {
      title: title,
      description: description,
      difficulty: difficulty,
      duration: duration,
      resource_url: resourceUrl,
      skill_id: skillId,
      trainer_id: trainerId
    };

    try {

      var url = TRAINER_API_BASE_URL + "/courses";

      var method = "POST";

      if (existing) {
        url =
          TRAINER_API_BASE_URL +
          "/courses/" +
          encodeURIComponent(existing.id);

        method = "PATCH";
      }

      var response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      });

      var responseText =
        await response.text();

      if (!response.ok) {

        console.error(
          "Course save failed:",
          response.status,
          responseText
        );

        throw new Error(
          "Course API returned " +
          response.status +
          ": " +
          responseText
        );
      }

      console.log(
        "Course API response:",
        responseText
      );

      closeModal();

      await loadTrainerCourses();

      if (state.active === "courses") {
        renderCoursesView();
      }

      if (state.active === "dashboard") {
        renderDashboard();
      }

      notify(
        existing
          ? "Course updated successfully"
          : "Course created successfully"
      );

    } catch (error) {

      console.error(
        "Failed to save course:",
        error
      );

      notify(
        "Could not save course: " + error.message
      );
    }
  }
  /* ---- Create Assessment ---- */
  var assessmentQuestionCount = 1;
  function openAssessmentModal(existing) {
    assessmentQuestionCount = existing && existing.questions && existing.questions.length ? existing.questions.length : 1;
    var body =
      '<div class="form-grid">' +
      field("asTitle", "Assessment title", "e.g. Neural Networks Check-in", true, "text", existing && existing.title) +
      '<label class="field"><span>Subject / skill</span><select id="asSubject"><option value="">Select a skill</option>' +
      (Array.isArray(state.skills) ? state.skills.map(function (skill) {
        var selected = existing && Number(existing.skill_id) === Number(skill.id)
          ? " selected"
          : (existing && existing.subject && existing.subject.toLowerCase() === String(skill.name).toLowerCase()
              ? " selected"
              : "");
        return '<option value="' + esc(skill.name) + '" data-skill-id="' + skill.id + '"' + selected + '>' +
          esc(skill.name) +
          '</option>';
      }).join("") : "") +
      '</select></label>' +
      field("asNumQ", "Number of questions", "20", false, "number", existing && existing.numQuestions) +
      field("asTime", "Time limit", "20 minutes", false, "text", existing && existing.time) +
      field("asDeadline", "Deadline", "September 20, 2026", false, "text", existing && existing.deadline) +
      '<label class="field wide"><span>Description</span><textarea id="asDescription" rows="2" placeholder="Add a short description">' + esc(existing && existing.description) + "</textarea></label>" +
      "</div>" +
      '<div class="qbuilder"><div class="qbuilder-head"><div><div class="qbuilder-title">Questions</div><div class="qbuilder-sub">Build your assessment question by question</div></div><span class="qbuilder-count" id="qCountBadge">' + assessmentQuestionCount + " added</span></div>" +
      '<div id="qBlocks"></div>' +
      '<button type="button" class="add-question-btn" id="addQuestionBtn">' + svg("plus", 13) + " Add another question</button></div>" +
      '<div class="modal-footer"><button type="button" class="btn btn-ghost" id="asCancel">Cancel</button><button type="button" class="btn btn-primary" id="asPublish">Publish assessment</button></div>';

    showModal({
      eyebrow: "Assessment builder",
      title: existing ? "Edit assessment" : "Create assessment",
      wide: true,
      body: body,
      onMount: function () {
        renderQBlocks(existing && existing.questions);
        document.getElementById("addQuestionBtn").addEventListener("click", function () {
          assessmentQuestionCount++;
          document.getElementById("qCountBadge").textContent = assessmentQuestionCount + " added";
          renderQBlocks(null, true);
        });
        document.getElementById("asCancel").addEventListener("click", closeModal);
        document.getElementById("asPublish").addEventListener("click", function () { saveAssessment(existing); });
      },
    });
  }
  function renderQBlocks(existingQuestions, appendOnly) {
    var wrap = document.getElementById("qBlocks");
    var startIndex = appendOnly ? wrap.children.length : 0;
    if (!appendOnly) wrap.innerHTML = "";
    for (var i = startIndex; i < assessmentQuestionCount; i++) {
      var eq = existingQuestions && existingQuestions[i];
      var block = document.createElement("div");
      block.className = "qblock";
      block.setAttribute("data-qindex", i);
      block.innerHTML =
        '<div class="qblock-head"><span class="stat-label">Question ' + (i + 1) + '</span>' + (i > 0 ? '<button type="button" class="qblock-remove" data-remove-q>' + svg("x", 13) + " Remove</button>" : "") + '</div>' +
        '<label class="field"><input type="text" class="qb-question" placeholder="Type your question here..." value="' + esc(eq && eq.text) + '" /></label>' +
        '<div class="options-grid">' + [0, 1, 2, 3].map(function (oi) {
          var letter = String.fromCharCode(65 + oi);
          var val = eq && eq.options ? eq.options[oi] : "";
          var checked = eq ? eq.correctIndex === oi : oi === 0;
          return '<label class="option-field"><input type="radio" name="correct-' + i + '" value="' + oi + '"' + (checked ? " checked" : "") + ' /><input type="text" class="qb-option" placeholder="Option ' + letter + '" value="' + esc(val) + '" /></label>';
        }).join("") + "</div>";
      wrap.appendChild(block);
    }
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-remove-q]"), function (btn) {
      btn.addEventListener("click", function () {
        btn.closest(".qblock").remove();
        assessmentQuestionCount = wrap.children.length;
        document.getElementById("qCountBadge").textContent = assessmentQuestionCount + " added";
      });
    });
  }
  async function saveAssessment(existing) {
    var title = document.getElementById("asTitle").value.trim();

    if (!title) {
      notify("Please enter an assessment title");
      return;
    }

    // Get questions from the ACTUAL question builder
    var blocks = document.querySelectorAll("#qBlocks .qblock");
    var questions = [];

    Array.prototype.forEach.call(blocks, function (block) {
      var textEl = block.querySelector(".qb-question");

      if (!textEl) return;

      var text = textEl.value.trim();

      var options = Array.prototype.map.call(
        block.querySelectorAll(".qb-option"),
        function (input) {
          return input.value.trim();
        }
      );

      var checkedRadio = block.querySelector(
        'input[type="radio"]:checked'
      );

      var correctIndex = checkedRadio
        ? Number(checkedRadio.value)
        : 0;

      if (text) {
        questions.push({
          text: text,
          options: options,
          correctIndex: correctIndex
        });
      }
    });

    // IMPORTANT: don't continue if no questions were actually detected
    if (questions.length === 0) {
      notify("Please add at least one question");
      return;
    }

    var trainerId = localStorage.getItem("userId");

    if (!trainerId) {
      notify("Trainer ID not found. Please login again.");
      return;
    }

    var subject =
      document.getElementById("asSubject").value.trim();

    if (!subject) {
      notify("Please enter a subject / skill");
      return;
    }

    // Find matching skill from backend-loaded skills
    var skill = Array.isArray(state.skills)
      ? state.skills.find(function (s) {
          return String(s.name).trim().toLowerCase() ===
            subject.toLowerCase();
        })
      : null;

    if (!skill) {
      notify(
        'Skill "' +
          subject +
          '" was not found. Use the exact skill name.'
      );
      return;
    }

    var description =
      document.getElementById("asDescription").value.trim();

    var deadline =
      document.getElementById("asDeadline").value.trim();

    var apiUrl =
      TRAINER_API_BASE_URL + "/assessments";

    try {
      var assessment;

      // -----------------------------
      // CREATE ASSESSMENT
      // -----------------------------
      if (!existing) {
        var assessmentResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: title,
            description: description,
            skill_id: Number(skill.id),
            trainer_id: trainerId,
            total_questions: questions.length,
            deadline: deadline || null
          })
        });

        if (!assessmentResponse.ok) {
          var errorText = await assessmentResponse.text();
          throw new Error(
            "Assessment creation failed: " +
              assessmentResponse.status +
              " " +
              errorText
          );
        }

        var assessmentData = await assessmentResponse.json();
        assessment = Array.isArray(assessmentData)
          ? assessmentData[0]
          : assessmentData;

        if (!assessment || !assessment.id) {
          throw new Error("Assessment was created but no assessment ID was returned.");
        }

        console.log("Created assessment:", assessment);
      }

      // -----------------------------
      // EDIT ASSESSMENT
      // -----------------------------
      else {
        var assessmentResponse = await fetch(
          apiUrl + "/" + existing.id,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: title,
              description: description,
              skill_id: Number(skill.id),
              trainer_id: trainerId,
              total_questions: questions.length,
              deadline: deadline || null
            })
          }
        );

        if (!assessmentResponse.ok) {
          var errorText = await assessmentResponse.text();
          throw new Error(
            "Assessment update failed: " +
              assessmentResponse.status +
              " " +
              errorText
          );
        }

        var assessmentData = await assessmentResponse.json();
        assessment = Array.isArray(assessmentData)
          ? assessmentData[0]
          : assessmentData;

        if (!assessment || !assessment.id) {
          throw new Error("Assessment was updated but no assessment ID was returned.");
        }

        console.log("Updated assessment:", assessment);

        // Get existing questions
        var oldQuestionsResponse = await fetch(
          TRAINER_API_BASE_URL + "/questions"
        );

        if (oldQuestionsResponse.ok) {
          var allQuestions = await oldQuestionsResponse.json();

          var oldQuestions = Array.isArray(allQuestions)
            ? allQuestions.filter(function (q) {
                return Number(q.assessment_id) ===
                  Number(existing.id);
              })
            : [];

          // Delete old questions
          for (var i = 0; i < oldQuestions.length; i++) {
            await fetch(
              TRAINER_API_BASE_URL +
                "/questions/" +
                oldQuestions[i].id,
              {
                method: "DELETE"
              }
            );
          }
        }
      }

      var assessmentId = existing
        ? Number(existing.id)
        : Number(assessment.id);

      if (!Number.isInteger(assessmentId)) {
        throw new Error("Invalid assessment ID: " + assessmentId);
      }
      // -----------------------------
      // CREATE QUESTIONS
      // -----------------------------
      for (var q = 0; q < questions.length; q++) {
        var question = questions[q];

        var questionResponse = await fetch(
          TRAINER_API_BASE_URL + "/questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              assessment_id: Number(assessmentId),
              question_text: question.text,
              option_a: question.options[0] || "",
              option_b: question.options[1] || "",
              option_c: question.options[2] || "",
              option_d: question.options[3] || "",
              correct_option: String.fromCharCode(
                65 + question.correctIndex
              ),
              marks: 1
            })
          }
        );

        if (!questionResponse.ok) {
          var questionError =
            await questionResponse.text();

          throw new Error(
            "Question " +
              (q + 1) +
              " failed: " +
              questionResponse.status +
              " " +
              questionError
          );
        }
      }

      // -----------------------------
      // UPDATE LOCAL STATE
      // -----------------------------
      var localAssessment = {
        id: assessmentId,
        title: title,
        subject: subject,
        numQuestions: questions.length,
        time:
          document.getElementById("asTime").value.trim() ||
          "20 minutes",
        deadline: deadline || "TBD",
        description: description,
        questions: questions,
        completed: existing
          ? existing.completed
          : "0 / 0",
        progress: existing
          ? existing.progress
          : 0,
        status: "Active"
      };

      if (existing) {
        state.assessments = state.assessments.map(
          function (a) {
            return a.id === existing.id
              ? localAssessment
              : a;
          }
        );
      } else {
        state.assessments.push(localAssessment);
      }

      persist("assessments");

      closeModal();

      if (state.active === "assessments") {
        renderAssessmentsView();
      }

      if (state.active === "dashboard") {
        renderDashboard();
      }

      notify(
        existing
          ? "Assessment updated successfully"
          : "Assessment published successfully"
      );

      console.log(
        "Assessment saved with",
        questions.length,
        "questions"
      );

    } catch (error) {
      console.error("Assessment save error:", error);
      notify(error.message || "Failed to save assessment");
    }
  }

  /* ---- Question Bank add/edit ---- */
  function openQuestionModal(existing) {
    var body =
      '<div class="form-grid">' +
      field("qfSubject", "Subject / category", "Machine Learning", true, "text", existing && existing.subject) +
      '<label class="field"><span>Difficulty</span><select id="qfDifficulty"><option' + (!existing || existing.difficulty === "Easy" ? " selected" : "") + '>Easy</option><option' + (existing && existing.difficulty === "Medium" ? " selected" : "") + '>Medium</option><option' + (existing && existing.difficulty === "Hard" ? " selected" : "") + '>Hard</option></select></label>' +
      '<label class="field wide"><span>Question</span><textarea id="qfQuestion" rows="2" placeholder="Type the question...">' + esc(existing && existing.question) + '</textarea></label>' +
      "</div>" +
      '<div class="options-grid" style="margin-top:16px">' + [0, 1, 2, 3].map(function (oi) {
        var letter = String.fromCharCode(65 + oi);
        var val = existing && existing.options ? existing.options[oi] : "";
        var checked = existing ? existing.correctIndex === oi : oi === 0;
        return '<label class="option-field"><input type="radio" name="qfCorrect" value="' + oi + '"' + (checked ? " checked" : "") + ' /><input type="text" class="qf-option" placeholder="Option ' + letter + '" value="' + esc(val) + '" /></label>';
      }).join("") + "</div>" +
      '<div class="modal-footer"><button type="button" class="btn btn-ghost" id="qfCancel">Cancel</button><button type="button" class="btn btn-primary" id="qfSave">' + (existing ? "Save changes" : "Add question") + "</button></div>";
    showModal({
      eyebrow: "Question bank",
      title: existing ? "Edit question" : "Add question",
      body: body,
      onMount: function () {
        document.getElementById("qfCancel").addEventListener("click", closeModal);
        document.getElementById("qfSave").addEventListener("click", function () { saveQuestion(existing); });
      },
    });
  }
  function saveQuestion(existing) {
    var question = document.getElementById("qfQuestion").value.trim();
    if (!question) { notify("Please enter a question"); return; }
    var options = Array.prototype.map.call(document.querySelectorAll(".qf-option"), function (i) { return i.value.trim(); });
    var checkedRadio = document.querySelector('input[name="qfCorrect"]:checked');
    var data = {
      id: existing ? existing.id : uid("q"),
      question: question,
      subject: document.getElementById("qfSubject").value.trim() || "General",
      difficulty: document.getElementById("qfDifficulty").value,
      options: options,
      correctIndex: checkedRadio ? Number(checkedRadio.value) : 0,
    };
    if (existing) {
      state.questionBank = state.questionBank.map(function (q) { return q.id === existing.id ? data : q; });
    } else {
      state.questionBank.push(data);
    }
    persist("questionBank");
    closeModal();
    renderQuestionBankView();
    notify(existing ? "Question updated" : "Question added to bank");
  }

  /* ---- Resource upload ---- */
  function openResourceModal() {
    var body =
      '<div class="form-grid">' +
      field("rfName", "Resource name", "e.g. SQL Joins cheat sheet", true) +
      '<label class="field"><span>Resource type</span><select id="rfType"><option>PDF</option><option>Video</option><option>Presentation</option><option>Link</option></select></label>' +
      field("rfCourse", "Course", "Select course", false) +
      field("rfUrl", "Resource URL", "https://...", true) +
      '<label class="field wide"><span>Description</span><textarea id="rfDescription" rows="2" placeholder="Add a short description"></textarea></label>' +
      "</div>" +
      '<div class="upload-box accent">' + svg("upload", 22) + '<div class="upload-title" style="margin-top:8px">Drop your file here or browse</div><div class="upload-sub">PDF, PPTX, MP4 up to 50MB</div></div>' +
      '<div class="modal-footer"><button type="button" class="btn btn-ghost" id="rfCancel">Cancel</button><button type="button" class="btn btn-primary" id="rfSave">Upload resource</button></div>';
    showModal({
      eyebrow: "Resource library",
      title: "Upload resource",
      body: body,
      onMount: function () {
        document.getElementById("rfCancel").addEventListener("click", closeModal);
        document.getElementById("rfSave").addEventListener("click", saveResource);
      },
    });
  }
  function saveResource() {
    var name = document.getElementById("rfName").value.trim();
    if (!name) { notify("Please enter a resource name"); return; }
    var type = document.getElementById("rfType").value;
    var iconMap = { PDF: "filetext", Video: "activity", Presentation: "briefcase", Link: "folder" };
    var colorMap = { PDF: "rose", Video: "violet", Presentation: "amber", Link: "cyan" };
    var data = {
      id: uid("r"),
      name: name,
      type: type,
      url: document.getElementById("rfUrl").value.trim(),
      meta: type + (document.getElementById("rfCourse").value.trim() ? " · " + document.getElementById("rfCourse").value.trim() : ""),
      icon: iconMap[type] || "filetext",
      color: colorMap[type] || "blue",
    };
    state.resources.unshift(data);
    persist("resources");
    closeModal();
    renderResourcesView();
    if (state.active === "dashboard") renderDashboard();
    notify("Resource added to your library");
  }

  /* ---------------- header panels ---------------- */
  function closePanels() {
    document.getElementById("notifPanel").classList.add("hidden");
    document.getElementById("profilePanel").classList.add("hidden");
  }

  /* ---------------- wire up static UI ---------------- */
  function wireNav() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        setActive(el.getAttribute("data-view"));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-open-modal]"), function (el) {
      el.addEventListener("click", function () { openModal(el.getAttribute("data-open-modal")); });
    });
  }

  function wireHeader() {
    document.getElementById("menuBtn").addEventListener("click", function () {
      document.getElementById("sidebar").classList.add("open");
      document.getElementById("mobileOverlay").classList.add("show");
    });
    document.getElementById("mobileOverlay").addEventListener("click", function () {
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("mobileOverlay").classList.remove("show");
    });

    document.getElementById("notifBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      document.getElementById("profilePanel").classList.add("hidden");
      document.getElementById("notifPanel").classList.toggle("hidden");
    });
    document.getElementById("profileBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      document.getElementById("notifPanel").classList.add("hidden");
      document.getElementById("profilePanel").classList.toggle("hidden");
    });
    document.body.addEventListener("click", closePanels);
    document.getElementById("notifPanel").addEventListener("click", function (e) { e.stopPropagation(); });
    document.getElementById("profilePanel").addEventListener("click", function (e) { e.stopPropagation(); });

    document.getElementById("markAllRead").addEventListener("click", markAllRead);
    document.getElementById("markAllReadFull").addEventListener("click", markAllRead);
    document.getElementById("logoutBtn").addEventListener("click", function () {
      notify("Logged out ");
      logoutUser();
    });
    document.getElementById("tipInsightsBtn").addEventListener("click", function () { setActive("performance"); });

    var searchDebounce;
    document.getElementById("globalSearch").addEventListener("input", function (e) {
      state.query = e.target.value;
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function () {
        if (state.active === "dashboard") renderDashboard();
        else if (state.active === "courses") {
          // simple course filter via re-render with query applied client side
          renderCoursesView();
        } else if (state.active === "trainees") {
          document.getElementById("traineesSearch").value = state.query;
          renderTraineesView();
        }
      }, 150);
    });
    document.getElementById("dashTraineeSearch").addEventListener("input", function (e) {
      state.query = e.target.value;
      renderTraineeTable("dashTraineeRows", filteredTrainees());
    });
    document.getElementById("traineesSearch").addEventListener("input", renderTraineesView);
  }

  function wireQuestionBankFilters() {
    document.getElementById("qbSubjectFilter").addEventListener("change", renderQuestionBankView);
    document.getElementById("qbDifficultyFilter").addEventListener("change", renderQuestionBankView);
  }

  function wireProfileForm() {
    document.getElementById("profileForm").addEventListener("submit", function (e) {
      e.preventDefault();
      state.profile = {
        name: document.getElementById("pfName").value.trim() || state.profile.name,
        role: document.getElementById("pfRole").value.trim() || state.profile.role,
        email: document.getElementById("pfEmail").value.trim(),
        phone: document.getElementById("pfPhone").value.trim(),
        skill: document.getElementById("pfSkill").value.trim(),
        bio: document.getElementById("pfBio").value.trim(),
      };
      persist("profile");
      renderProfileView();
      notify("Profile updated");
    });
  }

  function wireSettingsForm() {
    document.getElementById("settingsForm").addEventListener("submit", function (e) {
      e.preventDefault();
      state.settings.timezone = document.getElementById("stTimezone").value.trim();
      state.settings.timeLimit = Number(document.getElementById("stTimeLimit").value) || state.settings.timeLimit;
      persist("settings");
      notify("Settings saved");
    });
    document.getElementById("resetDataBtn").addEventListener("click", function () {
      if (!confirm("Reset all prototype data back to the original demo content? This clears everything you've added.")) return;
      Object.keys(KEYS).forEach(function (k) { localStorage.removeItem(KEYS[k]); });
      location.reload();
    });
  }

  /* ---------------- init ---------------- */
  async function init() {
    wireNav();
    wireHeader();
    wireQuestionBankFilters();
    wireProfileForm();
    wireSettingsForm();

    
    updateNotifBadge();
    renderNotifPanel();

    await Promise.all([
      loadTrainerDashboardStats(),
      loadTrainerSkills(),
    ]);

    updateHeaderProfile();
    await loadTrainerCourses();
    await loadTrainerAssessments();
    await loadTrainerTrainees();
    setActive("dashboard");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
