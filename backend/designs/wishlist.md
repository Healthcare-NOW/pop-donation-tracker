# Wishlist


## Show data by election cycle

### Questions
1. What candidates do we show when the 2022 cycle rolls around? Do we maintain an additional db entity for
   Ilhan Omar's 2022 candidacy, for example?
   Idea: Keep one Ilhan Omar candidate, but create a new table, "Elections" that has an entry for each election IO has run in.
   Instead of connecting contributions just to a committee, associate an election with the contribution as well.
1. How do we identify to which election cycle a contribution applies? Do we have to look at the date of the contribution
   and the "next" election cycle that the candidate has at the time of the contribution?

## User-facing

1. Tweet a page more easily, and in a way that displays nicely on mobile Twitter.
1. There's a spreadsheet of Partnership companies and the associated PACs. We need to
   update the db with the data in the spreadsheet.
1. Related to the above, we might introduce a UI for adding flagged companies, and creating links between
   flagged companies and committees.
1. Only an authenticated user would be able to do this, so we'd need to add
   authentication.
1. Ability to look up candidates by geographical location within a state, or reveal more
   location details about them when you hover over their names.
1. Perhaps add a form on the landing page that allows you to enter your zip code? Perhaps provide
   contact information, or even create a template email for you?
1. Link to PoP site.
1. Display how badly someone has violated the pledge.
1. Allow an authenticated user to mark someone as having signed up for the pledge.

## Not user-facing
1. Automate loading data, do it on a schedule, and update the UI to reflect how
   fresh the data is.
1. How easy can we make it reuse the code for a different kind of campaign?


