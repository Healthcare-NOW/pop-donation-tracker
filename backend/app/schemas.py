from app.serialization import ma
from app.models import *


class CandidateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Candidate
        include_fk = True


candidates_schema = CandidateSchema(many=True)
