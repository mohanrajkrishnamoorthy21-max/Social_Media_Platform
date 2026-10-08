# 📱 Social Media Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-REST_Framework-red.svg)](https://www.django-rest-framework.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack social media application built with a **Django REST Framework** backend and a responsive **Vanilla JavaScript (SPA)** frontend. Users can publish posts, interact via likes and comments, follow other accounts, customize profiles, and explore suggested connections.

---

## ✨ Features

- **🔐 Authentication & Security**
  - Custom User Registration & Login with DRF Token Authentication.
  - Secure password hashing and token management via `LocalStorage`.

- **📝 Post Management**
  - Create, view, and delete text posts with optional media attachments.
  - Dynamic feed rendering with real-time state updates.

- **❤️ Interactive Reactions & Comments**
  - Like/Unlike posts with instant count updates.
  - Threaded comment feeds for each post with instant UI rendering.

- **👥 Social Network & Relationships**
  - Follow/Unfollow users with dynamic button states.
  - View followers and following lists.
  - Smart "Suggested Users" recommendations.

- **👤 User Profiles**
  - Customizable profile info (Bio, Location, Avatar).
  - View user timeline, follower metrics, and activity history.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2 & Django REST Framework (DRF)
- **Authentication**: TokenAuthentication & SessionAuthentication
- **Database**: SQLite (Development) / MySQL / PostgreSQL (Production)
- **CORS & Environment**: `django-cors-headers`, `django-environ`

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+ Vanilla)
- **Architecture**: Single Page Application (SPA) structure
- **Communication**: Native `Fetch API` for REST endpoints

---

## 📂 Project Structure

```text
social_media_platform/
├── backend/
│   ├── comments/         # Comment models, serializers, views, and endpoints
│   ├── follows/          # User relationship logic (follow/unfollow, followers)
│   ├── likes/            # Post reaction and liking system
│   ├── posts/            # Post creation, retrieval, and management
│   ├── users/            # Custom user model, auth endpoints, profile views
│   ├── socialmedia/      # Main Django project configurations & settings
│   ├── manage.py         # Django management CLI script
│   └── .env.example      # Example environment configuration file
├── frontend/
│   ├── css/
│   │   └── style.css     # Main stylesheet and responsive layouts
│   ├── js/
│   │   ├── api.js        # API service layer using Fetch API
│   │   ├── app.js        # Main application entry point & routing
│   │   └── ui.js         # UI component rendering & DOM helpers
│   └── index.html        # Single Page Application entry point
├── .gitignore            # Git exclusion rules for sensitive & build files
└── README.md             # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/mohanrajkrishnamoorthy21-max/Social_Media_Platform.git
cd Social_Media_Platform
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers django-environ
   ```

4. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` folder based on `.env.example`:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=socialmedia
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

5. **Apply Database Migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Create Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django Development Server**:
   ```bash
   python manage.py runserver
   ```
   The backend API will run at `http://127.0.0.1:8000/`.

---

### 3. Frontend Setup

You can serve the frontend files using any static web server (such as Live Server in VS Code) or Python's built-in HTTP server:

```bash
# From project root:
python -m http.server 5500 --directory frontend
```

Open `http://127.0.0.1:5500` in your web browser.

---

## 📡 API Endpoints Reference

### Authentication & Users (`/api/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/register/` | Register a new user | ❌ |
| `POST` | `/api/login/` | Obtain authentication token | ❌ |
| `POST` | `/api/logout/` | Invalidate current token | `Bearer Token` |
| `GET` | `/api/me/` | Fetch authenticated user details | `Bearer Token` |
| `PUT/PATCH` | `/api/profile/update/` | Update profile information | `Bearer Token` |
| `GET` | `/api/profile/<username>/` | Get public profile of a user | ❌ |
| `GET` | `/api/suggested/` | List suggested accounts to follow | `Bearer Token` |

### Posts (`/api/posts/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/posts/` | Fetch global feed posts | ❌ |
| `POST` | `/api/posts/` | Create a new post | `Bearer Token` |
| `GET` | `/api/posts/<id>/` | Fetch single post detail | ❌ |
| `DELETE` | `/api/posts/<id>/` | Delete user's own post | `Bearer Token` |
| `GET` | `/api/posts/user/<username>/` | List all posts by a specific user | ❌ |

### Comments & Likes (`/api/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/posts/<post_id>/comments/` | Fetch comments for a post | ❌ |
| `POST` | `/api/posts/<post_id>/comments/` | Add a comment to a post | `Bearer Token` |
| `DELETE` | `/api/comments/<id>/` | Delete own comment | `Bearer Token` |
| `POST` | `/api/posts/<post_id>/like/` | Toggle like/unlike status on a post | `Bearer Token` |

### Follows (`/api/users/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/users/<username>/follow/` | Toggle follow/unfollow a user | `Bearer Token` |
| `GET` | `/api/users/<username>/followers/` | List followers of a user | ❌ |
| `GET` | `/api/users/<username>/following/` | List users followed by a user | ❌ |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
