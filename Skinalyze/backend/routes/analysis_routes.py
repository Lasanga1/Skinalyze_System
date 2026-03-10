import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db
from models.models import Analysis, Condition, Remedy, Ingredient, ConditionIngredient, Doctor
from services.ai_service import analyze_image, RECOMMENDATIONS

analysis_bp = Blueprint('analysis_bp', __name__)

@analysis_bp.post("/analyze")
@jwt_required()
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    file = request.files["image"]

    filename = str(uuid.uuid4()) + ".jpg"
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)

    file.save(filepath)

    prediction, confidence = analyze_image(filepath)
    print("Prediction from model:", prediction)
    
    prediction_clean = prediction.strip()

    condition = Condition.query.filter(
        db.func.lower(Condition.name) == prediction_clean.lower()
    ).first()

    if not condition:
        return jsonify({
            "error": "Condition not found in database",
            "prediction": prediction
        }), 400
    
    remedies = Remedy.query.filter_by(condition_id=condition.id).all()
    ingredients = db.session.query(Ingredient).join(
        ConditionIngredient,
        Ingredient.id == ConditionIngredient.ingredient_id
    ).filter(
        ConditionIngredient.condition_id == condition.id
    ).all()
    doctors = Doctor.query.all()

    user_id = int(get_jwt_identity())

    analysis = Analysis(
        user_id=user_id,
        prediction=prediction,
        confidence=confidence,
        image_path=filepath
    )

    db.session.add(analysis)
    db.session.commit()

    rec = RECOMMENDATIONS.get(prediction, {"advice": [], "avoid": []})

    remedy_list = [r.remedy_name for r in remedies]
    ingredient_list = [i.name for i in ingredients]

    doctor_list = [
        {
            "name": d.name,
            "hospital": d.hospital,
            "contact": d.contact,
            "location": d.location
        }
        for d in doctors
    ]

    return jsonify({
        "analysis_id": analysis.id,
        "prediction": prediction,
        "confidence": round(confidence * 100, 2),
        "image": "/uploads/" + filename,

        "condition_info": {
            "description": condition.description,
            "severity_note": condition.severity_note,
            "doctor_required_note": condition.doctor_required_note
        },

        "remedies": remedy_list,
        "ingredients_to_avoid": ingredient_list,
        "doctor_support": doctor_list
    })


@analysis_bp.get("/history")
@jwt_required()
def history():
    user_id = int(get_jwt_identity())
    rows = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.desc()).all()

    return jsonify([
        {
            "id": r.id,
            "prediction": r.prediction,
            "confidence": round(r.confidence * 100, 2),
            "image": "/uploads/" + os.path.basename(r.image_path) if r.image_path else None,
            "date": r.created_at
        }
        for r in rows
    ])


@analysis_bp.get("/progress")
@jwt_required()
def progress():
    user_id = int(get_jwt_identity())
    rows = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.asc()).all()
    
    severity_map = {
        "Acne and Rosacea": 4,
        "Eczema": 6,
        "Psoriasis pictures Lichen Planus and related diseases": 8,
        "Tinea Ringworm Candidiasis and other Fungal Infections": 7
    }

    return jsonify([
        {
            "id": r.id,
            "prediction": r.prediction,
            "confidence": round(r.confidence * 100, 2),
            "image": "/uploads/" + os.path.basename(r.image_path) if r.image_path else None,
            "date": r.created_at,
            "severity_score": severity_map.get(r.prediction, 5)
        }
        for r in rows
    ])


@analysis_bp.get("/doctors")
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([
        {
            "id": d.id,
            "name": d.name,
            "specialization": d.specialization,
            "hospital": d.hospital,
            "contact": d.contact,
            "location": d.location
        } for d in doctors
    ])


@analysis_bp.get("/conditions")
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
