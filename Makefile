.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST)  | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	poetry install

lint: ## Run flake8 and mypy
	poetry run mypy .
	poetry run flake8 .

format: ## Run black and isort
	poetry run black .
	poetry run isort .

start-deps: ## Start development dependencies with docker
	docker-compose up -d deps

data: start-deps ## import initial data
	set -o allexport && source .env.local && poetry run db_initial_data_import

start: start-deps ## Start local dev server
	set -o allexport && source .env.local && poetry run dev

test: ## Run unit tests
	poetry run pytest -m "not int" -s

test-cov: ## Run unit tests with coverage output (in htmlcov directory)
	poetry run pytest -m "not int" --cov=app --cov-report=html

test-int: start-deps ## Start dependencies and run integration tests
	set -o allexport && source .env.local && poetry run pytest -m "int" -s

migrations-create: start-deps ## Create a new alembic migration, based on your code changes. Usage: make migrations-create m="your message"
	set -o allexport && source .env.local && poetry run alembic revision --autogenerate -m "$(m)"

migrations-run: start-deps ## Run migrations
	set -o allexport && source .env.local && poetry run alembic upgrade head