import React from 'react';
import {Link, useParams} from 'react-router-dom'
import {candidateSummaryApiUrl, flaggedIndividualContributionsUrl} from "../urls";
import {Container, Header, Loader, Responsive, Segment, Table} from "semantic-ui-react";
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
                <Table.HeaderCell>Connected Corporation</Table.HeaderCell>
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

    const {candidate, flaggedIndividualContributions, flaggedCommitteeContributions} = data;

    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Container>
                <p>Below you’ll find a listing of donations this candidate has received from healthcare corporations and executives funding opposition to Medicare for All.</p>

                <p><b>Corporate Contributions</b> lists campaign donations from corporations that are funding opposition to Medicare for All (meaning they have joined the “Partnership for America’s Healthcare Future,” or belong to an industry group like PhRMA that has joined the Partnership).</p>

                <p><b>Individual Contributions</b> lists the total donations from employees of flagged corporations.</p>
                <p><b>NOTE</b>: The Patients Over Profits Pledge asks candidates to <a href="https://patientsoverprofits.org/frequently-asked-questions/">refuse donations from only the top executives of corporations opposing Medicare for All</a>. <b>Click on the dollar “Amount” to see a full listing of employees who have donated from that corporation</b>, to determine if the list includes top executives who violate the Pledge.</p>



            </Container>
            <ComplianceSummary
                candidate={candidate}
                flaggedIndividualContributions={flaggedIndividualContributions}
                flaggedCommitteeContributions={flaggedCommitteeContributions}
            />
            <Segment basic>
                <Header size='large'>Corporate Contributions</Header>
                {
                    handleEmptyList(() =>
                        <FlaggedCommitteeContributionList
                            contributions={flaggedCommitteeContributions}/>, flaggedCommitteeContributions)
                }
            </Segment>
            <Segment basic>
                <Header size='large'>Individual Contributions</Header>
                {
                    handleEmptyList(() =>
                        <FlaggedIndividualContributionList candidateId={candidateId}
                                                           contributions={flaggedIndividualContributions}/>, flaggedIndividualContributions)
                }
            </Segment>
        </div>


    );
};

export default CandidateSummary;