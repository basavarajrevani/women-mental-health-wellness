#!/bin/bash

echo "Starting Women's Mental Health Platform..."
echo "Clean development startup"
echo

echo "Clearing frontend cache..."
cd project
rm -rf .vite
rm -rf dist
cd ..

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
    sleep 3
else
    echo "MongoDB is already running"
fi

# Start Backend Server
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 5

# Start Frontend Development Server
echo "Starting Frontend..."
cd project
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "✅ All services starting..."
echo "🔗 Backend API: http://localhost:5000"
echo "🌐 Frontend: http://localhost:5173"
echo
echo "💡 Platform Features:"
echo "- Complete user authentication and profiles"
echo "- Community posts and support groups"
echo "- Events and mental health resources"
echo "- Admin dashboard and content management"
echo
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
