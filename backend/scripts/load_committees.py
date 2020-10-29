# Script for loading committees. Updates existing committees in place, and only adds new rows
# for committees with fec ids that aren't in our system. Outputs what has changed for each candidate
# that has been updated with new data.

import sys

from dev import app
from app.database import db
from app.models import Committee, Candidate
from app.schemas import committee_schema
from marshmallow import EXCLUDE

from scripts.utils import chunked, read_csv

app.app_context().push()

columns = [
    'fec_id',
    'name',
    'treasurer',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'designation',
    'type',
    'party_affiliation',
    'filing_frequency',
    'interest_group_category',
    'connected_org_name',
    'candidate_fec_id',
]


def load_committees(fec_ids):
    committees = db.session.query(Committee).filter(Committee.fec_id.in_(fec_ids))
    return {committee.fec_id: committee for committee in committees}


def synchronize_chunk(csv_chunk):
    fec_ids = [row["fec_id"] for row in csv_chunk]
    existing_committees = load_committees(fec_ids)
    for row in csv_chunk:
        new_data = committee_schema.load(row, unknown=EXCLUDE)

        if new_data["fec_id"] not in existing_committees:
            print("New committee:", new_data)
            new_committee = Committee(**new_data)
            candidate = db.session.query(Candidate).filter(Candidate.fec_id == row["candidate_fec_id"]).one_or_none()
            if candidate:
                print(f"Associating with candidate {candidate.fec_id}")
                new_committee.candidate = candidate
            db.session.add(new_committee)
        else:
            existing_committee = existing_committees[row["fec_id"]]
            for column in new_data:
                existing_val = getattr(existing_committee, column)
                new_val = new_data[column]
                if existing_val != new_val:
                    print(
                        f"Updating {column} on committee {row['fec_id']}. Old: {existing_val} New: {new_val}"
                    )
                    setattr(existing_committee, column, new_val)
    db.session.commit()


if __name__ == "__main__":
    committee_data_rows = (
        row
        for row in read_csv(
        sys.argv[1],
        fieldnames=columns,
    ))

    for chunk in chunked(committee_data_rows):
        synchronize_chunk(chunk)
