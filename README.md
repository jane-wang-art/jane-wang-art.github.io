# Jane Wang · Illustrated Days

A custom **Hexo 8.1.0** blog and artwork gallery using **Soft Margin**: white, muted pink, generous spacing, and the artwork at the center.

Site address after activation: **https://jane-wang-art.github.io/**

Artwork by **Jane Wang**. Copyright © 2026 **jane-wang-art**. All rights reserved.
Original artwork: https://github.com/jane-wang-art/jane-frank-artwork

## One-time GitHub Pages activation

The Hexo build, nine original-image integrity checks, internal-link checks, and desktop/mobile browser tests passed on 26 September 2026. The generated website is saved on `gh-pages`. The first deployment was blocked specifically because Pages was not enabled and the connected app could not create a Pages site: `Resource not accessible by integration`.

The repository owner or maintainer needs to make this one-time setting:

1. Open [this repository's Pages settings](https://github.com/jane-wang-art/jane-wang-art.github.io/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions**. No new workflow template is needed.
3. Open [Build and publish Hexo gallery](https://github.com/jane-wang-art/jane-wang-art.github.io/actions/workflows/pages.yml), choose **Run workflow**, and run it on `main`.

The workflow already builds and deploys the complete site. Do not upload the pictures again or run any local commands just to publish. After activation, subsequent source commits publish automatically. A passing build is not by itself proof that Pages deployment succeeded; check the deploy job and actual site URL.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

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
