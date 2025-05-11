# Menu Project API Documentation

## 📦 Project Setup with Docker

### ✅ Prerequisites

- Docker
- Docker Compose

### 📥 Clone and Launch

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd Menu_prj
   ```

2. Start the containers:

   ```bash
   docker-compose up --build -d
   ```

3. The app will run at: [http://localhost:80](http://localhost:80)

---

## 🔐 Authentication

### 📌 Register

**POST** `/api/auth/register/`

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "role": "restaurant_owner" // Options: "admin", "restaurant_owner"
}
```

### 📌 Login

**POST** `/api/auth/login/`

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "token": "your_auth_token"
}
```

---

## 👤 User Management (Requires Auth Header)

Add header to all requests:

```
Authorization: Token your_auth_token
```

### ✅ Get Profile

**GET** `/api/users/me/`

### ✏️ Update Profile

**PUT** `/api/users/me/`

```json
{
  "email": "newemail@example.com",
  "username": "newusername"
}
```

---

## 🍽️ Items Management

### ➕ Create Item

**POST** `/api/items/`

- Content-Type: `multipart/form-data`
- Fields:

  - `item_name`: string (required)
  - `prix`: decimal (required)
  - `categorie`: string (required)
  - `uploaded_images`: file\[] (optional, multiple allowed)

### 📋 Get All Items

**GET** `/api/items/`

### 🔎 Get Single Item

**GET** `/api/items/{id}/`

### 🛠 Update Item

**PUT** `/api/items/{id}/`

- Content-Type: `multipart/form-data`
- Optional Fields:

  - `item_name`
  - `prix`
  - `categorie`
  - `uploaded_images`: file\[]

### ❌ Delete Item

**DELETE** `/api/items/{id}/`

### 🖼 Delete Image from Item

**DELETE** `/api/items/{item_id}/delete_image/?image_id={image_id}`

---

## 📄 Response Format

### Item Object

```json
{
  "id": 1,
  "user": 1,
  "item_name": "Pizza",
  "prix": "12.99",
  "categorie": "main_course",
  "images": [
    {
      "id": 1,
      "image_url": "/media/items/image1.jpg"
    }
  ]
}
```

---

## 🚫 Error Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## 🗂 File Storage

- Images: `/media/items/`
- Static files: `/static/`
- Persisted via Docker volumes

---

## 💡 Notes for Frontend Developers

- Use `Authorization: Token <your_token>` in headers after login
- Use `multipart/form-data` for image uploads
- Multiple images per item supported
- All endpoints return JSON
- Access media from `/media/`
