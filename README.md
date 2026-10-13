# ActICL project page

Buildless, responsive research project page inspired by the FORGE project page. All paper content is based on the supplied `ICLR2027__Copy_.pdf` preprint (31 pages), with its four named authors.

## Project website

**[Open the ActICL project page](https://kaamava.github.io/acticl-project-page/)**

## Preview locally

```sh
python3 -m http.server 4173 --directory docs
```

Open `http://localhost:4173`. No build or package installation is required. `docs/` is the complete static website. The source paper is included as `docs/assets/ActICL.pdf`.

## Files

- `docs/index.html`: page content, paper links, author information, and citation.
- `docs/style.css`: visual design and responsive layouts.
- `docs/app.js`: six-scene walkthrough, model/setting selectors, result tables, and citation copying.
- `docs/assets/`: paper PDF, cropped original Figures 1 and 2, and vector identity assets.

## Content and data provenance

- Table 1, page 7: all three backbones and eight method rows, including reported averages. The bar chart displays MMICES, ContextNav, LSD, ProMSA, and the selected ActICL setting. The expanded table preserves all rows.
- Table 3, page 8: three retrieval methods, three answering models, and three benchmarks.
- Table 4, page 9: training-stage ablation, Qwen3.5-9B adaptive setting.
- Figure 4, page 9: 2.8 percentage-point average drop with a fixed retrieval goal.
- The +11.6, +4.4, +3.5 and +2.2 percentage-point aggregate claims follow the abstract/introduction. Small rounding differences can occur when recomputing from published three-decimal table values.
- The walkthrough is an illustrative reconstruction of Figure 1, with explicit synthetic chart values. It is neither a live model nor an observed experimental trajectory.
- Fixed-shot comparisons match demonstration counts, not compute. The page makes no token-saving claim against one-pass retrieval.

There are no invented code, arXiv, author-profile, or dataset URLs. Add the actual public links when available. Citation year is the supplied preprint's current year (2026); no acceptance claim is made.

The arXiv, Code, and Hugging Face buttons currently have empty `href` values and keep visitors on the same page when clicked. Add their public URLs in `docs/index.html` when ready; update both arXiv links (navigation and hero). BibTeX links to the citation section. The PDF remains in the assets folder, but the page no longer links to it.

## Hosting

GitHub Pages is configured to **Deploy from a branch → main → /docs**. Future commits to `main` update the website automatically after the Pages deployment completes. Keep the publishing directory set to `/docs`, where `index.html` and the website assets live.

The website does not require an `.openai` directory or a build step. The previous Sites hosting metadata has been removed and `.openai/` is ignored by Git. Google Fonts are optional; the site falls back to system fonts when unavailable.
