from app import app
from database import db
from models.models import Condition, Remedy, Ingredient, ConditionIngredient

with app.app_context():
    with open('db_output.txt', 'w') as f:
        for cond in Condition.query.all():
            rems = Remedy.query.filter_by(condition_id=cond.id).all()
            ings = db.session.query(Ingredient).join(ConditionIngredient).filter(ConditionIngredient.condition_id == cond.id).all()
            f.write(f"{cond.name}: {len(rems)} remedies, {len(ings)} ingredients\n")
