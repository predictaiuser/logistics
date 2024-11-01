from database import engine
import models

def create_tables():
    models.Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables() 