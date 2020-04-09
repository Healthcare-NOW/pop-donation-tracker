from app.serialization import ma
from app.models import *


class AlertSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Alert
    flagged_committee_contributions = ma.Decimal(2, as_string=True)
    flagged_individual_contributions = ma.Decimal(2, as_string=True)


class CommitteeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Committee


class CandidateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Candidate

    committees = ma.List(ma.Nested(CommitteeSchema))
    alerts = ma.List(ma.Nested(AlertSchema))


class FlaggedEmployerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = FlaggedEmployer


class IndividualContributorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = IndividualContributor


committee_schema = CommitteeSchema()
candidate_with_committees_schema = CandidateSchema()
candidate_schema = CandidateSchema(exclude=('committees',))
candidates_schema = CandidateSchema(many=True, exclude=('committees',))
individual_contributor_schema = IndividualContributorSchema()
flagged_employer_schema = FlaggedEmployerSchema()
