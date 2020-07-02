import pytest

from app import create_app
from test.factories import *
from config import Test
from types import SimpleNamespace


@pytest.fixture(scope="session")
def test_app():
    app = create_app(Test)
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield app
        db.session.remove()


@pytest.fixture(scope="session")
def test_client(test_app):
    return test_app.test_client()


@pytest.fixture
def fresh_db(test_app):
    db.session.execute(
        "TRUNCATE TABLE candidate CASCADE; TRUNCATE TABLE flagged_employer CASCADE;"
    )


@pytest.fixture
def candidate_setup():
    candidate = CandidateFactory()
    committee_1 = CommitteeFactory(candidate=candidate)
    committee_2 = CommitteeFactory(candidate=candidate)
    bad_employer = FlaggedEmployerFactory()
    bad_pac = CommitteeFactory(
        candidate=candidate, connected_organization_flagged_as=bad_employer
    )
    bad_contributor = IndividualContributorFactory(employer_flagged_as=bad_employer)
    return SimpleNamespace(
        candidate=candidate,
        committee_1=committee_1,
        committee_2=committee_2,
        bad_employer=bad_employer,
        bad_contributor=bad_contributor,
        bad_pac=bad_pac,
    )
