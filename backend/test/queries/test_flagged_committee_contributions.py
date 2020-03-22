from app.queries import fetch_flagged_committee_contributions
from test.factories import CommitteeContributionFactory


def test_no_flagged_contributions(candidate_setup):
    result = fetch_flagged_committee_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_below_200_ignored(candidate_setup):
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        recipient_committee=candidate_setup.committee_1,
        amount=199.99,
    )
    result = fetch_flagged_committee_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_of_type_24a_ignored(candidate_setup):
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        recipient_committee=candidate_setup.committee_1,
        transaction_type='24A',
        amount=200.1,
    )
    result = fetch_flagged_committee_contributions(candidate_setup.candidate)
    assert len(result) == 0


def test_contributions_across_committees_flagged(candidate_setup):
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        recipient_committee=candidate_setup.committee_1,
        amount=100,
    )
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        candidate=candidate_setup.candidate,
        amount=100,
    )
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        recipient_committee=candidate_setup.committee_2,
        amount=100,
    )
    result = fetch_flagged_committee_contributions(candidate_setup.candidate)
    assert len(result) == 1
    (committee, flagged_employer, amount) = result[0]
    assert amount == 300
    assert flagged_employer == candidate_setup.bad_employer
    assert committee == candidate_setup.bad_pac