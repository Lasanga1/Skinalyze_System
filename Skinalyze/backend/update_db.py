import sqlite3
from werkzeug.security import generate_password_hash

DB_PATH = "instance/skinalyze.db"

def run_migration():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if 'role' column exists in 'user' table
    cursor.execute("PRAGMA table_info(user)")
    columns = [info[1] for info in cursor.fetchall()]
    
    if "role" not in columns:
        print("Adding 'role' column to 'user' table...")
        cursor.execute("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'user'")
        conn.commit()
    else:
        print("'role' column already exists in 'user' table.")
        
    # Seed an admin user
    cursor.execute("SELECT id FROM user WHERE email = 'admin@skinalyze.com'")
    if not cursor.fetchone():
        print("Seeding default admin user...")
        pwd_hash = generate_password_hash("admin")
        cursor.execute("INSERT INTO user (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                       ("Admin User", "admin@skinalyze.com", pwd_hash, "admin"))
        conn.commit()
    else:
        print("Admin user already exists.")
        
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    run_migration()
