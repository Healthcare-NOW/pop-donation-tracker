import {useSelector} from "react-redux";
import {breadcrumbsSelector} from "./selectors";
import {Breadcrumb, Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {candidateSummaryUrl, flaggedIndividualContributionsUrl, stateSummaryUrl} from "./urls";
import React from "react";
import {candidateDisplayName} from "./helpers";

export const StateBreadcrumb = () => {
    const {state, year} = useSelector(breadcrumbsSelector);
    return (<Breadcrumb.Section as={Link} to={stateSummaryUrl(year, state)}>{state} {year}</Breadcrumb.Section>)
};

export const HomeBreadcrumb = () => (
    <Breadcrumb.Section as={Link} to={'/'}><Icon name='home'/></Breadcrumb.Section>
);

export const CandidateBreadcrumb = () => {
    const {candidate} = useSelector(breadcrumbsSelector);
    return (<Breadcrumb.Section as={Link} to={candidateSummaryUrl(candidate.id)}>{candidateDisplayName(candidate)}</Breadcrumb.Section>)
};

export const FlaggedIndividualContributionsBreadcrumb = () => {
    const {candidate, flaggedEmployer: {name, id}} = useSelector(breadcrumbsSelector);
    return (
        <Breadcrumb.Section
            as={Link}
            to={flaggedIndividualContributionsUrl(candidate.id, id)}>
            {name}
        </Breadcrumb.Section>)
};

