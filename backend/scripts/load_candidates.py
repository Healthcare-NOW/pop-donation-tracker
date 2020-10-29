# Script for loading candidates. Updates existing candidates in place, and only adds new rows
# for candidates with fec ids that aren't in our system. Outputs what has changed for each candidate
# that has been updated with new data.

import sys

from dev import app
from app.database import db
from app.models import Candidate
from app.schemas import candidate_schema
from marshmallow import EXCLUDE

from scripts.utils import chunked, read_csv

app.app_context().push()

columns = [
    "fec_id",
    "name",
    "party_affiliation",
    "election_year",
    "office_state",
    "office",
    "office_district",
    "incumbent_challenger_status",
    "status",
    "principal_campaign_committee_fec_id",
    "mailing_address_street_1",
    "mailing_address_street_2",
    "mailing_address_city",
    "state",
    "zip",
]


def load_candidates(fec_ids):
    candidates = db.session.query(Candidate).filter(Candidate.fec_id.in_(fec_ids))
    return {candidate.fec_id: candidate for candidate in candidates}


def synchronize_chunk(csv_chunk):
    fec_ids = [row["fec_id"] for row in csv_chunk]
    existing_candidates = load_candidates(fec_ids)
    for row in csv_chunk:
        new_data = candidate_schema.load(row, unknown=EXCLUDE)

        if new_data["fec_id"] not in existing_candidates:
            print("New candidate:", new_data)
            db.session.add(Candidate(**new_data))
        else:
            existing_candidate = existing_candidates[row["fec_id"]]
            for column in new_data:
                existing_val = getattr(existing_candidate, column)
                new_val = new_data[column]
                if existing_val != new_val:
                    print(
                        f"Updating {column} on candidate {row['fec_id']}. Old: {existing_val} New: {new_val}"
                    )
                    setattr(existing_candidate, column, new_val)
    db.session.commit()


if __name__ == "__main__":
    congress_data_rows = (
        row
        for row in read_csv(
        sys.argv[1],
        fieldnames=columns,
    )
        if row["office"] in ["H", "S"]
    )

    for chunk in chunked(congress_data_rows):
        synchronize_chunk(chunk)

