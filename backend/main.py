from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recommendation.recommender import recommend_courses
from supabase_client import supabase, supabase_admin


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Capacity Connect Backend",
    description="Backend API for the Capacity Connect platform",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Capacity Connect Backend is running!"
    }


# =========================================================
# PYDANTIC MODELS
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "trainee"


class LoginRequest(BaseModel):
    email: str
    password: str


class ApprovalRequest(BaseModel):
    is_approved: bool


class Skill(BaseModel):
    name: str
    description: str
    category: str


class Course(BaseModel):
    title: str
    description: str
    difficulty: str
    duration: str
    resource_url: str
    skill_id: int
    trainer_id: str


class Assessment(BaseModel):
    title: str
    description: str
    skill_id: int
    trainer_id: str
    total_questions: int
    deadline: str


class Question(BaseModel):
    assessment_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    marks: int


# =========================================================
# AUTHENTICATION
# =========================================================


# -------------------------
# REGISTER
# -------------------------

@app.post("/auth/register")
def register(data: RegisterRequest):

    # 1. Validate role
    role = data.role.strip().lower()

    if role not in {"trainee", "trainer"}:
        raise HTTPException(
            status_code=400,
            detail="Role must be either trainee or trainer"
        )

    # 2. Create Supabase Auth user
    try:
        auth_response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    if not auth_response.user:
        raise HTTPException(
            status_code=400,
            detail="User registration failed"
        )

    user_id = auth_response.user.id

    # 3. Create record in Users table
    user_data = {
        "id": user_id,
        "Name": data.name,
        "Email": data.email,
        "role": role,
        "is_approved": False
    }

    try:
        user_response = (
            supabase_admin
            .table("Users")
            .insert(user_data)
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"User record could not be created: {str(e)}"
        )

    if not user_response.data:
        raise HTTPException(
            status_code=500,
            detail="User record could not be created"
        )

    # 3.5 Create trainer profile automatically
    if role == "trainer":
        try:
            trainer_response = (
                supabase_admin
                .table("trainers")
                .insert({
                    "user_id": user_id,
                    "availability": True
                })
                .execute()
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Trainer profile could not be created: {str(e)}"
            )

        if not trainer_response.data:
            raise HTTPException(
                status_code=500,
                detail="Trainer profile could not be created"
            )

    # 4. Return result
    return {
        "message": "Registration successful. Waiting for admin approval.",
        "user": user_response.data[0]
    }


# -------------------------
# LOGIN
# -------------------------

@app.post("/auth/login")
def login_user(data: LoginRequest):

    # Login through Supabase Auth
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not auth_response.user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    auth_user_id = auth_response.user.id

    # Get user information from our Users table
    user_response = (
        supabase_admin
        .table("Users")
        .select("id, Name, Email, role, is_approved")
        .eq("id", auth_user_id)
        .single()
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )

    user = user_response.data

    # Check admin approval
    if not user["is_approved"]:
        raise HTTPException(
            status_code=403,
            detail="Account is waiting for admin approval"
        )

    # Make sure a session/token exists
    if not auth_response.session:
        raise HTTPException(
            status_code=401,
            detail="Login session could not be created"
        )

    return {
        "message": "Login successful",
        "user": user,
        "access_token": auth_response.session.access_token
    }


# -------------------------
# ADMIN APPROVAL
# -------------------------

@app.patch("/admin/users/{user_id}/approve")
def approve_user(
    user_id: str,
    data: ApprovalRequest
):

    # Uses service/admin client to update Users table
    response = (
        supabase_admin
        .table("Users")
        .update({
            "is_approved": data.is_approved
        })
        .eq("id", user_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "User approval status updated successfully",
        "user": response.data[0]
    }


@app.get("/admin/users/pending")
def get_pending_users():

    response = (
        supabase_admin
        .table("Users")
        .select("id,Name,Email,role,is_approved,created_at")
        .eq("is_approved", False)
        .order("created_at", desc=False)
        .execute()
    )

    return response.data or []


@app.get("/admin/users")
def get_all_users():

    response = (
        supabase_admin
        .table("Users")
        .select("id,Name,Email,role,is_approved,created_at")
        .order("created_at", desc=False)
        .execute()
    )

    return response.data or []


@app.get("/results")
def get_results():

    response = (
        supabase_admin
        .table("results")
        .select("*")
        .order("completed_at", desc=True)
        .execute()
    )

    return response.data or []


@app.get("/certificates")
def get_certificates():

    response = (
        supabase_admin
        .table("certificates")
        .select("*")
        .execute()
    )

    return response.data or []


# =========================================================
# SKILLS
# =========================================================


# -------------------------
# GET ALL SKILLS
# -------------------------

@app.get("/skills")
def get_skills():

    response = supabase.table("skills").select("*").execute()

    return response.data


# -------------------------
# CREATE SKILL
# -------------------------

@app.post("/skills")
def create_skill(skill: Skill):

    response = supabase.table("skills").insert({
        "name": skill.name,
        "description": skill.description,
        "category": skill.category
    }).execute()

    return response.data


# -------------------------
# UPDATE SKILL
# -------------------------

@app.patch("/skills/{skill_id}")
def update_skill(
    skill_id: int,
    skill: Skill
):

    response = (
        supabase
        .table("skills")
        .update({
            "name": skill.name,
            "description": skill.description,
            "category": skill.category
        })
        .eq("id", skill_id)
        .execute()
    )

    return response.data


# -------------------------
# DELETE SKILL
# -------------------------

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int):

    response = (
        supabase
        .table("skills")
        .delete()
        .eq("id", skill_id)
        .execute()
    )

    return response.data


# =========================================================
# COURSES
# =========================================================
#
# IMPORTANT:
# Your actual database column is:
#
# resource_ur1
#
# The last character is the number "1", not the letter "l".
#
# We keep it exactly as it exists in your database.
# =========================================================


# -------------------------
# GET ALL COURSES
# -------------------------

@app.get("/courses")
def get_courses():

    # 1. Get all courses
    courses_response = (
        supabase_admin
        .table("courses")
        .select("*")
        .execute()
    )

    courses = courses_response.data or []

    if not courses:
        return []

    # 2. Get all enrollments
    enrollments_response = (
        supabase_admin
        .table("enrollments")
        .select("id, course_id")
        .execute()
    )

    enrollments = enrollments_response.data or []

    # 3. Count enrollments for each course
    enrollment_counts = {}

    for enrollment in enrollments:
        course_id = enrollment["course_id"]

        enrollment_counts[course_id] = (
            enrollment_counts.get(course_id, 0) + 1
        )

    # 4. Add enrollment_count to every course
    for course in courses:
        course["enrollment_count"] = enrollment_counts.get(
            course["id"],
            0
        )

    return courses

# -------------------------
# GET COURSE BY ID
# -------------------------

@app.get("/courses/{course_id}")
def get_course(course_id: int):

    response = (
        supabase
        .table("courses")
        .select("*")
        .eq("id", course_id)
        .execute()
    )

    return response.data


# -------------------------
# CREATE COURSE
# -------------------------

@app.post("/courses")
def create_course(course: Course):

    response = (
        supabase_admin
        .table("courses")
        .insert({
            "title": course.title,
            "description": course.description,
            "difficulty": course.difficulty,
            "duration": course.duration,
            "resource_ur1": course.resource_url,
            "skill_id": course.skill_id,
            "trainer_id": course.trainer_id
        })
        .execute()
    )

    return response.data


# -------------------------
# UPDATE COURSE
# -------------------------

@app.patch("/courses/{course_id}")
def update_course(
    course_id: int,
    course: Course
):

    response = (
        supabase_admin
        .table("courses")
        .update({
            "title": course.title,
            "description": course.description,
            "difficulty": course.difficulty,
            "duration": course.duration,
            "resource_ur1": course.resource_url,
            "skill_id": course.skill_id,
            "trainer_id": course.trainer_id
        })
        .eq("id", course_id)
        .execute()
    )

    return response.data
@app.get("/trainers/{user_id}/courses")
def get_trainer_courses(user_id: str):

    # Get courses belonging to this trainer
    courses_response = (
        supabase_admin
        .table("courses")
        .select("*")
        .eq("trainer_id", user_id)
        .execute()
    )

    courses = courses_response.data or []

    if not courses:
        return []

    # Get enrollments for enrollment counts
    enrollments_response = (
        supabase_admin
        .table("enrollments")
        .select("course_id")
        .execute()
    )

    enrollments = enrollments_response.data or []

    enrollment_counts = {}

    for enrollment in enrollments:
        course_id = enrollment["course_id"]
        enrollment_counts[course_id] = enrollment_counts.get(course_id, 0) + 1

    # Add enrollment count to each trainer course
    for course in courses:
        course["enrollment_count"] = enrollment_counts.get(course["id"], 0)

    return courses


# -------------------------
# DELETE COURSE
# -------------------------

@app.delete("/courses/{course_id}")
def delete_course(course_id: int):

    response = (
        supabase_admin
        .table("courses")
        .delete()
        .eq("id", course_id)
        .execute()
    )

    return response.data


# =========================================================
# ASSESSMENTS
# =========================================================


# -------------------------
# GET ALL ASSESSMENTS
# -------------------------

@app.get("/assessments")
def get_assessments():

    response = supabase.table("assessments").select("*").execute()

    return response.data


# -------------------------
# GET ASSESSMENT BY ID
# -------------------------

@app.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: int):

    response = (
        supabase_admin 
        .table("assessments")
        .select("*")
        .eq("id", assessment_id)
        .execute()
    )

    return response.data


# -------------------------
# CREATE ASSESSMENT
# -------------------------

@app.post("/assessments")
def create_assessment(assessment: Assessment):

    # 1. Check that the trainer exists
    trainer_response = (
        supabase_admin
        .table("trainers")
        .select("user_id")
        .eq("user_id", assessment.trainer_id)
        .limit(1)
        .execute()
    )

    if not trainer_response.data:
        raise HTTPException(
            status_code=400,
            detail="Invalid trainer_id. The user is not registered as a trainer."
        )

    # 2. Create assessment
    response = (
        supabase_admin
        .table("assessments")
        .insert({
            "title": assessment.title,
            "description": assessment.description,
            "skill_id": assessment.skill_id,
            "trainer_id": assessment.trainer_id,
            "total_questions": assessment.total_questions,
            "deadline": assessment.deadline
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Assessment could not be created"
        )

    return response.data


# -------------------------
# UPDATE ASSESSMENT
# -------------------------

@app.patch("/assessments/{assessment_id}")
def update_assessment(
    assessment_id: int,
    assessment: Assessment
):

    response = (
        supabase
        .table("assessments")
        .update({
            "title": assessment.title,
            "description": assessment.description,
            "skill_id": assessment.skill_id,
            "trainer_id": assessment.trainer_id,
            "total_questions": assessment.total_questions,
            "deadline": assessment.deadline
        })
        .eq("id", assessment_id)
        .execute()
    )

    return response.data


# -------------------------
# DELETE ASSESSMENT
# -------------------------

@app.delete("/assessments/{assessment_id}")
def delete_assessment(assessment_id: int):

    response = (
        supabase
        .table("assessments")
        .delete()
        .eq("id", assessment_id)
        .execute()
    )

    return response.data

@app.get("/assessments/{assessment_id}/stats")
def get_assessment_stats(assessment_id: int):

    # 1. Check that the assessment exists
    assessment_response = (
        supabase_admin
        .table("assessments")
        .select("id")
        .eq("id", assessment_id)
        .limit(1)
        .execute()
    )

    if not assessment_response.data:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    # 2. Get all results for this assessment
    results_response = (
        supabase_admin
        .table("results")
        .select("score")
        .eq("assessment_id", assessment_id)
        .execute()
    )

    results = results_response.data or []

    # 3. If nobody has attempted it yet
    if not results:
        return {
            "assessment_id": assessment_id,
            "total_attempts": 0,
            "average_score": 0,
            "highest_score": 0,
            "lowest_score": 0
        }

    # 4. Extract scores
    scores = [
        float(result["score"])
        for result in results
        if result.get("score") is not None
    ]

    # 5. Calculate analytics
    if not scores:
        return {
            "assessment_id": assessment_id,
            "total_attempts": 0,
            "average_score": 0,
            "highest_score": 0,
            "lowest_score": 0
        }

    return {
        "assessment_id": assessment_id,
        "total_attempts": len(scores),
        "average_score": round(sum(scores) / len(scores), 2),
        "highest_score": max(scores),
        "lowest_score": min(scores)
    }
# =========================================================
# QUESTIONS
# =========================================================


# -------------------------
# GET ALL QUESTIONS
# -------------------------

@app.get("/questions")
def get_questions():

    response = (
        supabase_admin
        .table("questions")
        .select("*")
        .execute()
    )

    return response.data


# -------------------------
# GET QUESTION BY ID
# -------------------------

@app.get("/questions/{question_id}")
def get_question(question_id: int):

    response = (
        supabase
        .table("questions")
        .select("*")
        .eq("id", question_id)
        .execute()
    )

    return response.data


# -------------------------
# CREATE QUESTION
# -------------------------

@app.post("/questions")
def create_question(question: Question):

    response = (
        supabase
        .table("questions")
        .insert({
            "assessment_id": question.assessment_id,
            "question_text": question.question_text,
            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,
            "correct_option": question.correct_option,
            "marks": question.marks
        })
        .execute()
    )

    return response.data


# -------------------------
# UPDATE QUESTION
# -------------------------

@app.patch("/questions/{question_id}")
def update_question(
    question_id: int,
    question: Question
):

    response = (
        supabase
        .table("questions")
        .update({
            "assessment_id": question.assessment_id,
            "question_text": question.question_text,
            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,
            "correct_option": question.correct_option,
            "marks": question.marks
        })
        .eq("id", question_id)
        .execute()
    )

    return response.data


# -------------------------
# DELETE QUESTION
# -------------------------

@app.delete("/questions/{question_id}")
def delete_question(question_id: int):

    response = (
        supabase
        .table("questions")
        .delete()
        .eq("id", question_id)
        .execute()
    )

    return response.data


# =========================================================
# ENROLLMENTS
# =========================================================

class EnrollmentRequest(BaseModel):
    user_id: str
    course_id: int


@app.post("/enrollments", status_code=201)
def create_enrollment(data: EnrollmentRequest):

    # 1. Check that the user exists
    user_response = (
        supabase_admin
        .table("Users")
        .select("id, role")
        .eq("id", data.user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # 2. Check that the course exists
    course_response = (
        supabase_admin
        .table("courses")
        .select("id, title")
        .eq("id", data.course_id)
        .limit(1)
        .execute()
    )

    if not course_response.data:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    # 3. Check for an existing enrollment
    existing_response = (
        supabase_admin
        .table("enrollments")
        .select(
            "id, user_id, course_id, enrolled_at, status"
        )
        .eq("user_id", data.user_id)
        .eq("course_id", data.course_id)
        .limit(1)
        .execute()
    )

    if existing_response.data:
        raise HTTPException(
            status_code=409,
            detail="User is already enrolled in this course"
        )

    # 4. Create enrollment
    enrollment_response = (
        supabase_admin
        .table("enrollments")
        .insert({
            "user_id": data.user_id,
            "course_id": data.course_id,
            "status": "active"
        })
        .execute()
    )

    if not enrollment_response.data:
        raise HTTPException(
            status_code=500,
            detail="Enrollment could not be created"
        )

    return {
        "message": "Enrollment successful",
        "enrollment": enrollment_response.data[0]
    }


@app.get("/enrollments/{user_id}")
def get_user_enrollments(user_id: str):

    # 1. Check that the user exists
    user_response = (
        supabase_admin
        .table("Users")
        .select("id, role")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # 2. Get enrollments
    enrollment_response = (
        supabase_admin
        .table("enrollments")
        .select(
            "id, user_id, course_id, enrolled_at, status"
        )
        .eq("user_id", user_id)
        .order("enrolled_at", desc=True)
        .execute()
    )

    enrollments = enrollment_response.data or []

    if not enrollments:
        return []

    # 3. Collect course IDs
    course_ids = [
        item["course_id"]
        for item in enrollments
    ]

    # 4. Get the corresponding courses
    course_response = (
        supabase_admin
        .table("courses")
        .select(
            "id, title, description, difficulty, duration, "
            "resource_ur1, skill_id, trainer_id, created_at"
        )
        .in_("id", course_ids)
        .execute()
    )

    courses_by_id = {
        course["id"]: course
        for course in (course_response.data or [])
    }

    # 5. Combine enrollment + course data
    result = []

    for enrollment in enrollments:
        result.append({
            "id": enrollment["id"],
            "user_id": enrollment["user_id"],
            "course_id": enrollment["course_id"],
            "enrolled_at": enrollment["enrolled_at"],
            "status": enrollment["status"],
            "course": courses_by_id.get(
                enrollment["course_id"]
            )
        })

    return result


# =========================================================
# ASSESSMENT SUBMISSION
# =========================================================

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: str


class AssessmentSubmission(BaseModel):
    user_id: str
    answers: list[AnswerSubmission]


@app.post("/assessments/{assessment_id}/submit")
def submit_assessment(
    assessment_id: int,
    submission: AssessmentSubmission
):

    # -------------------------------------------------
    # 1. Check user exists
    # -------------------------------------------------

    user_response = (
        supabase_admin
        .table("Users")
        .select("id, role")
        .eq("id", submission.user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -------------------------------------------------
    # 2. Check assessment exists
    # -------------------------------------------------

    assessment_response = (
        supabase_admin
        .table("assessments")
        .select(
            "id, title, skill_id, total_questions"
        )
        .eq("id", assessment_id)
        .limit(1)
        .execute()
    )

    if not assessment_response.data:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    assessment = assessment_response.data[0]

    # -------------------------------------------------
    # 3. Get all questions for this assessment
    # -------------------------------------------------

    questions_response = (
        supabase_admin
        .table("questions")
        .select(
            "id, question_text, correct_option, marks"
        )
        .eq("assessment_id", assessment_id)
        .execute()
    )

    questions = questions_response.data or []

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for this assessment"
        )

    # -------------------------------------------------
    # 4. Validate submitted answers
    # -------------------------------------------------

    submitted_answers = {
        answer.question_id:
        answer.selected_option.strip().upper()
        for answer in submission.answers
    }

    question_ids = {
        question["id"]
        for question in questions
    }

    # Check for unknown question IDs
    invalid_question_ids = (
        set(submitted_answers.keys()) - question_ids
    )

    if invalid_question_ids:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid question IDs: "
                f"{sorted(invalid_question_ids)}"
            )
        )

    # Require every question to be answered
    missing_question_ids = (
        question_ids - set(submitted_answers.keys())
    )

    if missing_question_ids:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Missing answers for question IDs: "
                f"{sorted(missing_question_ids)}"
            )
        )

    # -------------------------------------------------
    # 5. Calculate score
    # -------------------------------------------------

    score = 0
    total_marks = 0
    correct_answers = 0

    for question in questions:

        marks = question["marks"] or 0
        total_marks += marks

        selected_option = submitted_answers[
            question["id"]
        ]

        correct_option = str(
            question["correct_option"]
        ).strip().upper()

        if selected_option == correct_option:
            score += marks
            correct_answers += 1

    # Prevent division by zero
    if total_marks <= 0:
        raise HTTPException(
            status_code=500,
            detail="Assessment has invalid total marks"
        )

    percentage = round(
        (score / total_marks) * 100,
        2
    )

    # -------------------------------------------------
    # 6. Determine attempt number
    # -------------------------------------------------

    previous_results_response = (
        supabase_admin
        .table("results")
        .select("id")
        .eq("user_id", submission.user_id)
        .eq("assessment_id", assessment_id)
        .execute()
    )

    previous_attempts = len(
        previous_results_response.data or []
    )

    attempt_number = previous_attempts + 1

    # -------------------------------------------------
    # 7. Save result
    # -------------------------------------------------

    result_response = (
        supabase_admin
        .table("results")
        .insert({
            "user_id": submission.user_id,
            "assessment_id": assessment_id,
            "score": score,
            "total_marks": total_marks,
            "percentage": percentage,
            "attempt_number": attempt_number
        })
        .execute()
    )

    if not result_response.data:
        raise HTTPException(
            status_code=500,
            detail="Assessment result could not be saved"
        )

    result = result_response.data[0]

    # -------------------------------------------------
    # 8. Calculate skill gap
    # -------------------------------------------------

    skill_id = assessment["skill_id"]

    # Demo target benchmark.
    # This can later come from a configurable benchmark system.
    target_score = 80

    current_score = percentage
    gap_score = max(
        target_score - current_score,
        0
    )

    if gap_score == 0:
        status = "Target Achieved"
    elif gap_score <= 20:
        status = "Needs Improvement"
    else:
        status = "Major Skill Gap"

    # -------------------------------------------------
    # 9. Update existing skill-gap row or create one
    # -------------------------------------------------

    existing_gap_response = (
        supabase_admin
        .table("skill_gaps")
        .select(
            "id, user_id, skills_id, current_score, "
            "target_score, gap_score, status"
        )
        .eq("user_id", submission.user_id)
        .eq("skills_id", skill_id)
        .limit(1)
        .execute()
    )

    gap_data = {
        "user_id": submission.user_id,
        "skills_id": skill_id,
        "current_score": current_score,
        "target_score": target_score,
        "gap_score": gap_score,
        "status": status
    }

    if existing_gap_response.data:

        gap_id = existing_gap_response.data[0]["id"]

        gap_response = (
            supabase_admin
            .table("skill_gaps")
            .update(gap_data)
            .eq("id", gap_id)
            .execute()
        )

    else:

        gap_response = (
            supabase_admin
            .table("skill_gaps")
            .insert(gap_data)
            .execute()
        )

    if not gap_response.data:
        raise HTTPException(
            status_code=500,
            detail="Skill gap could not be updated"
        )

    # -------------------------------------------------
    # 10. Return complete submission result
    # -------------------------------------------------

    return {
        "message": "Assessment submitted successfully",
        "result": result,
        "correct_answers": correct_answers,
        "total_questions": len(questions),
        "skill_gap": gap_response.data[0]
    }


# =========================================================
# SKILL GAPS
# =========================================================


# -------------------------
# GET SKILL GAPS FOR USER
# -------------------------

@app.get("/skill-gaps/{user_id}")
def get_user_skill_gaps(user_id: str):

    # 1. Check that the user exists
    user_response = (
        supabase_admin
        .table("Users")
        .select("id")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # 2. Get skill gaps for this user
    gap_response = (
        supabase_admin
        .table("skill_gaps")
        .select(
            "id, user_id, skills_id, current_score, "
            "target_score, gap_score, status, updated_at"
        )
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )

    return gap_response.data or []


# =========================================================
# RECOMMENDATIONS
# =========================================================

@app.get("/api/recommendations/{user_id}")
def get_recommendations(user_id: str):

    user_response = (
        supabase_admin
        .table("Users")
        .select(
            "id,Name,Email,role,is_approved"
        )
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user = user_response.data[0]

    if user.get("is_approved") is not True:
        raise HTTPException(
            status_code=403,
            detail="User is not approved",
        )

    recommendations = recommend_courses(user_id)

    return {
        "user_id": user_id,
        "recommendations": [
            recommendation.model_dump()
            for recommendation in recommendations
        ],
    }


# =========================================================
# PROFILES
# =========================================================

class ProfileRequest(BaseModel):
    user_id: str
    role: str
    phone: str | None = None
    qualification: str | None = None
    work_experience: str | None = None
    interests: str | None = None
    bio: str | None = None
    profile_image: str | None = None


# =========================================================
# PROFILES
# =========================================================

class ProfileRequest(BaseModel):
    user_id: str
    role: str
    phone: str | None = None
    qualification: str | None = None
    work_experience: str | None = None
    interests: str | None = None
    bio: str | None = None
    profile_image: str | None = None


@app.post("/profiles", status_code=201)
def create_profile(data: ProfileRequest):

    # -------------------------------------------------
    # 1. Validate role
    # -------------------------------------------------

    role = data.role.strip().lower()

    if role not in {"trainee", "trainer"}:
        raise HTTPException(
            status_code=400,
            detail="Role must be either trainee or trainer"
        )

    # -------------------------------------------------
    # 2. Check that user exists
    # -------------------------------------------------

    user_response = (
        supabase_admin
        .table("Users")
        .select(
            "id,Name,Email,role,is_approved"
        )
        .eq("id", data.user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -------------------------------------------------
    # 3. Check whether profile already exists
    # -------------------------------------------------

    existing_profile_response = (
        supabase_admin
        .table("profiles")
        .select("id")
        .eq("user_id", data.user_id)
        .limit(1)
        .execute()
    )

    profile_data = {
        "user_id": data.user_id,
        "phone": data.phone,
        "qualification": data.qualification,
        "work_experience": data.work_experience,
        "interests": data.interests,
        "bio": data.bio,
        "profile_image": data.profile_image
    }

    # -------------------------------------------------
    # 4. Create or update profile
    # -------------------------------------------------

    if existing_profile_response.data:

        profile_id = existing_profile_response.data[0]["id"]

        profile_response = (
            supabase_admin
            .table("profiles")
            .update(profile_data)
            .eq("id", profile_id)
            .execute()
        )

    else:

        profile_response = (
            supabase_admin
            .table("profiles")
            .insert(profile_data)
            .execute()
        )

    if not profile_response.data:
        raise HTTPException(
            status_code=500,
            detail="Profile could not be saved"
        )

    # -------------------------------------------------
    # 5. Update selected role
    # -------------------------------------------------

    role_response = (
        supabase_admin
        .table("Users")
        .update({
            "role": role
        })
        .eq("id", data.user_id)
        .execute()
    )

    if not role_response.data:
        raise HTTPException(
            status_code=500,
            detail=(
                "Profile saved but user role "
                "could not be updated"
            )
        )

    # -------------------------------------------------
    # 6. Return result
    # -------------------------------------------------

    return {
        "message": "Profile saved successfully",
        "profile": profile_response.data[0],
        "user": role_response.data[0]
    }


# =========================================================
# TRAINERS
# =========================================================

class TrainerRequest(BaseModel):
    user_id: str
    expertise: str | None = None
    experience_years: int | None = None
    qualifications: str | None = None
    bio: str | None = None
    rating: float | None = None
    availability: bool = True


# =========================================================
# TRAINERS
# =========================================================

@app.post("/trainers", status_code=201)
def create_trainer(data: TrainerRequest):

    # 1. Check that the user exists
    user_response = (
        supabase_admin
        .table("Users")
        .select(
            "id,Name,Email,role,is_approved"
        )
        .eq("id", data.user_id)
        .limit(1)
        .execute()
    )

    if not user_response.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user = user_response.data[0]

    # 2. Make sure the user is a trainer
    if user.get("role", "").strip().lower() != "trainer":
        raise HTTPException(
            status_code=400,
            detail="User role must be trainer"
        )

    # 3. Check whether trainer profile already exists
    existing_response = (
        supabase_admin
        .table("trainers")
        .select("id")
        .eq("user_id", data.user_id)
        .limit(1)
        .execute()
    )

    trainer_data = {
        "user_id": data.user_id,
        "expertise": data.expertise,
        "experience_years": data.experience_years,
        "qualifications": data.qualifications,
        "bio": data.bio,
        "rating": data.rating,
        "availability": data.availability
    }

    # 4. Update existing trainer or create new one
    if existing_response.data:

        trainer_id = existing_response.data[0]["id"]

        trainer_response = (
            supabase_admin
            .table("trainers")
            .update(trainer_data)
            .eq("id", trainer_id)
            .execute()
        )

    else:

        trainer_response = (
            supabase_admin
            .table("trainers")
            .insert(trainer_data)
            .execute()
        )

    if not trainer_response.data:
        raise HTTPException(
            status_code=500,
            detail="Trainer profile could not be saved"
        )

    return {
        "message": "Trainer profile saved successfully",
        "trainer": trainer_response.data[0],
        "user": user
    }


@app.get("/trainers/{user_id}")
def get_trainer(user_id: str):

    response = (
        supabase_admin
        .table("trainers")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Trainer profile not found"
        )

    return response.data[0]
@app.get("/admin/trainers")
def get_all_trainers():

    # 1. Get all trainer profiles
    trainers_response = (
        supabase_admin
        .table("trainers")
        .select("*")
        .execute()
    )

    trainers = trainers_response.data or []

    if not trainers:
        return []

    # 2. Get all courses
    courses_response = (
        supabase_admin
        .table("courses")
        .select("id, trainer_id")
        .execute()
    )

    courses = courses_response.data or []

    # 3. Get all enrollments
    enrollments_response = (
        supabase_admin
        .table("enrollments")
        .select("course_id, user_id")
        .execute()
    )

    enrollments = enrollments_response.data or []

    # 4. Calculate stats for each trainer
    for trainer in trainers:

        trainer_id = trainer["user_id"]

        # Courses taught by this trainer
        trainer_courses = [
            course
            for course in courses
            if course.get("trainer_id") == trainer_id
        ]

        course_ids = {
            course["id"]
            for course in trainer_courses
        }

        # Unique trainees across all trainer courses
        trainee_ids = {
            enrollment["user_id"]
            for enrollment in enrollments
            if enrollment.get("course_id") in course_ids
        }

        trainer["course_count"] = len(trainer_courses)
        trainer["trainee_count"] = len(trainee_ids)

    return trainers

# =========================================================
# ADMIN DASHBOARD
# =========================================================


# -------------------------
# GET ADMIN DASHBOARD STATS
# -------------------------

@app.get("/admin/dashboard/stats")
def get_admin_dashboard_stats():

    # -------------------------
    # USERS
    # -------------------------

    users_response = (
        supabase_admin
        .table("Users")
        .select("id, role, is_approved")
        .execute()
    )

    users = users_response.data or []

    total_trainees = sum(
        1 for user in users
        if str(
            user.get("role", "")
        ).lower() == "trainee"
    )

    total_trainers = sum(
        1 for user in users
        if str(
            user.get("role", "")
        ).lower() == "trainer"
    )

    pending_users = sum(
        1 for user in users
        if user.get("is_approved") is False
    )

    # -------------------------
    # COURSES
    # -------------------------

    courses_response = (
        supabase_admin
        .table("courses")
        .select("id")
        .execute()
    )

    total_courses = len(
        courses_response.data or []
    )

    # -------------------------
    # ASSESSMENTS
    # -------------------------

    assessments_response = (
        supabase_admin
        .table("assessments")
        .select("id")
        .execute()
    )

    total_assessments = len(
        assessments_response.data or []
    )

    # -------------------------
    # RESULTS / ATTEMPTS
    # -------------------------

    results_response = (
        supabase_admin
        .table("results")
        .select("id, percentage")
        .execute()
    )

    results = results_response.data or []

    assessment_attempts = len(results)

    if results:

        average_score = round(
            sum(
                float(
                    result.get(
                        "percentage",
                        0
                    ) or 0
                )
                for result in results
            ) / len(results),
            2
        )

    else:

        average_score = 0

    # -------------------------
    # CERTIFICATES
    # -------------------------

    certificates_response = (
        supabase_admin
        .table("certificate")
        .select("id")
        .execute()
    )

    total_certificates = len(
        certificates_response.data or []
    )

    return {
        "total_trainees": total_trainees,
        "total_trainers": total_trainers,
        "total_courses": total_courses,
        "total_assessments": total_assessments,
        "assessment_attempts": assessment_attempts,
        "average_score": average_score,
        "total_certificates": total_certificates,
        "pending_users": pending_users
    }
@app.get("/trainers/{user_id}/dashboard/stats")
def get_trainer_dashboard_stats(user_id: str):

    # 1. Check that this user is a trainer
    trainer_response = (
        supabase_admin
        .table("trainers")
        .select("user_id")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    if not trainer_response.data:
        raise HTTPException(
            status_code=404,
            detail="Trainer not found"
        )

    # 2. Get trainer name from Users table
    user_response = (
        supabase_admin
        .table("Users")
        .select("Name")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    trainer_name = ""

    if user_response.data:
        trainer_name = user_response.data[0].get("Name", "")

    # 3. Get courses belonging to this trainer
    courses_response = (
        supabase_admin
        .table("courses")
        .select("id")
        .eq("trainer_id", user_id)
        .execute()
    )

    courses = courses_response.data or []

    course_ids = {
        course["id"]
        for course in courses
    }

    # 4. Get enrollments
    enrollments_response = (
        supabase_admin
        .table("enrollments")
        .select("course_id, user_id")
        .execute()
    )

    enrollments = enrollments_response.data or []

    # Count UNIQUE trainees across all trainer courses
    trainee_ids = {
        enrollment["user_id"]
        for enrollment in enrollments
        if enrollment.get("course_id") in course_ids
    }

    # 5. Get assessments belonging to this trainer
    assessments_response = (
        supabase_admin
        .table("assessments")
        .select("id")
        .eq("trainer_id", user_id)
        .execute()
    )

    assessments = assessments_response.data or []

    assessment_ids = {
        assessment["id"]
        for assessment in assessments
    }

    # 6. Get results for this trainer's assessments
    results_response = (
        supabase_admin
        .table("results")
        .select("assessment_id, percentage")
        .execute()
    )

    results = results_response.data or []

    trainer_scores = [
        float(result["percentage"])
        for result in results
        if result.get("assessment_id") in assessment_ids
        and result.get("percentage") is not None
    ]

    # 7. Calculate average trainee score
    if trainer_scores:
        average_trainee_score = round(
            sum(trainer_scores) / len(trainer_scores),
            2
        )
    else:
        average_trainee_score = 0

    # 8. Return trainer dashboard statistics
    return {
        "trainer_name": trainer_name,
        "total_courses": len(courses),
        "total_trainees": len(trainee_ids),
        "active_assessments": len(assessments),
        "average_trainee_score": average_trainee_score
    }
@app.get("/trainer/trainees/{trainer_id}")
def get_trainer_trainees(trainer_id: str):

    # -------------------------------------------------
    # 1. Check that the trainer exists
    # -------------------------------------------------

    trainer_response = (
        supabase_admin
        .table("trainers")
        .select("user_id")
        .eq("user_id", trainer_id)
        .limit(1)
        .execute()
    )

    if not trainer_response.data:
        raise HTTPException(
            status_code=404,
            detail="Trainer not found"
        )

    # -------------------------------------------------
    # 2. Get courses belonging to this trainer
    # -------------------------------------------------

    courses_response = (
        supabase_admin
        .table("courses")
        .select("id, title, skill_id")
        .eq("trainer_id", trainer_id)
        .execute()
    )

    courses = courses_response.data or []

    if not courses:
        return []

    course_ids = {
        course["id"]
        for course in courses
    }

    course_map = {
        course["id"]: course
        for course in courses
    }

    # -------------------------------------------------
    # 3. Get enrollments for those courses
    # -------------------------------------------------

    enrollments_response = (
        supabase_admin
        .table("enrollments")
        .select(
            "id, user_id, course_id, enrolled_at, status"
        )
        .in_("course_id", list(course_ids))
        .execute()
    )

    enrollments = enrollments_response.data or []

    if not enrollments:
        return []

    # -------------------------------------------------
    # 4. Get unique trainee IDs
    # -------------------------------------------------

    trainee_ids = {
    enrollment["user_id"]
    for enrollment in enrollments
    if enrollment["user_id"] != trainer_id
    }

    # -------------------------------------------------
    # 5. Get trainee user information
    # -------------------------------------------------

    users_response = (
        supabase_admin
        .table("Users")
        .select("id, Name, Email, role")
        .in_("id", list(trainee_ids))
        .execute()
    )

    users = users_response.data or []

    users_map = {
        user["id"]: user
        for user in users
    }

    # -------------------------------------------------
    # 6. Get trainer's assessments
    # -------------------------------------------------

    assessments_response = (
        supabase_admin
        .table("assessments")
        .select("id, skill_id")
        .eq("trainer_id", trainer_id)
        .execute()
    )

    assessments = assessments_response.data or []

    assessment_ids = {
        assessment["id"]
        for assessment in assessments
    }

    # -------------------------------------------------
    # 7. Get results for trainer's assessments
    # -------------------------------------------------

    results = []

    if assessment_ids:

        results_response = (
            supabase_admin
            .table("results")
            .select(
                "id, user_id, assessment_id, "
                "score, percentage, completed_at"
            )
            .in_("assessment_id", list(assessment_ids))
            .order("completed_at", desc=True)
            .execute()
        )

        results = results_response.data or []

    # -------------------------------------------------
    # 8. Get skill gaps for these trainees
    # -------------------------------------------------

    skill_gaps_response = (
        supabase_admin
        .table("skill_gaps")
        .select(
            "id, user_id, skills_id, current_score, "
            "target_score, gap_score, status, updated_at"
        )
        .in_("user_id", list(trainee_ids))
        .execute()
    )

    skill_gaps = skill_gaps_response.data or []

    # -------------------------------------------------
    # 9. Build trainee response
    # -------------------------------------------------

    trainee_data = {}

    for trainee_id in trainee_ids:

        user = users_map.get(trainee_id)

        if not user:
            continue

        # Courses this trainee is enrolled in
        trainee_enrollments = [
            enrollment
            for enrollment in enrollments
            if enrollment["user_id"] == trainee_id
        ]

        enrolled_courses = []

        for enrollment in trainee_enrollments:

            course = course_map.get(
                enrollment["course_id"]
            )

            if course:
                enrolled_courses.append({
                    "course_id": course["id"],
                    "title": course["title"],
                    "skill_id": course["skill_id"],
                    "enrolled_at": enrollment["enrolled_at"],
                    "status": enrollment["status"]
                })

        # Results belonging to this trainee
        trainee_results = [
            result
            for result in results
            if result["user_id"] == trainee_id
        ]

        percentages = [
            float(result["percentage"])
            for result in trainee_results
            if result.get("percentage") is not None
        ]

        # Latest result
        latest_score = None

        if trainee_results:
            latest_score = trainee_results[0].get(
                "percentage"
            )

        # Average score
        if percentages:
            average_score = round(
                sum(percentages) / len(percentages),
                2
            )
        else:
            average_score = 0

        # Skill gaps belonging to trainee
        trainee_skill_gaps = [
            gap
            for gap in skill_gaps
            if gap["user_id"] == trainee_id
        ]

        # Competency = current skill scores
        competency = [
            {
                "skill_id": gap["skills_id"],
                "current_score": gap["current_score"],
                "target_score": gap["target_score"],
                "gap_score": gap["gap_score"],
                "status": gap["status"]
            }
            for gap in trainee_skill_gaps
        ]

        trainee_data[trainee_id] = {
            "trainee_id": trainee_id,
            "name": user.get("Name"),
            "email": user.get("Email"),
            "enrolled_courses": enrolled_courses,
            "enrollment_date": (
                min(
                    enrollment["enrolled_at"]
                    for enrollment in trainee_enrollments
                )
                if trainee_enrollments
                else None
            ),
            "assessment_attempts": len(
                trainee_results
            ),
            "latest_score": latest_score,
            "average_score": average_score,
            "progress": None,
            "skill_gaps": trainee_skill_gaps,
            "competency": competency,
            "status": (
                "Active"
                if any(
                    enrollment["status"] == "active"
                    for enrollment in trainee_enrollments
                )
                else "Inactive"
            )
        }

    return list(trainee_data.values())
