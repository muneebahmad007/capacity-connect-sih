/* =========================================================
   CAPACITY CONNECT — Admin Dashboard (Vanilla JavaScript)
   No build step. No dependencies. Works seamlessly via file://
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Storage Keys ---------------- */
  var KEYS = {
    users: "cc_admin_users",
    courses: "cc_admin_courses",
    assessments: "cc_admin_assessments",
    certificates: "cc_admin_certificates",
    announcements: "cc_admin_announcements",
    trainers: "cc_admin_trainers",
    notifications: "cc_admin_notifications",
    profile: "cc_admin_profile",
    settings: "cc_admin_settings"
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
      /* storage unavailable in restricted sandbox */
    }
  }

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- Seed Data ---------------- */
  var SEED_USERS = [
    { id: uid("u"), name: "Muneeb Ahmad", initials: "MA", email: "muneeb@example.com", role: "Trainee", status: "Active", joined: "Aug 12, 2026", color: "cyan", score: 85 },
    { id: uid("u"), name: "Daksh Jain", initials: "DJ", email: "daksh@example.com", role: "Trainer", status: "Active", joined: "Jul 15, 2026", color: "violet", score: 92 },
    { id: uid("u"), name: "Yash Jain", initials: "YJ", email: "yash@example.com", role: "Trainee", status: "Pending Approval", joined: "Sep 03, 2026", color: "amber", score: 0 },
    { id: uid("u"), name: "Riya Sharma", initials: "RS", email: "riya@example.com", role: "Trainee", status: "Active", joined: "Aug 28, 2026", color: "blue", score: 78 },
    { id: uid("u"), name: "Dr. Arjun Sharma", initials: "AS", email: "arjun.sharma@capacityconnect.io", role: "Trainer", status: "Active", joined: "Jan 10, 2026", color: "violet", score: 96 },
    { id: uid("u"), name: "Priya Mehta", initials: "PM", email: "priya.mehta@capacityconnect.io", role: "Trainer", status: "Active", joined: "Feb 18, 2026", color: "cyan", score: 94 },
    { id: uid("u"), name: "Rahul Verma", initials: "RV", email: "rahul.verma@example.com", role: "Trainer", status: "Pending Approval", joined: "Sep 01, 2026", color: "rose", score: 0 },
    { id: uid("u"), name: "Ananya Roy", initials: "AR", email: "ananya.roy@example.com", role: "Trainee", status: "Active", joined: "Aug 05, 2026", color: "emerald", score: 88 },
    { id: uid("u"), name: "Kunal Ghosh", initials: "KG", email: "kunal.ghosh@example.com", role: "Trainee", status: "Disabled", joined: "Jun 20, 2026", color: "rose", score: 45 }
  ];

  var SEED_COURSES = [
    { id: uid("c"), title: "Machine Learning Fundamentals", trainer: "Dr. Arjun Sharma", skill: "AI / ML", enrollments: 124, completion: 68, status: "Published", color: "violet", duration: "8 weeks", level: "Intermediate" },
    { id: uid("c"), title: "Database Management Essentials", trainer: "Priya Mehta", skill: "Database", enrollments: 96, completion: 72, status: "Published", color: "cyan", duration: "6 weeks", level: "Beginner" },
    { id: uid("c"), title: "Advanced Cybersecurity", trainer: "Rahul Verma", skill: "Cybersecurity", enrollments: 78, completion: 41, status: "Pending Approval", color: "rose", duration: "10 weeks", level: "Advanced" },
    { id: uid("c"), title: "Cloud Architecture & DevOps", trainer: "Dr. Arjun Sharma", skill: "Cloud Computing", enrollments: 64, completion: 55, status: "Published", color: "blue", duration: "8 weeks", level: "Intermediate" },
    { id: uid("c"), title: "Enterprise Communication Mastery", trainer: "Neha Sen", skill: "Communication", enrollments: 150, completion: 81, status: "Published", color: "emerald", duration: "4 weeks", level: "All Levels" },
    { id: uid("c"), title: "Full Stack Web Architecture", trainer: "Daksh Jain", skill: "Programming", enrollments: 112, completion: 75, status: "Draft", color: "amber", duration: "12 weeks", level: "Intermediate" },
    { id: uid("c"), title: "Legacy Systems Migration", trainer: "Priya Mehta", skill: "Database", enrollments: 45, completion: 38, status: "Archived", color: "slate", duration: "6 weeks", level: "Advanced" }
  ];

  var SEED_ASSESSMENTS = [
    { id: uid("a"), title: "AI & ML Fundamentals", skill: "AI / ML", trainer: "Dr. Arjun Sharma", questions: 20, attempts: 184, avgScore: 68, status: "Active" },
    { id: uid("a"), title: "Database Fundamentals", skill: "Database", trainer: "Priya Mehta", questions: 25, attempts: 143, avgScore: 72, status: "Active" },
    { id: uid("a"), title: "Network Security & Penetration", skill: "Cybersecurity", trainer: "Rahul Verma", questions: 30, attempts: 89, avgScore: 42, status: "Active" },
    { id: uid("a"), title: "Cloud Infrastructure & Scalability", skill: "Cloud Computing", trainer: "Dr. Arjun Sharma", questions: 20, attempts: 95, avgScore: 55, status: "Active" },
    { id: uid("a"), title: "Object Oriented Programming in Python", skill: "Programming", trainer: "Daksh Jain", questions: 25, attempts: 210, avgScore: 75, status: "Active" },
    { id: uid("a"), title: "High-Impact Executive Communication", skill: "Communication", trainer: "Neha Sen", questions: 15, attempts: 160, avgScore: 81, status: "Completed" },
    { id: uid("a"), title: "Kubernetes Orchestration Evaluation", skill: "Cloud Computing", trainer: "Dr. Arjun Sharma", questions: 20, attempts: 0, avgScore: 0, status: "Draft" }
  ];

  var SEED_CERTIFICATES = [
    { id: uid("crt"), certId: "CC-PY-2026-00124", trainee: "Muneeb Ahmad", initials: "MA", course: "Python Programming Fundamentals", score: 92, issueDate: "Aug 20, 2026", status: "Issued" },
    { id: uid("crt"), certId: "CC-ML-2026-00125", trainee: "Daksh Jain", initials: "DJ", course: "Advanced Machine Learning", score: 88, issueDate: "Aug 24, 2026", status: "Issued" },
    { id: uid("crt"), certId: "CC-DB-2026-00126", trainee: "Riya Sharma", initials: "RS", course: "Relational Database Design", score: 94, issueDate: "Aug 29, 2026", status: "Issued" },
    { id: uid("crt"), certId: "CC-CL-2026-00127", trainee: "Ananya Roy", initials: "AR", course: "Cloud Solutions Architecture", score: 85, issueDate: "Sep 02, 2026", status: "Issued" },
    { id: uid("crt"), certId: "CC-CS-2026-00128", trainee: "Rohan Mehta", initials: "RM", course: "Cybersecurity Defensive Operations", score: 78, issueDate: "Sep 03, 2026", status: "Pending" },
    { id: uid("crt"), certId: "CC-PR-2026-00119", trainee: "Sameer Khan", initials: "SK", course: "Introductory Programming", score: 56, issueDate: "Aug 10, 2026", status: "Revoked" }
  ];

  var SEED_ANNOUNCEMENTS = [
    {
      id: uid("ann"),
      title: "New AI/ML Training Program",
      date: "September 4, 2026",
      audience: "All Trainees",
      status: "Published",
      body: "We are launching an expanded 8-week cohort for Deep Learning & Generative AI architectures with Dr. Arjun Sharma. Trainees can register directly from their portal."
    },
    {
      id: uid("ann"),
      title: "Q3 Organization Competency Assessment Week",
      date: "September 1, 2026",
      audience: "All Users",
      status: "Published",
      body: "Mandatory skill benchmarks will commence on September 15. All department leads must ensure trainees complete the diagnostic evaluations to update competency matrices."
    },
    {
      id: uid("ann"),
      title: "Trainer Workshop: Advanced Assessment Design",
      date: "August 28, 2026",
      audience: "Trainers",
      status: "Published",
      body: "Interactive masterclass on authoring competency-aligned MCQs, situational judgment items, and practical sandbox tests."
    }
  ];

  var SEED_TRAINERS = [
    { id: uid("tr"), name: "Dr. Arjun Sharma", initials: "AS", expertise: "AI / ML", courses: 3, trainees: 184, rating: 4.8, experience: "8 Years", availability: "Available", status: "Active" },
    { id: uid("tr"), name: "Priya Mehta", initials: "PM", expertise: "Database Systems", courses: 4, trainees: 156, rating: 4.7, experience: "6 Years", availability: "Available", status: "Active" },
    { id: uid("tr"), name: "Rahul Verma", initials: "RV", expertise: "Cybersecurity", courses: 2, trainees: 78, rating: 4.5, experience: "5 Years", availability: "In Session", status: "Active" },
    { id: uid("tr"), name: "Neha Sen", initials: "NS", expertise: "Communication & Leadership", courses: 3, trainees: 192, rating: 4.9, experience: "10 Years", availability: "Available", status: "Active" },
    { id: uid("tr"), name: "Daksh Jain", initials: "DJ", expertise: "Programming & Cloud", courses: 2, trainees: 112, rating: 4.6, experience: "4 Years", availability: "Available", status: "Active" }
  ];

  var SEED_NOTIFICATIONS = [
    { id: uid("nt"), text: "New trainer approval request from Rahul Verma (Cybersecurity)", time: "Just now", read: false },
    { id: uid("nt"), text: "New course 'Advanced Cybersecurity' submitted for approval", time: "20 minutes ago", read: false },
    { id: uid("nt"), text: "AI/ML assessment completed by 18 trainees with 68% avg score", time: "2 hours ago", read: false },
    { id: uid("nt"), text: "New certificate CC-PY-2026-00124 generated for Muneeb Ahmad", time: "Yesterday", read: true },
    { id: uid("nt"), text: "New announcement 'New AI/ML Training Program' published", time: "2 days ago", read: true }
  ];

  var SEED_PROFILE = {
    name: "Dr. Rajesh Varma",
    title: "Administrator",
    role: "Administrator",
    email: "admin@capacityconnect.io",
    org: "Capacity Connect Enterprise",
    phone: "+91 98765 43210",
    bio: "Chief Competency Officer & Enterprise Learning Administrator overseeing organizational capacity building and workforce upskilling."
  };

  /* ---------------- State ---------------- */
  var state = {
    users: [],
    courses: [],
    assessments: load(KEYS.assessments, SEED_ASSESSMENTS),
    certificates: load(KEYS.certificates, SEED_CERTIFICATES),
    announcements: load(KEYS.announcements, SEED_ANNOUNCEMENTS),
    trainers: [],
    notifications: load(KEYS.notifications, SEED_NOTIFICATIONS),
    profile: load(KEYS.profile, SEED_PROFILE),

    // API lookup maps
    trainerMap: new Map(),
    skillMap: new Map(),

    activeUserTab: "all",
    userSearch: "",
    userRoleFilter: "",
    userStatusFilter: "",
    courseFilterStatus: "",
    courseFilterSkill: "",
    assessmentSearch: "",
    assessmentSkillFilter: ""
  };

  /* ---------------- UI Utilities ---------------- */
  function showToast(msg) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> <span>' + esc(msg) + '</span>';
    toast.classList.remove("hidden");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.add("hidden");
    }, 3200);
  }

  function getBand(score) {
    if (score >= 80) return { label: "Advanced", cls: "band-advanced" };
    if (score >= 60) return { label: "Proficient", cls: "band-proficient" };
    if (score >= 40) return { label: "Developing", cls: "band-developing" };
    return { label: "Beginner", cls: "band-beginner" };
  }

  /* ---------------- Navigation Routing ---------------- */
  function switchView(viewName) {
    var views = document.querySelectorAll(".view");
    var found = false;

    views.forEach(function (v) {
      if (v.getAttribute("data-view-name") === viewName) {
        v.classList.remove("hidden");
        found = true;
      } else {
        v.classList.add("hidden");
      }
    });

    if (!found && views.length > 0) {
      views[0].classList.remove("hidden");
      viewName = views[0].getAttribute("data-view-name");
    }

    // Update sidebar active classes
    var navItems = document.querySelectorAll(".nav-item[data-view]");
    navItems.forEach(function (btn) {
      if (btn.getAttribute("data-view") === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update breadcrumb
    var crumb = document.getElementById("crumbActive");
    if (crumb) {
      var displayTitles = {
        "dashboard": "Dashboard",
        "users": "User Management",
        "courses": "Course Management",
        "assessments": "Assessment Management",
        "competency": "Competency Overview",
        "skill-gaps": "Skill Gap Analytics",
        "certificates": "Certificates",
        "announcements": "Announcements",
        "reports": "Reports & Analytics",
        "trainers": "Trainer Monitoring",
        "notifications": "Notifications",
        "profile": "My Profile",
        "settings": "Settings"
      };
      crumb.textContent = displayTitles[viewName] || (viewName.charAt(0).toUpperCase() + viewName.slice(1));
    }

    // Close mobile sidebar if open
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleMobileSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("mobileOverlay");
    if (!sidebar || !overlay) return;
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  }

  function closeMobileSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("mobileOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
  }

  /* =========================================================
     COURSE / TRAINER / SKILL API MAPPING
     ========================================================= */

  var ADMIN_API_BASE_URL =
    "https://capacity-connect-backend-ejbl.onrender.com";


  /* ---------------- Load Trainers ---------------- */

  async function loadAdminTrainersForCourseMapping() {
    try {
      var response = await fetch(
        ADMIN_API_BASE_URL + "/admin/users"
      );

      if (!response.ok) {
        throw new Error(
          "Admin users API returned " + response.status
        );
      }

      var users = await response.json();

      // Keep only actual trainers
      var trainers = users.filter(function (user) {
        return String(user.role || "").toLowerCase() === "trainer";
      });

      state.trainers = trainers.map(function (trainer) {
        return {
          id: trainer.id,
          name: trainer.Name || trainer.name || "Unknown Trainer",
          email: trainer.Email || trainer.email || "",
          role: trainer.role,
          status: trainer.is_approved ? "Active" : "Pending Approval"
        };
      });

      // Build trainer_id -> trainer name lookup
      state.trainerMap.clear();

      state.trainers.forEach(function (trainer) {
        state.trainerMap.set(
          String(trainer.id),
          trainer.name
        );
      });

      console.log(
        "Trainer mapping loaded:",
        state.trainerMap
      );

    } catch (error) {
      console.error(
        "Failed to load trainers:",
        error
      );

      state.trainers = [];
      state.trainerMap.clear();
    }
  }


  /* ---------------- Load Skills ---------------- */

  async function loadAdminSkillsForCourseMapping() {
    try {
      var response = await fetch(
        ADMIN_API_BASE_URL + "/skills"
      );

      if (!response.ok) {
        throw new Error(
          "Skills API returned " + response.status
        );
      }

      var skills = await response.json();

      // Build skill_id -> skill name lookup
      state.skillMap.clear();

      skills.forEach(function (skill) {
        state.skillMap.set(
          String(skill.id),
          skill.name
        );
      });

      console.log(
        "Skill mapping loaded:",
        state.skillMap
      );

    } catch (error) {
      console.error(
        "Failed to load skills:",
        error
      );

      state.skillMap.clear();
    }
  }


  /* ---------------- Load Courses ---------------- */

  async function loadAdminCourses() {
    try {
      console.log("COURSE API DATA:", courses);
      console.log("TRAINER MAP:", state.trainerMap);
      console.log("SKILL MAP:", state.skillMap);
      const response = await fetch(
        ADMIN_API_BASE_URL + "/courses"
      );

      if (!response.ok) {
        throw new Error("Courses API returned " + response.status);
      }

      const courses = await response.json();

      if (!Array.isArray(courses)) {
        throw new Error("Invalid courses response");
      }

      state.courses = courses.map(function (course) {
        return {
          id: course.id,

          title: course.title || "Untitled Course",

          description: course.description || "",

          trainer:
            state.trainerMap &&
            state.trainerMap.get(String(course.trainer_id))
              ? state.trainerMap.get(String(course.trainer_id))
              : "—",

          skill:
            state.skillMap &&
            state.skillMap.get(String(course.skill_id))
              ? state.skillMap.get(String(course.skill_id))
              : "—",

          trainer_id: course.trainer_id,

          skill_id: course.skill_id,

          // REAL backend enrollment count
          enrollments: Number(course.enrollment_count ?? 0),

          // Not available from backend yet
          completion: 0,

          status: course.status || "Published",

          duration: course.duration || "—",

          level: course.difficulty || "—",

          resource_ur1: course.resource_ur1 || "",

          created_at: course.created_at || ""
        };
      });

      console.log("Admin courses loaded:", state.courses);

      renderCoursesTable();

    } catch (error) {
      console.error("Admin courses API error:", error);

      state.courses = [];

      renderCoursesTable();
    }
  }


  /* ---------------- Load Course Management Data ---------------- */

  async function loadCourseManagementData() {
    await Promise.all([
      loadAdminTrainersForCourseMapping(),
      loadAdminSkillsForCourseMapping()
    ]);

    await loadAdminCourses();
  }


  /* ---------------- Render Functions ---------------- */

  /* ---------------- Admin User Management API ---------------- */

  var ADMIN_API_BASE_URL =
    "https://capacity-connect-backend-ejbl.onrender.com";

  function formatUserRole(role) {
    if (!role) return "Trainee";

    var normalized = String(role).toLowerCase();

    if (normalized === "trainer") return "Trainer";
    if (normalized === "admin") return "Admin";

    return "Trainee";
  }

  function formatUserStatus(isApproved) {
    return isApproved ? "Active" : "Pending Approval";
  }

  function getUserInitials(name) {
    var value = String(name || "").trim();

    if (!value) return "U";

    var parts = value.split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  function getUserAvatarColor(role) {
    var normalized = String(role || "").toLowerCase();

    if (normalized === "trainer") return "violet";
    if (normalized === "admin") return "blue";

    return "cyan";
  }

  function formatJoinedDate(createdAt) {
    if (!createdAt) return "—";

    var date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  function normalizeAdminUser(user) {
    var role = formatUserRole(user.role);

    return {
      id: user.id,
      name: user.Name || "Unnamed User",
      initials: getUserInitials(user.Name),
      email: user.Email || "—",
      role: role,
      status: formatUserStatus(user.is_approved),
      joined: formatJoinedDate(user.created_at),
      color: getUserAvatarColor(role),
      score: 0
    };
  }

  async function loadAdminUsers(endpoint) {
    endpoint =
      endpoint ||
      ADMIN_API_BASE_URL + "/admin/users";

    try {
      var response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          "User API returned " + response.status
        );
      }

      var data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid users response from backend.");
      }

      state.users = data.map(normalizeAdminUser);

      renderUsersTable();
      renderTrainersTable();

      console.log(
        "Admin users loaded from backend:",
        state.users
      );

      return true;

    } catch (error) {
      console.error(
        "Failed to load admin users:",
        error
      );

      state.users = [];

      renderUsersTable();

      showToast(
        "Unable to load users from backend."
      );

      return false;
    }
  }

  async function loadPendingAdminUsers() {
    return loadAdminUsers(
      ADMIN_API_BASE_URL + "/admin/users/pending"
    );
  }

  async function approveAdminUser(userId, button) {
    if (!userId) return;

    if (button) {
      button.disabled = true;
      button.textContent = "Approving...";
    }

    try {
      var response = await fetch(
        ADMIN_API_BASE_URL +
          "/admin/users/" +
          encodeURIComponent(userId) +
          "/approve",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            is_approved: true
          })
        }
      );

      var data = {};

      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (!response.ok) {
        var errorMessage =
          data.detail ||
          data.message ||
          "User approval failed.";

        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage
            .map(function (err) {
              return err.msg || "Invalid request";
            })
            .join(", ");
        }

        throw new Error(errorMessage);
      }

      console.log(
        "User approved successfully:",
        data
      );

      showToast("User approved successfully.");

      /*
      * Reload from backend so the UI reflects
      * the actual Supabase state.
      */
      await loadAdminUsers();

    } catch (error) {
      console.error(
        "Failed to approve user:",
        error
      );

      showToast(
        error.message ||
        "Unable to approve user."
      );

      if (button) {
        button.disabled = false;
        button.textContent = "Approve";
      }
    }
  }

  // 1. Dashboard Competency Bars (Section 3)
  function renderCompetencyBars() {
    var container = document.getElementById("competencyBarsList");
    if (!container) return;

    var data = [
      { skill: "Programming", score: 75 },
      { skill: "Database Systems", score: 62 },
      { skill: "AI / ML", score: 48 },
      { skill: "Communication", score: 81 },
      { skill: "Cybersecurity", score: 42 },
      { skill: "Cloud Computing", score: 55 }
    ];

    var html = "";
    data.forEach(function (item) {
      var band = getBand(item.score);
      var gradient = item.score >= 80 ? "linear-gradient(90deg, #10b981, #34d399)" :
                     item.score >= 60 ? "linear-gradient(90deg, #2563eb, #60a5fa)" :
                     item.score >= 40 ? "linear-gradient(90deg, #d97706, #fbbf24)" :
                                        "linear-gradient(90deg, #e11d48, #fb7185)";

      html += '<div class="competency-bar-row">' +
        '<div class="competency-bar-header">' +
          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span class="competency-skill-name">' + esc(item.skill) + '</span>' +
            '<span class="competency-band-tag ' + band.cls + '">' + band.label + '</span>' +
          '</div>' +
          '<span style="font-weight:700; color:#fff;">' + item.score + '%</span>' +
        '</div>' +
        '<div class="competency-track">' +
          '<div class="competency-fill" style="width:' + item.score + '%; background:' + gradient + '"></div>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  // 2. Dashboard Skill Gaps (Section 4)
  function renderSkillGaps() {
    var container = document.getElementById("skillGapsList");
    if (!container) return;

    var gaps = [
      { skill: "AI / ML", current: 48, target: 80, gap: 32, severity: "Critical", chipCls: "chip-critical" },
      { skill: "Cybersecurity", current: 42, target: 75, gap: 33, severity: "Critical", chipCls: "chip-critical" },
      { skill: "Cloud Computing", current: 55, target: 80, gap: 25, severity: "High", chipCls: "chip-high" },
      { skill: "Advanced SQL", current: 52, target: 75, gap: 23, severity: "High", chipCls: "chip-high" }
    ];

    var html = "";
    gaps.forEach(function (g) {
      html += '<div class="skill-gap-item">' +
        '<div class="skill-gap-head">' +
          '<span class="skill-gap-title">' + esc(g.skill) + '</span>' +
          '<span class="skill-gap-chip ' + g.chipCls + '">' + g.severity + ' &middot; ' + g.gap + '% Gap</span>' +
        '</div>' +
        '<div class="skill-gap-progress-wrap">' +
          '<div class="skill-gap-curr" style="width:' + g.current + '%"></div>' +
          '<div class="skill-gap-target-marker" style="left:' + g.target + '%" title="Target: ' + g.target + '%"></div>' +
        '</div>' +
        '<div class="skill-gap-values">' +
          '<span>Current: <strong style="color:#fff;">' + g.current + '%</strong></span>' +
          '<span>Target: <strong style="color:#93c5fd;">' + g.target + '%</strong></span>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  // 3. User Management Table (Section 5)
  function renderUsersTable() {
    var tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    var filtered = state.users.filter(function (u) {
      if (state.activeUserTab === "trainees" && u.role !== "Trainee") return false;
      if (state.activeUserTab === "trainers" && u.role !== "Trainer") return false;
      if (state.activeUserTab === "pending" && u.status !== "Pending Approval") return false;

      if (state.userRoleFilter && u.role !== state.userRoleFilter) return false;
      if (state.userStatusFilter && u.status !== state.userStatusFilter) return false;

      if (state.userSearch) {
        var q = state.userSearch.toLowerCase();
        return u.name.toLowerCase().indexOf(q) !== -1 || u.email.toLowerCase().indexOf(q) !== -1;
      }
      return true;
    });

    // Update tab counts
    var countAll = state.users.length;
    var countTrainees = state.users.filter(function (u) { return u.role === "Trainee"; }).length;
    var countTrainers = state.users.filter(function (u) { return u.role === "Trainer"; }).length;
    var countPending = state.users.filter(function (u) { return u.status === "Pending Approval"; }).length;

    var elCountAll = document.getElementById("countAllUsers");
    if (elCountAll) elCountAll.textContent = countAll;
    var elCountTr = document.getElementById("countTrainees");
    if (elCountTr) elCountTr.textContent = countTrainees;
    var elCountTrn = document.getElementById("countTrainers");
    if (elCountTrn) elCountTrn.textContent = countTrainers;
    var elCountPnd = document.getElementById("countPending");
    if (elCountPnd) elCountPnd.textContent = countPending;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--slate-500);">' +
        '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px; opacity:0.5;"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>' +
        '<div>No users match your active criteria.</div>' +
      '</td></tr>';
      return;
    }

    var html = "";
    filtered.forEach(function (u) {
      var badgeCls = u.status === "Active" ? "badge-active" :
                     u.status === "Pending Approval" ? "badge-pending" : "badge-disabled";

      var roleBadgeCls = u.role === "Trainer" ? "badge-trainer" :
                         u.role === "Admin" ? "badge-admin" : "badge-trainee";

      var actionsHtml = '<div class="action-group">';
      actionsHtml += '<button class="row-btn" data-action="view-user" data-id="' + u.id + '">View</button>';

      if (u.status === "Pending Approval") {
        actionsHtml += '<button class="row-btn row-btn-success" data-action="approve-user" data-id="' + u.id + '">Approve</button>';
        actionsHtml += '<button class="row-btn row-btn-danger" data-action="reject-user" data-id="' + u.id + '">Reject</button>';
      } else {
        if (u.status === "Active") {
          actionsHtml += '<button class="row-btn" data-action="toggle-status" data-id="' + u.id + '">Disable</button>';
        } else {
          actionsHtml += '<button class="row-btn row-btn-success" data-action="toggle-status" data-id="' + u.id + '">Enable</button>';
        }
        actionsHtml += '<button class="row-btn row-btn-primary" data-action="change-role" data-id="' + u.id + '">Change Role</button>';
      }
      actionsHtml += '</div>';

      html += '<tr>' +
        '<td>' +
          '<div class="user-cell">' +
            '<div class="avatar avatar-' + (u.color || "cyan") + '">' + esc(u.initials) + '</div>' +
            '<div>' +
              '<div class="user-name">' + esc(u.name) + '</div>' +
              '<div class="user-email">' + esc(u.email) + '</div>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td><span class="badge ' + roleBadgeCls + '">' + esc(u.role) + '</span></td>' +
        '<td><span class="badge ' + badgeCls + '">' + esc(u.status) + '</span></td>' +
        '<td style="color:var(--slate-400);">' + esc(u.joined) + '</td>' +
        '<td>' + actionsHtml + '</td>' +
      '</tr>';
    });

    tbody.innerHTML = html;
  }

  async function loadAdminCourses() {
    try {
      var response = await fetch(
        ADMIN_API_BASE_URL + "/courses"
      );

      if (!response.ok) {
        throw new Error(
          "Course API returned " + response.status
        );
      }

      var data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid courses response from backend."
        );
      }

      state.courses = data.map(function (course) {

        var trainerName =
          state.trainerMap.get(
            String(course.trainer_id)
          ) || "—";

        var skillName =
          state.skillMap.get(
            String(course.skill_id)
          ) || "—";

        return {
          id: course.id,

          title:
            course.title || "Untitled Course",

          description:
            course.description || "",

          duration:
            course.duration || "—",

          level:
            course.difficulty || "—",

          skill_id:
            course.skill_id,

          trainer_id:
            course.trainer_id,

          // REAL trainer mapping
          trainer:
            trainerName,

          // REAL skill mapping
          skill:
            skillName,

          // REAL backend enrollment count
          enrollments:
            Number(course.enrollment_count ?? 0),

          // Completion tracking is not implemented yet
          completion: 0,

          status:
            course.status || "Published",

          resource_ur1:
            course.resource_ur1 || "",

          created_at:
            course.created_at || ""
        };
      });

      console.log(
        "Admin courses loaded from backend:",
        state.courses
      );

      renderCoursesTable();

    } catch (error) {

      console.error(
        "Failed to load admin courses:",
        error
      );

      state.courses = [];

      renderCoursesTable();
    }
  }


  // 4. Course Management Table (Section 6)
    // 4. Course Management Table (Section 6)
  function renderCoursesTable() {
    var tbody = document.getElementById("coursesTableBody");
    if (!tbody) return;

    var filtered = state.courses.filter(function (c) {
      if (
        state.courseFilterStatus &&
        c.status !== state.courseFilterStatus
      ) {
        return false;
      }

      if (
        state.courseFilterSkill &&
        c.skill !== state.courseFilterSkill
      ) {
        return false;
      }

      return true;
    });


    /* ---------------- Summary Counts ---------------- */

    var actCount = state.courses.filter(function (c) {
      return c.status === "Published";
    }).length;

    var pndCount = state.courses.filter(function (c) {
      return c.status === "Pending Approval";
    }).length;

    var drfCount = state.courses.filter(function (c) {
      return c.status === "Draft";
    }).length;

    var arcCount = state.courses.filter(function (c) {
      return c.status === "Archived";
    }).length;


    var elA =
      document.getElementById("courseCountActive");

    if (elA) {
      elA.textContent = actCount;
    }


    var elP =
      document.getElementById("courseCountPending");

    if (elP) {
      elP.textContent = pndCount;
    }


    var elD =
      document.getElementById("courseCountDraft");

    if (elD) {
      elD.textContent = drfCount;
    }


    var elAr =
      document.getElementById("courseCountArchived");

    if (elAr) {
      elAr.textContent = arcCount;
    }


    /* ---------------- Empty State ---------------- */

    if (filtered.length === 0) {

      tbody.innerHTML =
        '<tr>' +
          '<td colspan="7" style="text-align:center; padding:36px; color:var(--slate-500);">' +
            '<div style="font-size:14px;">No courses found.</div>' +
          '</td>' +
        '</tr>';

      return;
    }


    /* ---------------- Course Rows ---------------- */

    var html = "";

    filtered.forEach(function (c) {

      var badgeCls =
        c.status === "Published"
          ? "badge-published"
          : c.status === "Pending Approval"
            ? "badge-pending"
            : c.status === "Draft"
              ? "badge-draft"
              : "badge-archived";


      var actionsHtml =
        '<div class="action-group">';

      actionsHtml +=
        '<button class="row-btn" data-action="view-course" data-id="' +
        c.id +
        '">View</button>';


      if (c.status === "Pending Approval") {

        actionsHtml +=
          '<button class="row-btn row-btn-success" data-action="approve-course" data-id="' +
          c.id +
          '">Approve</button>';

      }


      if (c.status !== "Archived") {

        actionsHtml +=
          '<button class="row-btn" data-action="archive-course" data-id="' +
          c.id +
          '">Archive</button>';

      }


      actionsHtml += "</div>";


      html +=
        '<tr>' +

          /* Course */
          '<td>' +
            '<div style="font-weight:600; color:#fff;">' +
              esc(c.title) +
            '</div>' +

            '<div style="font-size:10px; color:var(--slate-500);">' +
              esc(c.duration) +
              ' &middot; ' +
              esc(c.level) +
            '</div>' +
          '</td>' +


          /* Trainer */
          '<td>' +
            esc(c.trainer || "—") +
          '</td>' +


          /* Skill */
          '<td>' +
            '<span class="badge badge-trainee">' +
              esc(c.skill || "—") +
            '</span>' +
          '</td>' +


          /* Enrollments */
          '<td>' +
            '<strong style="color:var(--slate-200);">' +
              (c.enrollments || 0) +
            '</strong>' +
          '</td>' +


          /* Completion */
          '<td>' +
            '<div style="display:flex; align-items:center; gap:8px; width:100px;">' +

              '<div class="competency-track" style="flex:1; height:6px;">' +

                '<div class="competency-fill" style="width:' +
                  (c.completion || 0) +
                  '%; background:var(--blue-400);">' +
                '</div>' +

              '</div>' +

              '<span style="font-size:11px; color:var(--slate-400);">' +
                (c.completion || 0) +
                '%' +
              '</span>' +

            '</div>' +
          '</td>' +


          /* Status */
          '<td>' +
            '<span class="badge ' +
              badgeCls +
            '">' +
              esc(c.status) +
            '</span>' +
          '</td>' +


          /* Actions */
          '<td>' +
            actionsHtml +
          '</td>' +

        '</tr>';
    });


    tbody.innerHTML = html;
  }

  // 5. Assessment Management Table (Section 7)
  function renderAssessmentsTable() {
    var tbody = document.getElementById("assessmentsTableBody");
    if (!tbody) return;

    var filtered = state.assessments.filter(function (a) {
      if (state.assessmentSkillFilter && a.skill !== state.assessmentSkillFilter) return false;
      if (state.assessmentSearch) {
        var q = state.assessmentSearch.toLowerCase();
        return a.title.toLowerCase().indexOf(q) !== -1 || a.trainer.toLowerCase().indexOf(q) !== -1;
      }
      return true;
    });

    var totCount = state.assessments.length;
    var actCount = state.assessments.filter(function (a) { return a.status === "Active"; }).length;
    var cmpCount = state.assessments.filter(function (a) { return a.status === "Completed"; }).length;
    var drfCount = state.assessments.filter(function (a) { return a.status === "Draft"; }).length;

    var elTot = document.getElementById("asmtCountTotal");
    if (elTot) elTot.textContent = totCount;
    var elAct = document.getElementById("asmtCountActive");
    if (elAct) elAct.textContent = actCount;
    var elCmp = document.getElementById("asmtCountCompleted");
    if (elCmp) elCmp.textContent = cmpCount;
    var elDrf = document.getElementById("asmtCountDraft");
    if (elDrf) elDrf.textContent = drfCount;

    var html = "";
    filtered.forEach(function (a) {
      var badgeCls = a.status === "Active" ? "badge-active" :
                     a.status === "Completed" ? "badge-published" : "badge-draft";

      html += '<tr>' +
        '<td><div style="font-weight:600; color:#fff;">' + esc(a.title) + '</div></td>' +
        '<td><span class="badge badge-trainee">' + esc(a.skill) + '</span></td>' +
        '<td>' + esc(a.trainer) + '</td>' +
        '<td>' + a.questions + '</td>' +
        '<td>' + a.attempts + '</td>' +
        '<td><strong style="color:' + (a.avgScore >= 70 ? "var(--emerald-400)" : a.avgScore >= 50 ? "var(--amber-400)" : "var(--rose-400)") + '">' + (a.avgScore ? a.avgScore + "%" : "—") + '</strong></td>' +
        '<td><span class="badge ' + badgeCls + '">' + esc(a.status) + '</span></td>' +
        '<td>' +
          '<div class="action-group">' +
            '<button class="row-btn" data-action="view-assessment" data-id="' + a.id + '">View</button>' +
            '<button class="row-btn" data-action="toggle-assessment" data-id="' + a.id + '">' + (a.status === "Active" ? "Disable" : "Enable") + '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    });

    tbody.innerHTML = html;
  }


  function normalizeAssessmentScore(value, questionCount) {
    var n = Number(value);

    if (!Number.isFinite(n)) {
      return 0;
    }

    // Backend returns raw score when it is within
    // the number of questions.
    if (questionCount > 0 && n <= questionCount) {
      return Math.round((n / questionCount) * 100);
    }

    // Otherwise assume it is already a percentage.
    return Math.round(n);
  }

  async function loadAdminAssessmentAnalytics() {
    try {

      var assessmentsResponse = await fetch(
        ADMIN_API_BASE_URL + "/assessments"
      );

      if (!assessmentsResponse.ok) {
        throw new Error(
          "Assessments API returned " +
          assessmentsResponse.status
        );
      }

      var assessments =
        await assessmentsResponse.json();

      if (!Array.isArray(assessments)) {
        throw new Error(
          "Invalid assessments response from backend."
        );
      }

      /* -----------------------------------------
        Load all questions once
        ----------------------------------------- */

      var questionsResponse = await fetch(
        ADMIN_API_BASE_URL + "/questions"
      );

      var questions = [];

      if (questionsResponse.ok) {
        questions = await questionsResponse.json();

        if (!Array.isArray(questions)) {
          questions = [];
        }
      }

      /* -----------------------------------------
        Build assessment rows
        ----------------------------------------- */

      var enrichedAssessments =
        await Promise.all(
          assessments.map(async function (assessment) {

            /* Count questions belonging
              to this assessment */

            var questionCount =
              questions.filter(function (question) {
                return Number(question.assessment_id) ===
                  Number(assessment.id);
              }).length;

            /* Load assessment analytics */

            var stats = {
              total_attempts: 0,
              average_score: 0,
              highest_score: 0,
              lowest_score: 0
            };

            try {

              var statsResponse = await fetch(
                ADMIN_API_BASE_URL +
                "/assessments/" +
                assessment.id +
                "/stats"
              );

              if (statsResponse.ok) {
                stats = await statsResponse.json();
              }

            } catch (statsError) {

              console.error(
                "Failed to load assessment stats:",
                assessment.id,
                statsError
              );
            }

            return {

              id:
                assessment.id,

              title:
                assessment.title ||
                "Untitled Assessment",

              skill:
                assessment.skill ||
                assessment.skill_name ||
                "—",

              trainer:
                assessment.trainer ||
                assessment.trainer_name ||
                "—",

              questions:
                questionCount,

              attempts:
                Number(
                  stats.total_attempts ?? 0
                ),

              avgScore:
                normalizeAssessmentScore(
                  stats.average_score ?? 0,
                  questionCount
                ),

              highestScore:
                Number(
                  stats.highest_score ?? 0
                ),

              lowestScore:
                Number(
                  stats.lowest_score ?? 0
                ),

              status:
                assessment.status ||
                "Active"
            };
          })
        );

      state.assessments =
        enrichedAssessments;

      console.log(
        "Admin Assessment Analytics:",
        state.assessments
      );

      renderAssessmentsTable();

    } catch (error) {

      console.error(
        "Failed to load assessment analytics:",
        error
      );

      state.assessments = [];
      renderAssessmentsTable();
    }
  }

  // 6. Certificate Management Table (Section 8)
  function renderCertificatesTable() {
    var tbody = document.getElementById("certificatesTableBody");
    if (!tbody) return;

    var html = "";
    state.certificates.forEach(function (crt) {
      var badgeCls = crt.status === "Issued" ? "badge-issued" :
                     crt.status === "Pending" ? "badge-pending" : "badge-revoked";

      html += '<tr>' +
        '<td>' +
          '<div class="user-cell">' +
            '<div class="avatar avatar-sm avatar-cyan">' + esc(crt.initials) + '</div>' +
            '<span class="user-name">' + esc(crt.trainee) + '</span>' +
          '</div>' +
        '</td>' +
        '<td>' + esc(crt.course) + '</td>' +
        '<td><strong style="color:var(--emerald-400);">' + crt.score + '%</strong></td>' +
        '<td style="color:var(--slate-400);">' + esc(crt.issueDate) + '</td>' +
        '<td><code style="font-family:monospace; color:var(--blue-300); background:rgba(59,130,246,0.1); padding:2px 6px; border-radius:4px;">' + esc(crt.certId) + '</code></td>' +
        '<td><span class="badge ' + badgeCls + '">' + esc(crt.status) + '</span></td>' +
        '<td>' +
          '<div class="action-group">' +
            '<button class="row-btn row-btn-primary" data-action="view-cert" data-id="' + crt.id + '">View</button>' +
            '<button class="row-btn" data-action="verify-cert" data-id="' + crt.id + '">Verify</button>' +
            (crt.status !== "Revoked" ? '<button class="row-btn row-btn-danger" data-action="revoke-cert" data-id="' + crt.id + '">Revoke</button>' : '') +
          '</div>' +
        '</td>' +
      '</tr>';
    });

    tbody.innerHTML = html;
  }

  // 7. Announcements (Section 9)
  function renderAnnouncements() {
    var container = document.getElementById("announcementsList");
    if (!container) return;

    var html = "";
    state.announcements.forEach(function (ann) {
      var audBadge = ann.audience === "Trainers" ? "badge-trainer" :
                     ann.audience === "Trainees" ? "badge-trainee" : "badge-active";

      html += '<div class="announcement-card">' +
        '<div class="ann-top">' +
          '<div class="ann-title">' + esc(ann.title) + '</div>' +
          '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span class="badge ' + audBadge + '">' + esc(ann.audience) + '</span>' +
            '<button class="icon-btn" data-action="delete-announcement" data-id="' + ann.id + '" title="Delete announcement" style="padding:4px; color:var(--slate-500);">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="ann-meta">' +
          '<span>Published: <strong>' + esc(ann.date) + '</strong></span>' +
          '<span>&middot;</span>' +
          '<span class="badge badge-published">Published</span>' +
        '</div>' +
        '<div class="ann-body">' + esc(ann.body) + '</div>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  async function loadAdminUsersForTrainers() {
    try {
      var response = await fetch(
        ADMIN_API_BASE_URL + "/admin/trainers"
      );

      if (!response.ok) {
        throw new Error("Trainer API returned " + response.status);
      }

      var data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid trainers response from backend.");
      }

      state.trainers = data.map(function (trainer) {
        var name = trainer.Name || trainer.name || "Unnamed Trainer";
        var parts = name.trim().split(/\s+/);

        var initials;

        if (parts.length > 1) {
          initials =
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0);
        } else {
          initials = name.substring(0, 2);
        }

        return {
          id: trainer.id,
          name: name,
          initials: initials.toUpperCase(),
          email: trainer.Email || trainer.email || "",
          role: "Trainer",

          status: trainer.is_approved
            ? "Active"
            : "Pending Approval",

          joined: trainer.created_at || "",

          courses: Number(
            trainer.course_count ?? 0
          ),

          trainees: Number(
            trainer.trainee_count ?? 0
          )
        };
      });

      console.log(
        "Trainer Monitoring - Backend Trainers:",
        state.trainers
      );

      renderTrainersTable();

    } catch (error) {
      console.error(
        "Trainer Monitoring API error:",
        error
      );

      state.trainers = [];
      renderTrainersTable();
    }
  }


  // 8. Trainer Monitoring Table (Section 11)
  function renderTrainersTable() {
    var tbody = document.getElementById("trainersTableBody");
    if (!tbody) return;

    var trainers = state.trainers || [];

    if (trainers.length === 0) {
      tbody.innerHTML =
        '<tr>' +
          '<td colspan="8" style="text-align:center; padding:40px; color:var(--slate-500);">' +
            'No trainers found in the database.' +
          '</td>' +
        '</tr>';

      return;
    }

    var html = "";

    trainers.forEach(function (trainer) {

      var statusClass =
        trainer.status === "Active"
          ? "badge-active"
          : "badge-pending";

      html +=
        '<tr>' +

          '<td>' +
            '<div class="user-cell">' +
              '<div class="avatar avatar-sm avatar-grad">' +
                esc(trainer.initials) +
              '</div>' +
              '<span class="user-name">' +
                esc(trainer.name) +
              '</span>' +
            '</div>' +
          '</td>' +

          '<td>' +
            '<span class="badge badge-trainer">' +
              'Trainer' +
            '</span>' +
          '</td>' +

          '<td>' +
            '<strong style="color:#fff;">' +
              trainer.courses +
            '</strong>' +
          '</td>' +

          '<td>' +
            '<strong style="color:#fff;">' +
              trainer.trainees +
            '</strong>' +
          '</td>' +

          '<td>' +
            '<span style="color:var(--slate-400); font-weight:700;">' +
              '—' +
            '</span>' +
          '</td>' +

          '<td style="color:var(--slate-400);">' +
            '—' +
          '</td>' +

          '<td>' +
            '<span class="badge badge-pending">' +
              '—' +
            '</span>' +
          '</td>' +

          '<td>' +
            '<span class="badge ' + statusClass + '">' +
              esc(trainer.status) +
            '</span>' +
          '</td>' +

        '</tr>';
    });

    tbody.innerHTML = html;
  }

  // 9. Notifications (Section 12)
  function renderNotifications() {
    var list = document.getElementById("notifPanelList");
    var fullList = document.getElementById("notificationsFullList");
    var badge = document.getElementById("navNotifBadge");
    var dot = document.getElementById("headerNotifDot");

    var unreadCount = state.notifications.filter(function (n) { return !n.read; }).length;

    if (badge) badge.textContent = unreadCount;
    if (dot) {
      if (unreadCount > 0) dot.classList.remove("hidden");
      else dot.classList.add("hidden");
    }

    var html = "";
    state.notifications.forEach(function (n) {
      html += '<div class="notif-item ' + (n.read ? "" : "unread") + '">' +
        '<div>' + esc(n.text) + '</div>' +
        '<div class="notif-time">' + esc(n.time) + '</div>' +
      '</div>';
    });

    if (list) list.innerHTML = html;
    if (fullList) fullList.innerHTML = html;
  }

  // 10. Dashboard Activity Overview Chart
  function renderParticipationChart() {
    var container = document.getElementById("participationChart");
    if (!container) return;

    // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug
    // Coordinates for SVG viewBox 0 0 500 160
    var points = [
      { x: 30, y: 120, label: "Jan", val: 540 },
      { x: 90, y: 105, label: "Feb", val: 680 },
      { x: 155, y: 92, label: "Mar", val: 790 },
      { x: 220, y: 80, label: "Apr", val: 890 },
      { x: 285, y: 65, label: "May", val: 980 },
      { x: 350, y: 55, label: "Jun", val: 1060 },
      { x: 415, y: 40, label: "Jul", val: 1180 },
      { x: 480, y: 25, label: "Aug", val: 1248 }
    ];

    var pathD = "M " + points[0].x + " " + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i - 1];
      var curr = points[i];
      var cx = (prev.x + curr.x) / 2;
      pathD += " C " + cx + " " + prev.y + ", " + cx + " " + curr.y + ", " + curr.x + " " + curr.y;
    }

    var areaD = pathD + " L 480 150 L 30 150 Z";

    var svg = '<svg viewBox="0 0 510 170" preserveAspectRatio="none">' +
      '<defs>' +
        '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>' +
          '<stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<line x1="30" y1="40" x2="480" y2="40" class="chart-grid-line"/>' +
      '<line x1="30" y1="80" x2="480" y2="80" class="chart-grid-line"/>' +
      '<line x1="30" y1="120" x2="480" y2="120" class="chart-grid-line"/>' +
      '<path d="' + areaD + '" fill="url(#areaGrad)"/>' +
      '<path d="' + pathD + '" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>';

    points.forEach(function (p) {
      svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.5" class="chart-dot"><title>' + p.label + ': ' + p.val + ' participants</title></circle>' +
             '<text x="' + p.x + '" y="165" text-anchor="middle" class="chart-axis-text">' + p.label + '</text>';
    });

    svg += '</svg>';
    container.innerHTML = svg;
  }

  // 11. Profile View Form
  function renderProfileForm() {
    var p = state.profile;
    var pfName = document.getElementById("pfName");
    var pfEmail = document.getElementById("pfEmail");
    var pfRole = document.getElementById("pfRole");
    var pfOrg = document.getElementById("pfOrg");
    var pfPhone = document.getElementById("pfPhone");
    var pfBio = document.getElementById("pfBio");

    if (pfName) pfName.value = p.name || "";
    if (pfEmail) pfEmail.value = p.email || "";
    if (pfRole) pfRole.value = p.role || "";
    if (pfOrg) pfOrg.value = p.org || "";
    if (pfPhone) pfPhone.value = p.phone || "";
    if (pfBio) pfBio.value = p.bio || "";

    var topName = document.getElementById("topAdminName");
    if (topName) topName.textContent = p.name;
    var sideName = document.getElementById("sideAdminName");
    if (sideName) sideName.textContent = p.name;
  }

  /* ---------------- Modals ---------------- */
  var modalRoot = document.getElementById("modalRoot");

  function closeModal() {
    if (modalRoot) {
      modalRoot.classList.add("hidden");
      modalRoot.innerHTML = "";
    }
  }

  // Certificate Preview Modal (Luxury verified layout)
  function openCertificateModal(cert) {
    if (!modalRoot) return;

    var html = '<div class="modal-shell wide">' +
      '<div class="modal-header">' +
        '<div><p class="modal-eyebrow">Credential Verification</p><h3 class="modal-title">Official Certificate Preview</h3></div>' +
        '<button class="modal-close" id="modalCloseBtn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="certificate-preview-frame">' +
          '<div class="cert-watermark"><svg viewBox="0 0 24 24" width="300" height="300"><path fill="white" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>' +
          '<div class="cert-header">' +
            '<div class="cert-logo">CAPACITY CONNECT &middot; COMPETENCY PLATFORM</div>' +
            '<div class="cert-title">Certificate of Competency</div>' +
            '<div class="cert-sub">This is officially presented to acknowledge competency mastery</div>' +
          '</div>' +
          '<div class="cert-recipient">' +
            '<div class="cert-recipient-name">' + esc(cert.trainee) + '</div>' +
          '</div>' +
          '<p class="cert-for">for successfully fulfilling all competency evaluations, performance milestones, and curriculum criteria for <span class="cert-course">' + esc(cert.course) + '</span> with an evaluated performance score of <strong style="color:#fef08a;">' + cert.score + '%</strong>.</p>' +
          '<div class="cert-footer-row">' +
            '<div class="cert-sign-block">' +
              '<div class="cert-sig-line">Dr. Rajesh Varma</div>' +
              '<div class="cert-sign-label">Administrator &middot; Capacity Connect</div>' +
            '</div>' +
            '<div class="cert-seal">' +
              '<span>VERIFIED<br>VALID</span>' +
            '</div>' +
            '<div class="cert-sign-block" style="text-align:right;">' +
              '<div style="font-family:monospace; font-size:12px; color:var(--blue-300);">' + esc(cert.certId) + '</div>' +
              '<div class="cert-sign-label">Issued: ' + esc(cert.issueDate) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-outline" id="printCertBtn"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print Credential</button>' +
          '<button class="btn btn-primary" id="modalDismissBtn">Done</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    modalRoot.innerHTML = html;
    modalRoot.classList.remove("hidden");

    document.getElementById("modalCloseBtn").onclick = closeModal;
    document.getElementById("modalDismissBtn").onclick = closeModal;
    document.getElementById("printCertBtn").onclick = function () {
      window.print();
    };
  }

  // Create Announcement Modal (Section 9)
  function openCreateAnnouncementModal() {
    if (!modalRoot) return;

    var html = '<div class="modal-shell">' +
      '<div class="modal-header">' +
        '<div><p class="modal-eyebrow">Organization Communication</p><h3 class="modal-title">Create Announcement</h3></div>' +
        '<button class="modal-close" id="modalCloseBtn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<form id="announcementForm" class="modal-body">' +
        '<div class="form-grid">' +
          '<label class="field wide"><span>Announcement Title</span><input id="annTitle" type="text" placeholder="e.g. Q4 Competency Assessment Week" required /></label>' +
          '<label class="field"><span>Target Audience</span>' +
            '<select id="annAudience">' +
              '<option value="All Users">All Users</option>' +
              '<option value="Trainees">Trainees Only</option>' +
              '<option value="Trainers">Trainers Only</option>' +
            '</select>' +
          '</label>' +
          '<label class="field"><span>Publish Date</span><input id="annDate" type="text" value="September 5, 2026" /></label>' +
          '<label class="field wide"><span>Message</span><textarea id="annBody" rows="4" placeholder="Write your announcement details here..." required></textarea></label>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-ghost" id="modalCancelBtn">Cancel</button>' +
          '<button type="submit" class="btn btn-primary">Publish Announcement</button>' +
        '</div>' +
      '</form>' +
    '</div>';

    modalRoot.innerHTML = html;
    modalRoot.classList.remove("hidden");

    document.getElementById("modalCloseBtn").onclick = closeModal;
    document.getElementById("modalCancelBtn").onclick = closeModal;

    document.getElementById("announcementForm").onsubmit = function (e) {
      e.preventDefault();
      var title = document.getElementById("annTitle").value.trim();
      var audience = document.getElementById("annAudience").value;
      var date = document.getElementById("annDate").value.trim();
      var body = document.getElementById("annBody").value.trim();

      if (!title || !body) return;

      var newAnn = {
        id: uid("ann"),
        title: title,
        date: date || "September 5, 2026",
        audience: audience,
        status: "Published",
        body: body
      };

      state.announcements.unshift(newAnn);
      save(KEYS.announcements, state.announcements);
      renderAnnouncements();
      closeModal();
      showToast("Announcement published successfully.");
    };
  }

  // Change Role Modal
  function openChangeRoleModal(user) {
    if (!modalRoot) return;

    var html = '<div class="modal-shell">' +
      '<div class="modal-header">' +
        '<div><p class="modal-eyebrow">User Management</p><h3 class="modal-title">Change Role for ' + esc(user.name) + '</h3></div>' +
        '<button class="modal-close" id="modalCloseBtn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<p style="font-size:13px; color:var(--slate-400); margin-bottom:16px;">Current Role: <strong style="color:#fff;">' + esc(user.role) + '</strong> (' + esc(user.email) + ')</p>' +
        '<label class="field wide"><span>Select New Role</span>' +
          '<select id="newRoleSelect">' +
            '<option value="Trainee"' + (user.role === "Trainee" ? " selected" : "") + '>Trainee (Learn &rarr; Assess &rarr; Improve)</option>' +
            '<option value="Trainer"' + (user.role === "Trainer" ? " selected" : "") + '>Trainer (Create &rarr; Teach &rarr; Monitor)</option>' +
            '<option value="Admin"' + (user.role === "Admin" ? " selected" : "") + '>Administrator (Manage &rarr; Monitor &rarr; Analyze)</option>' +
          '</select>' +
        '</label>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-ghost" id="modalCancelBtn">Cancel</button>' +
          '<button type="button" class="btn btn-primary" id="confirmRoleBtn">Update Role</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    modalRoot.innerHTML = html;
    modalRoot.classList.remove("hidden");

    document.getElementById("modalCloseBtn").onclick = closeModal;
    document.getElementById("modalCancelBtn").onclick = closeModal;

    document.getElementById("confirmRoleBtn").onclick = function () {
      var newRole = document.getElementById("newRoleSelect").value;
      user.role = newRole;
      save(KEYS.users, state.users);
      renderUsersTable();
      closeModal();
      showToast("Role updated to " + newRole + " successfully.");
    };
  }

  // View User Details Modal
  function openUserDetailsModal(user) {
    if (!modalRoot) return;

    var html = '<div class="modal-shell">' +
      '<div class="modal-header">' +
        '<div><p class="modal-eyebrow">User Profile</p><h3 class="modal-title">' + esc(user.name) + '</h3></div>' +
        '<button class="modal-close" id="modalCloseBtn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div style="display:flex; align-items:center; gap:16px; margin-bottom:20px; padding:16px; border-radius:12px; background:var(--card-alt); border:1px solid var(--border-soft);">' +
          '<div class="avatar avatar-lg avatar-' + (user.color || "cyan") + '">' + esc(user.initials) + '</div>' +
          '<div>' +
            '<div style="font-size:16px; font-weight:700; color:#fff;">' + esc(user.name) + '</div>' +
            '<div style="font-size:12px; color:var(--slate-400);">' + esc(user.email) + '</div>' +
            '<div style="margin-top:6px; display:flex; gap:6px;">' +
              '<span class="badge badge-trainee">' + esc(user.role) + '</span>' +
              '<span class="badge badge-active">' + esc(user.status) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="form-grid">' +
          '<div class="field"><span>Joined Date</span><p style="color:#fff; font-weight:600;">' + esc(user.joined) + '</p></div>' +
          '<div class="field"><span>Competency Index</span><p style="color:var(--blue-400); font-weight:700;">' + (user.score ? user.score + "%" : "N/A (Pending)") + '</p></div>' +
          '<div class="field wide"><span>System Account Status</span><p style="color:var(--slate-300);">Verified account under Capacity Connect Enterprise Workspace.</p></div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" id="modalDismissBtn">Close</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    modalRoot.innerHTML = html;
    modalRoot.classList.remove("hidden");

    document.getElementById("modalCloseBtn").onclick = closeModal;
    document.getElementById("modalDismissBtn").onclick = closeModal;
  }

  // Export CSV functionality (Section 10)
  function exportCSV() {
    var rows = [
      ["Metric / Category", "Value", "Target", "Status"],
      ["Total Trainees", "1248", "1500", "Active"],
      ["Total Trainers", "86", "100", "Active"],
      ["Active Courses", "42", "50", "Published"],
      ["Assessments Completed", "128", "150", "Active"],
      ["Average Training Completion", "74%", "85%", "Proficient"],
      ["Certificates Issued", "936", "1000", "Issued"],
      [],
      ["Skill Name", "Average Score", "Competency Band", "Organizational Gap"],
      ["Programming", "75%", "Proficient", "10%"],
      ["Database Systems", "62%", "Proficient", "18%"],
      ["AI / ML", "48%", "Developing", "32%"],
      ["Communication", "81%", "Advanced", "5%"],
      ["Cybersecurity", "42%", "Developing", "33%"],
      ["Cloud Computing", "55%", "Developing", "25%"]
    ];

    var csvContent = "data:text/csv;charset=utf-8," + rows.map(function (e) { return e.join(","); }).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "capacity_connect_admin_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Report generated and downloaded successfully.");
  }

    /* =========================================================
    ADMIN DASHBOARD API STATS
    ========================================================= */

  var ADMIN_API_BASE_URL =
    "https://capacity-connect-backend-ejbl.onrender.com";

  async function loadAdminDashboardStats() {
    try {
      var response = await fetch(
        ADMIN_API_BASE_URL + "/admin/dashboard/stats"
      );

      if (!response.ok) {
        throw new Error(
          "Dashboard API returned " + response.status
        );
      }

      var data = await response.json();

      console.log("Admin Dashboard API Stats:", data);

      /* -------------------------
        KPI CARDS
        ------------------------- */

      var trainees =
        document.getElementById("adminTotalTrainees");

      var trainers =
        document.getElementById("adminTotalTrainers");

      var courses =
        document.getElementById("adminActiveCourses");

      var assessments =
        document.getElementById("adminAssessmentsCompleted");

      var averageScore =
        document.getElementById("adminAverageScore");

      var certificates =
        document.getElementById("adminCertificatesIssued");

      /* -------------------------
        UPDATE VALUES
        ------------------------- */

      if (trainees) {
        trainees.textContent =
          data.total_trainees ?? 0;
      }

      if (trainers) {
        trainers.textContent =
          data.total_trainers ?? 0;
      }

      if (courses) {
        courses.textContent =
          data.total_courses ?? 0;
      }

      if (assessments) {
        assessments.textContent =
          data.assessment_attempts ?? 0;
      }

      if (averageScore) {
        averageScore.textContent =
          (data.average_score ?? 0) + "%";
      }

      if (certificates) {
        certificates.textContent =
          data.total_certificates ?? 0;
      }

      /* -------------------------
        PENDING APPROVAL COUNT
        ------------------------- */

      var pendingCount =
        document.getElementById("countPending");

      if (pendingCount) {
        pendingCount.textContent =
          data.pending_users ?? 0;
      }

    } catch (error) {

      console.error(
        "Failed to load Admin Dashboard stats:",
        error
      );

      /*
        Keep the dashboard usable if
        the API is temporarily unavailable.
      */

      var errorTargets = [
        "adminTotalTrainees",
        "adminTotalTrainers",
        "adminActiveCourses",
        "adminAssessmentsCompleted",
        "adminAverageScore",
        "adminCertificatesIssued"
      ];

      errorTargets.forEach(function (id) {
        var element = document.getElementById(id);

        if (element) {
          element.textContent = "—";
        }
      });

      var pendingCount =
        document.getElementById("countPending");

      if (pendingCount) {
        pendingCount.textContent = "—";
      }
    }
  }

  /* ---------------- Global Event Listeners ---------------- */
  function initEventListeners() {

    // Mobile hamburger menu toggle
    var menuBtn = document.getElementById("menuBtn");
    if (menuBtn) {
      menuBtn.addEventListener("click", toggleMobileSidebar);
    }
    var mobileOverlay = document.getElementById("mobileOverlay");
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", closeMobileSidebar);
    }

    // Sidebar navigation clicks
    document.addEventListener("click", function (e) {
      var navBtn = e.target.closest("[data-view]");
      if (navBtn) {
        var view = navBtn.getAttribute("data-view");
        if (view === "logout") {
          showToast("Session ended. Redirecting to login...");
          setTimeout(function () {
            window.location.href = "login.html";
          }, 1000);
          return;
        }
        switchView(view);
        // Close dropdowns
        closeDropdowns();
      }
    });

    // Topbar notification dropdown toggle
    var notifBtn = document.getElementById("notifBtn");
    var notifPanel = document.getElementById("notifPanel");
    if (notifBtn && notifPanel) {
      notifBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        notifPanel.classList.toggle("hidden");
        var profilePanel = document.getElementById("profilePanel");
        if (profilePanel) profilePanel.classList.add("hidden");
      });
    }

    // Topbar profile dropdown toggle
    var profileBtn = document.getElementById("profileBtn");
    var profilePanel = document.getElementById("profilePanel");
    if (profileBtn && profilePanel) {
      profileBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        profilePanel.classList.toggle("hidden");
        if (notifPanel) notifPanel.classList.add("hidden");
      });
    }

    // Mark all notifications read
    var markAllRead = document.getElementById("markAllRead");
    if (markAllRead) {
      markAllRead.addEventListener("click", function () {
        state.notifications.forEach(function (n) { n.read = true; });
        save(KEYS.notifications, state.notifications);
        renderNotifications();
        showToast("All notifications marked as read.");
      });
    }
    var markAllReadFull = document.getElementById("markAllReadFull");
    if (markAllReadFull) {
      markAllReadFull.addEventListener("click", function () {
        state.notifications.forEach(function (n) { n.read = true; });
        save(KEYS.notifications, state.notifications);
        renderNotifications();
        showToast("All notifications marked as read.");
      });
    }

    // Close dropdowns on outside click
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".topbar-right")) {
        closeDropdowns();
      }
    });

    function closeDropdowns() {
      if (notifPanel) notifPanel.classList.add("hidden");
      if (profilePanel) profilePanel.classList.add("hidden");
    }

    // User Management Tabs
    var tabBtns = document.querySelectorAll(".tab-btn[data-tab]");
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", async function () {
        tabBtns.forEach(function (b) {
          b.classList.remove("active");
        });

        btn.classList.add("active");

        state.activeUserTab =
          btn.getAttribute("data-tab");

        if (state.activeUserTab === "pending") {
          await loadPendingAdminUsers();
        } else {
          await loadAdminUsers();
          renderTrainersTable();
        }
      });
    });

    // User Management Search & Filters
    var userSearchInput = document.getElementById("userSearchInput");
    if (userSearchInput) {
      userSearchInput.addEventListener("input", function () {
        state.userSearch = userSearchInput.value.trim();
        renderUsersTable();
      });
    }
    var userRoleFilter = document.getElementById("userRoleFilter");
    if (userRoleFilter) {
      userRoleFilter.addEventListener("change", function () {
        state.userRoleFilter = userRoleFilter.value;
        renderUsersTable();
      });
    }
    var userStatusFilter = document.getElementById("userStatusFilter");
    if (userStatusFilter) {
      userStatusFilter.addEventListener("change", function () {
        state.userStatusFilter = userStatusFilter.value;
        renderUsersTable();
      });
    }

    // Course Management Filters
    var courseFilterStatus = document.getElementById("courseFilterStatus");
    if (courseFilterStatus) {
      courseFilterStatus.addEventListener("change", function () {
        state.courseFilterStatus = courseFilterStatus.value;
        renderCoursesTable();
      });
    }
    var courseFilterSkill = document.getElementById("courseFilterSkill");
    if (courseFilterSkill) {
      courseFilterSkill.addEventListener("change", function () {
        state.courseFilterSkill = courseFilterSkill.value;
        renderCoursesTable();
      });
    }

    // Assessment Management Filters
    var asmtSearch = document.getElementById("assessmentSearchInput");
    if (asmtSearch) {
      asmtSearch.addEventListener("input", function () {
        state.assessmentSearch = asmtSearch.value.trim();
        renderAssessmentsTable();
      });
    }
    var asmtSkillFilter = document.getElementById("assessmentSkillFilter");
    if (asmtSkillFilter) {
      asmtSkillFilter.addEventListener("change", function () {
        state.assessmentSkillFilter = asmtSkillFilter.value;
        renderAssessmentsTable();
      });
    }

    // Global Search Bar in Topbar
    var globalSearch = document.getElementById("globalSearch");
    if (globalSearch) {
      globalSearch.addEventListener("input", function () {
        var val = globalSearch.value.trim().toLowerCase();
        if (!val) return;
        // Search across courses or users
        if (val.indexOf("course") !== -1 || val.indexOf("ml") !== -1 || val.indexOf("python") !== -1) {
          switchView("courses");
        } else if (val.indexOf("trainee") !== -1 || val.indexOf("user") !== -1 || val.indexOf("muneeb") !== -1) {
          switchView("users");
        }
      });
    }

    // Table Action Delegations
    document.addEventListener("click", async function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      var id = btn.getAttribute("data-id");

      // User Actions
      if (action === "approve-user") {
        await approveAdminUser(id, btn);
            
      } else if (action === "reject-user") {
        var userToReject = state.users.find(function (u) { return u.id === id; });
        if (userToReject) {
          userToReject.status = "Disabled";
          save(KEYS.users, state.users);
          renderUsersTable();
          showToast("User registration rejected.");
        }
      } else if (action === "toggle-status") {
        var userToToggle = state.users.find(function (u) { return u.id === id; });
        if (userToToggle) {
          userToToggle.status = userToToggle.status === "Active" ? "Disabled" : "Active";
          save(KEYS.users, state.users);
          renderUsersTable();
          showToast("User status updated to " + userToToggle.status);
        }
      } else if (action === "change-role") {
        var userToRole = state.users.find(function (u) { return u.id === id; });
        if (userToRole) openChangeRoleModal(userToRole);
      } else if (action === "view-user") {
        var userToView = state.users.find(function (u) { return u.id === id; });
        if (userToView) openUserDetailsModal(userToView);
      }

      // Course Actions
      else if (action === "approve-course") {
        var courseToApprove = state.courses.find(function (c) { return c.id === id; });
        if (courseToApprove) {
          courseToApprove.status = "Published";
          save(KEYS.courses, state.courses);
          renderCoursesTable();
          showToast("Course approved successfully.");
        }
      } else if (action === "archive-course") {
        var courseToArchive = state.courses.find(function (c) { return c.id === id; });
        if (courseToArchive) {
          courseToArchive.status = "Archived";
          save(KEYS.courses, state.courses);
          renderCoursesTable();
          showToast("Course archived.");
        }
      }

      // Assessment Actions
      else if (action === "toggle-assessment") {
        var asmt = state.assessments.find(function (a) { return a.id === id; });
        if (asmt) {
          asmt.status = asmt.status === "Active" ? "Draft" : "Active";
          save(KEYS.assessments, state.assessments);
          renderAssessmentsTable();
          showToast("Assessment status updated to " + asmt.status);
        }
      }

      // Certificate Actions
      else if (action === "view-cert") {
        var cert = state.certificates.find(function (c) { return c.id === id; });
        if (cert) openCertificateModal(cert);
      } else if (action === "verify-cert") {
        var certToVerify = state.certificates.find(function (c) { return c.id === id; });
        if (certToVerify) {
          showToast("Certificate " + certToVerify.certId + " is verified authentic.");
        }
      } else if (action === "revoke-cert") {
        var certToRevoke = state.certificates.find(function (c) { return c.id === id; });
        if (certToRevoke) {
          certToRevoke.status = "Revoked";
          save(KEYS.certificates, state.certificates);
          renderCertificatesTable();
          showToast("Certificate " + certToRevoke.certId + " revoked.");
        }
      }

      // Announcement Actions
      else if (action === "delete-announcement") {
        state.announcements = state.announcements.filter(function (a) { return a.id !== id; });
        save(KEYS.announcements, state.announcements);
        renderAnnouncements();
        showToast("Announcement deleted.");
      }
    
    });

    // Create Announcement Modal Trigger
    var createAnnBtn = document.getElementById("createAnnouncementBtn");
    if (createAnnBtn) {
      createAnnBtn.addEventListener("click", openCreateAnnouncementModal);
    }

    // Reports Export CSV Buttons
    var exportCsvBtn = document.getElementById("exportCsvBtn");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", exportCSV);
    }
    var generateReportBtn = document.getElementById("generateReportBtn");
    if (generateReportBtn) {
      generateReportBtn.addEventListener("click", function () {
        showToast("Compiling competency metrics report...");
        setTimeout(exportCSV, 600);
      });
    }

    // Admin Profile Form Save
    var profileForm = document.getElementById("adminProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        state.profile.name = document.getElementById("pfName").value.trim() || state.profile.name;
        state.profile.email = document.getElementById("pfEmail").value.trim() || state.profile.email;
        state.profile.role = document.getElementById("pfRole").value.trim() || state.profile.role;
        state.profile.org = document.getElementById("pfOrg").value.trim() || state.profile.org;
        state.profile.phone = document.getElementById("pfPhone").value.trim() || state.profile.phone;
        state.profile.bio = document.getElementById("pfBio").value.trim() || state.profile.bio;

        save(KEYS.profile, state.profile);
        renderProfileForm();
        showToast("Administrator profile saved successfully.");
      });
    }

    // Reset Data Button in Settings
    var resetDataBtn = document.getElementById("resetDataBtn");
    if (resetDataBtn) {
      resetDataBtn.addEventListener("click", function () {
        if (confirm("Reset all prototype data to default seed state?")) {
          Object.keys(KEYS).forEach(function (k) {
            localStorage.removeItem(KEYS[k]);
          });
          location.reload();
        }
      });
    }
  }

  /* ---------------- Init ---------------- */
  async function init() {
    renderCompetencyBars();
    renderSkillGaps();
    renderUsersTable();
    renderCoursesTable();
    renderAssessmentsTable();
    renderCertificatesTable();
    renderAnnouncements();
    renderTrainersTable();
    renderNotifications();
    renderParticipationChart();
    renderProfileForm();
    initEventListeners();

    await loadAdminDashboardStats();
    await loadAdminUsers();
    await loadCourseManagementData();
    await loadAdminAssessmentAnalytics();
    await loadAdminUsersForTrainers();

  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
