# Jane Wang · Illustrated Days

A custom **Hexo 8.1.0** blog and artwork gallery, using the **Soft Margin** theme: white, muted pink, plenty of breathing room, and the artwork at the center.

Site address: **https://jane-wang-art.github.io/**

Artwork by **Jane Wang**. Copyright © 2026 **jane-wang-art**. All rights reserved.
Original artwork: https://github.com/jane-wang-art/jane-frank-artwork

## Pages and features

- `/`: editorial homepage, featured comic, selected artwork, character introductions.
- `/gallery/`: all nine images, with keyboard/swipe-accessible large-image viewing.
- `/stories/autumn-terrace/`: the complete nine-image episode, with page anchors.
- `/archives/`: Hexo's chronological story archive.
- `/about/`: Jane, Frank and 墨宝; accurate AI-assisted production disclosure.
- `/licensing/`: paid-permission requirements and audience-visible author/source credit.
- Atom feed, sitemap, custom 404 page, responsive layouts and reduced-motion support.

No invented portfolio entries, email addresses, social profiles or newsletter forms. The original artwork repository and Frank's blog are not modified by this project.

## Build and preview

Use Node.js 22 and Python 3 with Pillow:

```sh
npm ci
python3 -m pip install Pillow==11.3.0
npm run build
npm run server
```

On the initial bootstrap before a lockfile exists, use `npm install --ignore-scripts` once. The build workflow saves `package-lock.json`; later builds use `npm ci`.

`tools/prepare_artworks.py` downloads only the nine explicitly published PNGs from a pinned commit of the artwork archive. Each original is checked against its SHA-256 hash and preserved unchanged. Two proportional WebP display derivatives are generated per image; no cropping, watermarking or redrawing is performed. The originals and build-time image cache are not committed to this source branch.

## Publishing

`main` holds Hexo source. `.github/workflows/pages.yml` installs locked dependencies, prepares artwork, builds Hexo, checks every local route and image hash, runs desktop/mobile browser tests, saves the generated `gh-pages` snapshot, and deploys a GitHub Pages artifact.

GitHub Pages must be enabled with **Settings → Pages → Source → GitHub Actions**. The workflow attempts enablement, but a connection without repository administration access may require the owner to make this one-time setting. A successful build alone is not confirmation of a live site; check the deployment job and website.

No paid service, custom domain, tracking script or email collection is configured.

## Add a new story

Create a Markdown post in `source/_posts/` (or run `npm run new -- "Story title"`). A normal post works without a gallery. Put an excerpt before `<!-- more -->` and a meaningful `description` in its front matter.

For an illustrated episode, first publish the owner-approved images to the artwork archive. Add its series entry to `source/_data/gallery.json`, including a stable id, title, URL path, cover, ordered page metadata, original paths and SHA-256 hashes. Set `gallery_key` in the post to that id. Update `source_commit` deliberately after verifying the new published archive version. Never bulk-import rejected drafts or other artists' reference pages.

Colors, spacing and responsive layout: `themes/soft-margin/source/css/style.css`.
Site name/URL: `_config.yml`. Page copy: `source/` and `themes/soft-margin/layout/`.

## Rights

Public access is for viewing, not a free-reuse license. Uses requiring permission require a separate written agreement, payment of the agreed fee and visible credit to Jane Wang and the original artwork repository. See [LICENSE.md](LICENSE.md) and the website's licensing page. Do not relabel the artwork as open source or entirely hand-drawn.
