import React from 'react';
import {useParams} from 'react-router-dom';
import {flaggedIndividualContributionsApiUrl} from "../urls";
import {useReduxFetch} from "../hooks";
import {Container, Header, Loader, Table} from "semantic-ui-react";
import {displayZip} from "../helpers";
import {currencyFormat, screenWidthThreshold} from "../constants";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import {flaggedIndividualContributionsSelector} from "../selectors";
import {breadCrumbsSlice, flaggedIndividualContributionsSlice} from "../slices";

const IndividualContributionList = ({contributions}) => (
    <Table celled>
        <Responsive as={Table.Header} minWidth={screenWidthThreshold + 1}>
            <Table.Row>
                <Table.HeaderCell>Contributor</Table.HeaderCell>
                <Table.HeaderCell>City</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>ZIP</Table.HeaderCell>
                <Table.HeaderCell>Occupation</Table.HeaderCell>
                <Table.HeaderCell>Reported Employer</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Responsive>
        <Table.Body>
            {contributions.map(({contributor, amount}) => (
                <Table.Row key={contributor.id}>
                    <Table.Cell>{contributor.name}</Table.Cell>
                    <Table.Cell>{contributor.city}</Table.Cell>
                    <Table.Cell>{contributor.state}</Table.Cell>
                    <Table.Cell>{displayZip(contributor.zip)}</Table.Cell>
                    <Table.Cell>{contributor.occupation}</Table.Cell>
                    <Table.Cell>{contributor.employer}</Table.Cell>
                    <Table.Cell>{currencyFormat.format(amount)}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const FlaggedIndividualContributions = () => {
    const {candidateId, employerId} = useParams();
    const {data, isLoading} = useReduxFetch({
        url: flaggedIndividualContributionsApiUrl(candidateId, employerId),
        key: [candidateId, employerId],
        selector: flaggedIndividualContributionsSelector,
        onSuccess: (dispatch, data) => {
            dispatch(flaggedIndividualContributionsSlice.actions.receiveData({
                key: [candidateId, employerId],
                ...data
            }));

            const {candidate: {electionYear, officeState, partyAffiliation, name, id}} = data;

            dispatch(breadCrumbsSlice.actions.receiveData({
                year: electionYear,
                state: officeState,
                candidate: {
                    name,
                    partyAffiliation,
                    id
                }
            }));

        }
    });
    const {contributions, flaggedEmployerName} = data;
    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Header as='h2'>Contributions from {flaggedEmployerName} employees</Header>
            <Container>
                <p>Below is a listing of employees of the flagged corporation who have donated to this candidate.</p>

                <p><b>Top executives and/or their spouses will sometimes make donations to a candidate instead of the corporation itself to evade regulations.</b> So the Patients Over Profits Pledge asks candidates not to accept donations from the top executives of corporations that are working to undermine Medicare for All (see the campaign FAQ page for details).</p>

                <p><b>Review the listing of employee donations below to determine whether any are directors or top executives of the corporation.</b> Sometimes this will be clear from the “occupation” listed for the employee, but you may also have to conduct an internet search for their name and employer to determine if they sit on the Board of Directors or hold a high-ranking executive position.</p>
            </Container>
            <IndividualContributionList contributions={contributions}/>
        </div>
    );
};

export default FlaggedIndividualContributions;