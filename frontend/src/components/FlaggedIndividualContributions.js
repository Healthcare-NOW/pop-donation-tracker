import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, flaggedIndividualContributionsApiUrl} from "../urls";
import {useReduxFetch} from "../hooks";
import {Header, Loader, Table} from "semantic-ui-react";
import {candidateDisplayName, displayZip} from "../helpers";
import {currencyFormat, screenWidthThreshold} from "../constants";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import {flaggedIndividualContributionsSelector} from "../selectors";
import {flaggedIndividualContributionsSlice} from "../slices";

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
        action: flaggedIndividualContributionsSlice.actions.receiveData
    });

    const {candidate, contributions, flaggedEmployerName} = data;
    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Link to={candidateSummaryUrl(candidate.id)}>Back to {candidateDisplayName(candidate)}</Link>
            <Header as='h1'>Contributions from {flaggedEmployerName} employees
                to {candidateDisplayName(candidate)}</Header>
            <IndividualContributionList contributions={contributions}/>
        </div>
    );
};

export default FlaggedIndividualContributions;