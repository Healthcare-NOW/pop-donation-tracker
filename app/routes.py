from flask import Blueprint
from app.models import Candidate

handlers = Blueprint('handlers', __name__)


@handlers.route('/health')
def health():
    return 'OK'


@handlers.route('/year/<int:year>/state/<state>')
def candidates(year, state):
    senate_candidates = Candidate.query.filter_by(office_state=state, election_year=year, office='S')
    house_candidates = Candidate.query.filter_by(office_state=state, election_year=year, office='H')
    return f"Senate: {senate_candidates.count()} House: {house_candidates.count()}"
