#!/usr/bin/env sh
# Convert kmz to kml
# @ffflorian, 2017

# Exit on error
set -eu

# Check if 7z is available
if ! command -v "7z" > /dev/null; then
  echo >&2 "Could not find 7z. Exiting."
  exit 1
fi

# Function to convert kmz to kml
convert_kmz_to_kml() {
  for FILE in *.kmz; do
    if [ -e "$FILE" ]; then
      if 7z t "$FILE" > /dev/null; then
        7z e -so "$FILE" > "${FILE%.*}.kml"
        echo "${FILE##*/}"  # Output just the filename without the path
      else
        echo "Failed to test $FILE"
      fi
    fi
  done
}

# Initial conversion of existing KMZ files
convert_kmz_to_kml

# Monitor the directory for new KMZ files
while inotifywait -e create -e moved_to .; do
  convert_kmz_to_kml
done
