from app.models import *
from app.database import db
from app.schemas import candidates_schema
from app.utils import group_by
from collections import defaultdict
from flask import Blueprint, jsonify, render_template
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


@handlers.route('/year/<int:year>/state/<state>/candidates')
def candidates_summary(year, state):
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


@handlers.route('/candidate/<candidate_id>')
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

    return render_template('candidate.html',
                           candidate=candidate,
                           flagged_individual_contributions=flagged_individual_contributions)


@handlers.route('/candidate/<candidate_id>/flagged_employer/<employer_id>')
def flagged_individual_contribution_detail(candidate_id, employer_id):
    candidate = Candidate.query.get(candidate_id)
    employer = FlaggedEmployer.query.get(employer_id)
    flagged_individual_contributions = db.session.query(
        IndividualContributor, func.sum(IndividualContribution.amount)
    ).select_from(Committee).join(
        'individual_contributions', 'contributor'
    ).filter(
        Committee.candidate_id == candidate_id,
        IndividualContributor.employer_flagged_as_id == employer_id,
        IndividualContribution.transaction_type != '24T'
    ).group_by(IndividualContributor).order_by(
        IndividualContributor.name, func.sum(IndividualContribution.amount).desc())
    return render_template('flagged_individual_contributions_detail.html',
                           candidate=candidate,
                           employer=employer,
                           flagged_individual_contributions=flagged_individual_contributions
                           )


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
