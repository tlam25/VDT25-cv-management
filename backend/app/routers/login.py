from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from pydantic import BaseModel 
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt 
from passlib.context import CryptContext 

from app.core.database import get_db
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.employee import Employee, EmployeeStatus
from app.models.department import Department
from app.models.role import Role
from app.models.has_role import HasRole

import bcrypt

router = APIRouter(prefix="", tags=["login"])

SECRET_KEY = "2b7d5895cea1f0d463b29cbe0af7dcb77ec7114fb137c51f53dd7a21d95369ff" # cmd: openssl rand -hex 32
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    username: str
    emp_id: int
    first_name: str
    last_name: str
    roles: List[str]
    department: Optional[str] = None

# ham ho tro
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str, fixed_salt: Optional[bytes] = None) -> str:
    if fixed_salt:
        # fixed_salt phải có dạng: b"$2b$12$22charsOfSalt..."
        hashed = bcrypt.hashpw(password.encode('utf-8'), fixed_salt)
        return hashed.decode('utf-8')
    else:
        # bình thường dùng passlib để sinh salt ngẫu nhiên
        return pwd_context.hash(password)

def get_account(db: Session, username: str):
    account = db.query(Account).filter(
        Account.username == username
    ).first()
    return account

def get_employee(db: Session, emp_id: int):
    employee = db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()
    return employee

def get_department(db: Session, dept_id: int):
    department = db.query(Department).filter(
        Department.dept_id == dept_id
    ).first()
    return department.dept_name if department else None # admin khong co department

def get_user_role(db: Session, emp_id: int):
    roles = (
        db.query(Role)
            .join(HasRole, Role.role_id == HasRole.role_id)
            .filter(HasRole.emp_id == emp_id)
            .all()
    )
    return [role.role_name.value for role in roles] # mot emp co the co nhieu role

def authenticate_user(db: Session, username: str, password: str):
    account = get_account(db, username)
    if not account:
        return None
    if not verify_password(password, account.hashed_password):
        return None 
    
    return account

def create_access_token(data: dict, roles: list, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    to_encode.update({"roles": roles})

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

# endpoint dang nhap
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), 
                                 db: Session = Depends(get_db),
                                 request: Request = None):
    # check authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            # decode and check expire
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            exp = payload.get("exp")
            if exp:
                if datetime.fromtimestamp(exp, tz=timezone.utc) > datetime.now(timezone.utc):
                    raise HTTPException(
                        status_code = status.HTTP_400_BAD_REQUEST,
                        detail="Đã đăng nhập!"
                    )
        except JWTError: #token loi/het han thi cho phep dang nhap tiep
            pass
    
    account = authenticate_user(db, form_data.username, form_data.password)
    if not account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail = "Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    
    employee = get_employee(db, emp_id=account.emp_id)
    if employee is None or employee.status != EmployeeStatus.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or employee does not exist",
        )
    
    user_roles = get_user_role(db, emp_id=account.emp_id)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": account.username},
                                       roles=user_roles,
                                       expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

# status cua acc phu thuoc vao viec employee con lam viec (status: active) nx hay khong
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentails",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        roles: list = payload.get("roles", [])
        if username is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    account = get_account(db, username)
    if account is None:
        raise credentials_exception
    
    employee = get_employee(db, emp_id=account.emp_id)
    if employee is None or employee.status != EmployeeStatus.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or user does not exist",
        )
    
    dept_name = get_department(db, employee.dept_id)
    
    return UserResponse(
        username=account.username,
        emp_id=account.emp_id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        roles=roles,
        department=dept_name
    )

# endpoint check user info
@router.get("/accounts/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user


# fixed_salt = b"$2b$12$1234567890123456789012"  # 29 bytes salt cho bcrypt (cost=12)
# username = "lamnguyen"
# password = f"{username}123"

# print(get_password_hash(password, fixed_salt=fixed_salt))