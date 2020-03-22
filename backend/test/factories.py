from app.models import Candidate
from app.database import db
import factory
from factory.alchemy import SQLAlchemyModelFactory


class CandidateFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Candidate
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n)
    fec_id = factory.Sequence(lambda n: f'H0NY0{n:04d}')
    name = factory.Sequence(lambda n: f'DOE {n}, JOHN')
    party_affiliation = 'DEM'
    election_year = 2020
    office = 'H'
    office_state = 'NY'
    office_district = '01'
    incumbent_challenger_status = 'C'
    principal_campaign_committee_fec_id = factory.Sequence(lambda n: f'C{n:08d}')
