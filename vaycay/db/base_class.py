import typing as t

from sqlalchemy.ext.declarative import as_declarative, declared_attr

'''
In other codebases/examples you may have seen this done like so:
Base = declarative_base()
In our case, we're doing the same thing but with a decorator (provided by SQLAlchemy) so that we can declare some helper methods on our Base class - 
like automatically generating a __tablename__.
'''

class_registry: t.Dict = {}


@as_declarative(class_registry=class_registry)
class Base:
    id: t.Any
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()