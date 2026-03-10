# 🧴 Skinalyze  
### Intelligent Skin Allergy Detection & Personalized Remedy Recommendation System

**Skinalyze** is an AI-powered dermatology support web application that analyzes skin images and predicts possible skin conditions using deep learning.

Google Drive Link of the System: https://drive.google.com/file/d/16VW-VY_kjemtzDNg6LXRlvsypltqnc7H/view?usp=sharing

The system provides intelligent insights including:

- 🧠 Skin condition analysis  
- 💊 Personalized remedy recommendations  
- ⚠️ Ingredient warnings  
- 👨‍⚕️ Dermatologist support information  

This project was developed as part of the **BSc Software Engineering degree at Cardiff Metropolitan University**.

---

# ⚠️ Disclaimer

Skinalyze is designed as a **decision-support tool** and **does not replace professional medical diagnosis or treatment**. Users should always consult a qualified dermatologist for medical advice.

---

# 📌 Project Overview

Skinalyze combines **Artificial Intelligence**, **Computer Vision**, and **Modern Web Technologies** to create an intelligent dermatology assistance platform.

Users can:

- 📷 Upload a skin image  
- 🤖 Receive AI-based disease prediction  
- 📊 View prediction confidence score  
- 💊 Get remedies and skincare advice  
- ⚠️ See ingredients to avoid  
- 👨‍⚕️ Access dermatologist contact information  
- 📜 Track analysis history and progress  

The platform also includes an **Admin Panel** for managing dermatological data.

---

# 🧬 Supported Skin Conditions

The AI model currently detects the following conditions:

- Acne and Rosacea  
- Eczema  
- Psoriasis  
- Fungal Infections  

The deep learning model uses **Transfer Learning with MobileNetV2 architecture** and achieved **~90% validation accuracy** during evaluation.

---

# 🏗 System Architecture

The system follows a **Client–Server Architecture**.

### Components

| Layer | Technology |
|------|------------|
| Frontend | React (Vite) |
| Backend | Flask API |
| AI Model | TensorFlow CNN (MobileNetV2) |
| Database | SQLite |

---

# 🔄 System Workflow

```
User Uploads Image
        ↓
Frontend (React)
        ↓
Flask API
        ↓
AI Model Prediction
        ↓
Retrieve Remedies & Information
        ↓
Return Results to User
```

---

# 🧰 Technology Stack

## Frontend
- React
- Vite
- Axios
- React Router
- Chart.js
- React Icons

## Backend
- Python
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS

## Artificial Intelligence
- TensorFlow
- Keras
- MobileNetV2 (Transfer Learning)
- NumPy
- Pillow

## Database
- SQLite
- SQLAlchemy ORM

## Development Tools
- Visual Studio Code
- Google Colab
- Git

---

# 📂 Project Structure

```
Skinalyze
│
├── backend
│   ├── app.py
│   ├── update_db.py
│   ├── skinalyze_model.h5
│   ├── skinalyze.db
│   ├── uploads
│   └── venv
│
└── frontend
    ├── package.json
    ├── src
    └── vite.config.js
```

---

# ⚙️ Installation Guide

## 1️⃣ Install Required Software

Install the following before starting:

- Python 3.10 or 3.11  
- Node.js 18 or 20 (LTS)  
- Git (optional)  
- Visual Studio Code (recommended)

---

# 🖥 Backend Setup

Open a terminal inside the **backend folder**.

```
cd backend
```

### Create Virtual Environment

```
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```
venv\Scripts\activate
```

**Mac / Linux**

```
source venv/bin/activate
```

### Install Dependencies

```
pip install flask
pip install flask-sqlalchemy
pip install flask-cors
pip install flask-jwt-extended
pip install werkzeug
pip install pillow
pip install tensorflow
pip install numpy
pip install python-dotenv
```

---

### Setup Database

Run:

```
python update_db.py
```

This will:

- Update database schema  
- Create the default admin account  

### Default Admin Credentials

```
Email: admin@skinalyze.com
Password: admin
```

---

### Start Backend Server

```
python app.py
```

Backend will run on:

```
http://127.0.0.1:5000
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the **frontend folder**.

```
cd frontend
```

### Install Dependencies

```
npm install
```

Install additional libraries:

```
npm install axios
npm install react-router-dom
npm install chart.js react-chartjs-2
npm install react-icons
```

---

### Start Frontend

```
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# ▶️ Running the Full System

Run **two terminals simultaneously**.

### Terminal 1 – Backend

```
cd backend
venv\Scripts\activate
python app.py
```

### Terminal 2 – Frontend

```
cd frontend
npm run dev
```

---

# 🌐 System URLs

| Service | URL |
|------|------|
| Frontend | http://localhost:5173 |
| Backend API | http://127.0.0.1:5000 |
| Admin Panel | http://localhost:5173/admin |

---

# ✨ System Features

## User Features

- User registration and login  
- Upload skin images for analysis  
- AI disease prediction  
- Confidence score display  
- Remedy recommendations  
- Ingredient warnings  
- Dermatologist contact support  
- Analysis history tracking  
- Progress monitoring  
- User feedback system  

---

## Admin Features

- Manage skin conditions  
- Manage remedies  
- Manage ingredients  
- Manage dermatologist contacts  
- View user feedback  
- View analysis records  
- Analytics dashboard  

---

# 🤖 AI Model Workflow

Image processing pipeline:

1. Upload skin image  
2. Resize image to **224 × 224**  
3. Normalize pixel values  
4. Convert image to numerical array  
5. Pass image to **CNN model**  
6. Generate prediction with **confidence score**

---

# 🚀 Future Improvements

Possible enhancements include:

- Support for more skin diseases  
- Larger training datasets  
- Mobile application version  
- Explainable AI visualization  
- Telemedicine integration with dermatologists  

---

# 👨‍💻 Author

**B. M. S. L. Karaliyawatta**

BSc Software Engineering  
Cardiff Metropolitan University

---

# 📜 License

This project was developed for **academic and research purposes**.
