#!/bin/bash

echo "Starting Women's Mental Health & Wellness Platform..."
echo

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
echo "Starting Frontend Development Server..."
cd project
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "All services are starting up..."
echo "Backend API: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
