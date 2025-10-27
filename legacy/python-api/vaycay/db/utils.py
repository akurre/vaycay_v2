import os


def get_url() -> str:
    database_url = os.getenv("DATABASE_URL")

    if database_url is None:
        raise ValueError("Environment variable 'DATABASE_URL' is not defined.")

    return database_url


def get_schema() -> str:
    database_schema = os.getenv("DATABASE_SCHEMA")

    if database_schema is None:
        raise ValueError("Environment variable 'DATABASE_SCHEMA' is not defined.")

    return database_schema


def get_schema_prefix() -> str:
    return f"{schema}." if (schema := get_schema()) else ""
