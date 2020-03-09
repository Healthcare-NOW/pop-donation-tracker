import React from 'react';
import {useParams} from 'react-router-dom'

const CandidateSummary = () => {
    const {candidateId} = useParams();
    return (<div>Hello, {candidateId}</div>);
};

export default CandidateSummary;