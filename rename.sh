#!/bin/bash

# Define the relative directory path
DIR="test/validation"

# Find all .ts and .tsx files in the specified directory and rename them
find "$DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
  # Construct the new file name with .test.ts extension
  new_file="${file%.*}.test.ts"

  # Rename the file
  mv "$file" "$new_file"

  echo "Renamed $file to $new_file"
done
