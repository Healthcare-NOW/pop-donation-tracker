from dev import app
from app.models import *
from app.models import db
from sqlalchemy.orm import joinedload

app.app_context().push()


flagged_employers = FlaggedEmployer.query.options(joinedload("matching_rules")).all()

for employer in flagged_employers:
    print(f"Applying rules for {employer.name}...")
    for matching_rule in employer.matching_rules:
        print(
            f"Employer: {matching_rule.employer} City: {matching_rule.city} State: {matching_rule.state}"
        )
        query = Committee.query.filter(
            Committee.name.op("~")(matching_rule.employer)
            | Committee.connected_organization.op("~")(matching_rule.employer)
        )
        if matching_rule.city:
            query = query.filter(Committee.city.op("~")(matching_rule.city))
        if matching_rule.state:
            query = query.filter(Committee.state.op("~")(matching_rule.state))

        num_updated = query.update(
            {Committee.connected_organization_flagged_as_id: employer.id},
            synchronize_session=False,
        )
        print(f"Matched: {num_updated}")

db.session.commit()
