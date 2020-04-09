from app.models import *
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


class AlertFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Alert
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n)
    flagged_committee_contributions = factory.Faker('pydecimal', min_value=0)
    flagged_individual_contributions = factory.Faker('pydecimal', min_value=0)
    candidate = factory.SubFactory(CandidateFactory)


class CommitteeFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Committee
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n)
    fec_id = factory.Sequence(lambda n: f'C{n:08d}')
    name = factory.Sequence(lambda n: f'COMMITTEE TO ELECT JOHN DOE {n}')
    city = factory.Faker('city')
    state = factory.Faker('state_abbr')
    designation = 'P'
    type = 'H'
    party_affiliation = 'DEM'
    interest_group_category = None
    connected_organization = factory.Sequence(lambda n: f'JOHN DOE {n} VICTORY FUND')
    candidate = factory.SubFactory(CandidateFactory)
    connected_organization_flagged_as = None


class IndividualContributorFactory(SQLAlchemyModelFactory):
    class Meta:
        model = IndividualContributor
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n)
    name = factory.Sequence(lambda n: f'DOE {n}, JANE')
    city = factory.Faker('city')
    state = factory.Faker('state_abbr')
    zip = factory.Faker('postalcode')
    occupation = 'CONSULTANT'
    employer = 'ACME, INC.'
    employer_flagged_as = None


class BaseContributionFactory(SQLAlchemyModelFactory):
    id = factory.Sequence(lambda n: n)
    amendment_indicator = 'N'
    report_type = 'Q1'
    primary_general_indicator = 'P2020'
    fec_image_ref = factory.Sequence(lambda n: f'image_ref_{n}')
    transaction_type = '15'
    entity_type = 'IND'
    date = factory.Faker('date_object')
    amount = factory.Faker('pydecimal', min_value=0)


class IndividualContributionFactory(BaseContributionFactory):
    class Meta:
        model = IndividualContribution
        sqlalchemy_session = db.session

    committee = factory.SubFactory(CommitteeFactory)
    contributor = factory.SubFactory(IndividualContributor)
    committee_fec_id = factory.Sequence(lambda n: f'C{n:08d}')
    other_fec_id = factory.Sequence(lambda n: f'C{n:08d}')
    fec_unique_id = factory.Sequence(lambda n: n)


class CommitteeContributionFactory(BaseContributionFactory):
    class Meta:
        model = CommitteeContribution
        sqlalchemy_session = db.session

    donor_committee = factory.SubFactory(CommitteeFactory)
    recipient_name = factory.Faker('name')
    recipient_city = factory.Faker('city')
    recipient_state = factory.Faker('state_abbr')
    recipient_zip = factory.Faker('postalcode')
    recipient_occupation = 'CONSULTANT'
    recipient_employer = 'ACME, INC.'
    other_fec_id = factory.Sequence(lambda n: f'C{n:08d}')
    candidate_fec_id = factory.Sequence(lambda n: f'H0NY0{n:04d}')
    recipient_committee = factory.SubFactory(CommitteeFactory)
    candidate = factory.LazyAttribute(lambda c: c.recipient_committee.candidate)
    transaction_fec_id = factory.Sequence(lambda n: f'transaction_id_{n}')
    file_num = factory.Sequence(lambda n: n)
    memo_cd = 'X'
    memo = 'Some memo.'
    fec_unique_id = factory.Sequence(lambda n: n)


class FlaggedEmployerFactory(SQLAlchemyModelFactory):
    class Meta:
        model = FlaggedEmployer
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n)
    name = factory.Sequence(lambda n: f'EVIL {n}, INC.')
    group = 'EVIL GROUP'
