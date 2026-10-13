'use strict';

// Values transcribed from Tables 1, 3 and 4 of the supplied preprint.
// Each Table 1 row contains seven benchmark scores followed by the reported mean.
const experimentData = {
  qwen8: { name: 'Qwen3-VL-8B', rows: {
    'Zero-shot': [.735,.238,.473,.554,.528,.462,.293,.469],
    'Random': [.728,.259,.482,.527,.540,.449,.562,.507],
    'MMICES': [.743,.278,.495,.583,.543,.485,.695,.546],
    'ContextNav': [.764,.295,.527,.605,.558,.510,.761,.574],
    'LSD': [.779,.308,.519,.629,.552,.518,.784,.584],
    'ProMSA': [.819,.326,.546,.684,.575,.561,.873,.626],
    'ActICL · 4-shot': [.837,.365,.571,.721,.603,.594,.902,.656],
    'ActICL · adaptive': [.859,.378,.578,.739,.616,.620,.887,.668]
  }},
  qwen30: { name: 'Qwen3-VL-30B-A3B', rows: {
    'Zero-shot': [.819,.286,.512,.582,.585,.495,.351,.519],
    'Random': [.832,.324,.497,.579,.592,.480,.538,.549],
    'MMICES': [.851,.308,.508,.594,.597,.492,.746,.585],
    'ContextNav': [.863,.335,.536,.616,.618,.521,.825,.616],
    'LSD': [.865,.352,.529,.624,.642,.529,.803,.621],
    'ProMSA': [.892,.388,.573,.694,.660,.565,.894,.667],
    'ActICL · 4-shot': [.922,.430,.602,.739,.693,.597,.910,.699],
    'ActICL · adaptive': [.928,.445,.623,.728,.726,.618,.904,.710]
  }},
  qwen9: { name: 'Qwen3.5-9B', rows: {
    'Zero-shot': [.824,.343,.675,.674,.728,.617,.376,.605],
    'Random': [.853,.358,.683,.692,.751,.635,.628,.657],
    'MMICES': [.859,.366,.680,.705,.759,.649,.814,.690],
    'ContextNav': [.870,.387,.702,.732,.781,.673,.877,.717],
    'LSD': [.868,.396,.697,.719,.785,.675,.845,.712],
    'ProMSA': [.908,.405,.736,.728,.829,.714,.889,.744],
    'ActICL · 4-shot': [.935,.427,.751,.778,.862,.737,.913,.772],
    'ActICL · adaptive': [.929,.468,.788,.794,.870,.760,.921,.790]
  }}
};
const transferData = {
  qwen397: { MMICES: [.472,.492,.761], ContextNav: [.487,.524,.772], ActICL: [.500,.545,.780] },
  luna: { MMICES: [.568,.634,.802], ContextNav: [.590,.669,.809], ActICL: [.615,.697,.820] },
  sol: { MMICES: [.636,.728,.844], ContextNav: [.643,.740,.849], ActICL: [.674,.765,.874] }
};
const ablations = { 'Base': .582, 'SFT only': .657, 'Joint RL only': .636, 'w/o acquisition': .689, 'w/o answering': .684, 'ActICL': .709 };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const percentage = (v) => (v * 100).toFixed(1);
let setting = 'adaptive';

function bar(label, value, variant = '') {
  const row = document.createElement('div');
  row.className = `bar-row ${variant}`;
  row.innerHTML = `<span class="bar-label"></span><div class="bar-track" aria-hidden="true"><span class="bar-fill"></span></div><span class="bar-value"></span>`;
  row.querySelector('.bar-label').textContent = label;
  row.querySelector('.bar-fill').style.width = `${percentage(value)}%`;
  row.querySelector('.bar-value').textContent = percentage(value);
  return row;
}
function renderResults() {
  const model = experimentData[$('#model-select').value];
  const selected = setting === 'adaptive' ? 'ActICL · adaptive' : 'ActICL · 4-shot';
  $('#result-title').textContent = `${setting === 'adaptive' ? 'Adaptive' : '4-shot'} · ${model.name}`;
  $('#result-protocol').textContent = setting === 'adaptive'
    ? 'ActICL chooses its demonstration count. All retrieval baselines use four demonstrations.'
    : 'All compared retrieval methods use four demonstrations. Acquisition compute is not matched.';
  $('#result-bars').replaceChildren(...['MMICES','ContextNav','LSD','ProMSA',selected].map((name) => bar(name, model.rows[name][7], name === selected ? 'ours' : name === 'ProMSA' ? 'strong' : '')));
  const gain = percentage(model.rows[selected][7] - model.rows.MMICES[7]);
  const vsPromsa = percentage(model.rows[selected][7] - model.rows.ProMSA[7]);
  $('#result-gain').innerHTML = `+${gain}<span> pp</span>`;
  $('#result-baseline-gain').textContent = `+${vsPromsa} pp`;
  $('#detail-caption').textContent = `Table 1 · ${model.name} · scores in percent`;
  const tableRows = Object.entries(model.rows).map(([name, values]) => {
    const row = document.createElement('tr');
    if (name === selected) row.className = 'highlight';
    const label = document.createElement('th'); label.scope = 'row'; label.textContent = name; row.append(label);
    values.forEach((v) => { const cell = document.createElement('td'); cell.textContent = percentage(v); row.append(cell); });
    return row;
  });
  $('#detail-table').replaceChildren(...tableRows);
}
$$('[data-setting]').forEach((button) => button.addEventListener('click', () => {
  setting = button.dataset.setting;
  $$('[data-setting]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
  renderResults();
}));
$('#model-select').addEventListener('change', renderResults);
function renderTransfer() {
  $('#transfer-table').replaceChildren(...Object.entries(transferData[$('#transfer-select').value]).map(([name, values]) => {
    const row = document.createElement('tr');
    if (name === 'ActICL') row.className = 'highlight';
    const label = document.createElement('th'); label.scope = 'row'; label.textContent = name; row.append(label);
    values.forEach((v) => { const cell = document.createElement('td'); cell.textContent = percentage(v); row.append(cell); });
    return row;
  }));
}
$('#transfer-select').addEventListener('change', renderTransfer);
renderResults(); renderTransfer();
$('#ablation-bars').replaceChildren(...Object.entries(ablations).map(([name, value]) => bar(name, value, name === 'ActICL' ? 'ours' : '')));

// The walkthrough is an explicitly illustrative, authored explanation of Figure 1.
// It does not call or simulate a live model prediction.
const scenes = [
  { title: 'Start with the information gap.', detail: 'The agent reasons about what its current context is missing.', status: 'Identify the gap', action: '', reason: 'A similar-looking chart is a start. Which examples will teach the skills this question needs?', cards: ['unseen','unseen','unseen'], labels: ['Candidate','Candidate','Not retrieved yet'], kept: [] },
  { title: 'Search with a purpose.', detail: 'The agent can retrieve by image, by text, or through joint retrieval.', status: 'Search', action: 'search', reason: 'Start with grouped bar charts. Look for examples that explain the colored series and how to read their values.', cards: ['','','unseen'], labels: ['Preview available','Preview available','Not retrieved yet'], kept: [] },
  { title: 'Inspect before retaining.', detail: 'Reading reveals each complete input–output demonstration.', status: 'Read → curate', action: 'read', reason: 'Read #1 and #2. They cover series mapping and individual values. Add both to the context—but percentage change is still missing.', cards: ['retained','retained','unseen'], labels: ['Read · retained','Read · retained','Not retrieved yet'], kept: [1,2] },
  { title: 'Let the next goal evolve.', detail: 'A new search targets the specific skill the current context still lacks.', status: 'Search → read', action: 'search', reason: 'Search for questions about percentage growth. Read #7: it teaches both value reading and comparing year-over-year change.', cards: ['retained','retained','read'], labels: ['Retained','Retained','Read · new skill'], kept: [1,2] },
  { title: 'Keep the skill. Remove the overlap.', detail: 'Curation can replace a redundant demonstration, even when the context is full.', status: 'Curate', action: 'curate', reason: '#7 already covers the value-reading skill in #2. Keep #1 and #7; remove #2 from the retained context.', cards: ['retained','removed','retained'], labels: ['Retained','Removed · redundant','Retained'], kept: [1,7] },
  { title: 'Commit the context. Then answer.', detail: 'The same model—or a different answering model—receives the retained demonstrations.', status: 'Solve', action: 'solve', reason: 'Series mapping and percentage growth are now covered. Commit the context and answer with the two complementary examples.', cards: ['retained','removed','retained'], labels: ['Final context','Available, not kept','Final context'], kept: [1,7] }
];
let currentScene = 0, playing = false, demoTimer;
function showScene(index) {
  currentScene = index;
  const scene = scenes[index];
  $('#scene-counter').textContent = `${String(index + 1).padStart(2,'0')} / 06`;
  $('#scene-title').textContent = scene.title;
  $('#scene-detail').textContent = scene.detail;
  $('#scene-reason').textContent = scene.reason;
  $('#agent-status').textContent = scene.status;
  $('#context-count').textContent = `${scene.kept.length} retained`;
  $$('[data-action]').forEach((el) => el.classList.toggle('active', el.dataset.action === scene.action));
  $$('.demo-card').forEach((el, i) => { el.className = `demo-card ${scene.cards[i]}`; el.querySelector('.card-status').textContent = scene.labels[i]; });
  $('#retained-context').replaceChildren(...(scene.kept.length ? scene.kept.map((id) => {
    const chip = document.createElement('span'); chip.className = 'context-token';
    chip.textContent = ({1:'#1 Series mapping',2:'#2 Value reading',7:'#7 Percentage growth'})[id];
    return chip;
  }) : [Object.assign(document.createElement('span'), {className:'empty-context',textContent:'Waiting for useful examples…'})]));
  $('#query-result').classList.toggle('visible', index === 5);
  $$('[data-scene]').forEach((button) => button.setAttribute('aria-pressed',String(Number(button.dataset.scene) === index)));
}
function setPlaying(value) {
  playing = value; clearInterval(demoTimer);
  $('#play-demo').setAttribute('aria-label', value ? 'Pause walkthrough' : 'Play walkthrough');
  $('#play-symbol').textContent = value ? 'Ⅱ' : '▶';
  $('#play-label').textContent = value ? 'Pause' : 'Play';
  if (value) {
    if (currentScene === scenes.length - 1) showScene(0);
    demoTimer = setInterval(() => { if (currentScene < scenes.length - 1) showScene(currentScene + 1); else setPlaying(false); }, 5500);
  }
}
$('#play-demo').addEventListener('click', () => setPlaying(!playing));
$('#replay-demo').addEventListener('click', () => { showScene(0); setPlaying(true); });
$$('[data-scene]').forEach((button) => button.addEventListener('click', () => { setPlaying(false); showScene(Number(button.dataset.scene)); }));
showScene(0);
document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });

const menu = $('.menu-toggle');
function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); $('#nav-links').classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('#nav-links').classList.toggle('open',open); });
$$('#nav-links a').forEach((a) => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) $$('#nav-links a').forEach((a) => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); });
},{rootMargin:'-15% 0px -60% 0px',threshold:0});
['overview','method','results','citation'].forEach((id) => navObserver.observe(document.getElementById(id)));

$('#copy-citation').addEventListener('click', async () => {
  const text = $('#bibtex').textContent;
  const label = $('#copy-citation span');
  try {
    await navigator.clipboard.writeText(text);
    label.textContent = 'Copied!'; $('#copy-status').textContent = 'BibTeX copied to clipboard.';
    setTimeout(() => { label.textContent = 'Copy BibTeX'; }, 2200);
  } catch {
    const range = document.createRange(); range.selectNodeContents($('#bibtex'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    label.textContent = 'Selected — press ⌘/Ctrl+C';
    $('#copy-status').textContent = 'Clipboard unavailable. Citation selected; press Command C or Control C to copy.';
  }
});
