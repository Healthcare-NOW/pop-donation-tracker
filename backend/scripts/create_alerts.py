from dev import app
from app.queries import *

app.app_context().push()


def candidate_batches(batch_size):
    min_id = 0
    while True:
        candidates = Candidate.query.filter(Candidate.id >= min_id).order_by(Candidate.id).limit(batch_size).all()
        if not candidates:
            break
        yield candidates
        min_id = max(candidate.id for candidate in candidates)


batch_size = 25
completed = 0
for batch in candidate_batches(batch_size):
    if not batch:
        break
    for candidate in batch:
        committee_contributions = sum(c[2] for c in fetch_flagged_committee_contributions(candidate))
        individual_contributions = sum(c[1] for c in fetch_flagged_individual_contributions(candidate))
        if committee_contributions or individual_contributions:
            candidate.alerts.append(Alert(flagged_individual_contributions=individual_contributions,
                                          flagged_committee_contributions=committee_contributions))
    db.session.commit()
    completed += batch_size
    print(completed)
