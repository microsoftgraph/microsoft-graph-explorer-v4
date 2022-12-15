#!/bin/bash
#
# This hook will look for code comments marked '//no-commit'
#    - case-insensitive
#    - dash is optional
#    - there may be a space after the //
#
noCommitCount=$(git diff --no-ext-diff --cached | egrep -i --count "(@No|\/\/\s?no[ -]?)commit")
if [ "$noCommitCount" -ne "0" ]; then
   echo "WARNING: You are attempting to commit changes which include a 'no-commit'."
   echo "Please check the following files:"
   git diff --no-ext-diff --cached --name-only -i -G"(@no|\/\/s?no-?)commit" | sed 's/^/   - /'
   echo
   echo "You can ignore this warning by running the commit command with '--no-verify'"
   exit 1
fi