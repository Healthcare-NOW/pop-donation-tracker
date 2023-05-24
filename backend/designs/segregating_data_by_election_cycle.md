# Segregating Data by Election Cycle

## Ideas
### Ask on ProgCode 
Maybe there are people on ProgCode who know more about this data than we do.

### Use the `primary_general_indicator`
Problem: The data in this column is sometimes missing a year. In the case of individual contributions, about 4.6 million
of these just have 'P'.

Instead, for each contribution, we can figure out which candidate it's for, then apply it to that candidate's upcoming
election at the time of the contribution.

### Potential pitfalls
- Can we safely infer that new contributions that appear in 2022 aren't for older campaigns? For example, 
  is it possible that a contribution appears in 2022 with a primary general indicator column set to "P2020"
  for the first time?