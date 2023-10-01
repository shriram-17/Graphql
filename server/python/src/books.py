from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from .connection import Author, Book, SessionLocal

router = APIRouter();

class BookPayload(BaseModel):
    title: str
    author_id : int

@router.post("/")
async def create_book(book_data:BookPayload):
    db = SessionLocal()
    try:
        book = Book(title=book_data.title,author_id=book_data.author_id)
        db.add(book)
        db.commit()
        db.refresh(book)
        return {"Message":"Book inserted","book":book};
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()
        
@router.get("/all")
async def get_book_all():
    db = SessionLocal()
    try:      
        books_data = db.query(Book).all()
        books = [{"book_id":book.bid,"title":book.title} for book in books_data ]
        return books
    except Exception as e:
           raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()
         
@router.get("/{book_id}")
async def get_author_books_by_id(book_id: int):
    db = SessionLocal()
    try:
        book_data = db.query(Book).filter(Book.bid==book_id).first()
        author_data = db.query(Author).filter(Author.id==book_data.author_id).first()
        book ={
            "Book_id":book_data.bid,
            "Book Name":book_data.title,
            "Author":author_data.name
        }
        return book
    except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()  