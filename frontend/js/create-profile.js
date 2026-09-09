/* =========================================================
   CAPACITY CONNECT — Create Profile (vanilla JS)
   No build step. No dependencies. Works via file://
   ========================================================= */
(function () {
  "use strict";

  var PROFILE_KEY = "capacityConnectProfile";
  var SIGNUP_KEY = "capacityConnectSignup";
  var EMAIL_KEY = "capacityConnectEmail";

  var INTERESTS = ["Programming", "Web Development", "Database Systems", "Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity", "Cloud Computing", "Communication", "Leadership"];
  var SKILLS_BASE = ["Python", "C", "C++", "Java", "JavaScript", "HTML", "CSS", "SQL", "Data Structures", "Git", "GitHub", "FastAPI", "React", "Docker", "Artificial Intelligence", "Machine Learning", "Data Science", "Communication", "Team Collaboration"];
  var EXPERTISE_OPTIONS = ["Python", "C++", "Database Systems", "Artificial Intelligence", "Machine Learning", "Data Science", "Web Development", "Cybersecurity", "Cloud Computing"];

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- signup context ---------------- */
  function getSignupContext() {
    try {
      var raw = localStorage.getItem(SIGNUP_KEY);
      var stored = raw ? JSON.parse(raw) : {};
      var role = stored.role === "trainer" ? "trainer" : "trainee";
      return { role: role, email: stored.email || localStorage.getItem(EMAIL_KEY) || "" };
    } catch (e) {
      return { role: "trainee", email: "" };
    }
  }
  function loadExistingProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  var signup = getSignupContext();
  var existing = loadExistingProfile();

  /* ---------------- state ---------------- */
  var state = {
    role: existing ? existing.role : signup.role,
    fullName: existing ? existing.fullName || "" : "",
    email: existing ? existing.email || "" : signup.email,
    phone: existing ? existing.phone || "" : "",
    qualification: existing ? existing.qualification || "" : "",
    organization: existing ? existing.organization || "" : "",
    bio: existing ? existing.bio || "" : "",
    profileImage: existing ? existing.profileImage || "" : "",
    workExperience: existing && existing.trainee ? existing.trainee.workExperience || "" : "",
    interests: existing && existing.trainee ? (existing.trainee.learningInterests || []).slice() : [],
    skills: existing && existing.trainee ? (existing.trainee.skills || []).slice() : [],
    learningGoals: existing && existing.trainee ? existing.trainee.learningGoals || "" : "",
    expertise: existing && existing.trainer ? (existing.trainer.expertise || []).slice() : [],
    specialization: existing && existing.trainer ? existing.trainer.specialization || "" : "",
    experienceYears: existing && existing.trainer ? existing.trainer.experienceYears || "" : "",
    availability: existing && existing.trainer ? existing.trainer.availability || "" : "",
    professionalBackground: existing && existing.trainer ? existing.trainer.professionalBackground || "" : "",
    customSkill: "",
    errors: {},
    saving: false,
  };
  var emailWasFromSignup = Boolean(signup.email) && !existing;

  /* ---------------- dom refs ---------------- */
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- render: chips ---------------- */
  function renderChipRow(containerId, options, selectedArr, onToggle) {
    var el = $(containerId);
    el.innerHTML = options.map(function (opt) {
      var isSel = selectedArr.indexOf(opt) !== -1;
      return '<button type="button" class="chip' + (isSel ? " selected" : "") + '" data-chip="' + esc(opt) + '">' +
        (isSel ? '<svg class="chip-check" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : "") +
        esc(opt) + "</button>";
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll(".chip"), function (btn) {
      btn.addEventListener("click", function () {
        onToggle(btn.getAttribute("data-chip"));
      });
    });
  }
  function renderInterestsChips() {
    renderChipRow("interestsChips", INTERESTS, state.interests, function (v) {
      toggleInArray(state.interests, v);
      renderInterestsChips();
      updateCompletion();
    });
  }
  function skillsOptionList() {
    var extra = state.skills.filter(function (s) { return SKILLS_BASE.indexOf(s) === -1; });
    return SKILLS_BASE.concat(extra);
  }
  function renderSkillsChips() {
    renderChipRow("skillsChips", skillsOptionList(), state.skills, function (v) {
      toggleInArray(state.skills, v);
      renderSkillsChips();
      updateCompletion();
    });
  }
  function renderExpertiseChips() {
    renderChipRow("expertiseChips", EXPERTISE_OPTIONS, state.expertise, function (v) {
      toggleInArray(state.expertise, v);
      renderExpertiseChips();
      updateCompletion();
    });
  }
  function toggleInArray(arr, value) {
    var idx = arr.indexOf(value);
    if (idx === -1) arr.push(value); else arr.splice(idx, 1);
  }

  /* ---------------- role toggle ---------------- */
  function applyRole(role) {
    state.role = role;
    state.errors = {};
    clearAllFieldErrors();
    $("roleTraineeBtn").classList.toggle("active", role === "trainee");
    $("roleTrainerBtn").classList.toggle("active", role === "trainer");
    $("traineeLearningSection").classList.toggle("hidden", role !== "trainee");
    $("traineeSkillsSection").classList.toggle("hidden", role !== "trainee");
    $("trainerSection").classList.toggle("hidden", role !== "trainer");
    updateCompletion();
  }

  /* ---------------- select placeholder styling ---------------- */
  function wireSelectPlaceholder(id) {
    var sel = $(id);
    sel.addEventListener("change", function () {
      sel.classList.toggle("placeholder", !sel.value);
      state[id] = sel.value;
      updateCompletion();
    });
  }

  /* ---------------- photo upload ---------------- */
  function setPhotoError(msg) {
    var el = $("photoError");
    if (msg) { el.textContent = msg; el.classList.remove("hidden"); }
    else { el.textContent = ""; el.classList.add("hidden"); }
  }
  function renderPhoto() {
    var frame = $("photoFrame");
    if (state.profileImage) {
      frame.innerHTML = '<img src="' + state.profileImage + '" alt="Profile preview" />';
      $("removePhotoBtn").classList.remove("hidden");
    } else {
      frame.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>';
      $("removePhotoBtn").classList.add("hidden");
    }
  }
  function wirePhotoUpload() {
    $("photoInput").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type) || file.size > 2 * 1024 * 1024) {
        setPhotoError("Please choose a JPG or PNG image smaller than 2MB.");
        e.target.value = "";
        return;
      }
      setPhotoError("");
      var reader = new FileReader();
      reader.onload = function () {
        state.profileImage = String(reader.result);
        renderPhoto();
      };
      reader.readAsDataURL(file);
    });
    $("removePhotoBtn").addEventListener("click", function () {
      state.profileImage = "";
      $("photoInput").value = "";
      renderPhoto();
    });
  }

  /* ---------------- completion ---------------- */
  function updateCompletion() {
    var required = [state.fullName, state.email, state.qualification];
    var optional = state.role === "trainee"
      ? [state.phone, state.organization, state.bio, state.workExperience, state.interests.length ? "yes" : "", state.skills.length ? "yes" : "", state.learningGoals]
      : [state.phone, state.organization, state.bio, state.expertise.length ? "yes" : "", state.specialization, state.experienceYears, state.availability, state.professionalBackground];
    var totalWeight = required.length * 2 + optional.length;
    var completedWeight = required.filter(Boolean).length * 2 + optional.filter(Boolean).length;
    var pct = Math.round((completedWeight / totalWeight) * 100);
    $("completionPct").textContent = pct + "%";
    $("completionFill").style.width = pct + "%";
  }

  /* ---------------- field wiring ---------------- */
  function clearFieldError(key) {
    delete state.errors[key];
    var el = $("err-" + key);
    if (el) { el.textContent = ""; el.classList.add("hidden"); }
  }
  function clearAllFieldErrors() {
    ["fullName", "email", "qualification"].forEach(clearFieldError);
  }
  function bindTextField(id, stateKey) {
    $(id).addEventListener("input", function (e) {
      state[stateKey] = e.target.value;
      clearFieldError(stateKey);
      updateCompletion();
    });
  }

  function wireBio() {
    $("bio").addEventListener("input", function (e) {
      state.bio = e.target.value;
      $("bioCount").textContent = e.target.value.length + " / 300";
      updateCompletion();
    });
  }

  function wireCustomSkill() {
    function addCustomSkill() {
      var val = $("customSkillInput").value.trim();
      if (val && state.skills.indexOf(val) === -1) {
        state.skills.push(val);
        $("customSkillInput").value = "";
        renderSkillsChips();
        updateCompletion();
      }
    }
    $("addSkillBtn").addEventListener("click", addCustomSkill);
    $("customSkillInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); }
    });
  }

  /* ---------------- validation ---------------- */
  function validate() {
    var errors = {};
    if (!state.fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!state.email.trim() || !/^\S+@\S+\.\S+$/.test(state.email)) errors.email = "Please enter a valid email address.";
    if (!state.qualification) errors.qualification = "Please select your qualification.";
    state.errors = errors;
    ["fullName", "email", "qualification"].forEach(function (key) {
      var el = $("err-" + key);
      if (errors[key]) { el.textContent = errors[key]; el.classList.remove("hidden"); }
      else { el.textContent = ""; el.classList.add("hidden"); }
    });
    return Object.keys(errors).length === 0;
  }

  /* ---------------- save ---------------- */
  async function saveProfile() {
    var userId =
        localStorage.getItem("registeredUserId") ||
        localStorage.getItem("userId");

    if (!userId) {
        alert("User ID not found. Please register again.");
        return false;
    }

    // Role comes from the existing role toggle/state
    var role =
        state.role === "trainer"
            ? "trainer"
            : "trainee";

    // Existing fields from the ACTUAL state object
    var phone =
        String(state.phone || "").trim();

    var qualification =
        String(state.qualification || "").trim();

    var workExperience =
        String(
            state.workExperience ||
            state.experienceYears ||
            ""
        ).trim();

    // profiles.interests is TEXT, so convert selected chips to a string
    var interests =
        Array.isArray(state.interests)
            ? state.interests.join(", ")
            : String(state.interests || "").trim();

    var bio =
        String(state.bio || "").trim();

    var profileImage =
        state.profileImage || null;

    try {
        var response = await fetch(
            "https://capacity-connect-backend-ejbl.onrender.com/profiles",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    role: role,
                    phone: phone || null,
                    qualification: qualification || null,
                    work_experience: workExperience || null,
                    interests: interests || null,
                    bio: bio || null,
                    profile_image: profileImage
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
                "Profile could not be saved.";

            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage
                    .map(function (err) {
                        return err.msg || "Invalid input";
                    })
                    .join(", ");
            }

            throw new Error(errorMessage);
        }

        console.log("Profile saved successfully:", data);

        // Store confirmed user ID
        if (data.user && data.user.id) {
            localStorage.setItem(
                "userId",
                data.user.id
            );
        } else {
            localStorage.setItem(
                "userId",
                userId
            );
        }

        // Store final role returned by backend
        if (data.user && data.user.role) {
            localStorage.setItem(
                "userRole",
                data.user.role
            );
        } else {
            localStorage.setItem(
                "userRole",
                role
            );
        }

        // Keep existing local profile as backup
        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify({
                ...state,
                profileCompleted: true,
                approvalStatus: "pending"
            })
        );

        return true;

    } catch (error) {
        console.error(
            "Profile save error:",
            error
        );

        alert(
            error.message ||
            "Unable to save profile. Please try again."
        );

        return false;
    }
  }

  function wireSubmit() {
    $("profileForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!validate()) {
            var firstKey = Object.keys(state.errors)[0];

            if (firstKey && $(firstKey)) {
                $(firstKey).focus();
            }

            return;
        }

        if (state.saving) {
            return;
        }

        state.saving = true;

        $("submitBtn").disabled = true;
        $("submitBtnText").textContent = "Saving Profile...";

        var success = await saveProfile();

        if (success) {
            $("profileScreen").classList.add("hidden");
            $("successScreen").classList.remove("hidden");

            window.scrollTo(0, 0);
        } else {
            state.saving = false;

            $("submitBtn").disabled = false;
            $("submitBtnText").textContent =
                "Create Profile & Start Assessment →";
        }
    });
  }

  /* ---------------- skip dialog ---------------- */
  function wireSkipDialog() {
    $("skipBtn").addEventListener("click", function () { $("skipOverlay").classList.remove("hidden"); });
    $("skipDialogClose").addEventListener("click", function () { $("skipOverlay").classList.add("hidden"); });
    $("skipKeepBtn").addEventListener("click", function () { $("skipOverlay").classList.add("hidden"); });
    $("skipOverlay").addEventListener("mousedown", function (e) { if (e.target === $("skipOverlay")) $("skipOverlay").classList.add("hidden"); });
    $("skipContinueBtn").addEventListener("click", function () { window.location.href = "pending-approval.html"; });
  }
  function wireContinue() {
    $("continueBtn").addEventListener("click", function () { window.location.href = "pending-approval.html"; });
  }

  /* ---------------- populate form from state (existing profile) ---------------- */
  function populateFormFromState() {
    $("fullName").value = state.fullName;
    $("email").value = state.email;
    if (emailWasFromSignup) { $("email").setAttribute("readonly", "readonly"); $("email").classList.add("readonly-email"); }
    $("phone").value = state.phone;
    $("qualification").value = state.qualification;
    $("qualification").classList.toggle("placeholder", !state.qualification);
    $("organization").value = state.organization;
    $("bio").value = state.bio;
    $("bioCount").textContent = state.bio.length + " / 300";
    $("workExperience").value = state.workExperience;
    $("workExperience").classList.toggle("placeholder", !state.workExperience);
    $("learningGoals").value = state.learningGoals;
    $("specialization").value = state.specialization;
    $("experienceYears").value = state.experienceYears;
    $("experienceYears").classList.toggle("placeholder", !state.experienceYears);
    $("availability").value = state.availability;
    $("availability").classList.toggle("placeholder", !state.availability);
    $("professionalBackground").value = state.professionalBackground;
    renderPhoto();
    applyRole(state.role);
    renderInterestsChips();
    renderSkillsChips();
    renderExpertiseChips();
    updateCompletion();
  }

  /* ---------------- init ---------------- */
  function init() {
    bindTextField("fullName", "fullName");
    bindTextField("email", "email");
    bindTextField("phone", "phone");
    bindTextField("organization", "organization");
    bindTextField("learningGoals", "learningGoals");
    bindTextField("specialization", "specialization");
    bindTextField("professionalBackground", "professionalBackground");
    wireBio();
    wireSelectPlaceholder("qualification");
    wireSelectPlaceholder("workExperience");
    wireSelectPlaceholder("experienceYears");
    wireSelectPlaceholder("availability");
    wirePhotoUpload();
    wireCustomSkill();
    wireSubmit();
    wireSkipDialog();
    wireContinue();

    $("roleTraineeBtn").addEventListener("click", function () { applyRole("trainee"); });
    $("roleTrainerBtn").addEventListener("click", function () { applyRole("trainer"); });

    populateFormFromState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
