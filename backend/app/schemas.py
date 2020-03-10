from app.serialization import ma
from app.models import *


class CommitteeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Committee


class CandidateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Candidate

    committees = ma.List(ma.Nested(CommitteeSchema))


candidate_schema = CandidateSchema()
candidates_schema = CandidateSchema(many=True, exclude=('committees',))
