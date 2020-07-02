from test.factories import CandidateFactory, AlertFactory
from app.schemas import candidates_schema


def test_state_summary_with_some_candidates(test_client):
    house_candidate_1 = CandidateFactory(
        office="H", office_district="02", office_state="MA"
    )
    AlertFactory(candidate=house_candidate_1)
    house_candidate_2 = CandidateFactory(
        office="H", office_district="02", office_state="MA"
    )
    house_candidate_3 = CandidateFactory(
        office="H", office_district="03", office_state="MA"
    )
    senate_candidate = CandidateFactory(office="S", office_state="MA")
    CandidateFactory(office="S", office_state="NY")
    CandidateFactory(office="S", election_year=2022, office_state="MA")

    resp = test_client.get("/api/year/2020/state/MA")
    assert resp.get_json() == {
        "state": "MA",
        "year": 2020,
        "senate": candidates_schema.dump([senate_candidate]),
        "house": [
            {
                "district": "02",
                "candidates": candidates_schema.dump(
                    [house_candidate_1, house_candidate_2]
                ),
            },
            {
                "district": "03",
                "candidates": candidates_schema.dump([house_candidate_3]),
            },
        ],
    }


def test_state_summary_with_no_candidates(test_client):
    resp = test_client.get("/api/year/2020/state/MA")
    assert resp.get_json() == {"senate": [], "house": [], "state": "MA", "year": 2020}
