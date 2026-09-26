#!/usr/bin/env bash
# Keep a generated snapshot in THIS repository only. Never force-push.
set -eu
[ "$GITHUB_REPOSITORY" = 'jane-wang-art/jane-wang-art.github.io' ]
SITE_DIR="$GITHUB_WORKSPACE/public"
OUT=$(mktemp -d "$RUNNER_TEMP/jane-site.XXXXXX")
trap 'rm -rf "$OUT"' EXIT
git -C "$OUT" init -q -b gh-pages
git -C "$OUT" config user.name 'github-actions[bot]'
git -C "$OUT" config user.email '41898282+github-actions[bot]@users.noreply.github.com'
HEADER="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$GH_TOKEN" | base64 -w0)"
git -C "$OUT" config http.https://github.com/.extraheader "$HEADER"
git -C "$OUT" remote add origin "https://github.com/$GITHUB_REPOSITORY.git"
if git -C "$OUT" ls-remote --exit-code --heads origin gh-pages > /dev/null; then
  git -C "$OUT" fetch -q --depth=1 origin gh-pages
  git -C "$OUT" checkout -q -B gh-pages FETCH_HEAD
  git -C "$OUT" rm -q -r --ignore-unmatch .
fi
cp -a "$SITE_DIR/." "$OUT/"
git -C "$OUT" add --all
if ! git -C "$OUT" diff --cached --quiet; then
  git -C "$OUT" commit -q -m "site: Hexo build from ${GITHUB_SHA:0:7}"
  git -C "$OUT" push -q origin HEAD:gh-pages
fi
