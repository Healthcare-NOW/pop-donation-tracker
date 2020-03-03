from app.database import db
from sqlalchemy.dialects.postgresql import ENUM


class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    party_affiliation = db.Column(db.String(3))
    election_year = db.Column(db.SmallInteger, nullable=False)
    office = db.Column(ENUM("H", "S", name="office"), nullable=False)
    office_state = db.Column(db.String(2), nullable=False)
    office_district = db.Column(db.String(2))
    incumbent_challenger_status = db.Column(ENUM("C", "I", "O", name="incumbent_challenger_status"))
    principal_campaign_committee_fec_id = db.Column(db.String(9))


class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    designation = db.Column(ENUM("A", "B", "D", "J", "P", "U", name="committee_designation"))
    type = db.Column(db.String(1))
    party_affiliation = db.Column(db.String(3))
    interest_group_category = db.Column(ENUM("C", "L", "M", "T", "V", "W", "I", "H", name="interest_group_category"))
    connected_organization = db.Column(db.String)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    candidate = db.relationship('Candidate', backref=db.backref('committees', lazy=True))
