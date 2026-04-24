#!/bin/bash

echo "Cleaning old processes..."

PID_8080=$(lsof -ti :8080)
if [ -n "$PID_8080" ]; then
  kill -9 $PID_8080
  echo "Killed process on port 8080"
fi

PID_5173=$(lsof -ti :5173)
if [ -n "$PID_5173" ]; then
  kill -9 $PID_5173
  echo "Killed process on port 5173"
fi

echo "Starting Typing Speed Test..."

cd backend
./mvnw spring-boot:run &
sleep 5

cd ..
npm run dev &

echo "App running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8080"

wait