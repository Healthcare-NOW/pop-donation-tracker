import React from 'react';
import {Link, useParams} from 'react-router-dom'
import {candidateSummaryApiUrl, flaggedIndividualContributionsUrl, stateSummaryUrl} from "../urls";
import {Header, Loader, Segment, Table} from "semantic-ui-react";
import {useFetch} from "../hooks";
import {handleEmptyList} from "../utils";
import {candidateDisplayName} from "../helpers";
import {currencyFormat} from "../constants";
import {sumBy} from 'lodash';

const FlaggedIndividualContributionList = ({candidateId, contributions}) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Employer</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {contributions.map(({flaggedEmployerId, flaggedEmployerName, amount}) => (
                <Table.Row key={flaggedEmployerId}>
                    <Table.Cell>{flaggedEmployerName}</Table.Cell>
                    <Table.Cell>
                        <Link
                            to={flaggedIndividualContributionsUrl(candidateId, flaggedEmployerId)}>{currencyFormat.format(amount)}
                        </Link>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const FlaggedCommitteeContributionList = ({contributions}) => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Committee</Table.HeaderCell>
                <Table.HeaderCell>Connected Organization</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {contributions.map(({committee, flaggedConnectedOrganization, amount}) => (
                <Table.Row key={committee.id}>
                    <Table.Cell>{committee.name}</Table.Cell>
                    <Table.Cell>{flaggedConnectedOrganization}</Table.Cell>
                    <Table.Cell>{currencyFormat.format(amount)}</Table.Cell>
                </Table.Row>
            ))}
            <Table.Row key='totalFlagged'>
                <Table.Cell colSpan={2}><b>TOTAL</b></Table.Cell>
                <Table.Cell>
                    <b>{currencyFormat.format(sumBy(contributions, ({amount}) => parseInt(amount)))}</b>
                </Table.Cell>
            </Table.Row>
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
        flaggedIndividualContributions: [],
        flaggedCommitteeContributions: []
    });
    const {candidate, flaggedIndividualContributions, flaggedCommitteeContributions} = data;
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
                        <Header size='large'>Committee Contributions</Header>
                        {
                            handleEmptyList(() =>
                                <FlaggedCommitteeContributionList contributions={flaggedCommitteeContributions}/>, flaggedCommitteeContributions)
                        }
                    </Segment>
                    <Segment>
                        <Header size='large'>Individual Contributions</Header>
                        {
                            handleEmptyList(() =>
                                <FlaggedIndividualContributionList candidateId={candidateId}
                                                                   contributions={flaggedIndividualContributions}/>, flaggedIndividualContributions)
                        }
                    </Segment>
                </Segment.Group>
            </div>
        </div>


    );
};

export default CandidateSummary;