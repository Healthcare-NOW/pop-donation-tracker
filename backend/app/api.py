from app.models import *
from app.schemas import candidates_schema
from app.utils import group_by
from flask import Blueprint, jsonify

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
