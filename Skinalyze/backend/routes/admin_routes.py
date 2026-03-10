from functools import wraps
from flask import Blueprint, request, jsonify
from sqlalchemy.sql import func
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from database import db
from models.models import User, Condition, Remedy, Ingredient, ConditionIngredient, Doctor, Analysis, Feedback

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return jsonify({"error": "Admins only"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@admin_bp.post("/login")
def admin_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password) or user.role != "admin":
        return jsonify({"error": "Invalid admin credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": token,
        "user": {
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })

# ==========================================
# CONDITIONS
# ==========================================
@admin_bp.get("/conditions")
@admin_required()
def get_conditions():
    conditions = Condition.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "severity_note": c.severity_note,
            "doctor_required_note": c.doctor_required_note
        } for c in conditions
    ])

@admin_bp.post("/conditions")
@admin_required()
def create_condition():
    data = request.json
    c = Condition(
        name=data.get("name"),
        description=data.get("description"),
        severity_note=data.get("severity_note"),
        doctor_required_note=data.get("doctor_required_note")
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({"message": "Condition created", "id": c.id})

@admin_bp.put("/conditions/<int:id>")
@admin_required()
def update_condition(id):
    c = Condition.query.get(id)
    if not c: return jsonify({"error": "Not found"}), 404
    data = request.json
    c.name = data.get("name", c.name)
    c.description = data.get("description", c.description)
    c.severity_note = data.get("severity_note", c.severity_note)
    c.doctor_required_note = data.get("doctor_required_note", c.doctor_required_note)
    db.session.commit()
    return jsonify({"message": "Condition updated"})

@admin_bp.delete("/conditions/<int:id>")
@admin_required()
def delete_condition(id):
    c = Condition.query.get(id)
    if not c: return jsonify({"error": "Not found"}), 404
    db.session.delete(c)
    db.session.commit()
    return jsonify({"message": "Condition deleted"})

# ==========================================
# REMEDIES
# ==========================================
@admin_bp.get("/remedies")
@admin_required()
def get_remedies():
    remedies = Remedy.query.all()
    return jsonify([{
        "id": r.id, "condition_id": r.condition_id, 
        "remedy_name": r.remedy_name, "instructions": r.instructions
    } for r in remedies])

@admin_bp.post("/remedies")
@admin_required()
def create_remedy():
    data = request.json
    r = Remedy(
        condition_id=data.get("condition_id"),
        remedy_name=data.get("remedy_name"),
        instructions=data.get("instructions")
    )
    db.session.add(r)
    db.session.commit()
    return jsonify({"message": "Remedy created", "id": r.id})

@admin_bp.put("/remedies/<int:id>")
@admin_required()
def update_remedy(id):
    r = Remedy.query.get(id)
    if not r: return jsonify({"error": "Not found"}), 404
    data = request.json
    r.condition_id = data.get("condition_id", r.condition_id)
    r.remedy_name = data.get("remedy_name", r.remedy_name)
    r.instructions = data.get("instructions", r.instructions)
    db.session.commit()
    return jsonify({"message": "Remedy updated"})

@admin_bp.delete("/remedies/<int:id>")
@admin_required()
def delete_remedy(id):
    r = Remedy.query.get(id)
    if not r: return jsonify({"error": "Not found"}), 404
    db.session.delete(r)
    db.session.commit()
    return jsonify({"message": "Remedy deleted"})

# ==========================================
# INGREDIENTS
# ==========================================
@admin_bp.get("/ingredients")
@admin_required()
def get_ingredients():
    ingredients = Ingredient.query.all()
    res = []
    for i in ingredients:
        c_ids = [ci.condition_id for ci in ConditionIngredient.query.filter_by(ingredient_id=i.id).all()]
        res.append({
            "id": i.id, "name": i.name, 
            "risk_type": i.risk_type, "description": i.description,
            "condition_ids": c_ids
        })
    return jsonify(res)

@admin_bp.post("/ingredients")
@admin_required()
def create_ingredient():
    data = request.json
    i = Ingredient(
        name=data.get("name"),
        risk_type=data.get("risk_type"),
        description=data.get("description")
    )
    db.session.add(i)
    db.session.flush()
    
    condition_ids = data.get("condition_ids", [])
    for cid in condition_ids:
        ci = ConditionIngredient(condition_id=cid, ingredient_id=i.id)
        db.session.add(ci)
        
    db.session.commit()
    return jsonify({"message": "Ingredient created", "id": i.id})

@admin_bp.put("/ingredients/<int:id>")
@admin_required()
def update_ingredient(id):
    i = Ingredient.query.get(id)
    if not i: return jsonify({"error": "Not found"}), 404
    data = request.json
    i.name = data.get("name", i.name)
    i.risk_type = data.get("risk_type", i.risk_type)
    i.description = data.get("description", i.description)
    
    if "condition_ids" in data:
        ConditionIngredient.query.filter_by(ingredient_id=i.id).delete()
        for cid in data["condition_ids"]:
            ci = ConditionIngredient(condition_id=cid, ingredient_id=i.id)
            db.session.add(ci)
            
    db.session.commit()
    return jsonify({"message": "Ingredient updated"})

@admin_bp.delete("/ingredients/<int:id>")
@admin_required()
def delete_ingredient(id):
    i = Ingredient.query.get(id)
    if not i: return jsonify({"error": "Not found"}), 404
    ConditionIngredient.query.filter_by(ingredient_id=i.id).delete()
    db.session.delete(i)
    db.session.commit()
    return jsonify({"message": "Ingredient deleted"})

# ==========================================
# DOCTORS
# ==========================================
@admin_bp.get("/doctors")
@admin_required()
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([{
        "id": d.id, "name": d.name, "specialization": d.specialization,
        "hospital": d.hospital, "contact": d.contact, "location": d.location
    } for d in doctors])

@admin_bp.post("/doctors")
@admin_required()
def create_doctor():
    data = request.json
    d = Doctor(
        name=data.get("name"),
        specialization=data.get("specialization"),
        hospital=data.get("hospital"),
        contact=data.get("contact"),
        location=data.get("location")
    )
    db.session.add(d)
    db.session.commit()
    return jsonify({"message": "Doctor created", "id": d.id})

@admin_bp.put("/doctors/<int:id>")
@admin_required()
def update_doctor(id):
    d = Doctor.query.get(id)
    if not d: return jsonify({"error": "Not found"}), 404
    data = request.json
    d.name = data.get("name", d.name)
    d.specialization = data.get("specialization", d.specialization)
    d.hospital = data.get("hospital", d.hospital)
    d.contact = data.get("contact", d.contact)
    d.location = data.get("location", d.location)
    db.session.commit()
    return jsonify({"message": "Doctor updated"})

@admin_bp.delete("/doctors/<int:id>")
@admin_required()
def delete_doctor(id):
    d = Doctor.query.get(id)
    if not d: return jsonify({"error": "Not found"}), 404
    db.session.delete(d)
    db.session.commit()
    return jsonify({"message": "Doctor deleted"})

# ==========================================
# VIEWERS (Analysis & Feedback)
# ==========================================
@admin_bp.get("/feedback")
@admin_required()
def get_all_feedback():
    feedbacks = db.session.query(Feedback, User.email).join(User, Feedback.user_id == User.id).all()
    return jsonify([{
        "id": f.Feedback.id,
        "user_email": f.email,
        "analysis_id": f.Feedback.analysis_id,
        "rating": f.Feedback.rating,
        "comment": f.Feedback.comment
    } for f in feedbacks])

@admin_bp.get("/analysis")
@admin_required()
def get_all_analysis():
    analyses = Analysis.query.all()
    return jsonify([{
        "analysis_id": a.id,
        "user_id": a.user_id,
        "prediction": a.prediction,
        "confidence": a.confidence,
        "image_path": a.image_path,
        "created_at": a.created_at
    } for a in analyses])

# ==========================================
# ANALYTICS DASHBOARD
# ==========================================
@admin_bp.get("/analytics")
@admin_required()
def get_analytics():
    total_users = User.query.count()
    total_analyses = Analysis.query.count()
    total_feedback = Feedback.query.count()
    
    # Common condition
    analyses = Analysis.query.all()
    predictions = [a.prediction for a in analyses]
    
    dist = {}
    for p in predictions:
        dist[p] = dist.get(p, 0) + 1
        
    most_common = max(dist, key=dist.get) if dist else "N/A"
    
    # Analyses per day
    # Simple formatting string approach for SQLite
    daily_query = db.session.query(
        func.date(Analysis.created_at).label('date'), 
        func.count(Analysis.id)
    ).group_by('date').all()
    
    analyses_per_day = {x[0]: x[1] for x in daily_query}
    
    # Average confidence
    avg_conf = db.session.query(func.avg(Analysis.confidence)).scalar() or 0.0

    return jsonify({
        "total_users": total_users,
        "total_analyses": total_analyses,
        "total_feedback": total_feedback,
        "most_common_prediction": most_common,
        "prediction_distribution": dist,
        "analyses_per_day": analyses_per_day,
        "average_confidence": round(avg_conf * 100, 2)
    })
