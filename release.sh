#!/usr/bin/env bash

set -v            # print commands before execution, but don't expand env vars in output
set -o errexit    # always exit on error
set -o pipefail   # honor exit codes when piping
set -o nounset    # fail on unset variables

git clone "https://DashiumBot:$GH_TOKEN@github.com/Dashium/DashiumModules" release
cd release

npm start

# bail if nothing changed
if [ "$(git status --porcelain)" = "" ]; then
  echo "no new content found; goodbye!"
  cd ..
  rm -rf ./release
  exit
fi

git config user.email dashium@outlook.fr
git config user.name DashiumBot
git add .
git commit -am "🤖🔄 Update Modules" --author "DashiumBot <dashium@outlook.fr>"
git pull --rebase
git push origin main

cd ..

rm -rf ./release