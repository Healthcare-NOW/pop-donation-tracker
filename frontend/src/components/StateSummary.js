import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryApiUrl} from '../urls';
import {Header, List, Loader, Segment} from 'semantic-ui-react'
import {useFetch} from "../hooks";
import {candidateDisplayName} from "../helpers";
import {handleEmptyList} from "../utils";

const CandidateLink = ({candidate}) => {
    const {id} = candidate;
    return (<Link to={candidateSummaryUrl(id)}>{candidateDisplayName(candidate)}</Link>);
};


const SenateCandidateList = ({candidates}) => {
    return (
        <List>
            {candidates.map(candidate => (
                <List.Item key={candidate.id}>
                    <CandidateLink candidate={candidate}/>
                </List.Item>
            ))}
        </List>
    );
};

const HouseCandidateList = ({candidatesByDistrict}) =>
    (<Segment.Group>
        {candidatesByDistrict.map(({district, candidates}) =>
            <Segment>
                <Header size='medium'>{ district }</Header>
                <List>
                    {candidates.map(candidate => (
                        <List.Item key={candidate.id}>
                            <CandidateLink candidate={candidate}/>
                        </List.Item>
                    ))}
                </List>
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

    if (isLoading) return (<Loader active inline='centered' />);

    return (
        <div>
            <Header as='h1'>{state} {year}</Header>
            <div>
                <Segment.Group>
                    <Segment>
                        <Header size='large'>Senate Candidates</Header>
                        { handleEmptyList(() => <SenateCandidateList candidates={senate}/>, senate) }
                    </Segment>
                </Segment.Group>
                <Segment.Group>
                    <Segment>
                        <Header size='large'>House Candidates</Header>
                        <HouseCandidateList candidatesByDistrict={house}/>
                    </Segment>
                </Segment.Group>
            </div>
        </div>
    )
}

export default StateSummary;
