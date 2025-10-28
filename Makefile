.PHONY: help install db-setup dev clean db-start db-stop server-dev client-dev check-prereqs lint lint-fix type-check

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target - show help
help:
	@echo "$(GREEN)Vaycay v2 - Available Make Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Quick Setup (First Time):$(NC)"
	@echo "  make install      - Install all dependencies (client + server)"
	@echo "  make db-setup     - Setup database (migrations + data import)"
	@echo "  make dev          - Start all services for development"
	@echo ""
	@echo "$(YELLOW)Individual Services:$(NC)"
	@echo "  make server-dev   - Run GraphQL server only"
	@echo "  make client-dev   - Run React client only"
	@echo "  make db-start     - Start PostgreSQL database only"
	@echo "  make db-stop      - Stop PostgreSQL database"
	@echo ""
	@echo "$(YELLOW)Code Quality:$(NC)"
	@echo "  make lint         - Check for ESLint errors in client and server"
	@echo "  make lint-fix     - Auto-fix ESLint errors in client and server"
	@echo "  make type-check   - Check for TypeScript errors in client and server"
	@echo ""
	@echo "$(YELLOW)Utilities:$(NC)"
	@echo "  make clean        - Stop all services and clean up"
	@echo "  make help         - Show this help message"
	@echo ""
	@echo "$(GREEN)Typical First-Time Setup:$(NC)"
	@echo "  1. make install"
	@echo "  2. make db-setup"
	@echo "  3. make dev"

# Check for required tools
check-prereqs:
	@echo "$(YELLOW)Checking prerequisites...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Error: Docker is not installed$(NC)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Error: Node.js is not installed$(NC)"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)Error: npm is not installed$(NC)"; exit 1; }
	@echo "$(GREEN)✓ All prerequisites found$(NC)"

# Install all dependencies
install: check-prereqs
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@echo "$(YELLOW)Installing server dependencies...$(NC)"
	cd server && npm install
	@echo "$(YELLOW)Installing client dependencies...$(NC)"
	cd client && npm install
	@echo "$(GREEN)✓ All dependencies installed successfully$(NC)"

# Setup database
db-setup: check-prereqs
	@echo "$(GREEN)Setting up database...$(NC)"
	@echo "$(YELLOW)Starting PostgreSQL...$(NC)"
	docker-compose up -d db
	@echo "$(YELLOW)Waiting for database to be ready...$(NC)"
	@sleep 5
	@echo "$(YELLOW)Running Prisma migrations...$(NC)"
	cd server && npm run prisma:migrate
	@echo "$(YELLOW)Generating Prisma client...$(NC)"
	cd server && npm run prisma:generate
	@echo "$(YELLOW)Importing weather data (this may take a few minutes)...$(NC)"
	cd server && npm run import-data
	@echo "$(GREEN)✓ Database setup complete$(NC)"

# Start all services for development
dev: check-prereqs
	@echo "$(GREEN)Starting all services...$(NC)"
	@echo "$(YELLOW)Starting database...$(NC)"
	@docker-compose up -d db
	@sleep 3
	@echo "$(YELLOW)Starting GraphQL server...$(NC)"
	@echo "$(YELLOW)Server will be available at: http://localhost:4001$(NC)"
	@cd server && npm run dev &
	@sleep 5
	@echo "$(YELLOW)Starting React client...$(NC)"
	@echo "$(YELLOW)Client will be available at: http://localhost:3000$(NC)"
	@echo ""
	@echo "$(GREEN)All services started!$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop the client, then run 'make clean' to stop all services$(NC)"
	@cd client && npm run dev

# Start database only
db-start: check-prereqs
	@echo "$(GREEN)Starting PostgreSQL database...$(NC)"
	docker-compose up -d db
	@echo "$(GREEN)✓ Database started at localhost:5431$(NC)"

# Stop database
db-stop:
	@echo "$(YELLOW)Stopping PostgreSQL database...$(NC)"
	docker-compose stop db
	@echo "$(GREEN)✓ Database stopped$(NC)"

# Run server only
server-dev: check-prereqs
	@echo "$(GREEN)Starting GraphQL server...$(NC)"
	@echo "$(YELLOW)Make sure database is running (make db-start)$(NC)"
	@echo "$(YELLOW)Server will be available at: http://localhost:4001$(NC)"
	cd server && npm run dev

# Run client only
client-dev: check-prereqs
	@echo "$(GREEN)Starting React client...$(NC)"
	@echo "$(YELLOW)Make sure server is running (make server-dev)$(NC)"
	@echo "$(YELLOW)Client will be available at: http://localhost:3000$(NC)"
	cd client && npm run dev

# Lint both client and server
lint: check-prereqs
	@echo "$(GREEN)Running ESLint checks...$(NC)"
	@echo "$(YELLOW)Checking client...$(NC)"
	@cd client && npm run lint || true
	@echo ""
	@echo "$(YELLOW)Checking server...$(NC)"
	@cd server && npm run lint || true
	@echo "$(GREEN)✓ Lint check complete$(NC)"

# Auto-fix lint errors in both client and server
lint-fix: check-prereqs
	@echo "$(GREEN)Auto-fixing ESLint errors...$(NC)"
	@echo "$(YELLOW)Fixing client...$(NC)"
	@cd client && npm run lint:fix || true
	@echo ""
	@echo "$(YELLOW)Fixing server...$(NC)"
	@cd server && npm run lint:fix || true
	@echo "$(GREEN)✓ Auto-fix complete$(NC)"

# Type check both client and server
type-check: check-prereqs
	@echo "$(GREEN)Running TypeScript type checks...$(NC)"
	@echo "$(YELLOW)Checking client...$(NC)"
	@cd client && npm run type-check || true
	@echo ""
	@echo "$(YELLOW)Checking server...$(NC)"
	@cd server && npm run type-check || true
	@echo "$(GREEN)✓ Type check complete$(NC)"

# Clean up - stop all services
clean:
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@-pkill -f "ts-node-dev.*src/index.ts" 2>/dev/null || true
	@-pkill -f "react-scripts start" 2>/dev/null || true
	docker-compose down
	@echo "$(GREEN)✓ All services stopped$(NC)"
