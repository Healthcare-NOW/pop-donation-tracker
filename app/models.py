from app.database import db
from sqlalchemy.dialects.postgresql import ENUM


class Candidate(db.Model):
    candidate_id = db.Column(db.Integer, primary_key=True)
    candidate_fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    party_affiliation = db.Column(db.String(3))
    election_year = db.Column(db.SmallInteger, nullable=False)
    office = db.Column(ENUM("H", "S", name="office"), nullable=False)
    office_state = db.Column(db.String(2), nullable=False)
    office_district = db.Column(db.String(2))
    incumbent_challenger_status = db.Column(ENUM("C", "I", "O", name="incumbent_challenger_status"))
    principal_campaign_committee_fec_id = db.Column(db.String(9))
