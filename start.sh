#!/bin/bash

echo "Hostel Management System - Startup Script"
echo ""
echo "Starting Backend Server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

sleep 5

echo "Starting Frontend Application..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend running on http://localhost:5000"
echo "Frontend running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
