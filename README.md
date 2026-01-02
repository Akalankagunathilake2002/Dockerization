# Dockerized Microservices Application 🚀

This project is a **Dockerized microservices-based application** built using **Node.js, Express, MongoDB, and RabbitMQ**, with a modern **Next.js frontend (planned)**.

It demonstrates real-world backend architecture concepts such as service separation, asynchronous communication, and container orchestration.

---

## 🧩 Architecture Overview

The system consists of the following services:

### 🔹 User Service

* Manages user-related operations
* Built with **Node.js + Express**
* Uses **MongoDB** for persistence

### 🔹 Task Service

* Handles task creation and retrieval
* Stores data in **MongoDB**
* Publishes events to **RabbitMQ** when a task is created

### 🔹 Notification Service

* Listens to RabbitMQ events
* Consumes `task_created` messages
* Simulates notifications by logging events

### 🔹 MongoDB

* Central database for services
* Each service uses its own collection

### 🔹 RabbitMQ

* Message broker for asynchronous communication
* Enables event-driven architecture

### 🔹 Frontend 

* Will be developed using **Next.js**
* Will interact with backend services via REST APIs
* Focused on a clean and modern UI

---

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* RabbitMQ
* Docker & Docker Compose

**Frontend**

* Next.js (planned)

---

## 📂 Project Structure

```
Dockerization/
│
├── docker-compose.yml
├── user-service/
├── task-service/
├── notification-service/
└── frontend/        (to be added using Next.js)
```

---

## 🚀 How to Run the Project

### 1️⃣ Prerequisites

* Docker
* Docker Compose

### 2️⃣ Start all services

From the project root:

```bash
docker compose up --build -d
```

### 3️⃣ Verify running containers

```bash
docker ps
```

---

## 🔗 Service Ports

| Service              | Port     |
| -------------------- | -------- |
| User Service         | 3000     |
| Task Service         | 3003     |
| Notification Service | Internal |
| MongoDB              | 27017    |
| RabbitMQ             | 5672     |
| RabbitMQ UI          | 15672    |

---

## 🧪 API Endpoints (Examples)

### Create a Task

```
POST http://localhost:3003/tasks
```

Body:

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs",
  "userId": "1"
}
```

---

## 📌 Key Features

* Microservices architecture
* Event-driven communication using RabbitMQ
* Dockerized services for easy setup
* Scalable and production-style backend design
* Frontend planned with Next.js

---



## 📄 License

This project is for educational and learning purposes.
