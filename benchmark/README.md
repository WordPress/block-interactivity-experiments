# Testing performance and fragility of vDOM hydration

The list of sites is divided into 10 files in `benchmark/data/`.

## Run the tests

```sh
npm install 
npm run benchmark <file_in_benchmark/data>
```

For example:

```sh
# This will run the tests against all the sites in 1.csv
npm run benchmark 1.csv
```

The test injects the `hydrationScript.js` using Playwright and checks if any
MutationObserver callbacks have been called. It will also record any errors that
might have occured during hydration.

The tests run against the list of WordPress sites in the specified file in top to
bottom order. The results are saved into the `test_results.db` sqlite database.

The script will check the database to see if a successful test has already been 
recorded against a particular site and if yes, will skip testing it and try the
next site from the list.

### How can I see the test results?

You should use a DB viewer tool like <https://sqlitebrowser.org/>  and use it to
open the `benchmark/test_results.db` file.

### Help, I see many timeout errors!

This is probably because your network is too slow to handle the traffic spike -
the script by default tries to test 40 sites concurrently. Try lowering the
number of pages tested concurrently:

```sh
npm run benchmark -- 1.csv --concurrency=20
```
