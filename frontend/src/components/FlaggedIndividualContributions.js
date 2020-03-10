import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, flaggedIndividualContributionsApiUrl} from "../urls";
import {useFetch} from "../hooks";
import {Header, Loader, Table} from "semantic-ui-react";
import {candidateDisplayName} from "../helpers";

const IndividualContributionList = ({contributions}) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Contributor</Table.HeaderCell>
                <Table.HeaderCell>City</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>ZIP</Table.HeaderCell>
                <Table.HeaderCell>Occupation</Table.HeaderCell>
                <Table.HeaderCell>Reported Employer</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {contributions.map(({contributor, amount}) => (
                <Table.Row key={contributor.id}>
                    <Table.Cell>{contributor.name}</Table.Cell>
                    <Table.Cell>{contributor.city}</Table.Cell>
                    <Table.Cell>{contributor.state}</Table.Cell>
                    <Table.Cell>{contributor.zip}</Table.Cell>
                    <Table.Cell>{contributor.occupation}</Table.Cell>
                    <Table.Cell>{contributor.employer}</Table.Cell>
                    <Table.Cell>{amount}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const FlaggedIndividualContributions = () => {
    const {candidateId, employerId} = useParams();
    const {data, isLoading} = useFetch(flaggedIndividualContributionsApiUrl(candidateId, employerId), {
        candidate: {},
        contributions: []
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