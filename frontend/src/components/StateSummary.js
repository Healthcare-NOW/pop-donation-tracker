import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {candidateSummaryUrl, stateSummaryUrl} from '../urls';
import {Header, Segment, List} from 'semantic-ui-react'
import {getRequest} from "../request";
import {Link} from 'react-router-dom';
import {partyDisplayNames} from "../constants";

const CandidateName = ({candidate}) => {
    const {id, name, partyAffiliation} = candidate;
    return (<Link to={candidateSummaryUrl(id)}>{name} {`(${partyDisplayNames[partyAffiliation] || partyAffiliation})`}</Link>);
};

const SenateCandidateList = ({candidates}) => {
    return (
        <List>
            {candidates.map(candidate => (
                <List.Item key={candidate.id}>
                    <CandidateName candidate={candidate}/>
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
                            <CandidateName candidate={candidate}/>
                        </List.Item>
                    ))}
                </List>
            </Segment>
        )}
    </Segment.Group>);

function StateSummary() {
    const {year, state} = useParams();
    const [senateCandidates, setSenateCandidates] = useState([]);
    const [houseCandidates, setHouseCandidates] = useState([]);
    useEffect(() => {
            getRequest(stateSummaryUrl(year, state)).then(({senate, house}) => {
                setSenateCandidates(senate);
                setHouseCandidates(house);
            })
        }
        , [year, state]);

    return (
        <div>
            <Header as='h1'>{state} {year}</Header>
            <div>
                <Segment.Group>
                    <Segment>
                        <Header size='large'>Senate Candidates</Header>
                        <SenateCandidateList candidates={senateCandidates}/>
                    </Segment>
                </Segment.Group>
                <Segment.Group>
                    <Segment>
                        <Header size='large'>House Candidates</Header>
                        <HouseCandidateList candidatesByDistrict={houseCandidates}/>
                    </Segment>
                </Segment.Group>
            </div>
        </div>
    )
}

export default StateSummary;
