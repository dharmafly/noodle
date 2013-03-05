#!/bin/bash

# Start the testing server and store its pid
node tests/server.js & pid=$!

# Run the tests
node_modules/mocha/bin/mocha tests/tests.js --timeout 4000 --reporter list

# Kill the test server via its pid
kill $!
