from flask import Blueprint, render_template
from app.models import Candidate
from app.database import db

handlers = Blueprint('handlers', __name__)


@handlers.route('/health')
def health():
    return 'OK'


@handlers.route('/year/<int:year>/state/<state>')
def state_summary(year, state):
    senate_candidates = Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='S'
    ).order_by(Candidate.name)
    congressional_districts = db.session.query(Candidate.office_district).filter_by(
        office_state=state, election_year=year, office='H'
    ).filter(Candidate.office_district.isnot(None)).distinct().order_by(Candidate.office_district)
    return render_template("state.html",
                           state=state,
                           year=year,
                           senate_candidates=senate_candidates,
                           congressional_districts=congressional_districts
                           )


@handlers.route('/year/<int:year>/state/<state>/district/<district>')
def district_summary(year, state, district):
    candidates = Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='H',
        office_district=district
    ).order_by(Candidate.name)
    return render_template("district.html",
                           state=state,
                           year=year,
                           district=district,
                           candidates=candidates
                           )


@handlers.route('/candidate/<candidate_id>')
def candidate_summary(candidate_id):
    candidate = Candidate.query.get(candidate_id)
    return render_template("candidate.html", candidate=candidate)
