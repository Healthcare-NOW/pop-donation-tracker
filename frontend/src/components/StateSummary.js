import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryApiUrl} from '../urls';
import {Card, Header, Icon, List, Loader, Segment} from 'semantic-ui-react'
import {useFetch} from "../hooks";
import {candidateDisplayName} from "../helpers";
import {handleEmptyList} from "../utils";
import {filter} from 'lodash';

const CandidateLink = ({candidate}) => {
    const {id} = candidate;
    return (
        <span className='candidateLink'>
           <Link to={candidateSummaryUrl(id)} style={{}}>{candidateDisplayName(candidate)}</Link>
            {candidate.incumbentChallengerStatus === 'I' &&
            <span className='incumbent'><Icon color='black' name='star'/></span>}
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
        <Card.Group itemsPerRow={3}>
            <CandidateList candidates={democrats} className='democrat'/>
            <CandidateList candidates={republicans} className='republican'/>
            <CandidateList candidates={others} className='other'/>
        </Card.Group>
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

function StateSummary() {
    const {year, state} = useParams();
    const {data, isLoading} = useFetch(stateSummaryApiUrl(year, state), {
        senate: [],
        house: []
    });

    const {senate, house} = data;

    if (isLoading) return (<Loader active inline='centered'/>);

    return (
        <div>
            <Header as='h1'>{state} {year}</Header>
            <Segment.Group>
                <Segment>
                    <Header size='large'>Senate Candidates</Header>
                    <Segment.Group>
                        <Segment>
                            {handleEmptyList(() => <CandidateListByParty candidates={senate}/>, senate)}
                        </Segment>
                    </Segment.Group>
                </Segment>
                <Segment>
                    <Header size='large'>House Candidates</Header>
                    <HouseCandidateList candidatesByDistrict={house}/>
                </Segment>
            </Segment.Group>
        </div>
    )
}

export default StateSummary;
