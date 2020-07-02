from app.models import *
from app.schemas import (
    candidate_with_committees_schema,
    candidate_schema,
    candidates_schema,
    committee_schema,
    individual_contributor_schema,
    flagged_employer_schema,
)
from app.queries import (
    fetch_flagged_individual_contributions,
    fetch_flagged_committee_contributions,
)
from app.utils import group_by
from flask import Blueprint, jsonify
from sqlalchemy import func
from sqlalchemy.orm import joinedload

api = Blueprint("api", __name__)


@api.route("/health")
def health():
    return {"message": "OK"}


@api.route("/year/<int:year>/state/<state>")
def state_summary(year, state):
    senate_candidates = (
        Candidate.query.options(joinedload("alerts"))
        .filter_by(office_state=state, election_year=year, office="S")
        .order_by(Candidate.name)
    )
    candidates_by_district = group_by(
        Candidate.query.options(joinedload("alerts"))
        .filter_by(office_state=state, election_year=year, office="H")
        .filter(Candidate.office_district.isnot(None))
        .order_by(Candidate.name),
        lambda c: c.office_district,
    )

    return {
        "state": state,
        "year": year,
        "senate": candidates_schema.dump(senate_candidates),
        "house": [
            {"district": district, "candidates": candidates_schema.dump(candidates)}
            for (district, candidates) in candidates_by_district
        ],
    }


@api.route("/candidate/<int:candidate_id>")
def candidate_summary(candidate_id):
    candidate = Candidate.query.options(joinedload("committees")).get(candidate_id)

    flagged_individual_contributions = fetch_flagged_individual_contributions(candidate)

    flagged_committee_contributions = fetch_flagged_committee_contributions(candidate)

    return {
        "candidate": candidate_with_committees_schema.dump(candidate),
        "flagged_individual_contributions": [
            {
                "flagged_employer": flagged_employer_schema.dump(flagged_employer),
                "amount": float(amount),
            }
            for (flagged_employer, amount) in flagged_individual_contributions
        ],
        "flagged_committee_contributions": [
            {
                "committee": committee_schema.dump(committee),
                "flagged_connected_organization": flagged_employer_schema.dump(
                    flagged_employer
                ),
                "amount": float(amount),
            }
            for (committee, flagged_employer, amount) in flagged_committee_contributions
        ],
    }


@api.route("/candidate/<int:candidate_id>/flagged-employer/<int:employer_id>")
def flagged_individual_contribution_detail(candidate_id, employer_id):
    candidate = Candidate.query.options(joinedload("committees")).get(candidate_id)
    committee_ids = [committee.id for committee in candidate.committees]

    employer = FlaggedEmployer.query.get(employer_id)

    flagged_individual_contributions = (
        db.session.query(IndividualContributor, func.sum(IndividualContribution.amount))
        .select_from(IndividualContribution)
        .join("contributor")
        .filter(
            IndividualContribution.committee_id.in_(committee_ids),
            IndividualContributor.employer_flagged_as_id == employer_id,
            IndividualContribution.transaction_type != "24T",
        )
        .group_by(IndividualContributor)
        .order_by(
            IndividualContributor.name, func.sum(IndividualContribution.amount).desc()
        )
    )
    return jsonify(
        {
            "candidate": candidate_schema.dump(candidate),
            "flagged_employer_name": employer.name,
            "contributions": [
                {
                    "contributor": individual_contributor_schema.dump(contributor),
                    "amount": str(amount),
                }
                for (contributor, amount) in flagged_individual_contributions
            ],
        }
    )
