from app.queries import fetch_flagged_individual_contributions
from test.factories import *


def test_no_flagged_contributions(candidate_setup):
    result = fetch_flagged_individual_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_below_200_ignored(candidate_setup):
    IndividualContributionFactory(
        committee=candidate_setup.committee_1,
        amount=199.99,
        contributor=candidate_setup.bad_contributor,
    )
    result = fetch_flagged_individual_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_of_type_24t_ignored(candidate_setup):
    IndividualContributionFactory(
        committee=candidate_setup.committee_1,
        amount=200.1,
        transaction_type="24T",
        contributor=candidate_setup.bad_contributor,
    )
    result = fetch_flagged_individual_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_across_committees_flagged(candidate_setup):
    IndividualContributionFactory(
        committee=candidate_setup.committee_1,
        amount=150,
        contributor=candidate_setup.bad_contributor,
    )
    IndividualContributionFactory(
        committee=candidate_setup.committee_2,
        amount=150,
        contributor=candidate_setup.bad_contributor,
    )
    result = fetch_flagged_individual_contributions(candidate_setup.candidate)
    assert len(result) == 1
    (flagged_employer, amount) = result[0]
    assert amount == 300
    assert flagged_employer == candidate_setup.bad_employer
