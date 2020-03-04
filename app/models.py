from app.database import db
from sqlalchemy.dialects.postgresql import ENUM, MONEY


class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    party_affiliation = db.Column(db.String(3))
    election_year = db.Column(db.SmallInteger, nullable=False)
    office = db.Column(ENUM('H', 'S', name='office'), nullable=False)
    office_state = db.Column(db.String(2), nullable=False)
    office_district = db.Column(db.String(2))
    incumbent_challenger_status = db.Column(ENUM('C', 'I', 'O', name='incumbent_challenger_status'))
    principal_campaign_committee_fec_id = db.Column(db.String(9))


class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    designation = db.Column(ENUM('A', 'B', 'D', 'J', 'P', 'U', name='committee_designation'))
    type = db.Column(db.String(1))
    party_affiliation = db.Column(db.String(3))
    interest_group_category = db.Column(ENUM('C', 'L', 'M', 'T', 'V', 'W', 'I', 'H', name='interest_group_category'))
    connected_organization = db.Column(db.String)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    candidate = db.relationship('Candidate', backref=db.backref('committees', lazy=True))


class IndividualContributor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    city = db.Column(db.String(30))
    state = db.Column(db.String(2))
    zip = db.Column(db.String(9))
    employer = db.Column(db.String(38))
    occupation = db.Column(db.String(38))


class IndividualContribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'), nullable=False)
    committee = db.relationship('Committee', backref=db.backref('individual_contributions', lazy=True))
    contributor_id = db.Column(db.Integer, db.ForeignKey('individual_contributor.id'), nullable=False)
    contributor = db.relationship('IndividualContributor', backref=db.backref('individual_contributions', lazy=True))
    amendment_indicator = db.Column(ENUM('N', 'A', 'T', name='amendment_indicator'))
    report_type = db.Column(db.String(3))
    primary_general_indicator = db.Column(db.String(5))
    fec_image_ref = db.Column(db.String(18))
    transaction_type = db.Column(db.String(3))
    entity_type = db.Column(db.String(3))
    date = db.Column(db.Date)
    amount = db.Column(MONEY)
    committee_fec_id = db.Column(db.String(9))
    other_fec_id = db.Column(db.String(9))
    fec_unique_id = db.Column(db.Numeric(19), unique=True, nullable=False)
