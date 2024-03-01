#!/usr/bin/env bash

set -e
set -u
set -o pipefail

if [[ ${RUNNER_DEBUG:-0} == 1 ]]; then
  set -x
fi

KEY="${1}"
OUTPUT="${2}"

if [[ -z $KEY ]]; then
  echo "Error: KEY not specified."
  exit 1
fi

if [[ -z $OUTPUT ]]; then
  echo "Error: OUTPUT not specified."
  exit 1
fi

echo "$OUTPUT=$(jq --raw-output "$KEY" package.json)" >> "$GITHUB_OUTPUT"
