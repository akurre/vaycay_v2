from typing import Generator

from app.database.session import SessionLocal


def get_db() -> Generator:
    db = SessionLocal()
    db.current_user_id = None
    try:
        yield db
    finally:
        db.close()


"""
1.) We import the ORM session class SessionLocal from app/db/session.py
2.) We instantiate the session
3.) We yield the session, which returns a generator. Why do this? 
       The yield statement suspends the function’s execution and sends a value back to the caller, 
       but retains enough state to enable the function to resume where it is left off. 
       In short, it’s an efficient way to work with our database connection. 
4.) We make sure we close the DB connection by using the finally clause of the try block - 
    meaning that the DB session is always closed. This releases connection objects associated with the 
    session and leaves the session ready to be used again.
"""