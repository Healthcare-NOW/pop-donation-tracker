import React from 'react';
import {isEmpty, sumBy} from 'lodash';
import {Icon, Message} from "semantic-ui-react";
import {currencyFormat} from "../constants";

export const ComplianceSummary = ({flaggedIndividualContributions, flaggedCommitteeContributions}) => {
    const totalCommitteeContributions = currencyFormat.format(sumBy(flaggedCommitteeContributions, 'amount'));
    return (
        <Message>
            <div className="App-complianceSummaryItem">
                {
                    isEmpty(flaggedCommitteeContributions) ?
                        (<span>
                            <Icon name="check circle" color="green" size="large"/> This candidate has not received any
                            contributions exceeding $200 from flagged committees.
                        </span>)
                        :
                        (<span>
                            <Icon name="warning circle" color="red" size="large"/> This candidate has received
                            contributions totalling {totalCommitteeContributions} from flagged committees.
                        </span>)

                }
            </div>
            <div>
            {
                isEmpty(flaggedIndividualContributions) ?
                    <span>
                        <Icon name="check circle" color="green" size="large"/> This candidate has not received any
                        contributions exceeding $200 from employees of flagged companies.
                    </span>
                    :
                    <span>
                        <Icon name="warning circle" color="orange" size="large"/> This candidate has received
                        contributions exceeding $200 from employees of flagged committees. <i>Note: These employees
                        may or may not be high-ranking executives.</i>
                    </span>

            }
            </div>
        </Message>
    );
};