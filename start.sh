#!/bin/bash

echo "Cleaning old processes..."

# Kill backend (port 8080)
PID_8080=$(lsof -ti :8080)
if [ -n "$PID_8080" ]; then
  kill -9 $PID_8080
  echo "Killed process on port 8080"
fi

# Kill frontend (port 5173)
PID_5173=$(lsof -ti :5173)
if [ -n "$PID_5173" ]; then
  kill -9 $PID_5173
  echo "Killed process on port 5173"
fi

echo "Starting Typing Speed Test..."

# Start backend
echo "Starting backend..."
cd backend
./mvnw spring-boot:run &
sleep 5

# Start frontend
echo "Starting frontend..."
cd ..
npm run dev &

echo "App running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8080"

wait