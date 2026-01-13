from sqlalchemy.orm import Session
from backend import models, database

def list_users():
    db = database.SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"ID: {user.id}, Email: {user.email}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
