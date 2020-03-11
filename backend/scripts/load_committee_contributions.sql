CREATE TABLE committee_contribution_temp
(
    committee_fec_id   character varying(9),
    amendment_ind      character varying(1),
    report_type        character varying(3),
    transaction_pgi    character varying(5),
    image_num          character varying(18),
    transaction_type   character varying(3),
    entity_type        character varying(3),
    name               text,
    city               character varying(30),
    state              character varying(2),
    zip                character varying(9),
    employer           text,
    occupation         text,
    transaction_date   character varying(8),
    transaction_amount numeric(18, 2),
    other_fec_id       character varying(9),
    candidate_fec_id   character varying(9),
    transaction_fec_id character varying(32),
    file_num           numeric(22, 0),
    memo_cd            character varying(1),
    memo_text          text,
    sub_id             numeric(19, 0)
);

COPY committee_contribution_temp FROM 'itpas2.txt' WITH DELIMITER '|' NULL '';

INSERT INTO committee_contribution
(amendment_indicator,
 report_type,
 primary_general_indicator,
 fec_image_ref,
 transaction_type,
 entity_type,
 date,
 amount,
 donor_committee_id,
 recipient_name,
 recipient_city,
 recipient_state,
 recipient_zip,
 recipient_occupation,
 recipient_employer,
 other_fec_id,
 candidate_fec_id,
 transaction_fec_id,
 file_num,
 memo_cd,
 memo,
 fec_unique_id)
SELECT cc.amendment_ind::amendment_indicator,
       cc.report_type,
       cc.transaction_pgi,
       cc.image_num,
       cc.transaction_type,
       cc.entity_type,
       to_date(transaction_date, 'MMDDYYYY'),
       cc.transaction_amount,
       com.id,
       cc.name,
       cc.city,
       cc.state,
       cc.zip,
       cc.occupation,
       cc.employer,
       cc.other_fec_id,
       cc.candidate_fec_id,
       cc.transaction_fec_id,
       cc.file_num,
       cc.memo_cd,
       cc.memo_text,
       cc.sub_id
FROM committee_contribution_temp cc,
     committee com
WHERE cc.committee_fec_id = com.fec_id;

UPDATE committee_contribution
SET recipient_committee_id = committee.id
FROM committee WHERE committee_contribution.other_fec_id = committee.fec_id;

UPDATE committee_contribution
SET candidate_id = candidate.id
FROM candidate WHERE committee_contribution.candidate_fec_id = candidate.fec_id;

DROP TABLE committee_contribution_temp;