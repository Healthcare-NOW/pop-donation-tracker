import React from 'react';
import {Link, useParams} from 'react-router-dom'
import {candidateSummaryApiUrl, flaggedIndividualContributionsUrl, stateSummaryUrl} from "../urls";
import {Header, Loader, Segment, Table} from "semantic-ui-react";
import {useFetch} from "../hooks";
import {handleEmptyList} from "../utils";
import {candidateDisplayName} from "../helpers";


const FlaggedIndividualContributionList = ({candidateId, contributions}) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Employer</Table.HeaderCell>
                <Table.HeaderCell>Total Amount</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {contributions.map(({flaggedEmployerId, flaggedEmployerName, amount}) => (
                <Table.Row key={flaggedEmployerId}>
                    <Table.Cell>{flaggedEmployerName}</Table.Cell>
                    <Table.Cell>
                        <Link
                            to={flaggedIndividualContributionsUrl(candidateId, flaggedEmployerId)}>{amount}
                        </Link>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const CommitteeList = ({committees}) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Designation</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {committees.map(({id, name, designation, type}) => (
                <Table.Row key={id}>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{designation}</Table.Cell>
                    <Table.Cell>{type}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const CandidateSummary = () => {
    const {candidateId} = useParams();
    const {data, isLoading} = useFetch(candidateSummaryApiUrl(candidateId), {
        candidate: {committees: []},
        flaggedContributions: []
    });

    const {candidate, flaggedContributions} = data;
    const {officeState, electionYear, committees} = candidate;

    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Link to={stateSummaryUrl(electionYear, officeState)}>Back to {officeState} {electionYear}</Link>
            <Header as='h1'>{candidateDisplayName(candidate)}</Header>
            <div>
                <Segment.Group>
                    <Segment>
                        <Header size='large'>Committees</Header>
                        {
                            handleEmptyList(() =>
                                <CommitteeList committees={committees}/>, committees)
                        }
                    </Segment>
                    <Segment>
                        <Header size='large'>Individual Contributions</Header>
                        {
                            handleEmptyList(() =>
                                <FlaggedIndividualContributionList candidateId={candidateId}
                                                                   contributions={flaggedContributions}/>, flaggedContributions)
                        }
                    </Segment>
                </Segment.Group>
            </div>
        </div>


    );
};

export default CandidateSummary;