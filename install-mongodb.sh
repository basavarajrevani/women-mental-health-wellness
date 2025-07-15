#!/bin/bash

echo "Installing and Setting up MongoDB for WMH Platform..."
echo "====================================================="

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 Detected macOS"
    echo
    echo "📥 Installing MongoDB with Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install MongoDB
    brew tap mongodb/brew
    brew install mongodb-community
    
    # Start MongoDB service
    brew services start mongodb/brew/mongodb-community
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Detected Linux"
    echo
    echo "📥 Installing MongoDB..."
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        # Import MongoDB public GPG key
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        
        # Create list file for MongoDB
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        # Update package database
        sudo apt-get update
        
        # Install MongoDB
        sudo apt-get install -y mongodb-org
        
        # Start MongoDB service
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
    # CentOS/RHEL/Fedora
    elif command -v yum &> /dev/null; then
        # Create repository file
        sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
        
        # Install MongoDB
        sudo yum install -y mongodb-org
        
        # Start MongoDB service
        sudo systemctl start mongod
        sudo systemctl enable mongod
    else
        echo "❌ Unsupported Linux distribution"
        echo "Please install MongoDB manually: https://docs.mongodb.com/manual/installation/"
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please install MongoDB manually: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

echo
echo "✅ MongoDB installation completed!"

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 5

echo
echo "🧪 Testing MongoDB connection..."
cd backend
npm run test-db

echo
echo "🗄️ Setting up database..."
npm run setup-db

echo
echo "✅ MongoDB Setup Complete!"
echo "========================="
echo
echo "🔗 MongoDB is now running locally on: mongodb://localhost:27017"
echo "📊 You can access MongoDB with:"
echo "   • MongoDB Compass: https://www.mongodb.com/products/compass"
echo "   • Command line: mongosh (or mongo for older versions)"
echo
echo "🚀 Next steps:"
echo "   1. Start the backend: npm run dev"
echo "   2. Start the frontend: cd ../project && npm run dev"
echo "   3. Access the platform: http://localhost:5173"
echo
echo "🔐 Admin Login:"
echo "   Email: admin@wmh-platform.com"
echo "   Password: admin123"
