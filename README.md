# ActICL project page

Buildless, responsive research project page inspired by the FORGE project page. All paper content is based on the supplied `ICLR2027__Copy_.pdf` preprint (31 pages), with its four named authors.

## Preview locally

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. No build or package installation is required. `dist/` can also be deployed to GitHub Pages or any static host. The source paper is included as `dist/assets/ActICL.pdf`.

## Files

- `dist/index.html`: page content, paper links, author information, and citation.
- `dist/style.css`: visual design and responsive layouts.
- `dist/app.js`: six-scene walkthrough, model/setting selectors, result tables, and citation copying.
- `dist/assets/`: paper PDF, cropped original Figures 1 and 2, and vector identity assets.

## Content and data provenance

- Table 1, page 7: all three backbones and eight method rows, including reported averages. The bar chart displays MMICES, ContextNav, LSD, ProMSA, and the selected ActICL setting. The expanded table preserves all rows.
- Table 3, page 8: three retrieval methods, three answering models, and three benchmarks.
- Table 4, page 9: training-stage ablation, Qwen3.5-9B adaptive setting.
- Figure 4, page 9: 2.8 percentage-point average drop with a fixed retrieval goal.
- The +11.6, +4.4, +3.5 and +2.2 percentage-point aggregate claims follow the abstract/introduction. Small rounding differences can occur when recomputing from published three-decimal table values.
- The walkthrough is an illustrative reconstruction of Figure 1, with explicit synthetic chart values. It is neither a live model nor an observed experimental trajectory.
- Fixed-shot comparisons match demonstration counts, not compute. The page makes no token-saving claim against one-pass retrieval.

There are no invented code, arXiv, author-profile, or dataset URLs. Add the actual public links when available. Citation year is the supplied preprint's current year (2026); no acceptance claim is made.

## Hosting

`.openai/hosting.json` records the private Site identity. Preserve its project ID on future deployments. Google Fonts are optional; the site falls back to system fonts when unavailable.
