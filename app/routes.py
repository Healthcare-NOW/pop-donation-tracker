from flask import Blueprint, render_template
from app.models import *
from app.database import db
from collections import defaultdict
from sqlalchemy import func

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
    congressional_candidates = Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='H'
    ).filter(Candidate.office_district.isnot(None)).order_by(Candidate.name)

    grouped_by_district = defaultdict(list)
    for candidate in congressional_candidates:
        grouped_by_district[candidate.office_district].append(candidate)
    districts = sorted(grouped_by_district.keys())
    candidates_by_district = [
        (district, grouped_by_district[district]) for district in districts
    ]
    return render_template('state.html',
                           state=state,
                           year=year,
                           senate_candidates=senate_candidates,
                           candidates_by_district=candidates_by_district
                           )


@handlers.route('/year/<int:year>/state/<state>/district/<district>')
def district_summary(year, state, district):
    candidates = Candidate.query.filter_by(
        office_state=state,
        election_year=year,
        office='H',
        office_district=district
    ).order_by(Candidate.name)
    return render_template('district.html',
                           state=state,
                           year=year,
                           district=district,
                           candidates=candidates
                           )


@handlers.route('/candidate/<candidate_id>')
def candidate_summary(candidate_id):
    candidate = Candidate.query.get(candidate_id)
    flagged_individual_contributions = db.session.query(
        FlaggedIndividualContributor, func.sum(IndividualContribution.amount)
    ).select_from(Candidate).join(
        'committees', 'individual_contributions', 'contributor', 'flagged_as'
    ).filter(Candidate.id == candidate_id).group_by(FlaggedIndividualContributor).having(
        func.sum(IndividualContribution.amount) > 200
    ).all()

    return render_template('candidate.html',
                           candidate=candidate,
                           flagged_individual_contributions=flagged_individual_contributions)


@handlers.route('/flagged_individual_contributors')
def flagged_individual_contributors():
    flagged_contributors = FlaggedIndividualContributor.query.order_by(FlaggedIndividualContributor.name)
    grouped_by_employer = defaultdict(list)
    for contributor in flagged_contributors:
        grouped_by_employer[contributor.employer].append(contributor)
    employers = sorted(grouped_by_employer.keys())
    flagged_contributors_by_employer = [
        (employer, grouped_by_employer[employer]) for employer in employers
    ]
    return render_template('flagged_individual_contributors.html',
                           flagged_contributors_by_employer=flagged_contributors_by_employer
                           )
