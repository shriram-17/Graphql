from typing import List
from src.connection import SessionLocal,Author,Book
from fastapi import HTTPException
import strawberry

@strawberry.type
class AuthorType:
    id: int
    name: str
@strawberry.type
class BookType:
    bid: int
    title: str
    Author:List[AuthorType]
@strawberry.type
class AuthorWithBooks:
    author : AuthorType    
    books : List[BookType]

@strawberry.type
class BookWithAuthor:
    bid : int 
    title : str
    author : AuthorType
@strawberry.type
class Query: 
    @strawberry.field
    def hello(self) -> str:
        return "Hello World"
    
    @strawberry.field
    async def get_authors(self) -> List[AuthorType]:
        db = SessionLocal()
        try:
             authors= db.query(Author).all()
             print(authors)
             return [AuthorType(id=author.id,name=author.name) for author in authors];
        except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
        finally:
            db.close()
            
    @strawberry.field
    def get_books(self) -> List[BookType]:
        db = SessionLocal()            
        try:
            books = db.query(Book).all()
            authors = db.query(Author).all()
            author_mapping = {author.id: AuthorType(id=author.id, name=author.name) for author in authors}
            book_list = []
            
            for book in books:
                author = author_mapping.get(book.author_id)  
                book_type = BookType(bid=book.bid, title=book.title, Author=[author] if author else [])
                book_list.append(book_type)
            
            return book_list
        except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
        finally:
            db.close()
            
    @strawberry.field
    async def get_author_with_books(self, author_id: int) -> AuthorWithBooks:
        db = SessionLocal()
        try:
            author = db.query(Author).filter(Author.id == author_id).first()
            if not author:    
                return AuthorWithBooks(author=None, books=[])
              
            books = db.query(Book).filter(Book.author_id == author_id).all()
            author_type = AuthorType(id=author.id, name=author.name)
            book_list = [BookType(bid=book.bid, title=book.title, Author=[author_type]) for book in books]
            return AuthorWithBooks(author=author_type, books=book_list)
        except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
        finally:
            db.close()

    @strawberry.field
    async def get_books_with_author(self,book_id:int) -> BookWithAuthor :
        db = SessionLocal()
        try:
            book = db.query(Book).filter(Book.bid == book_id).first()
            print(book)
            if not book:    
                return BookWithAuthor(bid=None,title=None,author=None)
            author = db.query(Author).filter(Author.id == book.author_id).first()
            print(author)
            return BookWithAuthor(bid=book.bid,title=book.title,author = author) 
        except Exception as e:
            raise HTTPException(status_code=500, detail='Internal server error')
        finally:
            db.close()
                
schema = strawberry.Schema(query=Query)

