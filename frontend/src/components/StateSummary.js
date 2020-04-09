import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryApiUrl} from '../urls';
import {Card, Header, Icon, List, Loader, Popup, Responsive, Segment} from 'semantic-ui-react'
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


const CandidateAlertBadge = ({alerts}) => {
    if (isEmpty(alerts)) return null;

    const mostRecent = maxBy(alerts, ({created_on}) => moment(created_on, 'YYYY-MM-DD'));

    const severe = parseFloat(mostRecent.flaggedCommitteeContributions) > 0;

    const icon = severe
        ? <Icon name="times circle" color="red"/>
        : <Icon name="exclamation circle" color="orange"/>;

    const message = severe
        ? 'This candidate has received contributions from flagged committees.'
        : 'This candidate may have received contributions from executives of flagged corporations.';

    return (<Popup
        mouseEnterDelay={500}
        mouseLeaveDelay={500}
        content={message}
        trigger={<div className='App-candidateBadge'>{icon}</div>}
    />)
};

const CandidateLink = ({candidate}) => {
    const {id} = candidate;
    return (
        <span className='candidateLink'>
           <Link to={candidateSummaryUrl(id)} style={{}}>{candidateDisplayName({candidate, maxLength: 30})}</Link>
            {candidate.incumbentChallengerStatus === 'I' &&
            <Popup
                mouseEnterDelay={500}
                mouseLeaveDelay={500}
                content="Incumbent"
                trigger={<div className='App-candidateBadge'><Capitol/></div>}
            />}
            {candidate.pledgeDate &&
            <Popup
                mouseEnterDelay={500}
                mouseLeaveDelay={500}
                content={`Took the pledge on ${candidate.pledgeDate}`}
                trigger={<div className='App-candidateBadge'><PoppIcon/></div>}
            />}
            <CandidateAlertBadge alerts={candidate.alerts}/>
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
