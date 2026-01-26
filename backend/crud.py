from sqlalchemy.orm import Session
import models, auth

# ---------------------------------------------------------
# Users
# ---------------------------------------------------------

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(
        models.User.email == email
    ).first()


def create_user(db: Session, email: str, password: str):
    user = models.User(
        email=email,
        hashed_password=auth.get_password_hash(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
