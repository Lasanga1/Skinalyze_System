from app import app
from database import db
from models.models import Condition, Remedy, Ingredient, ConditionIngredient

with app.app_context():
    psoriasis = Condition.query.filter_by(name="Psoriasis pictures Lichen Planus and related diseases").first()
    tinea = Condition.query.filter_by(name="Tinea Ringworm Candidiasis and other Fungal Infections").first()

    if psoriasis:
        # Add Remedy
        r_p = Remedy(condition_id=psoriasis.id, remedy_name="Coal Tar Topical", instructions="Apply directly to affected areas to reduce scaling and itching.")
        db.session.add(r_p)
        # Add Ingredient
        i_p = Ingredient(name="Salicylic Acid (High Concentration)", risk_type="Irritant for severe psoriasis", description="Can cause excessive dryness in plaque psoriasis if overused.")
        db.session.add(i_p)
        db.session.flush()
        db.session.add(ConditionIngredient(condition_id=psoriasis.id, ingredient_id=i_p.id))

    if tinea:
        # Add Remedy
        r_t = Remedy(condition_id=tinea.id, remedy_name="Clotrimazole Cream", instructions="Apply twice a day to the fungal infection site.")
        db.session.add(r_t)
        # Add Ingredient
        i_t = Ingredient(name="Heavy Oils (Coconut Oil, Cocoa Butter)", risk_type="Fungal Feeder", description="Some heavy oils can trap moisture and actually feed certain fungal infections like Malassezia.")
        db.session.add(i_t)
        db.session.flush()
        db.session.add(ConditionIngredient(condition_id=tinea.id, ingredient_id=i_t.id))

    db.session.commit()
    print("Seeded missing data successfully.")
