import React from 'react';
import {isEmpty, sumBy} from 'lodash';
import {List, Message} from "semantic-ui-react";
import {currencyFormat} from "../constants";

export const ComplianceSummary = ({flaggedIndividualContributions, flaggedCommitteeContributions}) => {
    const totalCommitteeContributions = currencyFormat.format(sumBy(flaggedCommitteeContributions, 'amount'));
    return (
        <Message>
            <List relaxed>
                <List.Item>
                    {
                        isEmpty(flaggedCommitteeContributions) ?
                            (<><List.Icon name="check circle" color="green" size="large"/>
                                <List.Content>
                                    No contributions exceeding $200 from flagged committees.
                                </List.Content></>)
                            :
                            (<><List.Icon name="warning circle" color="red" size="large"/>
                                <List.Content>Received contributions totalling {totalCommitteeContributions} from flagged committees.
                                </List.Content></>)
                    }
                </List.Item>
                <List.Item>
                    {
                        isEmpty(flaggedIndividualContributions) ?
                            (<><List.Icon name="check circle" color="green" size="large"/>
                                <List.Content>No contributions exceeding $200 from employees of flagged companies.</List.Content></>)
                            :
                            (<>
                                <List.Icon name="warning circle" color="orange" size="large"/>
                                <List.Content>
                                    Received contributions exceeding $200 from employees of flagged
                                        companies.
                                    <br/>tete
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