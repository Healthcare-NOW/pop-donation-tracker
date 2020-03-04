CREATE TABLE individual_contribution_temp (
    committee_fec_id character varying(9),
    amendment_ind character varying(1),
    report_type character varying(3),
    transaction_pgi character varying(5),
    image_num character varying(18),
    transaction_type character varying(3),
    entity_type character varying(3),
    name text,
    city character varying(30),
    state character varying(2),
    zip character varying(9),
    employer text,
    occupation text,
    date character varying(8),
    amount money,
    other_fec_id character varying(9),
    transaction_fec_id character varying(32),
    file_num numeric(22),
    memo_code character varying(1),
    memo text,
    sub_id numeric(19)
);

COPY individual_contribution_temp FROM
program 'sed ''s/\\/\\\\/g'' < itcont.txt' WITH DELIMITER '|' NULL '';

CREATE TABLE individual_contribution_temp_extract (
    committee_id integer,
    amendment_ind character varying(1),
    report_type character varying(3),
    transaction_pgi character varying(5),
    image_num character varying(18),
    transaction_type character varying(3),
    entity_type character varying(3),
    name text,
    city character varying(30),
    state character varying(2),
    zip character varying(9),
    employer text,
    occupation text,
    date character varying(8),
    amount money,
    committee_fec_id character varying(9),
    other_fec_id character varying(9),
    transaction_fec_id character varying(32),
    file_num numeric(22),
    memo_code character varying(1),
    memo text,
    sub_id numeric(19)
);

INSERT INTO individual_contribution_temp_extract (
    committee_id,
    amendment_ind,
    report_type,
    transaction_pgi,
    image_num,
    transaction_type,
    entity_type,
    name,
    city,
    state,
    zip,
    employer,
    occupation,
    date,
    amount,
    committee_fec_id,
    other_fec_id,
    transaction_fec_id,
    file_num,
    memo_code,
    memo,
    sub_id
)

SELECT com.id,
    i.amendment_ind,
    i.report_type,
    i.transaction_pgi,
    i.image_num,
    i.transaction_type,
    i.entity_type,
    i.name,
    i.city,
    i.state,
    i.zip,
    i.employer,
    i.occupation,
    i.date,
    i.amount,
    i.committee_fec_id,
    i.other_fec_id,
    i.transaction_fec_id,
    i.file_num,
    i.memo_code,
    i.memo,
    i.sub_id
FROM candidate, committee com, individual_contribution_temp i
WHERE candidate.id = com.candidate_id AND (candidate.office = 'H' OR candidate.office = 'S')
AND i.committee_fec_id = com.fec_id;


INSERT INTO individual_contribution_temp_extract (
    committee_id,
    amendment_ind,
    report_type,
    transaction_pgi,
    image_num,
    transaction_type,
    entity_type,
    name,
    city,
    state,
    zip,
    employer,
    occupation,
    date,
    amount,
    committee_fec_id,
    other_fec_id,
    transaction_fec_id,
    file_num,
    memo_code,
    memo,
    sub_id
)

SELECT com.id,
    i.amendment_ind,
    i.report_type,
    i.transaction_pgi,
    i.image_num,
    i.transaction_type,
    i.entity_type,
    i.name,
    i.city,
    i.state,
    i.zip,
    i.employer,
    i.occupation,
    i.date,
    i.amount,
    i.committee_fec_id,
    i.other_fec_id,
    i.transaction_fec_id,
    i.file_num,
    i.memo_code,
    i.memo,
    i.sub_id
FROM candidate, committee com, individual_contribution_temp i
WHERE candidate.id = com.candidate_id AND (candidate.office = 'H' OR candidate.office = 'S')
AND i.other_fec_id = com.fec_id;


DROP TABLE individual_contribution_temp;


INSERT INTO individual_contributor (name, city, state, zip, employer, occupation)
SELECT DISTINCT name, city, state, zip, employer, occupation
FROM individual_contribution_temp_extract;


INSERT INTO individual_contribution (
	committee_id,
	contributor_id,
	amendment_indicator,
	report_type,
	primary_general_indicator,
	fec_image_ref,
	transaction_type,
	entity_type,
	date,
	amount,
	committee_fec_id,
	other_fec_id,
	fec_unique_id
)
SELECT
    i.committee_id,
    c.id,
    i.amendment_ind::amendment_indicator,
    i.report_type,
    i.transaction_pgi,
    i.image_num,
    i.transaction_type,
    i.entity_type,
    to_date(i.date, 'MMDDYYYY'),
    i.amount,
    i.committee_fec_id,
    i.other_fec_id,
    i.sub_id
FROM individual_contribution_temp_extract i, individual_contributor c
WHERE i.name = c.name
AND i.city = c.city
AND i.state = c.state
AND i.zip = c.zip
AND i.employer = c.employer
AND i.occupation = c.occupation;

DROP TABLE individual_contribution_temp_extract;

