import React, { useEffect, useMemo, useRef, useState } from 'react';

const defaultImage = '';

const defects = [
  { value: 'Goresan (Scratch)', icon: 'ri-brush-line', tone: 'red' },
  { value: 'Retak (Crack)', icon: 'ri-git-branch-line', tone: 'amber' },
  { value: 'Noda (Stain)', icon: 'ri-contrast-drop-line', tone: 'violet' },
  { value: 'Sobek (Tear)', icon: 'ri-scissors-cut-line', tone: 'cyan' },
];

const galleryItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  image: defaultImage,
  confidence: `${94 + (i % 4)}%`,
  x: 420 + i * 3,
  y: 286 + i * 2,
}));


const translations = {
  en: {
    brandSubtitle: 'AI DATA AUGMENTATION · SYNTHETIC DEFECT GENERATOR',
    project: 'PROJECT',
    ready: 'READY',
    serverGpu: 'SERVER / GPU',
    connected: 'CONNECTED',
    settings: 'Settings',
    toggleTheme: 'Toggle theme',

    filesSuffix: 'FILES',
    baselineData: 'BASELINE DATA',
    normalProduct: 'NORMAL PRODUCT',
    defectReferences: 'DEFECT REFERENCES',
    dropImages: 'Drop images here',
    orClickBrowse: 'or click to browse · JPG / PNG / WEBP',
    imagesLoaded: (n) => `${n} image${n > 1 ? 's' : ''} loaded`,
    baselineValidated: 'Baseline dataset validated',

    generation: 'GENERATION',
    defectType: 'DEFECT TYPE',
    targetDataset: 'TARGET DATASET',
    imagesUnit: 'IMAGES',
    qualityProfile: 'QUALITY PROFILE',
    defaultEpoch: 'DEFAULT EPOCH',
    generateBtn: 'GENERATE SYNTHETIC DATA',
    generatingBtn: 'GENERATING…',
    estimatedTime: 'Estimated time',

    mainCanvas: 'MAIN CANVAS',
    inspectionView: 'INSPECTION VIEW',
    livePreview: 'LIVE PREVIEW',
    label: 'LABEL',
    boundingBox: 'BOUNDING BOX',
    realismScore: 'REALISM SCORE',
    epoch: 'EPOCH',
    prev: 'Prev',
    next: 'Next',
    epochEvolution: 'EPOCH EVOLUTION',
    scrubber: 'SCRUBBER',
    stageNoise: 'Noise',
    stageFinal: 'Final',
    stageCurrent: 'Current',
    stageRefined: 'Refined',
    viewHeatmap: 'View Heatmap',
    toggleLabels: 'Toggle Labels',
    labels: 'Labels',
    on: 'ON',
    off: 'OFF',

    liveOutput: 'LIVE OUTPUT',
    generatedSuffix: 'GENERATED',
    resultGrid: 'RESULT GRID',
    page: 'PAGE',
    totalGenerated: 'Total Generated:',
    qualityMetrics: 'QUALITY METRICS',
    realism: 'REALISM',
    excellent: 'EXCELLENT',
    diversity: 'DIVERSITY',
    high: 'HIGH',
    veryGood: 'VERY GOOD',
    dataBalance: 'DATA BALANCE',
    optimal: 'OPTIMAL',
    exportFactory: 'EXPORT & FACTORY AI',
    annotationFormat: 'ANNOTATION FORMAT',
    imagesWord: 'Images',
    annotations: 'Annotations',
    classes: 'Classes',
    exportDataset: 'EXPORT DATASET',
    pushFactory: 'PUSH TO FACTORY AI',

    settingsTitle: 'Settings',
    settingsKicker: 'GENESIS SYSTEM',
    settingsDesc: 'Global configuration for generation, dataset delivery, and factory connectivity.',
    groupAiGeneration: 'AI GENERATION',
    groupDatasetExport: 'DATASET & EXPORT',
    groupHardware: 'HARDWARE',
    groupInspectionView: 'INSPECTION VIEW',
    groupLanguage: 'LANGUAGE',

    defaultAnnotationFormat: 'DEFAULT ANNOTATION FORMAT',
    confirmBeforeExport: 'CONFIRM BEFORE EXPORT',
    autoSaveProject: 'AUTO SAVE PROJECT',
    genQualityNote: 'Advanced generation quality is kept here so the main workspace stays focused on inspection.',

    processingDevice: 'PROCESSING DEVICE',
    genesisServer: 'GENESIS SERVER',
    factoryEndpoint: 'FACTORY AI ENDPOINT',
    apiEndpoint: 'API ENDPOINT',

    showLabelsDefault: 'SHOW LABELS BY DEFAULT',
    themeNote: 'Theme switching remains in the header for quick access.',

    displayLanguage: 'DISPLAY LANGUAGE',
    languageNote: 'Switches all interface text. Technical values (formats, hardware options) stay in English.',

    cancel: 'CANCEL',
    saveChanges: 'SAVE CHANGES',

    msgReady: 'System ready for generation',
    msgGenerating: 'Genesis is generating synthetic defect variations…',
    msgGenerated: (n) => `${n.toLocaleString()} synthetic images generated successfully`,
    msgExported: (format, n) => `Dataset prepared as ${format} · ${n.toLocaleString()} images`,
    msgPushed: 'Dataset queued for Factory AI pipeline',
    msgSettingsSaved: 'Genesis settings saved successfully',
  },
  id: {
    brandSubtitle: 'AUGMENTASI DATA AI · GENERATOR CACAT SINTETIS',
    project: 'PROYEK',
    ready: 'SIAP',
    serverGpu: 'SERVER / GPU',
    connected: 'TERHUBUNG',
    settings: 'Pengaturan',
    toggleTheme: 'Ubah tema',

    filesSuffix: 'FILE',
    baselineData: 'DATA DASAR',
    normalProduct: 'PRODUK NORMAL',
    defectReferences: 'REFERENSI CACAT',
    dropImages: 'Letakkan gambar di sini',
    orClickBrowse: 'atau klik untuk memilih · JPG / PNG / WEBP',
    imagesLoaded: (n) => `${n} gambar dimuat`,
    baselineValidated: 'Dataset dasar telah tervalidasi',

    generation: 'GENERASI',
    defectType: 'JENIS CACAT',
    targetDataset: 'TARGET DATASET',
    imagesUnit: 'GAMBAR',
    qualityProfile: 'PROFIL KUALITAS',
    defaultEpoch: 'EPOCH DEFAULT',
    generateBtn: 'BUAT DATA SINTETIS',
    generatingBtn: 'MEMBUAT…',
    estimatedTime: 'Estimasi waktu',

    mainCanvas: 'KANVAS UTAMA',
    inspectionView: 'TAMPILAN INSPEKSI',
    livePreview: 'PRATINJAU LANGSUNG',
    label: 'LABEL',
    boundingBox: 'KOTAK BATAS',
    realismScore: 'SKOR REALISME',
    epoch: 'EPOCH',
    prev: 'Sebelumnya',
    next: 'Berikutnya',
    epochEvolution: 'EVOLUSI EPOCH',
    scrubber: 'PENGGULIR',
    stageNoise: 'Derau',
    stageFinal: 'Akhir',
    stageCurrent: 'Saat Ini',
    stageRefined: 'Disempurnakan',
    viewHeatmap: 'Lihat Heatmap',
    toggleLabels: 'Alihkan Label',
    labels: 'Label',
    on: 'AKTIF',
    off: 'NONAKTIF',

    liveOutput: 'KELUARAN LANGSUNG',
    generatedSuffix: 'DIBUAT',
    resultGrid: 'GRID HASIL',
    page: 'HALAMAN',
    totalGenerated: 'Total Dibuat:',
    qualityMetrics: 'METRIK KUALITAS',
    realism: 'REALISME',
    excellent: 'SANGAT BAIK',
    diversity: 'DIVERSITAS',
    high: 'TINGGI',
    veryGood: 'SANGAT BAIK',
    dataBalance: 'KESEIMBANGAN DATA',
    optimal: 'OPTIMAL',
    exportFactory: 'EKSPOR & FACTORY AI',
    annotationFormat: 'FORMAT ANOTASI',
    imagesWord: 'Gambar',
    annotations: 'Anotasi',
    classes: 'Kelas',
    exportDataset: 'EKSPOR DATASET',
    pushFactory: 'KIRIM KE FACTORY AI',

    settingsTitle: 'Pengaturan',
    settingsKicker: 'SISTEM GENESIS',
    settingsDesc: 'Konfigurasi global untuk generasi, pengiriman dataset, dan konektivitas pabrik.',
    groupAiGeneration: 'GENERASI AI',
    groupDatasetExport: 'DATASET & EKSPOR',
    groupHardware: 'PERANGKAT KERAS',
    groupInspectionView: 'TAMPILAN INSPEKSI',
    groupLanguage: 'BAHASA',

    defaultAnnotationFormat: 'FORMAT ANOTASI DEFAULT',
    confirmBeforeExport: 'KONFIRMASI SEBELUM EKSPOR',
    autoSaveProject: 'SIMPAN OTOMATIS PROYEK',
    genQualityNote: 'Kualitas generasi lanjutan disimpan di sini agar ruang kerja utama tetap fokus pada inspeksi.',

    processingDevice: 'PERANGKAT PEMROSESAN',
    genesisServer: 'SERVER GENESIS',
    factoryEndpoint: 'ENDPOINT FACTORY AI',
    apiEndpoint: 'API ENDPOINT',

    showLabelsDefault: 'TAMPILKAN LABEL SECARA DEFAULT',
    themeNote: 'Pengalihan tema tetap berada di header untuk akses cepat.',

    displayLanguage: 'BAHASA TAMPILAN',
    languageNote: 'Mengubah seluruh teks antarmuka. Nilai teknis (format, opsi perangkat keras) tetap dalam bahasa Inggris.',

    cancel: 'BATAL',
    saveChanges: 'SIMPAN PERUBAHAN',

    msgReady: 'Sistem siap untuk generasi',
    msgGenerating: 'Genesis sedang membuat variasi cacat sintetis…',
    msgGenerated: (n) => `${n.toLocaleString('id-ID')} gambar sintetis berhasil dibuat`,
    msgExported: (format, n) => `Dataset disiapkan sebagai ${format} · ${n.toLocaleString('id-ID')} gambar`,
    msgPushed: 'Dataset diantrekan untuk pipeline Factory AI',
    msgSettingsSaved: 'Pengaturan Genesis berhasil disimpan',
  },
};

function resolveMessage(status, t) {
  switch (status.key) {
    case 'generating':
      return t.msgGenerating;
    case 'generated':
      return t.msgGenerated(status.count);
    case 'exported':
      return t.msgExported(status.format, status.count);
    case 'pushed':
      return t.msgPushed;
    case 'settingsSaved':
      return t.msgSettingsSaved;
    case 'ready':
    default:
      return t.msgReady;
  }
}

function SectionTitle({ title, meta }) {
  return (
    <div className="section-title">
      <div className="section-title-main">
        <span>{title}</span>
      </div>
      {meta && <span className="section-meta">{meta}</span>}
    </div>
  );
}

function MetricCard({ icon, label, value, note, accent }) {
  return (
    <div className={`metric-card ${accent}`}>
      <div className="metric-icon"><i className={icon} /></div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-note">{note}</div>
      </div>
    </div>
  );
}

function UploadZone({ label, count, files, onFiles, inputRef, t }) {
  const openPicker = () => inputRef.current?.click();
  const handleDrop = (event) => {
    event.preventDefault();
    const incoming = Array.from(event.dataTransfer.files || []);
    if (incoming.length) onFiles(incoming);
  };

  return (
    <div className="upload-block">
      <div className="upload-label-row">
        <span>{label}</span>
        <span className="count-badge">{files.length || count}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => onFiles(Array.from(e.target.files || []))}
      />
      <button
        className="upload-zone"
        onClick={openPicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="upload-icon"><i className="ri-upload-cloud-2-line" /></div>
        <strong>{files.length ? t.imagesLoaded(files.length) : t.dropImages}</strong>
        <span>{t.orClickBrowse}</span>
      </button>
      {files.length > 0 && (
        <div className="mini-file-row">
          {files.slice(0, 5).map((file) => (
            <div className="mini-file" key={`${file.name}-${file.lastModified}`} title={file.name}>
              <i className="ri-image-2-line" />
            </div>
          ))}
          {files.length > 5 && <span className="more-files">+{files.length - 5}</span>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState('id');
  const t = translations[language];

  const [selectedModel, setSelectedModel] = useState('Detect mistake');
  const [selectedDefect, setSelectedDefect] = useState('Goresan (Scratch)');
  const [epoch, setEpoch] = useState(49);
  const [targetImages, setTargetImages] = useState('1,000');
  const [showLabels, setShowLabels] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(1000);
  const [format, setFormat] = useState('YOLO (.txt)');
  const [normalFiles, setNormalFiles] = useState([]);
  const [defectFiles, setDefectFiles] = useState([]);
  const [selectedResult, setSelectedResult] = useState(0);
  const [status, setStatus] = useState({ key: 'ready' });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [confirmExport, setConfirmExport] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('High');
  const [defaultEpoch, setDefaultEpoch] = useState(49);
  const [defaultFormat, setDefaultFormat] = useState('YOLO (.txt)');
  const [apiEndpoint, setApiEndpoint] = useState('factory-ai.local/api/v1');
  const [gpuMode, setGpuMode] = useState('Auto Select');

  const normalInputRef = useRef(null);
  const defectInputRef = useRef(null);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentDefect = useMemo(
    () => defects.find((item) => item.value === selectedDefect) || defects[0],
    [selectedDefect]
  );

  const previewImage = normalFiles[0] ? URL.createObjectURL(normalFiles[0]) : defaultImage;
  const message = resolveMessage(status, t);

  const handleGenerate = () => {
    setIsGenerating(true);
    setStatus({ key: 'generating' });
    window.setTimeout(() => {
      setIsGenerating(false);
      const value = Number(String(targetImages).replace(/,/g, '')) || 1000;
      setGenerated(value);
      setStatus({ key: 'generated', count: value });
    }, 1400);
  };

  const handleExport = () => {
    setStatus({ key: 'exported', format, count: generated });
  };

  const handlePush = () => {
    setStatus({ key: 'pushed' });
  };

  const handleSaveSettings = () => {
    setEpoch(defaultEpoch);
    setFormat(defaultFormat);
    setShowLabels(showLabels);
    setStatus({ key: 'settingsSaved' });
    setIsSettingsOpen(false);
  };

  return (
    <div className={`genesis-shell ${isDark ? 'dark' : ''}`}>
        <header className="topbar glass-panel">
          <div className="brand-block">
            <div className="brand-mark">
              <img src="/genesis-logo-mark.png" alt="GENESIS AI logo" />
            </div>
            <div>
              <div className="brand-name">GENESIS <span>AI</span></div>
              <div className="brand-subtitle">{t.brandSubtitle}</div>
            </div>
          </div>

          <div className="project-strip">
            <div className="top-info">
              <span className="top-label">{t.project}</span>
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option>Box Inspection</option>
                <option>Carpet Inspection </option>
                <option>Ring Inspection</option>
              </select>
            </div>
            <div className="divider" />
            <div className="status-pill"><span className="status-dot" /> {t.ready} <small>v2.1</small></div>
            <div className="top-info gpu"><span className="top-label">{t.serverGpu}</span><span><i className="ri-flashlight-line" /> {t.connected}</span></div>
          </div>

          <div className="top-actions">
            <button className="icon-btn" onClick={() => setIsDark(!isDark)} title={t.toggleTheme}>
              <i className={isDark ? 'ri-sun-line' : 'ri-moon-line'} />
            </button>
            <button
              className="settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
            >
              <i className="ri-settings-3-line" /> {t.settings}
            </button>
          </div>
        </header>

        <main className="workspace">
          <aside className="left-column">
            <section className="glass-panel panel-card">
              <SectionTitle title={t.baselineData} meta={`${normalFiles.length + defectFiles.length || 20} ${t.filesSuffix}`} />
              <UploadZone label={t.normalProduct} count="12" files={normalFiles} onFiles={setNormalFiles} inputRef={normalInputRef} t={t} />
              <UploadZone label={t.defectReferences} count="8" files={defectFiles} onFiles={setDefectFiles} inputRef={defectInputRef} t={t} />
              <div className="data-status"><i className="ri-checkbox-circle-fill" /> {t.baselineValidated}</div>
            </section>

            <section className="glass-panel panel-card generator-card">
              <SectionTitle title={t.generation} meta={t.ready} />

              <label className="field-label">{t.defectType}</label>
              <div className="select-shell">
                <i className={currentDefect.icon} />
                <select value={selectedDefect} onChange={(e) => setSelectedDefect(e.target.value)}>
                  {defects.map((defect) => <option key={defect.value}>{defect.value}</option>)}
                </select>
                <i className="ri-arrow-down-s-line" />
              </div>

              <label className="field-label">{t.targetDataset}</label>
              <div className="number-shell">
                <input value={targetImages} onChange={(e) => setTargetImages(e.target.value)} inputMode="numeric" />
                <span>{t.imagesUnit}</span>
              </div>

              <div className="generation-info">
                <div>
                  <span>{t.qualityProfile}</span>
                  <strong>{defaultQuality}</strong>
                </div>
                <div>
                  <span>{t.defaultEpoch}</span>
                  <strong>{defaultEpoch}</strong>
                </div>
              </div>

              <button className={`generate-btn ${isGenerating ? 'loading' : ''}`} onClick={handleGenerate} disabled={isGenerating}>
                <i className={isGenerating ? 'ri-loader-4-line spin' : 'ri-sparkling-2-fill'} />
                {isGenerating ? t.generatingBtn : t.generateBtn}
              </button>
              <div className="eta-row"><span><i className="ri-time-line" /> {t.estimatedTime}</span><strong>~12 min</strong></div>
            </section>
          </aside>

          <section className="center-column glass-panel panel-card">
            <div className="canvas-head">
              <SectionTitle title={t.mainCanvas} meta={t.inspectionView} />
              <div className="canvas-tools">
                <button className="canvas-tool"><i className="ri-zoom-in-line" /></button>
                <button className="canvas-tool"><i className="ri-fullscreen-line" /></button>
              </div>
            </div>

            <div className="inspection-canvas">
              <img src={previewImage} alt="Product preview" />
              <div className="scan-line" />
              {showLabels && (
                <div className="bbox">
                  <div className="bbox-label">{selectedDefect.toUpperCase()} <b>0.97</b></div>
                </div>
              )}
              <div className="canvas-corner top-left">{t.livePreview}</div>
              <div className="canvas-corner bottom-left">CAM 01 · 1920×1080</div>
              <div className="inspection-card">
                <div><span>{t.label}</span><strong>{selectedDefect}</strong></div>
                <div><span>{t.boundingBox}</span><strong>x: 512 · y: 384</strong></div>
                <div><span>{t.realismScore}</span><strong className="success-text">96%</strong></div>
              </div>
            </div>

            <div className="epoch-header">
              <button className="nav-btn" onClick={() => setEpoch(Math.max(1, epoch - 1))}><i className="ri-arrow-left-s-line" /> {t.prev}</button>
              <div className="epoch-readout"><span>{t.epoch}</span><strong>{epoch}</strong><small>/ 100</small></div>
              <button className="nav-btn" onClick={() => setEpoch(Math.min(100, epoch + 1))}>{t.next} <i className="ri-arrow-right-s-line" /></button>
            </div>

            <div className="evolution-block">
              <div className="evolution-title"><span>{t.epochEvolution}</span><small>{t.scrubber}</small></div>
              <input className="range-input evolution-range" type="range" min="1" max="100" value={epoch} onChange={(e) => setEpoch(Number(e.target.value))} />
              <div className="evolution-grid">
                {[1, 10, 25, 49, 75, 100].map((item) => (
                  <button key={item} className={`epoch-thumb ${epoch === item ? 'active' : ''}`} onClick={() => setEpoch(item)}>
                    <div className={`epoch-art epoch-${item}`}><span /></div>
                    <small>{t.epoch} {item}</small>
                    <em>{item === 1 ? t.stageNoise : item === 100 ? t.stageFinal : item === 49 ? t.stageCurrent : t.stageRefined}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="canvas-footer">
              <button className="secondary-btn"><i className="ri-fire-line" /> {t.viewHeatmap}</button>
              <button className="secondary-btn" onClick={() => setShowLabels(!showLabels)}><i className="ri-focus-3-line" /> {t.toggleLabels}</button>
              <span className={`label-state ${showLabels ? 'on' : ''}`}><i className="ri-checkbox-blank-circle-fill" /> {t.labels} {showLabels ? t.on : t.off}</span>
            </div>
          </section>

          <aside className="right-column">
            <section className="glass-panel panel-card gallery-card">
              <SectionTitle title={t.liveOutput} meta={`${generated.toLocaleString()} ${t.generatedSuffix}`} />
              <div className="gallery-head"><span>{t.resultGrid}</span><span>{t.page} 01 / 34</span></div>
              <div className="result-grid">
                {galleryItems.map((item) => (
                  <button key={item.id} className={`result-thumb ${selectedResult === item.id - 1 ? 'selected' : ''}`} onClick={() => setSelectedResult(item.id - 1)}>
                    <img src={item.image} alt={`Generated defect ${item.id}`} />
                    <span className="thumb-box" />
                    <span className="thumb-confidence">{item.confidence}</span>
                  </button>
                ))}
              </div>
              <div className="pagination"><span>{t.totalGenerated} <strong>{generated.toLocaleString()}</strong></span><div><button><i className="ri-arrow-left-s-line" /></button><span>1 / 34</span><button><i className="ri-arrow-right-s-line" /></button></div></div>
            </section>

            <section className="glass-panel panel-card metrics-card">
              <SectionTitle title={t.qualityMetrics} />
              <div className="metrics-grid">
                <MetricCard icon="ri-verified-badge-line" label={t.realism} value="96%" note={t.excellent} accent="green" />
                <MetricCard icon="ri-node-tree" label={t.diversity} value={t.high} note={t.veryGood} accent="blue" />
                <MetricCard icon="ri-database-2-line" label={t.dataBalance} value={t.optimal} note={t.ready} accent="purple" />
              </div>
            </section>

            <section className="glass-panel panel-card export-card">
              <SectionTitle title={t.exportFactory} />
              <label className="field-label">{t.annotationFormat}</label>
              <div className="select-shell">
                <i className="ri-file-code-line" />
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option>YOLO (.txt)</option>
                  <option>COCO (.json)</option>
                  <option>Pascal VOC (.xml)</option>
                </select>
                <i className="ri-arrow-down-s-line" />
              </div>
              <div className="dataset-summary"><span>{t.imagesWord} <b>{generated.toLocaleString()}</b></span><span>{t.annotations} <b>{generated.toLocaleString()}</b></span><span>{t.classes} <b>04</b></span></div>
              <button className="export-btn" onClick={handleExport}><i className="ri-download-2-line" /> {t.exportDataset}</button>
              <button className="push-btn" onClick={handlePush}><i className="ri-upload-cloud-2-line" /> {t.pushFactory}</button>
              <div className="ready-line"><span className="status-dot" /> {message}</div>
            </section>
          </aside>
        </main>

        {isSettingsOpen && (
          <div className="settings-overlay" onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}>
            <section className="settings-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
              <div className="settings-modal-head">
                <div>
                  <div className="settings-kicker">{t.settingsKicker}</div>
                  <h2 id="settings-title">{t.settingsTitle}</h2>
                  <p>{t.settingsDesc}</p>
                </div>
                <button className="settings-close" onClick={() => setIsSettingsOpen(false)} aria-label="Close settings">
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="settings-grid">
                <div className="settings-group">
                  <div className="settings-group-title"><i className="ri-sparkling-2-line" /> {t.groupAiGeneration}</div>

                  <label className="settings-field">
                    <span>{t.qualityProfile}</span>
                    <select value={defaultQuality} onChange={(e) => setDefaultQuality(e.target.value)}>
                      <option>Balanced</option>
                      <option>High</option>
                      <option>Maximum Detail</option>
                    </select>
                  </label>

                  <label className="settings-field">
                    <span>{t.defaultEpoch}</span>
                    <div className="settings-number">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={defaultEpoch}
                        onChange={(e) => setDefaultEpoch(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                      />
                      <small>/ 100</small>
                    </div>
                  </label>

                  <div className="settings-note">
                    <i className="ri-information-line" />
                    {t.genQualityNote}
                  </div>
                </div>

                <div className="settings-group">
                  <div className="settings-group-title"><i className="ri-database-2-line" /> {t.groupDatasetExport}</div>

                  <label className="settings-field">
                    <span>{t.defaultAnnotationFormat}</span>
                    <select value={defaultFormat} onChange={(e) => setDefaultFormat(e.target.value)}>
                      <option>YOLO (.txt)</option>
                      <option>COCO (.json)</option>
                      <option>Pascal VOC (.xml)</option>
                    </select>
                  </label>

                  <label className="settings-field">
                    <span>{t.confirmBeforeExport}</span>
                    <button className={`switch ${confirmExport ? 'on' : ''}`} onClick={() => setConfirmExport(!confirmExport)} aria-label="Toggle export confirmation">
                      <span />
                    </button>
                  </label>

                  <label className="settings-field">
                    <span>{t.autoSaveProject}</span>
                    <button className={`switch ${autoSave ? 'on' : ''}`} onClick={() => setAutoSave(!autoSave)} aria-label="Toggle auto save">
                      <span />
                    </button>
                  </label>
                </div>

                <div className="settings-group">
                  <div className="settings-group-title"><i className="ri-cpu-line" /> {t.groupHardware}</div>

                  <label className="settings-field">
                    <span>{t.processingDevice}</span>
                    <select value={gpuMode} onChange={(e) => setGpuMode(e.target.value)}>
                      <option>Auto Select</option>
                      <option>GPU 0 · NVIDIA</option>
                      <option>CPU Fallback</option>
                    </select>
                  </label>

                  <div className="connection-row">
                    <div>
                      <span>{t.genesisServer}</span>
                      <strong><i className="status-dot" /> {t.connected}</strong>
                    </div>
                    <em>v2.1</em>
                  </div>

                  <div className="connection-row">
                    <div>
                      <span>{t.factoryEndpoint}</span>
                      <strong>{apiEndpoint}</strong>
                    </div>
                    <i className="ri-link-m" />
                  </div>

                  <label className="settings-field">
                    <span>{t.apiEndpoint}</span>
                    <input value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} />
                  </label>
                </div>

                <div className="settings-group">
                  <div className="settings-group-title"><i className="ri-eye-line" /> {t.groupInspectionView}</div>

                  <label className="settings-field">
                    <span>{t.showLabelsDefault}</span>
                    <button className={`switch ${showLabels ? 'on' : ''}`} onClick={() => setShowLabels(!showLabels)} aria-label="Toggle labels">
                      <span />
                    </button>
                  </label>

                  <div className="settings-note">
                    <i className="ri-lightbulb-line" />
                    {t.themeNote}
                  </div>
                </div>

                <div className="settings-group">
                  <div className="settings-group-title"><i className="ri-translate-2" /> {t.groupLanguage}</div>

                  <label className="settings-field">
                    <span>{t.displayLanguage}</span>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </label>

                  <div className="settings-note">
                    <i className="ri-information-line" />
                    {t.languageNote}
                  </div>
                </div>
              </div>

              <div className="settings-modal-footer">
                <button className="secondary-btn" onClick={() => setIsSettingsOpen(false)}>{t.cancel}</button>
                <button className="settings-save-btn" onClick={handleSaveSettings}>
                  <i className="ri-save-3-line" /> {t.saveChanges}
                </button>
              </div>
            </section>
          </div>
        )}
    </div>
  );
}