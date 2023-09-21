from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.future import select
from typing import List
from strawberry.asgi import GraphQL;
from src.schema import Query as StrawberryQuery;
from src.connection import engine,SessionLocal,Author,Book
import strawberry;

app = FastAPI();

class AuthorPayload(BaseModel):
    name : str 
    
class BookPayload(BaseModel):
    title: str
    author_id : int
          
@app.get("/")
async def get_helloworld():
    return {"Message":"Hello World"};

@app.post("/author")
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
    
@app.post("/book")
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
@app.get("/author/all")
async def get_author_all():
    db = SessionLocal()
    try:      
        authors_data = db.query(Author).all()
        authors = [{"author_id":author.id,"name":author.name} for author in authors_data ]
        return authors
    except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()

@app.get("/book/all")
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
        
                    
@app.get("/author/{author_id}")
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
        
@app.get("/book/{book_id}")
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
            print(e);
            raise HTTPException(status_code=500, detail='Internal server error')
    finally:
        db.close()        
        

                
strawberry_app = GraphQL(schema=strawberry.Schema(query=StrawberryQuery), debug=True)

app.add_route("/graphql", strawberry_app)