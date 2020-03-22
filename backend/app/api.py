from app.models import *
from app.schemas import candidate_with_committees_schema, candidate_schema, candidates_schema, \
    committee_schema, individual_contributor_schema, flagged_employer_schema
from app.utils import group_by
from flask import Blueprint, jsonify
from sqlalchemy import func
from sqlalchemy.orm import joinedload

api = Blueprint('api', __name__)


@api.route('/health')
def health():
    return {'message': 'OK'}


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

    return {
        'senate': candidates_schema.dump(senate_candidates),
        'house': [
            {'district': district,
             'candidates': candidates_schema.dump(candidates)}
            for (district, candidates) in candidates_by_district
        ]}


@api.route('/candidate/<int:candidate_id>')
def candidate_summary(candidate_id):
    candidate = Candidate.query.options(joinedload('committees')).get(candidate_id)
    committee_ids = [committee.id for committee in candidate.committees]

    flagged_individual_contributions = db.session.query(
        FlaggedEmployer, func.sum(IndividualContribution.amount)
    ).select_from(IndividualContribution).join(
        'contributor', 'employer_flagged_as'
    ).filter(
        IndividualContribution.transaction_type != '24T',
        IndividualContribution.committee_id.in_(committee_ids)
    ).group_by(FlaggedEmployer).having(
        func.sum(IndividualContribution.amount) > 200
    ).order_by(func.sum(IndividualContribution.amount).desc()).all()

    flagged_committee_contributions = db.session.query(
        Committee, FlaggedEmployer, func.sum(CommitteeContribution.amount)
    ).select_from(CommitteeContribution).join(
        'donor_committee', 'connected_organization_flagged_as'
    ).filter(
        CommitteeContribution.transaction_type != '24A',
        CommitteeContribution.recipient_committee_id.in_(committee_ids) | (CommitteeContribution.candidate_id == candidate.id)
    ).group_by(Committee, FlaggedEmployer).having(
        func.sum(CommitteeContribution.amount) > 200
    ).order_by(func.sum(CommitteeContribution.amount).desc()).all()

    return {
        'candidate': candidate_with_committees_schema.dump(candidate),
        'flagged_individual_contributions': [
            {
                'flagged_employer': flagged_employer_schema.dump(flagged_employer),
                'amount': float(amount)
            } for (flagged_employer, amount) in flagged_individual_contributions
        ],
        'flagged_committee_contributions': [
            {
                'committee': committee_schema.dump(committee),
                'flagged_connected_organization': flagged_employer_schema.dump(flagged_employer),
                'amount': float(amount)
            } for (committee, flagged_employer, amount) in flagged_committee_contributions
        ]
    }


@api.route('/candidate/<int:candidate_id>/flagged-employer/<int:employer_id>')
def flagged_individual_contribution_detail(candidate_id, employer_id):
    candidate = Candidate.query.options(joinedload('committees')).get(candidate_id)
    committee_ids = [committee.id for committee in candidate.committees]

    employer = FlaggedEmployer.query.get(employer_id)

    flagged_individual_contributions = db.session.query(
        IndividualContributor, func.sum(IndividualContribution.amount)
    ).select_from(IndividualContribution).join(
        'contributor'
    ).filter(
        IndividualContribution.committee_id.in_(committee_ids),
        IndividualContributor.employer_flagged_as_id == employer_id,
        IndividualContribution.transaction_type != '24T'
    ).group_by(IndividualContributor).order_by(
        IndividualContributor.name, func.sum(IndividualContribution.amount).desc())
    return jsonify({
        'candidate': candidate_schema.dump(candidate),
        'flagged_employer_name': employer.name,
        'contributions': [
            {
                'contributor': individual_contributor_schema.dump(contributor),
                'amount': str(amount)
            } for (contributor, amount) in flagged_individual_contributions
        ]
    })
