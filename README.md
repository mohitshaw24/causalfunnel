# 🎯 CausalFunnel Analytics Tracker

A full-stack user behavior tracking and analytics platform built for the CausalFunnel Full Stack Engineer take-home assignment. This application tracks user interactions (page views and clicks) across multiple web pages, stores the data in a cloud database, and visualizes the user journey and click heatmaps in a real-time dashboard.

## 🌐 Live Demo

*   **Dashboard (Frontend):** https://causalfunnel-dashboard-seven.vercel.app
*   **Backend API:** https://causalfunnel-backend-i5fy.onrender.com


## ✨ Key Features

*   **Client-Side Tracking:** Lightweight, standalone JavaScript tracker that captures `page_view` and `click` events with X/Y coordinates.
*   **Session Management:** Persists user sessions across page refreshes and navigation using `localStorage`.
*   **User Journey Timeline:** Visualizes the exact chronological path a user took through the application.
*   **Click Heatmaps:** Plots exact click coordinates on a visual representation of the tracked page.
*   **Cloud Infrastructure:** Fully deployed on Vercel (Frontend) and Render (Backend) with a MongoDB Atlas cloud database.

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Deployment:** Vercel, Render, GitHub Actions (CI/CD)


## 🏗️ Architecture & Technical Highlights

1.  **Reliable Event Delivery:** The tracking script uses `navigator.sendBeacon()` instead of standard `fetch()` requests. This ensures that analytics events are successfully sent to the server even if the user navigates away from the page immediately after clicking.
2.  **Efficient Database Queries:** The MongoDB schema uses indexes on `sessionId` and `timestamp`. The backend utilizes MongoDB's Aggregation Pipeline to efficiently group and count sessions without loading the entire database into memory.
3.  **Cross-Origin Security:** Implemented robust CORS policies to allow secure communication between the locally hosted demo pages, the Vercel frontend, and the Render backend.


## 🚀 Local Setup & Installation

To run this project locally, you will need **Node.js** and a running **MongoDB** instance (or a MongoDB Atlas connection string).

### 1. Clone the Repository

* git clone https://github.com/mohitshaw24/causalfunnel.git
* cd causalfunnel

### 2. Backend Setup

* cd backend
* npm install

Create a .env file inside the backend folder and add your MongoDB connection string:

* mongodb://<username>:<password>@ac-sklk55o-shard-00-00.dfj3soz.mongodb.net:27017,ac-sklk55o-shard-00-01.dfj3soz.mongodb.net:27017,ac-sklk55o-shard-00-  02.dfj3soz.mongodb.net:27017/causalfunnel?ssl=true&replicaSet=atlas-5m8ovf-shard-0&authSource=admin&appName=Cluster0
* PORT = 5000

**Start the backend server**
* node server.js

### 3. Frontend Setup

* Open a new terminal window
* cd frontend
* npm install
* npm run dev

* The dashboard will be available at http://localhost:5173

### 4. Demo Site Setup

* To generate tracking data, open the demo-site/demo.html file using a local server (like the VS Code Live Server extension) to avoid browser CORS restrictions with the file:// protocol.
* Click around the demo pages, then refresh your dashboard to see the data!

### 📂 Project Structure
<img width="497" height="363" alt="image" src="https://github.com/user-attachments/assets/89b1bca2-636d-4ba8-af5a-b528bf2a89b7" />
