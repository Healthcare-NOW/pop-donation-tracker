from test.factories import *
from app.schemas import candidate_with_committees_schema, flagged_employer_schema, committee_schema


def test_candidate_summary(test_client, candidate_setup):
    IndividualContributionFactory(
        contributor=candidate_setup.bad_contributor,
        committee=candidate_setup.committee_1,
        amount=200.1
    )
    CommitteeContributionFactory(
        donor_committee=candidate_setup.bad_pac,
        recipient_committee=candidate_setup.committee_2,
        amount=200.05
    )

    resp = test_client.get(f'/api/candidate/{candidate_setup.candidate.id}')
    assert resp.get_json() == {
        'candidate': candidate_with_committees_schema.dump(candidate_setup.candidate),
        'flagged_individual_contributions': [{
            'amount': 200.1,
            'flagged_employer': flagged_employer_schema.dump(candidate_setup.bad_employer)
        }],
        'flagged_committee_contributions': [{
            'amount': 200.05,
            'flagged_connected_organization': flagged_employer_schema.dump(candidate_setup.bad_employer),
            'committee': committee_schema.dump(candidate_setup.bad_pac)
        }]
    }
