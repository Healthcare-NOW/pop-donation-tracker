import React from 'react';
import {Link, useParams} from 'react-router-dom'
import {candidateSummaryApiUrl, flaggedIndividualContributionsUrl} from "../urls";
import {Header, List, Loader, Responsive, Segment, Table} from "semantic-ui-react";
import {useReduxFetch} from "../hooks";
import {handleEmptyList} from "../utils";
import {currencyFormat, screenWidthThreshold} from "../constants";
import {sumBy} from 'lodash';
import {candidateSummarySelector} from "../selectors";
import {breadCrumbsSlice, candidateSummarySlice} from "../slices";
import {ComplianceSummary} from "./ComplianceSummary";

const FlaggedIndividualContributionList = ({candidateId, contributions}) => (
    <Table celled>
        <Responsive as={Table.Header} minWidth={screenWidthThreshold + 1}>
            <Table.Row>
                <Table.HeaderCell>Employer</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Responsive>
        <Table.Body>
            {contributions.map(({flaggedEmployer, amount}) => (
                <Table.Row key={flaggedEmployer.id}>
                    <Table.Cell>{flaggedEmployer.name} ({flaggedEmployer.group})</Table.Cell>
                    <Table.Cell>
                        <Link
                            to={flaggedIndividualContributionsUrl(candidateId, flaggedEmployer.id)}>{currencyFormat.format(amount)}
                        </Link>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>);

const FlaggedCommitteeContributionList = ({contributions}) => (
    <Table celled>
        <Responsive as={Table.Header} minWidth={screenWidthThreshold + 1}>
            <Table.Row>
                <Table.HeaderCell>Committee</Table.HeaderCell>
                <Table.HeaderCell>Connected Organization</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
        </Responsive>
        <Table.Body>
            {contributions.map(({committee, flaggedConnectedOrganization, amount}) => (
                <Table.Row key={committee.id}>
                    <Table.Cell>{committee.name}</Table.Cell>
                    <Table.Cell>{flaggedConnectedOrganization.name} ({flaggedConnectedOrganization.group})</Table.Cell>
                    <Table.Cell>{currencyFormat.format(amount)}</Table.Cell>
                </Table.Row>
            ))}
            <Table.Row key='totalFlagged'>
                <Table.Cell colSpan={2}><b>TOTAL</b></Table.Cell>
                <Table.Cell>
                    <b>{currencyFormat.format(sumBy(contributions, 'amount'))}</b>
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>);

const CommitteeList = ({committees}) => (
    <div>
        <Responsive maxWidth={screenWidthThreshold}>
            <List>
                {
                    committees.map(({id, name}) => (
                        <List.Item key={id}>{name}</List.Item>
                    ))
                }
            </List>
        </Responsive>
        <Responsive minWidth={screenWidthThreshold + 1}>
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
            </Table></Responsive>
    </div>);

const CandidateSummary = () => {
    const {candidateId} = useParams();
    const {data, isLoading} = useReduxFetch({
        key: [candidateId],
        url: candidateSummaryApiUrl(candidateId),
        selector: candidateSummarySelector,
        onSuccess: (dispatch, data) => {
            dispatch(candidateSummarySlice.actions.receiveData({
                key: [candidateId],
                ...data
            }));

            const {electionYear, officeState, partyAffiliation, name, id} = data.candidate;
            dispatch(breadCrumbsSlice.actions.receiveData({
                year: electionYear,
                state: officeState,
                candidate: {
                    name,
                    partyAffiliation,
                    id
                }
            }))
        }
    });

    const {candidate: {committees}, flaggedIndividualContributions, flaggedCommitteeContributions} = data;

    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <ComplianceSummary
                flaggedIndividualContributions={flaggedIndividualContributions}
                flaggedCommitteeContributions={flaggedCommitteeContributions}
            />
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
                            <FlaggedCommitteeContributionList
                                contributions={flaggedCommitteeContributions}/>, flaggedCommitteeContributions)
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


    );
};

export default CandidateSummary;