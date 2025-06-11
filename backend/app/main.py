from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from app.core.database import init_db, engine, Base
from app.models import account, course, cv_details, cv_items, department, employee, enrollment, has_role, has_skill, project, role, skill, training, works_on_project, request, notification
from app.routers import login, admin, pm, lead, staff, cv, trainings, courses, skills, enrollments, has_skill, request, notification, department

app = FastAPI()

init_db()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router)
app.include_router(pm.router)
app.include_router(admin.router)
app.include_router(lead.router)
app.include_router(staff.router)
app.include_router(cv.router)
app.include_router(trainings.router)
app.include_router(courses.router)
app.include_router(skills.router)
app.include_router(enrollments.router)
app.include_router(has_skill.router)
app.include_router(request.router)
app.include_router(notification.router)
app.include_router(department.router)