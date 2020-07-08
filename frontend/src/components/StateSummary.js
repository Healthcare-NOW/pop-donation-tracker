import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryApiUrl} from '../urls';
import {Card, Container, Header, Icon, List, Loader, Popup, Responsive, Segment} from 'semantic-ui-react'
import {candidateDisplayName} from "../helpers";
import {handleEmptyList} from "../utils";
import {filter, isEmpty, maxBy} from 'lodash';
import {screenWidthThreshold} from "../constants";
import {useReduxFetch} from "../hooks";
import {stateSummarySelector} from "../selectors";
import {breadCrumbsSlice, stateSummarySlice} from "../slices";
import {Capitol} from './Capitol';
import {PoppIcon} from "./PoppIcon";
import moment from "moment";

const Badge = ({icon, popupText}) => (
    <Popup
        mouseEnterDelay={500}
        mouseLeaveDelay={500}
        content={popupText}
        trigger={<div className='App-candidateBadge'>{icon}</div>}
    />
);


const CandidateAlertBadges = ({alerts}) => {
    if (isEmpty(alerts)) return null;

    const mostRecent = maxBy(alerts, ({created_on}) => moment(created_on, 'YYYY-MM-DD'));
    const badges = [];

    if (parseFloat(mostRecent.flaggedIndividualContributions) > 0) {
        badges.push(
            <Badge key={`mild-${mostRecent.id}`}
                   popupText={'This candidate may have received contributions from executives of flagged corporations.'}
                   icon={<Icon name="exclamation circle" color="orange"/>}/>)
    }

    if (parseFloat(mostRecent.flaggedCommitteeContributions) > 0) {
        badges.push(
            <Badge key={`severe-${mostRecent.id}`}
                   popupText={'This candidate has received contributions from flagged committees.'}
                   icon={<Icon name="times circle" color="red"/>}/>)
    }

    return badges
};

const CandidateLink = ({candidate}) => {
    const {id} = candidate;
    return (
        <span className='candidateLink'>
           <Link to={candidateSummaryUrl(id)} style={{}}>{candidateDisplayName({candidate, maxLength: 30})}</Link>
            {candidate.incumbentChallengerStatus === 'I' &&
            <Badge popupText={'Incumbent'} icon={<Capitol/>}/>}
            {candidate.pledgeDate &&
            <Badge popupText={`Took the pledge on ${candidate.pledgeDate}`} icon={<PoppIcon/>}/>}
            <CandidateAlertBadges alerts={candidate.alerts}/>
        </span>
    )
};

const CandidateList = ({candidates, className}) => (
    <Card>
        <div className={`candidateList ${className}`}>
            <List>
                {candidates.map(candidate => (
                    <List.Item key={candidate.id}>
                        <CandidateLink candidate={candidate}/>
                    </List.Item>
                ))}
            </List>
        </div>
    </Card>
);

const CandidateListByParty = ({candidates}) => {

    const democrats = filter(candidates, {partyAffiliation: 'DEM'});
    const republicans = filter(candidates, {partyAffiliation: 'REP'});
    const others = filter(candidates,
        ({partyAffiliation}) => partyAffiliation !== 'DEM' & partyAffiliation !== 'REP');

    return (
        <div>
            <Responsive maxWidth={screenWidthThreshold}>
                <Card.Group itemsPerRow={1}>
                    {!isEmpty(democrats) && <CandidateList candidates={democrats} className='democrat'/>}
                    {!isEmpty(republicans) && <CandidateList candidates={republicans} className='republican'/>}
                    {!isEmpty(others) && <CandidateList candidates={others} className='other'/>}
                </Card.Group>
            </Responsive>
            <Responsive minWidth={screenWidthThreshold + 1}>
                <Card.Group itemsPerRow={3}>
                    <CandidateList candidates={democrats} className='democrat'/>
                    <CandidateList candidates={republicans} className='republican'/>
                    <CandidateList candidates={others} className='other'/>
                </Card.Group>
            </Responsive>
        </div>
    );
};

const HouseCandidateList = ({candidatesByDistrict}) =>
    (<Segment.Group>
        {candidatesByDistrict.map(({district, candidates}) =>
            <Segment key={district}>
                <Header size='medium'>{district}</Header>
                <CandidateListByParty candidates={candidates}/>
            </Segment>
        )}
    </Segment.Group>);

const StateSummary = () => {
    const {year, state} = useParams();
    const {data, isLoading} = useReduxFetch({
        url: stateSummaryApiUrl(year, state),
        key: [year, state],
        selector: stateSummarySelector,
        onSuccess: (dispatch, data) => {
            dispatch(stateSummarySlice.actions.receiveData({
                key: [year, state],
                ...data
            }));
            dispatch(breadCrumbsSlice.actions.receiveData({
                state,
                year
            }));
        }
    });

    const {senate, house} = data;

    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Container>
                <p>This page lists all of your state’s candidates for the U.S. Congress. <b>Click on any candidate’s
                    name for a complete report on donations they have received from healthcare corporations and
                    executives who are funding opposition to Medicare for All.</b></p>

                <p><b>Icons to the right of your candidate’s name</b> give a preview of their donations:</p>

                <List relaxed>
                    <List.Item>
                        <List.Icon>
                            <div className='App-complianceIcon'><Capitol/></div>
                        </List.Icon>
                        <List.Content>is an incumbent, sitting Member of Congress</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon>
                            <div className='App-complianceIcon'><PoppIcon/></div>
                        </List.Icon>
                        <List.Content>has taken the Patients Over Profits Pledge</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="times circle" color="red" size="large"/>
                        <List.Content>has received donations from corporations funding opposition to Medicare
                            for All</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="exclamation circle" color="orange" size="large"/>
                        <List.Content><b><i>may</i></b> have received donations from corporate executives
                            opposing Medicare for All (click to see candidate’s page for more details)
                        </List.Content>
                    </List.Item>
                </List>

            </Container>

            <Segment basic>
                <Header size='large'>Senate Candidates</Header>
                <Segment.Group>
                    <Segment basic>
                        {handleEmptyList(() => <CandidateListByParty candidates={senate}/>, senate)}
                    </Segment>
                </Segment.Group>
            </Segment>
            <Segment basic>
                <Header size='large'>House Candidates</Header>
                <HouseCandidateList candidatesByDistrict={house}/>
            </Segment>
        </div>
    )
};

export default StateSummary;
