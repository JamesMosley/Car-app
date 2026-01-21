from sqlalchemy.orm import Session
import models, database, auth
import sys
import os

# Ensure we can import modules from current directory
sys.path.append(os.getcwd())

def create_test_user():
    db = database.SessionLocal()
    email = "test@example.com"
    password = "password123"
    try:
        # Create tables if they don't exist (just in case)
        models.Base.metadata.create_all(bind=database.engine)
        
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"User {email} already exists.")
            # Update password just in case
            user.hashed_password = auth.get_password_hash(password)
            db.commit()
            print(f"Updated password for {email} to {password}")
            return

        hashed_password = auth.get_password_hash(password)
        new_user = models.User(email=email, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        print(f"Created user: {email} with password: {password}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
