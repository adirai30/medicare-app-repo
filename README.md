# 🏥 MediCare App — DevSecOps Application Repository

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Nginx](https://img.shields.io/badge/Nginx-Frontend-brightgreen)
![Trivy](https://img.shields.io/badge/Trivy-Security-blue)
![ECR](https://img.shields.io/badge/AWS-ECR-orange)
![GitOps](https://img.shields.io/badge/Deployment-GitOps-purple)

## 📌 Project Overview

**MediCare** is a cloud-native healthcare appointment platform designed and deployed using modern **AWS DevOps, DevSecOps, Kubernetes, and GitOps practices**.

The application provides a healthcare interface for managing:

* 👨‍⚕️ Doctors
* 🏥 Hospitals
* 👤 Patients
* 📅 Appointments
* ❤️ Healthcare services

The application is containerized with Docker and deployed to **Amazon EKS**.

The CI/CD pipeline automatically:

1. 🧪 Tests the backend
2. 🔐 Performs security scanning
3. 🐳 Builds Docker images
4. 📦 Pushes images to Amazon ECR
5. 🔄 Updates the GitOps repository
6. 🚀 Allows Argo CD to synchronize the new version into EKS

---

# 🏗️ High-Level Architecture

```text
                    👨‍💻 Developer
                         │
                         ▼
                 ┌─────────────────┐
                 │     GitHub      │
                 │   App Repository│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ GitHub Actions  │
                 │   CI/CD Pipeline│
                 └────────┬────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          🧪 Test      🔐 Trivy      🐳 Docker
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Amazon ECR    │
                              │ Backend + Frontend
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  GitOps Update  │
                              │   Repository    │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │     Argo CD     │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Amazon EKS    │
                              │                 │
                              │  MediCare App   │
                              └─────────────────┘
```

---

# 🧰 Technology Stack

| Category                   | Technology            |
| -------------------------- | --------------------- |
| ☁️ Cloud                   | AWS                   |
| ☸️ Container Orchestration | Amazon EKS            |
| 🐳 Containers              | Docker                |
| 📦 Container Registry      | Amazon ECR            |
| 🔄 CI/CD                   | GitHub Actions        |
| 🔐 Security Scan           | Trivy                 |
| 🚀 GitOps CD               | Argo CD               |
| 🟢 Backend                 | Node.js + Express     |
| 🌐 Frontend                | HTML, CSS, JavaScript |
| 🌍 Web Server              | Nginx                 |
| 🗃️ Source Control         | Git + GitHub          |
| 🏗️ Infrastructure         | Terraform             |
| 📊 Monitoring              | Prometheus + Grafana  |

---

# 📁 Repository Structure

```text
medicare-app-repo/
│
├── .github/
│   └── workflows/
│       └── devsecops-ci.yml
│
├── backend/
│   ├── data/
│   ├── routes/
│   │   ├── appointments.js
│   │   ├── doctors.js
│   │   ├── hospitals.js
│   │   └── patients.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── Dockerfile
│   └── index.html
│
├── README.md
├── .gitignore
└── Dockerfile
```

---

# ⚙️ Backend

The backend is developed using:

* Node.js
* Express.js
* CORS
* REST APIs

### API Endpoints

```text
GET /api/health
GET /api/doctors
GET /api/hospitals
GET /api/patients
GET /api/appointments
```

### Health Check

```text
GET /api/health
```

Example response:

```json
{
  "status": "UP",
  "service": "MediCare Backend",
  "message": "Hospital appointment API is running"
}
```

---

# 🌐 Frontend

The frontend is served through **Nginx**.

The production application uses:

```javascript
const API_BASE_URL = "/api";
```

Using a relative API path allows the frontend and backend to communicate through the same public ALB endpoint.

---

# 🐳 Docker

## Backend Image

The backend uses:

```dockerfile
FROM node:20-alpine
```

The container exposes:

```text
5000
```

## Frontend Image

The frontend uses:

```dockerfile
FROM nginx:alpine
```

The container exposes:

```text
80
```

---

# 🔐 DevSecOps Pipeline

Workflow:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── 🧪 Backend Tests
   │
   ├── 🔐 Trivy Security Scan
   │
   ├── 🐳 Build Backend Image
   │
   ├── 🐳 Build Frontend Image
   │
   ├── 📦 Push Images → Amazon ECR
   │
   └── 🔄 Update GitOps Repository
             │
             ▼
          Argo CD
```

---

# 🧪 Application Testing

Backend tests are executed using:

```bash
npm ci
npm test
```

The test validates the JavaScript syntax of:

```text
server.js
appointments.js
doctors.js
hospitals.js
patients.js
```

---

# 🔐 Security

Trivy is used for filesystem/container security scanning.

The CI pipeline checks for:

```text
CRITICAL
HIGH
```

severity vulnerabilities.

The project also uses:

### 🔑 GitHub OIDC

AWS authentication from GitHub Actions uses:

```text
GitHub Actions
      ↓
OIDC
      ↓
AWS IAM Role
      ↓
Amazon ECR
```

No long-lived AWS access keys are stored in GitHub Actions.

---

# 📦 Amazon ECR

Two Docker images are maintained:

```text
medicare-backend
medicare-frontend
```

Images are tagged using the Git commit SHA.

Example:

```text
788365607408.dkr.ecr.us-east-1.amazonaws.com/medicare-backend:<commit-sha>

788365607408.dkr.ecr.us-east-1.amazonaws.com/medicare-frontend:<commit-sha>
```

This provides traceability between:

```text
Git Commit → Docker Image → GitOps Manifest → EKS Deployment
```

---

# 🔄 GitOps Integration

After successfully building and pushing images, GitHub Actions updates the GitOps repository with the new image tag.

```text
App Repository
      │
      ▼
GitHub Actions
      │
      ▼
Amazon ECR
      │
      ▼
GitOps Repository
      │
      ▼
Argo CD
      │
      ▼
Amazon EKS
```

---

# 🚀 Deployment

The application is deployed to:

```text
Amazon EKS
```

Kubernetes namespace:

```text
medicare
```

Current application components:

```text
medicare-backend
medicare-frontend
```

Both workloads run multiple replicas for improved availability.

---

# 🌍 Application Access

The application is exposed through:

```text
AWS Application Load Balancer
```

The ALB routes:

```text
/api/*  → Backend
/*      → Frontend
```

---

# 📊 Monitoring

The platform is designed to integrate:

* Prometheus
* Grafana
* Alertmanager

Monitoring will provide visibility into:

* CPU usage
* Memory usage
* Kubernetes pods
* Nodes
* Deployments
* Application health
* Cluster resources

---

# 🛠️ Local Development

## Clone Repository

```bash
git clone https://github.com/adirai30/medicare-app-repo.git
cd medicare-app-repo
```

## Backend

```bash
cd backend
npm install
npm test
node server.js
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Frontend

The frontend can be served using any static HTTP server or Nginx.

---

# 🐳 Local Docker Testing

### Backend

```bash
cd backend
docker build -t medicare-backend .
docker run -p 5000:5000 medicare-backend
```

### Frontend

```bash
cd frontend
docker build -t medicare-frontend .
docker run -p 8080:80 medicare-frontend
```

---

# 🎯 Project Objectives

This project demonstrates practical experience with:

* ☁️ AWS Cloud
* ☸️ Kubernetes
* 🐳 Docker
* 🔄 CI/CD
* 🔐 DevSecOps
* 📦 Amazon ECR
* 🔑 AWS IAM + OIDC
* 🌎 AWS Load Balancer
* 🚀 GitOps
* 🔁 Argo CD
* 🏗️ Terraform
* 📊 Prometheus
* 📈 Grafana

---

# 👨‍💻 Author

**Aditya Rai**

Cloud / DevOps Engineer

GitHub:

https://github.com/adirai30

---

# ⭐ Project Highlights

```text
✅ AWS EKS deployment
✅ Dockerized application
✅ GitHub Actions CI/CD
✅ Trivy security scanning
✅ AWS OIDC authentication
✅ Amazon ECR
✅ GitOps deployment
✅ Argo CD
✅ Kubernetes health probes
✅ AWS Application Load Balancer
✅ Terraform infrastructure
✅ Prometheus + Grafana monitoring
```

---

# 📜 License

This project is created for learning, portfolio, demonstration, and DevOps practice purposes.
