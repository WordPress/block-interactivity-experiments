# Testing performance and fragility of vDOM hydration

## Run the tests

```sh
node benchmark/index.mjs
```

## Results

Results from running the script over the first 100 websites in `domains.mjs` are
in `results_first_100.json`.

## Interpreting the results

You can use a tool like <https://github.com/stedolan/jq> to filter and analyse
the JSON blob with the results. For example, to see what kind of node was
removed in all of the runs:

```sh
cat benchmark/mutation-observer-results.json | jq ".[][]?.removedNodes[].nodeName"
```
