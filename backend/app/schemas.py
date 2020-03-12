from app.serialization import ma
from app.models import *


class CommitteeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Committee


class CandidateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Candidate

    committees = ma.List(ma.Nested(CommitteeSchema))


class IndividualContributorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = IndividualContributor


committee_schema = CommitteeSchema()
candidate_with_committees_schema = CandidateSchema()
candidate_schema = CandidateSchema(exclude=('committees',))
candidates_schema = CandidateSchema(many=True, exclude=('committees',))
individual_contributor_schema = IndividualContributorSchema()
