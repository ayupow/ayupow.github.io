# Asset sources

- `static/assets/img/seu-logo.png`: color university emblem extracted from Southeast University's official emblem sheet, https://www.seu.edu.cn/_upload/article/45/a3/5fcb5b774bf9834f977715922998/351bcc1e-9094-4f2e-81bf-310bcbeb5790.jpg (linked by https://www.seu.edu.cn/6/list.psp). The emblem was isolated from the sheet without changing its design or colors.
- `static/assets/img/nus-logo.svg`: NUS coat of arms, retrieved from Wikimedia's copy, https://upload.wikimedia.org/wikipedia/en/b/b9/NUS_coat_of_arms.svg . Official identity reference: https://nus.edu.sg/identity/ . The official site's image endpoints rejected automated retrieval; the locally stored asset is a copy of the university crest, not a newly drawn mark. University marks remain the property of their respective owners.
- Background, profile photo, activity photographs, and publication figures: retained from this repository. WebP derivatives and thumbnails are generated locally; original assets remain unchanged.

Research overviews are paraphrases of the linked publisher pages inside `publications.md`. No verified public summary was obtained for either conference paper, so those cards display figures only. Existing conference citation years and the supplied accepted label are retained; no new publication-status claims have been inferred.

## Local verification (2026-10-19)

Headless Chrome over a local HTTP server at viewport widths 1440, 768, and 375 pixels:

- Seven paper cards, six awards, and three education/visit cards retained.
- No horizontal overflow, missing images, or uncaught JavaScript exceptions.
- All 22 expanded publication figures decoded successfully; collapsed galleries had no image `src` and made no gallery image requests.
- Mobile menu opens and closes after selecting a section. External HTTP links have `target="_blank"` and `rel="noopener noreferrer"`.
- Full animation cycle observed (7 → 0 → 1 → … → 7 words); heading height remained unchanged. Reduced-motion mode shows all seven words.
- No external network requests are needed for the initial homepage render; school marks and image derivatives are local.
- Simulated configuration and publication-fetch failures: the publication section shows its error message while education, awards, and fallback animation remain functional.
- Desktop and mobile screenshots visually inspected. Live GitHub Pages deployment and real-world network latency were not tested; this change was prepared locally only.

Measured file sizes: profile photo 1,801,033 → 30,846 bytes; background 923,892 → 206,520 bytes. The seven displayed paper thumbnails total 98,520 bytes. Original paper PNGs total 26,093,737 bytes and are only opened on request.

## Follow-up refinements (2026-10-19)

Removed section eyebrow labels and the redundant research-interest sentence; slowed words to 500 ms; added GitHub and ER2 joint-training details supplied by the author. Added the sixth journal article, giving eight papers total. IF/JCR/Nature Index labels are supplied by the author, not independently updated metrics. Local Chrome checks at 1440/768/375 px confirmed eight cards, no overflow or broken images, functional menus and deferred figures. `contents/small figs/` was empty during this update: existing figure thumbnails remain until the supplied journal covers are available; cover styling is prepared.

Journal covers supplied by the author in `contents/small figs/`: 15-29-02 → Sustainable Cities and Society (both papers); 15-29-15 → Expert Systems with Applications; 15-29-37 → Energy and Buildings; 15-30-56 → Engineering, Construction and Architectural Management. Local WebP derivatives are used for the five matching journal cards. These are journal identifiers, not claims that the shown cover corresponds to a particular paper issue. The Chinese journal card has no supplied cover and remains text-only.

Follow-up: supplied SEU journal cover (`2026-10-19 15-32-43屏幕截图.png`) and I3CE banners (`11111.webp` for 2024; `host255689594.jpg` for 2026) replace remaining thumbnails. The supplied SEU cover identifies the journal and is not the cited 2026 issue. Removed Nature Index from the 2024 SCS card. Four papers with Wang following supervisor Zhou carry the author-supplied label “First (after my supervisor) author”.
