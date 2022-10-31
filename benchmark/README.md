# Testing performance and fragility of vDOM hydration

## Run the tests

```sh
node benchmark/index.mjs
```

The test injects the `hydrationScript.js` using Playwright and checks if any
MutationObserver callbacks have been called.

The tests run against the list of WordPress sites in `sites.csv` in top to
bottom order. The results are saved into the `test_results.db` sqlite database.

By default, the script will check the database to see if a
successful test has already been run against that particular site so as not to
repeat test runs.
