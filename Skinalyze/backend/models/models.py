from database import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user")


class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    prediction = db.Column(db.String(255), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    image_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.now())


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    analysis_id = db.Column(db.Integer, db.ForeignKey("analysis.id"), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(500))


class Condition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    description = db.Column(db.Text)
    severity_note = db.Column(db.Text)
    doctor_required_note = db.Column(db.Text)


class Remedy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    condition_id = db.Column(db.Integer, db.ForeignKey("condition.id"))
    remedy_name = db.Column(db.String(255))
    instructions = db.Column(db.Text)


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    risk_type = db.Column(db.String(200))
    description = db.Column(db.Text)


class ConditionIngredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    condition_id = db.Column(db.Integer, db.ForeignKey("condition.id"))
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"))


class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    specialization = db.Column(db.String(200))
    hospital = db.Column(db.String(200))
    contact = db.Column(db.String(50))
    location = db.Column(db.String(200))
