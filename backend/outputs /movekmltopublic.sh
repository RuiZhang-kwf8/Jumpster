#!/usr/bin/env sh
# Move KML files to a different directory
# Exit on error
set -eu

# Check if inotifywait is available
if ! command -v "inotifywait" > /dev/null; then
  echo >&2 "Could not find inotifywait. Exiting."
  exit 1
fi

# Function to move kml files
movekmltopublic() {
  for FILE in *.kml; do
    if [ -e "$FILE" ]; then
      mv "$FILE" ../../frontend/public 
    else
      echo "No KML files found."
    fi
  done
}

# Initial move of existing KML files
movekmltopublic

# Monitor the directory for new KML files
while inotifywait -e create -e moved_to .; do
  movekmltopublic
done
