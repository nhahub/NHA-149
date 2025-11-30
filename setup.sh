#!/bin/bash

# Taqyeem Platform Setup Script
# This script sets up the complete Taqyeem platform

echo "🚀 Setting up Taqyeem Platform..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp env.example .env
        print_warning "Please update backend/.env with your MongoDB and Cloudinary credentials"
    else
        print_status "Backend environment file already exists"
    fi
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating frontend environment file..."
        cp env.example .env
        print_status "Frontend environment file created"
    else
        print_status "Frontend environment file already exists"
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Create start scripts
create_scripts() {
    print_status "Creating start scripts..."
    
    # Backend start script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Taqyeem Backend..."
cd backend
npm run dev
EOF
    
    # Frontend start script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Taqyeem Frontend..."
cd frontend
npm run dev
EOF
    
    # Full start script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Taqyeem Platform..."

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Taqyeem Platform is running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF
    
    # Make scripts executable
    chmod +x start-backend.sh start-frontend.sh start-all.sh
    
    print_success "Start scripts created"
}

# Main setup function
main() {
    print_status "Starting Taqyeem Platform setup..."
    
    # Check prerequisites
    check_node
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Create start scripts
    create_scripts
    
    echo ""
    print_success "🎉 Taqyeem Platform setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update backend/.env with your MongoDB and Cloudinary credentials"
    echo "2. Update frontend/.env with your API URL if needed"
    echo "3. Run './start-all.sh' to start both frontend and backend"
    echo "   Or run './start-backend.sh' and './start-frontend.sh' separately"
    echo ""
    echo "Access the application:"
    echo "- Frontend: http://localhost:5173"
    echo "- Backend API: http://localhost:5000"
    echo ""
    echo "For more information, check the README.md files in each directory."
}

# Run main function
main
