from app.models import *
from app.schemas import candidate_schema, candidates_schema
from app.utils import group_by
from flask import Blueprint, jsonify
from sqlalchemy import func

api = Blueprint('api', __name__)


@api.route('/health')
def health():
    return jsonify({'message': 'OK'})


@api.route('/year/<int:year>/state/<state>')
def state_summary(year, state):
    senate_candidates = Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='S'
    ).order_by(Candidate.name)
    candidates_by_district = group_by(Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='H'
    ).filter(Candidate.office_district.isnot(None)).order_by(Candidate.name), lambda c: c.office_district)

    return jsonify({
        'senate': candidates_schema.dump(senate_candidates),
        'house': [
            {'district': district,
             'candidates': candidates_schema.dump(candidates)}
            for (district, candidates) in candidates_by_district
        ]})


@api.route('/candidate/<candidate_id>')
def candidate_summary(candidate_id):
    candidate = Candidate.query.get(candidate_id)
    flagged_individual_contributions = db.session.query(
        FlaggedEmployer, func.sum(IndividualContribution.amount)
    ).select_from(Candidate).join(
        'committees', 'individual_contributions', 'contributor', 'employer_flagged_as'
    ).filter(
        Candidate.id == candidate_id,
        IndividualContribution.transaction_type != '24T'
    ).group_by(FlaggedEmployer).having(
        func.sum(IndividualContribution.amount) > 200
    ).order_by(func.sum(IndividualContribution.amount).desc()).all()

    return jsonify({
        'candidate': candidate_schema.dump(candidate),
        'flagged_contributions': [
            {
                'flagged_employer_id': flaggedEmployer.id,
                'flagged_employer_name': flaggedEmployer.name,
                'amount': str(amount)
            } for (flaggedEmployer, amount) in flagged_individual_contributions
        ]
    })
