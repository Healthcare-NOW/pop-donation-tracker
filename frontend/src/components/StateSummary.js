import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryApiUrl} from '../urls';
import {Card, Header, Icon, List, Loader, Responsive, Segment} from 'semantic-ui-react'
import {candidateDisplayName} from "../helpers";
import {handleEmptyList} from "../utils";
import {filter, isEmpty} from 'lodash';
import {screenWidthThreshold} from "../constants";
import {useReduxFetch} from "../hooks";
import {stateSummarySelector} from "../selectors";
import {breadCrumbsSlice, stateSummarySlice} from "../slices";
import {Capitol} from './Capitol';

const CandidateLink = ({candidate}) => {
    const {id} = candidate;
    return (
        <span className='candidateLink'>
           <Link to={candidateSummaryUrl(id)} style={{}}>{candidateDisplayName(candidate)}</Link>
            {candidate.incumbentChallengerStatus === 'I' && <Capitol/>}
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
            <Segment basic key={district}>
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
            <Segment.Group>
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
            </Segment.Group>
        </div>
    )
};

export default StateSummary;
