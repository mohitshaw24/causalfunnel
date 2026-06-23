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

git clone https://github.com/mohitshaw24/causalfunnel.git
cd causalfunnel

