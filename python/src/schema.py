from typing import List
import strawberry
from src.prisma import prisma

@strawberry.type
class ItemType:
    id: int
    name: str   
    
    
@strawberry.type
class Query:
    @strawberry.field
    async def get_items(self) -> List[ItemType]:
        items = await prisma.item.find_many();
        return [ ItemType(id=item.id,name=item.name) for item in items ] 

schema = strawberry.Schema(query=Query)