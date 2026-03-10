try:
    from flask_sqlalchemy import SQLAlchemy
    SQLALCHEMY_AVAILABLE = True
except ImportError:
    SQLALCHEMY_AVAILABLE = False
    print("Warning: flask-sqlalchemy not installed. Database support disabled.")
    # Create a mock SQLAlchemy object
    class SQLAlchemy:
        def init_app(self, app):
            pass
        
        def create_all(self):
            pass

try:
    from flask_jwt_extended import JWTManager
    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False
    print("Warning: flask-jwt-extended not installed. JWT support disabled.")
    # Create a mock JWTManager object
    class JWTManager:
        def init_app(self, app):
            pass

db = SQLAlchemy()
jwt = JWTManager()
