CREATE TABLE candidate_temp (
    fec_id character varying(9),
    name character varying,
    party_affiliation character varying(3),
    election_year smallint,
    office_state character varying(2),
    office character varying(1),
    office_district character varying(2),
    incumbent_challenger_status character varying(1),
    status character varying(1),
    principal_campaign_committee_fec_id character varying(9),
    mailing_address_street_1 character varying(34),
    mailing_address_street_2 character varying(34),
    mailing_address_city character varying(30),
    state character varying(2),
    zip character varying(9)
);

COPY candidate_temp FROM 'cn.txt' WITH DELIMITER '|' NULL ''

INSERT INTO candidate (
	fec_id,
	name,
	party_affiliation,
	election_year,
	office_state,
	office,
	office_district,
	incumbent_challenger_status,
	principal_campaign_committee_fec_id
)
SELECT
	fec_id,
	name,
	party_affiliation,
	election_year,
	office_state,
	office::office,
	office_district,
	incumbent_challenger_status::incumbent_challenger_status,
	principal_campaign_committee_fec_id

FROM candidate_temp WHERE office = 'H' OR office = 'S' ON CONFLICT DO NOTHING

DROP TABLE candidate_temp;
