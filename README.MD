## "Anomaly Detection System Using Web Server Logs" 

This project aims to enhance web security within a hospital management system by utilizing advanced machine learning techniques. Given the increasing complexity of cyber threats, this system is designed to automatically differentiate between normal web activities and potential malicious intrusions by analyzing web server logs. 

Developing an anomaly detection system involves several crucial steps which includes gathering real web logs, for analyzing web server activities, simulating various cyber attacks with diverse scenarios, training multiple machine learning models using the log data and finally enabling it to automatically detect and flag unusual and potentially harmful activities.

This report details the development of such a system, the machine learning algorithms employed, and the significance of this technology in combating cyber threats, particularly in today’s context of the evolving digital landscape.




## Creating the Frontend Project Structure
cd anomaly_detection/frontend
npx create-react-app anomaly_app

npm install axios


## Starting FrontEnd
export NODE_OPTIONS=--openssl-legacy-provider

npm start


npm start -- --port 8848

## Project Structure
Anomaly_detection/
│
├── backend/             # All backend-related files
│   ├── app/             # Main application files
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility scripts and helper functions
│   │
│   ├── config/          # Configuration files and environment variables
│   ├── tests/           # Test scripts
│   ├── main.py          # Entry point for the FastAPI application
│   └── requirements.txt # Python dependencies
│
├── frontend/            # All frontend-related files
│   ├── src/             # Source files
│   │   ├── components/  # UI components
│   │   ├── views/       # Pages or views
│   │   ├── services/    # Services for API calls and data handling
│   │   ├── app.js       # Main frontend application file
│   │   └── index.js     # Entry point for the frontend application
│   │
│   ├── public/          # Public files like index.html, favicons
│   ├── assets/          # Static assets like images, stylesheets
│   └── package.json     # Frontend dependencies and scripts
│
├── database/            # Database-related files
│   ├── migrations/      # Database migration files
│   └── scripts/         # Scripts for database setup and maintenance
│
├── docs/                # Documentation for the project
│
├── scripts/             # Utility scripts for deployment, setup, etc.
│
├── .gitignore           # Specifies intentionally untracked files to ignore
├── README.md            # Project overview and instructions
└── docker-compose.yml   # Docker configuration for local development (optional)
