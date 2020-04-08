import React from 'react';
import {isEmpty, sumBy} from 'lodash';
import {List, Message} from "semantic-ui-react";
import {currencyFormat} from "../constants";
import {PoppIcon} from "./PoppIcon";

export const ComplianceSummary = ({candidate, flaggedIndividualContributions, flaggedCommitteeContributions}) => {
    const totalCommitteeContributions = currencyFormat.format(sumBy(flaggedCommitteeContributions, 'amount'));
    return (
        <Message>
            <List relaxed>
                {candidate.pledgeDate &&
                (<List.Item>
                    <List.Icon><div className='App-complianceIcon'><PoppIcon/></div></List.Icon>
                    <List.Content>Took the pledge on {candidate.pledgeDate}</List.Content>
                </List.Item>)
                }
                <List.Item>
                    {
                        isEmpty(flaggedCommitteeContributions) ?
                            (<><List.Icon name="check circle" color="green" size="large"/>
                                <List.Content>
                                    No contributions exceeding $200 from flagged committees.
                                </List.Content></>)
                            :
                            (<><List.Icon name="warning circle" color="red" size="large"/>
                                <List.Content>Received contributions totalling {totalCommitteeContributions} from
                                    flagged committees.
                                </List.Content></>)
                    }
                </List.Item>
                <List.Item>
                    {
                        isEmpty(flaggedIndividualContributions) ?
                            (<><List.Icon name="check circle" color="green" size="large"/>
                                <List.Content>No contributions exceeding $200 from employees of flagged
                                    companies.</List.Content></>)
                            :
                            (<>
                                <List.Icon name="warning circle" color="orange" size="large"/>
                                <List.Content>
                                    Received contributions exceeding $200 from employees of flagged
                                    companies.
                                    <br/>
                                    <i>Note: These employees may or may not be high-ranking
                                        executives.</i>
                                </List.Content>
                            </>)

                    }
                </List.Item>
            </List>
        </Message>
    );
};