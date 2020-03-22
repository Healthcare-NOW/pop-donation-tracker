from test.factories import *
from app.schemas import candidate_with_committees_schema, flagged_employer_schema, committee_schema


def test_candidate_summary(test_client):
    candidate = CandidateFactory()
    committee_1 = CommitteeFactory(candidate=candidate)
    committee_2 = CommitteeFactory(candidate=candidate)
    bad_employer = FlaggedEmployerFactory()
    bad_pac = CommitteeFactory(
        candidate=candidate,
        connected_organization_flagged_as=bad_employer
    )
    bad_contributor = IndividualContributorFactory(employer_flagged_as=bad_employer)
    IndividualContributionFactory(
        contributor=bad_contributor,
        committee=committee_1,
        amount=200.1
    )
    CommitteeContributionFactory(
        donor_committee=bad_pac,
        recipient_committee=committee_2,
        amount=200.05
    )

    resp = test_client.get(f'/api/candidate/{candidate.id}')
    assert resp.get_json() == {
        'candidate': candidate_with_committees_schema.dump(candidate),
        'flagged_individual_contributions': [{
            'amount': 200.1,
            'flagged_employer': flagged_employer_schema.dump(bad_employer)
        }],
        'flagged_committee_contributions': [{
            'amount': 200.05,
            'flagged_connected_organization': flagged_employer_schema.dump(bad_employer),
            'committee': committee_schema.dump(bad_pac)
        }]
    }
