from app.database import db
from sqlalchemy.dialects.postgresql import ENUM
from datetime import datetime


class BaseModel(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)


class BaseModelWithTimestamps(BaseModel):
    __abstract__ = True
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Candidate(BaseModelWithTimestamps):
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    party_affiliation = db.Column(db.String(3))
    election_year = db.Column(db.SmallInteger, nullable=False)
    office = db.Column(ENUM("H", "S", name="office"), nullable=False)
    office_state = db.Column(db.String(2), nullable=False)
    office_district = db.Column(db.String(2))
    incumbent_challenger_status = db.Column(
        ENUM("C", "I", "O", name="incumbent_challenger_status")
    )
    principal_campaign_committee_fec_id = db.Column(db.String(9))
    pledge_date = db.Column(db.Date)


class Alert(BaseModel):
    created_on = db.Column(db.DateTime, default=datetime.utcnow)
    from_date = db.Column(db.Date)
    to_date = db.Column(db.Date)
    flagged_committee_contributions = db.Column(db.Numeric(18, 2))
    flagged_individual_contributions = db.Column(db.Numeric(18, 2))
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidate.id"), nullable=False)
    candidate = db.relationship("Candidate", backref=db.backref("alerts", lazy=True))


class Committee(BaseModelWithTimestamps):
    fec_id = db.Column(db.String(9), unique=True, nullable=False)
    name = db.Column(db.String)
    city = db.Column(db.String(30))
    state = db.Column(db.String(2))
    designation = db.Column(
        ENUM("A", "B", "D", "J", "P", "U", name="committee_designation")
    )
    type = db.Column(db.String(1))
    party_affiliation = db.Column(db.String(3))
    interest_group_category = db.Column(
        ENUM("C", "L", "M", "T", "V", "W", "I", "H", name="interest_group_category")
    )
    connected_organization = db.Column(db.String)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidate.id"))
    candidate = db.relationship(
        "Candidate", backref=db.backref("committees", lazy=True)
    )
    connected_organization_flagged_as_id = db.Column(
        db.Integer, db.ForeignKey("flagged_employer.id")
    )
    connected_organization_flagged_as = db.relationship("FlaggedEmployer")


class IndividualContributor(BaseModel):
    name = db.Column(db.String)
    city = db.Column(db.String(30))
    state = db.Column(db.String(2))
    zip = db.Column(db.String(9))
    occupation = db.Column(db.String(38))
    employer = db.Column(db.String(38))
    employer_flagged_as_id = db.Column(db.Integer, db.ForeignKey("flagged_employer.id"))
    employer_flagged_as = db.relationship("FlaggedEmployer")


class BaseContribution(BaseModel):
    __abstract__ = True
    amendment_indicator = db.Column(ENUM("N", "A", "T", name="amendment_indicator"))
    report_type = db.Column(db.String(3))
    primary_general_indicator = db.Column(db.String(5))
    fec_image_ref = db.Column(db.String(18))
    transaction_type = db.Column(db.String(3))
    entity_type = db.Column(db.String(3))
    date = db.Column(db.Date)
    amount = db.Column(db.Numeric(18, 2))


class IndividualContribution(BaseContribution):
    committee_id = db.Column(
        db.Integer, db.ForeignKey("committee.id"), nullable=False, index=True
    )
    committee = db.relationship(
        "Committee", backref=db.backref("individual_contributions", lazy=True)
    )
    contributor_id = db.Column(
        db.Integer, db.ForeignKey("individual_contributor.id"), nullable=False
    )
    contributor = db.relationship(
        "IndividualContributor",
        backref=db.backref("individual_contributions", lazy=True),
    )
    committee_fec_id = db.Column(db.String(9))
    other_fec_id = db.Column(db.String(9))
    fec_unique_id = db.Column(db.Numeric(19), unique=True, nullable=False)


class CommitteeContribution(BaseContribution):
    donor_committee_id = db.Column(
        db.Integer, db.ForeignKey("committee.id"), nullable=False
    )
    donor_committee = db.relationship(
        "Committee",
        foreign_keys=[donor_committee_id],
        backref=db.backref("contributions_given", lazy=True),
    )
    recipient_name = db.Column(db.String)
    recipient_city = db.Column(db.String(30))
    recipient_state = db.Column(db.String(2))
    recipient_zip = db.Column(db.String(9))
    recipient_occupation = db.Column(db.String(38))
    recipient_employer = db.Column(db.String(38))
    other_fec_id = db.Column(db.String(9))
    candidate_fec_id = db.Column(db.String(9))
    recipient_committee_id = db.Column(db.Integer, db.ForeignKey("committee.id"))
    recipient_committee = db.relationship(
        "Committee",
        foreign_keys=[recipient_committee_id],
        backref=db.backref("committee_contributions_received", lazy=True),
    )
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidate.id"))
    candidate = db.relationship(
        "Candidate", backref=db.backref("committee_contributions", lazy=True)
    )
    transaction_fec_id = db.Column(db.String(32))
    file_num = db.Column(db.Numeric(22))
    memo_cd = db.Column(db.String(1))
    memo = db.Column(db.String)
    fec_unique_id = db.Column(db.Numeric(19), unique=True, nullable=False)


class FlaggedEmployer(BaseModel):
    name = db.Column(db.String)
    group = db.Column(db.String)


class FlaggedEmployerMatchingRule(BaseModel):
    employer = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    flagged_employer_id = db.Column(
        db.Integer, db.ForeignKey("flagged_employer.id"), nullable=False
    )
    flagged_employer = db.relationship(
        "FlaggedEmployer", backref=db.backref("matching_rules")
    )
