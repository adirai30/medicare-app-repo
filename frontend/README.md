# MediCare Frontend

Professional responsive frontend for the AWS Hospital Appointment DevSecOps/GitOps project.

## Structure

```text
frontend/
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Features

- Responsive hospital/healthcare landing page
- Doctor directory with specialty filters
- Hospital directory
- Appointment booking wizard
- Patient details and appointment confirmation
- Local demo appointment persistence using `localStorage`
- Patient dashboard
- Appointment cancellation
- Appointment download as `.txt`
- Login demo flow
- Medical service cards
- Support, privacy, terms and disclaimer placeholders
- Mobile navigation
- Accessible buttons and form labels
- No frontend framework required

## Run locally

Open `index.html` directly in a browser, or use VS Code Live Server.

For a simple local server:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Backend integration points

The frontend is intentionally API-ready. Replace the demo/localStorage logic in `js/app.js` with your backend endpoints for:

- authentication
- hospitals
- doctors
- departments
- appointment slots
- appointment creation
- appointment cancellation
- patient records

## Production note

This is a portfolio/demo frontend. Do not use the placeholder support details or localStorage for real patient/medical data. Production healthcare deployments require appropriate authentication, authorization, encryption, privacy controls, audit logging and compliance review.
