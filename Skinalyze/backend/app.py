from flask import Flask, jsonify, send_from_directory
import os

try:
    from flask_cors import CORS
    CORS_AVAILABLE = True
except ImportError:
    CORS_AVAILABLE = False
    print("Warning: flask-cors not installed. CORS support disabled.")

from config import Config
from database import db, jwt

def create_app():
    app = Flask(__name__)
    
    if CORS_AVAILABLE:
        CORS(app)
    
    app.config.from_object(Config)
    
    db.init_app(app)
    jwt.init_app(app)
    
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    
    # Register blueprints
    try:
        from routes.auth_routes import auth_bp
        from routes.analysis_routes import analysis_bp
        from routes.feedback_routes import feedback_bp
        from routes.admin_routes import admin_bp
        
        app.register_blueprint(auth_bp)
        app.register_blueprint(analysis_bp)
        app.register_blueprint(feedback_bp)
        app.register_blueprint(admin_bp)
    except ImportError as e:
        print(f"Warning: Could not import some routes: {e}")
    
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    with app.app_context():
        try:
            # Import models so SQLAlchemy creates the tables if they don't exist
            from models import models
            db.create_all()
        except Exception as e:
            print(f"Warning: Could not create database tables: {e}")
        
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
