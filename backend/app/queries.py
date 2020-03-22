from app.models import *
from sqlalchemy import func


def fetch_flagged_individual_contributions(candidate):
    committee_ids = [committee.id for committee in candidate.committees]

    return db.session.query(
        FlaggedEmployer, func.sum(IndividualContribution.amount)
    ).select_from(IndividualContribution).join(
        'contributor', 'employer_flagged_as'
    ).filter(
        IndividualContribution.transaction_type != '24T',
        IndividualContribution.committee_id.in_(committee_ids)
    ).group_by(FlaggedEmployer).having(
        func.sum(IndividualContribution.amount) > 200
    ).order_by(func.sum(IndividualContribution.amount).desc()).all()


def fetch_flagged_committee_contributions(candidate):
    committee_ids = [committee.id for committee in candidate.committees]

    return db.session.query(
        Committee, FlaggedEmployer, func.sum(CommitteeContribution.amount)
    ).select_from(CommitteeContribution).join(
        'donor_committee', 'connected_organization_flagged_as'
    ).filter(
        CommitteeContribution.transaction_type != '24A',
        CommitteeContribution.recipient_committee_id.in_(committee_ids) | (
                    CommitteeContribution.candidate_id == candidate.id)
    ).group_by(Committee, FlaggedEmployer).having(
        func.sum(CommitteeContribution.amount) > 200
    ).order_by(func.sum(CommitteeContribution.amount).desc()).all()
