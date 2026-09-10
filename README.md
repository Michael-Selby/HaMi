# HaMi - Menstrual Cycle Tracker

A MERN stack application for tracking menstrual cycles, predicting periods, and identifying fertile windows.

## Features

- **Period Prediction**: Calculates when your next period will start based on your cycle history
- **Fertile Window**: Identifies high-risk pregnancy zones (fertile window)
- **Safe Days**: Shows safe days in your cycle
- **Calendar View**: Visual calendar with color-coded days for different cycle phases
- **Customizable**: Set your cycle length and period length for accurate predictions

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Setup

### Prerequisites

- Node.js installed
- MongoDB running locally or MongoDB Atlas connection string

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Configuration

1. Copy `.env.example` to `.env` in the backend folder:
```bash
cd backend
copy .env.example .env
```

2. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/hami
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

### Running the Application

From the root directory, run:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

Or run separately:
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/cycles/:userId` - Get cycle data for a user
- `POST /api/cycles` - Create or update cycle data
- `PUT /api/cycles/:userId` - Update cycle data
- `DELETE /api/cycles/:userId` - Delete cycle data

## Cycle Calculation Logic

The application uses the following logic:
- **Cycle Length**: Default 28 days (normal range: 21-35 days)
- **Period Length**: Default 5 days (normal range: 2-7 days)
- **Ovulation**: Occurs approximately 14 days before the next period
- **Fertile Window**: 5 days before ovulation to 1 day after ovulation

## Color Legend

- 🔴 **Red**: Period days
- 🟡 **Amber**: Fertile window (high pregnancy risk)
- 🟢 **Green**: Safe days
