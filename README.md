# URL Shortener

A simple and efficient URL shortener service built with **React** (frontend) and **Node.js** (backend). It supports shortening URLs, generating QR codes, viewing analytics, and managing user authentication. The service also integrates with IPQS for spam and malware detection.

---

## Features

- **URL Shortening**: Create short URLs that redirect to longer URLs.
- **User Authentication**: Signup, login, and logout functionality with JWT authentication.
- **Analytics**: View the total number of clicks and visit history for each shortened URL.
- **QR Code Generation**: Generate QR codes for shortened URLs.
- **Spam & Malware Detection**: Check for spam, malware, and other security risks via IPQS.
- **Responsive UI**: Built with React, ensuring a smooth experience across devices.
- - **Copy Feature**: Easily copy the shortened URL to your clipboard with one click.

---

## Tech Stack

### Frontend
- **React** (Vite for fast builds)
- **CSS Modules** (for component-based styling)
- **Axios** (for API requests)
- **React Router** (for routing)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (for data storage)
- **Mongoose** (ODM for MongoDB)
- **JWT Authentication** (for secure user login)
- **IPQS API** (for spam and malware detection)
- **QR Code Generation** (via `qrcode` package)

---

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- MongoDB (for local setup or use MongoDB Atlas)
- A `.env` file with your environment variables (more info below)

### Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/URL-Shortener.git
   cd URL-Shortener

Frontend .env:
plaintext
Copy
Edit
VITE_BASE_URL=http://localhost:8000
Backend .env:
plaintext
Copy
Edit
BASE_URL=http://localhost:8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
IPQS_API_KEY=your_ipqs_api_key
