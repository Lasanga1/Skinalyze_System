class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///skinalyze.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "skinalyze_secret_key"
    
    # We'll use timedelta which is imported in app.py, or define it with seconds or timedelta here.
    # Actually, we can just use integers or import timedelta
    from datetime import timedelta
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    UPLOAD_FOLDER = "uploads"
