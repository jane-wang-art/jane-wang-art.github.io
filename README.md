# Jane Wang · Illustrated Days

A custom **Hexo 8.1.0** blog and artwork gallery using **Soft Margin**: white, muted pink, generous spacing, and the artwork at the center.

Site address after activation: **https://jane-wang-art.github.io/**

Artwork by **Jane Wang**. Copyright © 2026 **jane-wang-art**. All rights reserved.
Original artwork: https://github.com/jane-wang-art/jane-frank-artwork

## Deployment

GitHub Pages is configured to publish with **GitHub Actions**. Pushes to `main` build, verify and deploy the Hexo site automatically. The workflow verifies the nine artwork files, internal routes, responsive layouts and browser rendering before deployment.

## Pages and features

- `/`: editorial homepage, featured comic, selected artwork, character introductions.
- `/gallery/`: all nine images, with keyboard/swipe-accessible large-image viewing.
- `/stories/autumn-terrace/`: the complete nine-image episode, with page anchors.
- `/archives/`: Hexo's chronological story archive.
- `/about/`: Jane, Frank and 墨宝; accurate AI-assisted production disclosure.
- `/licensing/`: paid-permission requirements and audience-visible author/source credit.
- Atom feed, sitemap, custom 404, responsive layouts and reduced-motion support.

No invented portfolio entries, email addresses, social profiles, newsletter forms or trackers. The original artwork repository and Frank's blog are unchanged.

## Build and preview locally (optional)

Use Node.js 22 and Python 3 with Pillow:

```sh
npm ci
python3 -m pip install Pillow==11.3.0
npm run build
npm run server
```

`tools/prepare_artworks.py` retrieves only the nine explicitly published PNGs from a pinned commit of the artwork archive. Each original is SHA-256 verified and retained unchanged. Two proportional WebP display derivatives are generated per image; no cropping, watermarking or redrawing occurs. The images and build cache are not committed to this source branch; generated images are included in the site output.

## Build architecture

`main` holds Hexo source and the dependency lockfile. `.github/workflows/pages.yml` installs locked dependencies, prepares artwork, builds Hexo, verifies local routes and image hashes, runs real Chromium desktop/mobile checks, saves the generated `gh-pages` snapshot, uploads a Pages artifact, and deploys it. Browser screenshots are retained as workflow artifacts for seven days.

No paid service, custom domain, tracking script or email collection is configured.

## Add a new story

Create a Markdown post in `source/_posts/` (or run `npm run new -- "Story title"`). A normal post works without a gallery. Add a meaningful description in its front matter.

For a new illustrated episode, first publish the approved images to the artwork archive. Add a series entry to `source/_data/gallery.json`: stable id, title, URL path, cover, ordered page metadata, source paths and SHA-256 hashes. Set the post's `gallery_key` to that id. Deliberately update `source_commit` after reviewing the archive version, and extend the gallery/reader test counts for the new collection. Never bulk-import rejected drafts or other artists' reference pages.

Theme colors and layout: `themes/soft-margin/source/css/style.css`.
Site title/URL: `_config.yml`. Page copy: `source/` and `themes/soft-margin/layout/`.

## Rights

Public access is for viewing, not a free-reuse license. Uses requiring permission require a separate written agreement, payment and visible credit to Jane Wang and the original artwork repository. See [LICENSE.md](LICENSE.md) and the website's licensing page. Do not relabel the artwork as open source or entirely hand-drawn.
