#!/bin/bash
# Generates content/.authors.json mapping each .md file to its GitHub username.
# Runs in CI where gh CLI and GITHUB_TOKEN are available.
# Uses GitHub API to resolve the actual GitHub login from commit SHA.

set -e

REPO="${GITHUB_REPOSITORY:-explorills/one-blog}"
OUTPUT="content/.authors.json"

echo "{" > "$OUTPUT"
FIRST=true

for file in content/*.md; do
  [ -f "$file" ] || continue

  FILENAME=$(basename "$file")

  # Get the SHA of the commit that first added this file
  SHA=$(git log --follow --diff-filter=A --format="%H" -- "$file" | tail -1)

  if [ -z "$SHA" ]; then
    continue
  fi

  # Query GitHub API for the commit author's login
  LOGIN=$(gh api "repos/$REPO/commits/$SHA" --jq '.author.login // empty' 2>/dev/null || echo "")

  if [ -z "$LOGIN" ]; then
    # Fallback to git author name
    LOGIN=$(git log --follow --diff-filter=A --format="%aN" -- "$file" | tail -1)
  fi

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> "$OUTPUT"
  fi

  printf '  "%s": "%s"' "$FILENAME" "$LOGIN" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "}" >> "$OUTPUT"

echo "Generated $OUTPUT"
cat "$OUTPUT"
