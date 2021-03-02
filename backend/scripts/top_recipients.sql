-- Lists recipients of flagged committee contributions.

select a.id, a.name, a.office_state, a.office, sum(a.total_amount) as total_am from

(select can.id, can.name, can.office_state, can.office, sum(comcon.amount) as total_amount from

candidate can, committee cancom, committee_contribution comcon, committee doncom

where cancom.candidate_id = can.id
  and comcon.recipient_committee_id=cancom.id
  and comcon.candidate_id is null
  and doncom.id = comcon.donor_committee_id
  and doncom.connected_organization_flagged_as_id is not null
  and comcon.transaction_type != '24A'

group by can.id

union all

select can.id, can.name, can.office_state, can.office, sum(comcon.amount) as total_amount from

candidate can, committee_contribution comcon, committee doncom

where comcon.candidate_id = can.id
  and doncom.id = comcon.donor_committee_id
  and doncom.connected_organization_flagged_as_id is not null
  and comcon.transaction_type != '24A'

group by can.id) a group by a.id, a.name, a.office_state, a.office

order by sum(total_amount) desc;



