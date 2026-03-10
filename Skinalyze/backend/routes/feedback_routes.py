from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database import db
from models.models import Feedback

feedback_bp = Blueprint('feedback_bp', __name__)

@feedback_bp.post("/feedback")
@jwt_required()
def feedback():
    data = request.json

    fb = Feedback(
        user_id=int(get_jwt_identity()),
        analysis_id=data["analysis_id"],
        rating=data["rating"],
        comment=data.get("comment", "")
    )

    db.session.add(fb)
    db.session.commit()

    return jsonify({"message": "Feedback saved"})
