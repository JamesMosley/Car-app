import sys
import os

# Add the current directory to sys.path to ensure imports work
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
import models, database

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
