CREATE TABLE committee_temp (
	fec_id character varying(9),
    name text,
    treasurer character varying(90),
    street_1 character varying(34),
    street_2 character varying(34),
    city character varying(30),
    state character varying(2),
    zip character varying(9),
    designation character varying(1),
    type character varying(1),
    party_affiliation character varying(3),
    filing_frequency character varying(1),
    interest_group_category character varying(1),
    connected_org_name text,
    candidate_fec_id character varying(9)
);

COPY committee_temp FROM 'cm.txt' WITH DELIMITER '|' NULL '';

INSERT INTO committee (
	fec_id,
	name,
	designation,
	type,
	party_affiliation,
	interest_group_category,
	connected_organization,
	candidate_id
)
SELECT
	com.fec_id,
	com.name,
	designation::committee_designation,
	type,
	com.party_affiliation,
	interest_group_category::interest_group_category,
	connected_org_name,
	can.id

FROM committee_temp com, candidate can WHERE com.candidate_fec_id = can.fec_id
ON CONFLICT DO NOTHING;

DROP TABLE committee_temp