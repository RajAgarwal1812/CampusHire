CampusHire is a Node.js and Express-based web application for tracking campus placement drives.

The project demonstrates a complete CI/CD workflow using Git, GitHub Pull Requests, automated testing, ESLint, Docker, GitHub Actions, and Render.

## Features

- View upcoming placement drives
- Add a placement drive using a web form
- Validate company name and drive date
- Filter placement drives by month
- JSON API for placement drives
- Health-check endpoint
- Automated tests
- ESLint code quality checks
- Dockerized application
- Automated CI/CD pipeline
- Deployment to Render

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Node.js Test Runner
- ESLint
- Git
- GitHub
- Docker
- GitHub Actions
- Render

## Application Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Display placement drives and month filter |
| `/drives` | POST | Add a new placement drive |
| `/api/drives` | GET | Return placement drives as JSON |
| `/health` | GET | Health check |

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/RajAgarwal1812/CampusHire.git
cd CampusHire
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
npm start
```

The application runs on:

```text
http://localhost:3000
```

### 4. Run tests

```bash
npm test
```

The project includes automated tests for:

* Health endpoint
* Adding a placement drive
* Invalid placement-drive validation
* Filtering placement drives by month
* JSON API response

### 5. Run lint

```bash
npm run lint
```

## Docker

### Build the Docker image

```bash
docker build -t campushire .
```

### Run the Docker container

```bash
docker run -d -p 3000:3000 campushire
```

The application can then be accessed at:

```text
http://localhost:3000
```

The health endpoint can be tested at:

```text
http://localhost:3000/health
```

## CI/CD Pipeline

CampusHire uses GitHub Actions to automate code quality checks, testing, Docker image building, and deployment.

### Pipeline

```text
Feature Branch
      |
      v
Pull Request
      |
      v
+----------------------+
| ESLint + Automated   |
| Tests                |
+----------------------+
      |
      v
+----------------------+
| Docker Image Build   |
| + Smoke Test         |
+----------------------+
      |
      v
Merge into main
      |
      v
+----------------------+
| GitHub Actions       |
| Deployment Stage     |
+----------------------+
      |
      v
+----------------------+
| Render Deploy Hook   |
+----------------------+
      |
      v
Live Website
```

### Pipeline Stages

#### 1. Test

GitHub Actions runs:

```bash
npm ci
npm run lint
npm test
```

This verifies code quality and application functionality.

#### 2. Build

After the tests pass, GitHub Actions builds the Docker image:

```bash
docker build --build-arg GIT_SHA=${GITHUB_SHA} -t campushire .
```

A Docker container is then started and the health endpoint is checked:

```text
/health
```

This acts as a smoke test to verify that the container starts correctly.

#### 3. Deploy

Deployment runs only after the test and build stages succeed and the workflow is triggered by a push to the `main` branch.

GitHub Actions triggers the Render deployment using a secure Render Deploy Hook stored as a GitHub repository secret.

The deployment secret is not stored directly in the source code.

## Git Workflow

The project follows a feature-branch and Pull Request workflow.

```text
main
 |
 +-- feature branch
       |
       +-- Development
       |
       +-- Commit
       |
       +-- Push
       |
       +-- Pull Request
       |
       +-- GitHub Actions checks
       |
       +-- Merge into main
       |
       +-- Deployment
```

Development changes are made on feature branches rather than directly on `main`.

Pull Requests are used to review and verify changes before merging them into `main`.

## Docker Configuration

The application uses a Dockerfile based on Node.js Alpine Linux.

The Docker image:

* Installs production dependencies
* Copies the application source code
* Runs the application as the Node user
* Exposes the application port
* Starts the Express server

## Project Structure

```text
CampusHire/
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .gitignore
├── README.md
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
└── test/
    └── app.test.js
```

## Deployment

The application is deployed as a Docker-based Web Service on Render.

### Live Application

[https://campushire-ca43.onrender.com](https://campushire-ca43.onrender.com)

### Health Check

[https://campushire-ca43.onrender.com/health](https://campushire-ca43.onrender.com/health)

### JSON API

[https://campushire-ca43.onrender.com/api/drives](https://campushire-ca43.onrender.com/api/drives)

## Current Placement Drives

The application currently contains sample placement-drive data:

| Company | Date       |
| ------- | ---------- |
| TCS     | 2026-09-25 |
| Infosys | 2026-10-10 |

Additional placement drives can be added through the web form.

## API Example

The `/api/drives` endpoint returns placement drives in JSON format.

Example:

```json
[
  {
    "company": "TCS",
    "date": "2026-09-25"
  },
  {
    "company": "Infosys",
    "date": "2026-10-10"
  }
]
```

## Health Check Example

The `/health` endpoint returns:

```json
{
  "status": "ok"
}
```

## CI/CD Verification

The GitHub Actions pipeline verifies that:

* ESLint passes
* Automated tests pass
* Docker image builds successfully
* Docker container starts successfully
* The health endpoint responds correctly
* Deployment is triggered only after successful CI stages
* Render receives the deployment request through a secure deploy hook

## Repository

GitHub repository:

[https://github.com/RajAgarwal1812/CampusHire](https://github.com/RajAgarwal1812/CampusHire)

## Conclusion

CampusHire demonstrates a complete development and deployment workflow for a Node.js web application.

The project combines application development with software engineering practices such as feature-branch development, Pull Requests, automated testing, linting, containerization, continuous integration, continuous deployment, and cloud deployment using Render.

````
