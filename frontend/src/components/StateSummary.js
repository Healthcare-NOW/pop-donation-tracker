import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {stateSummaryUrl} from '../urls';
import {Header, Segment, Table} from 'semantic-ui-react'
import {getRequest} from "../request";

const SenateCandidateList = ({candidates}) => {
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Party Affiliation</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {candidates.map(({id, name, partyAffiliation}) => (
                    <Table.Row key={id}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{partyAffiliation}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const HouseCandidateList = ({candidatesByDistrict}) =>
    (<Segment.Group>
        {candidatesByDistrict.map(({district, candidates}) =>
            <Segment>
                <Header size='medium'>{ district }</Header>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Party Affiliation</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {candidates.map(({id, name, partyAffiliation}) => (
                            <Table.Row key={id}>
                                <Table.Cell>{name}</Table.Cell>
                                <Table.Cell>{partyAffiliation}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
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
