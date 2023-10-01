from fastapi import APIRouter,HTTPException
from pydantic import BaseModel;
from .connection import Author, Book, SessionLocal

class AuthorPayload(BaseModel):
    name : str 
    
router = APIRouter();

@router.post("/")
async def create_author(author_data: AuthorPayload):
    db = SessionLocal()
    try:
        author = Author(name=author_data.name)
        db.add(author)
        db.commit()
        db.refresh(author)
        return {"Message": "Author Inserted", "Author": author}
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()

@router.get("/all")
async def get_author_all():
    db = SessionLocal()
    try:      
        authors_data = db.query(Author).all()
        authors = [{"author_id": author.id, "name": author.name} for author in authors_data]
        return authors
    except Exception as e:
        raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()

@router.get("/{author_id}")
async def get_author_books_by_id(author_id: int):
    db = SessionLocal()
    try:
        author_data = db.query(Author).filter(Author.id==author_id).first()
        books = db.query(Book).filter(Book.author_id==author_id).all()
        author ={
            "id":author_data.id,
            "Name":author_data.name,
            "books":[]
        };
        book_data = [book.title for book in books]
        author['books'] = book_data
        return author
    except Exception as e:
            print(e);
            raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()