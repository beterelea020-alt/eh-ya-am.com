(() => {
  'use strict';

  const CATEGORIES = window.BATTLE_TRIP_CATEGORIES || [];
  const QUESTIONS = window.BATTLE_TRIP_QUESTIONS || [];
  const CONFIG = window.EH_YA_AM_CONFIG || { developerName: 'Pola Elea', developerRole: 'Full Stack Developer || Problem Solver', portfolioLinks: [] };
  const STORAGE_KEY = 'ehYaAm.session.v1';
  const LEGACY_KEY = 'battleTrip.session.v1';
  const HOME_TILES = ['general', 'speed', 'funny', 'dare', 'logic', 'egypt'];
  const VIEWS = ['home', 'categories', 'question', 'scored', 'results', 'creator', 'settings'];
  const app = document.getElementById('app');
  const liveRegion = document.getElementById('live-region');
  let timerInterval = null;
  let timerRemaining = 0;
  let audioContext = null;

  /* ---------- Icons ---------- */
  const ICONS = {
    'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    chevron: '<path d="M15 18l-6-6 6-6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    undo: '<path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    skip: '<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>',
    play: '<path d="M6 3l14 9-14 9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    pencil: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    volume: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    sparkle: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0z"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    cv: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>'
  };
  function ico(name, cls = '') {
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  /* ---------- State ---------- */
  const DEFAULT_SETTINGS = () => ({ boysName: 'فريق الولاد', girlsName: 'فريق البنات', pointValue: 1, sounds: true, animations: true, countdownSeconds: 10 });
  const DEFAULT_STATE = () => ({
    view: 'home',
    settings: DEFAULT_SETTINGS(),
    scores: { boys: 0, girls: 0 },
    currentCategory: null,
    currentIndex: 0,
    results: {},
    history: [],
    matchStartedAt: new Date().toISOString(),
    tempShowHint: false, tempShowAnswer: false, tempShowAward: false, tempMenu: false
  });

  function hydrate(raw) {
    const parsed = JSON.parse(raw);
    const fresh = DEFAULT_STATE();
    return {
      ...fresh,
      ...parsed,
      settings: { ...fresh.settings, ...(parsed.settings || {}) },
      scores: {
        boys: Number.isFinite(parsed.scores?.boys) ? parsed.scores.boys : 0,
        girls: Number.isFinite(parsed.scores?.girls) ? parsed.scores.girls : 0
      },
      results: parsed.results && typeof parsed.results === 'object' ? parsed.results : {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      currentIndex: Number.isInteger(parsed.currentIndex) && parsed.currentIndex >= 0 ? parsed.currentIndex : 0,
      currentCategory: CATEGORIES.some(c => c.id === parsed.currentCategory) ? parsed.currentCategory : null,
      view: VIEWS.includes(parsed.view) ? parsed.view : 'home',
      tempShowHint: false, tempShowAnswer: false, tempShowAward: false, tempMenu: false
    };
  }

  function safeLoad() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_KEY);
      if (!raw) return DEFAULT_STATE();
      return hydrate(raw);
    } catch (error) {
      console.warn('تعذر استرجاع الجلسة المحفوظة؛ سيتم بدء جلسة جديدة.', error);
      return DEFAULT_STATE();
    }
  }

  let state = safeLoad();

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn('تعذر حفظ الجلسة في LocalStorage.', error);
      announce('تنبيه: المتصفح لم يستطع حفظ التغييرات. جرّب إتاحة مساحة تخزين للمتصفح.');
      return false;
    }
  }

  /* ---------- Helpers ---------- */
  function announce(message) { if (liveRegion) liveRegion.textContent = message; }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function categoryById(id) { return CATEGORIES.find(item => item.id === id); }
  function questionsFor(categoryId) { return QUESTIONS.filter(item => item.categoryId === categoryId); }
  function currentQuestions() { return questionsFor(state.currentCategory); }
  function currentQuestion() { return currentQuestions()[state.currentIndex] || null; }
  function resolvedCount(categoryId = null) {
    return Object.keys(state.results).filter(id => {
      const q = QUESTIONS.find(item => item.id === id);
      return q && (!categoryId || q.categoryId === categoryId);
    }).length;
  }
  function winnerRounds(team) { return state.history.filter(item => item.winner === team && item.action === 'score').length; }
  function completedCategories() { return CATEGORIES.filter(c => resolvedCount(c.id) >= questionsFor(c.id).length).length; }
  function nameOf(team) { return team === 'boys' ? state.settings.boysName : state.settings.girlsName; }
  function scoreOf(team) { return state.scores[team] || 0; }
  function pointValueFor(q) { return Number.isFinite(q.points) && q.points > 0 ? q.points : Math.max(1, Number(state.settings.pointValue) || 1); }
  function pointsWord(n) { return n === 1 ? 'نقطة' : 'نقاط'; }
  function safeURL(url) {
    try {
      const parsed = new URL(url);
      return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '';
    } catch (_) { return ''; }
  }
  function questionLabel(q) {
    const labels = { factual: 'معلومة عامة', riddle: 'لغز', speed: 'سرعة بديهة', creative: 'تحدي إبداعي', truefalse: 'صح ولا غلط', dare: 'تحدي خفيف' };
    return labels[q.type] || 'سؤال';
  }
  function avatar(team) { return `<span class="team-avatar"><img src="assets/avatar-${team === 'boys' ? 'boy' : 'girl'}.svg" alt=""></span>`; }
  function catIcon(category) {
    if (!category) return '❓';
    if (category.icon === 'EG') return '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#ce1126"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#000"/><circle cx="15" cy="10" r="2" fill="#c09300"/></svg>';
    return escapeHTML(category.icon);
  }
  function formatTime(timestamp) {
    try { return new Intl.DateTimeFormat('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }).format(new Date(timestamp)); }
    catch (_) { return ''; }
  }

  /* ---------- Shared pieces ---------- */
  function logo(size = '') {
    return `<div class="logo ${size}" role="img" aria-label="${escapeHTML(CONFIG.gameName || 'إيه يا عم؟')} ${escapeHTML(CONFIG.gameNameEn || 'EH YA AM')}"><img class="logo-crown" src="assets/crown.svg" alt=""><div class="logo-plate"><img class="logo-brush" src="assets/brush.svg" alt=""><span class="logo-ar">إيه يا عم؟</span><span class="logo-en">EH YA AM</span></div></div>`;
  }

  function appbar(title, backAction = 'home', extra = '') {
    return `<div class="appbar"><button class="appbar-btn left" data-action="${backAction}" aria-label="رجوع">${ico('arrow-left')}</button><h1>${title}</h1>${extra}</div>`;
  }

  function teamCard(team, { bonus = 0, winner = false } = {}) {
    return `<div class="team-card ${team} ${winner ? 'is-winner' : ''}">${avatar(team)}${bonus ? `<span class="team-bonus">+${bonus}</span>` : ''}<span class="team-name">${escapeHTML(nameOf(team))}</span><strong class="team-points" data-score="${team}">${scoreOf(team)}</strong></div>`;
  }

  function drawer() {
    if (!state.tempMenu) return '';
    const item = (action, icon, label, view) => `<button class="drawer-item ${state.view === view ? 'is-active' : ''}" data-action="${action}">${ico(icon)}<span>${label}</span></button>`;
    return `<div class="drawer-back" data-action="close-menu" data-backdrop="1"></div>
      <nav class="drawer" aria-label="القائمة">
        <div class="drawer-profile"><img src="assets/developer-dog.jpg" alt=""><div><strong>${escapeHTML(CONFIG.developerName || 'Pola Elea')}</strong><small>Developer</small></div><img class="crown-s" src="assets/crown.svg" alt="" style="border:0;border-radius:0;height:auto"></div>
        ${item('home', 'home', 'الرئيسية', 'home')}
        ${item('categories', 'grid', 'الفئات', 'categories')}
        ${item('settings', 'gear', 'الإعدادات', 'settings')}
        ${item('creator', 'user', 'عن المطوّر', 'creator')}
        <div class="drawer-sep"></div>
        <button class="drawer-item exit" data-action="close-menu">${ico('logout')}<span>إغلاق</span></button>
      </nav>`;
  }

  /* ---------- Views ---------- */
  function renderHome() {
    const b = scoreOf('boys');
    const g = scoreOf('girls');
    const total = b + g;
    const boysPct = total ? Math.round((b / total) * 100) : 50;
    const leader = b === g ? 'متعادلين' : `${nameOf(b > g ? 'boys' : 'girls')} متصدر`;
    const hasProgress = resolvedCount() > 0 || Boolean(state.currentCategory);
    const tiles = HOME_TILES.map(categoryById).filter(Boolean).map(category => {
      const list = questionsFor(category.id);
      const count = resolvedCount(category.id);
      return `<button class="cat-tile ${count >= list.length ? 'is-done' : ''}" data-action="open-category" data-category="${category.id}" aria-label="فتح فئة ${escapeHTML(category.name)}">
        <span class="cat-ico">${catIcon(category)}</span><strong>${escapeHTML(category.name)}</strong>
        <small>${count ? `${count} / ${list.length}` : `${list.length} سؤال`}</small>
        ${count ? `<span class="tile-progress"><i style="width:${Math.min(100, count / Math.max(1, list.length) * 100)}%"></i></span>` : ''}
      </button>`;
    }).join('');
    return `<section class="screen">
      <div class="home-hero">
        <div class="home-top"><button class="appbar-btn" data-action="menu" aria-label="القائمة">${ico('menu')}</button><button class="appbar-btn" data-action="settings" aria-label="الإعدادات">${ico('gear')}</button></div>
        ${logo()}
        <p class="tagline">رحلة .. ومنافسة .. وضحك كتير!</p>
      </div>
      <div class="teams">${teamCard('boys')}<span class="vs" aria-hidden="true">VS</span>${teamCard('girls')}</div>
      <div class="meter"><div class="meter-label">${escapeHTML(leader)}</div>
        <div class="meter-track" role="img" aria-label="مؤشر تقدم الفريقين"><div class="meter-fill"><span class="m-boys" style="width:${boysPct}%"></span><span class="m-girls"></span></div><span class="meter-flag" style="right:${boysPct}%"><img src="assets/crown.svg" alt=""></span></div></div>
      <div class="stats">
        <div class="stat"><span>${ico('flag')} السؤال الحالي</span><b>${resolvedCount()} / ${QUESTIONS.length}</b></div>
        <div class="stat"><span>${ico('trophy')} الجولات</span><b>${completedCategories()} / ${CATEGORIES.length}</b></div>
        <div class="stat"><span>${ico('star')} الفوز</span><b>${winnerRounds('boys')} - ${winnerRounds('girls')}</b></div>
      </div>
      <div class="home-actions"><button class="btn-gold" data-action="categories">${ico('play', 'fill')} ابدأ اللعبة</button></div>
      <div class="section-title">الفئات</div>
      <div class="cat-grid">${tiles}</div>
      <div class="home-actions"><button class="btn-dark" data-action="resume" ${hasProgress ? '' : 'disabled'}>${ico('refresh')} استكمال الجلسة</button><button class="btn-dark" data-action="creator">${ico('user')} عن المطوّر</button></div>
    </section>${drawer()}`;
  }

  function renderCategories() {
    const rows = CATEGORIES.map(category => {
      const list = questionsFor(category.id);
      const count = resolvedCount(category.id);
      return `<button class="cat-row ${state.currentCategory === category.id ? 'is-current' : ''}" data-action="open-category" data-category="${category.id}" aria-label="فتح فئة ${escapeHTML(category.name)}">
        <span class="cat-ico">${catIcon(category)}</span>
        <span class="cat-row-main"><strong>${escapeHTML(category.name)}</strong><small>${list.length} سؤال</small>
          <span class="cat-row-bar"><span class="bar"><i style="width:${Math.min(100, count / Math.max(1, list.length) * 100)}%"></i></span><span>${count}/${list.length}</span></span></span>
        ${ico('chevron')}
      </button>`;
    }).join('');
    return `<section class="screen">${appbar(`اختر الفئة <img src="assets/crown.svg" alt="" width="22">`)}<div class="cat-list">${rows}</div></section>`;
  }

  function sheets(q) {
    if (!state.tempShowHint && !state.tempShowAnswer && !state.tempShowAward) return '';
    const creative = q.type === 'creative' || q.type === 'dare';
    const hint = state.tempShowHint ? `<div class="sheet hint"><span class="big-ico">${ico('bulb')}</span><h2>التلميح</h2><p class="sheet-text">${escapeHTML(q.hint || 'مفيش تلميح للسؤال ده.')}</p><button class="btn-dark" data-action="close-hint">إغلاق</button></div>` : '';
    const answer = state.tempShowAnswer ? `<div class="sheet answer"><span class="big-ico">${ico('check')}</span><h2>${creative ? 'الإجابة / معيار التحكيم' : 'الإجابة الصحيحة'}</h2><p class="answer-text">${escapeHTML(q.answer)}</p>${q.explanation ? `<small>${escapeHTML(q.explanation)}</small>` : ''}${Array.isArray(q.alternatives) && q.alternatives.length ? `<small><b>بدائل مقبولة:</b> ${escapeHTML(q.alternatives.join('، '))}</small>` : ''}${q.judgingCriteria ? `<div class="judging"><b>معيار الحكم:</b> ${escapeHTML(q.judgingCriteria)}</div>` : ''}<button class="btn-gold" data-action="answer-continue">متابعة ${ico('arrow-left')}</button></div>` : '';
    const award = state.tempShowAward ? `<div class="sheet award-sheet"><h2>مين كسب الجولة؟</h2>
        <div class="award-btns"><button class="award-btn boys" data-action="award" data-team="boys">${avatar('boys')}<strong>${escapeHTML(nameOf('boys'))}</strong><small>+${pointValueFor(q)} ${pointsWord(pointValueFor(q))}</small></button><button class="award-btn girls" data-action="award" data-team="girls">${avatar('girls')}<strong>${escapeHTML(nameOf('girls'))}</strong><small>+${pointValueFor(q)} ${pointsWord(pointValueFor(q))}</small></button></div>
        <div class="award-sub"><button class="btn-dark" data-action="tie">تعادل</button><button class="btn-dark" data-action="skip">${ico('skip')} تخطي</button></div>
        <button class="btn-dark" data-action="close-award">إلغاء</button></div>` : '';
    return `<div class="overlay" data-action="close-sheets" data-backdrop="1">${hint}${answer}${award}</div>`;
  }

  function renderQuestion() {
    const q = currentQuestion();
    if (!q) return `<section class="screen">${appbar('اختر فئة الأول', 'categories')}<div class="cat-list"><button class="btn-gold" data-action="categories">العودة للفئات</button></div></section>`;
    const category = categoryById(q.categoryId);
    const list = currentQuestions();
    const result = state.results[q.id];
    const progress = ((state.currentIndex + 1) / Math.max(1, list.length)) * 100;
    const isLast = state.currentIndex >= list.length - 1;
    let resolvedHTML = '';
    if (result) {
      const text = result.winner === 'boys' || result.winner === 'girls' ? `النقطة راحت لـ ${nameOf(result.winner)}!` : result.winner === 'tie' ? 'تعادل… مفيش نقاط للجولة دي.' : result.winner === 'cancelled' ? 'السؤال اتلغى.' : 'السؤال اتخطّى من غير نقاط.';
      resolvedHTML = `<div class="resolved ${result.winner === 'boys' ? 'r-boys' : result.winner === 'girls' ? 'r-girls' : ''}">${ico('check')}<div><strong>${escapeHTML(text)}</strong><span>${result.points ? `+${result.points} ${pointsWord(result.points)}` : 'من غير تغيير في النتيجة'}${result.timestamp ? ` • ${escapeHTML(formatTime(result.timestamp))}` : ''}</span></div></div>`;
    }
    let meta = '';
    if (q.type === 'speed' || q.type === 'dare') {
      meta = `<div class="q-meta"><span>⏱️ ${q.timeLimit ? `${q.timeLimit} ثانية` : 'وقت يحدده المضيف'}</span>${q.requiredCount ? `<span>🎯 مطلوب ${q.requiredCount} إجابات</span>` : ''}${q.type === 'speed' ? '<span>✅ المضيف يقبل الإجابات الصحيحة المختلفة</span>' : ''}</div>`;
    }
    const mainBtn = result
      ? `<button class="btn-gold" data-action="next">${isLast ? 'إنهاء الفئة' : 'السؤال التالي'} ${ico('arrow-left')}</button>`
      : `<button class="btn-gold" data-action="open-award">${ico('trophy')} سجّل النقطة</button>`;
    const navSecond = result
      ? (state.history.length ? `<button class="btn-dark" data-action="undo">${ico('undo')} تراجع</button>` : '<span></span>')
      : `<button class="btn-dark" data-action="next">${isLast ? 'إنهاء الفئة' : 'التالي'} ${ico('arrow-left')}</button>`;
    return `<section class="screen">
      ${appbar(`${catIcon(category)} ${escapeHTML(category?.name || 'سؤال')}`, 'categories')}
      <div class="q-head">السؤال ${state.currentIndex + 1} من ${list.length}</div>
      <div class="bar-thin"><i style="width:${progress}%"></i></div>
      <article class="q-card">
        <div class="q-pills"><span class="pill">${escapeHTML(questionLabel(q))}</span><span class="pill soft">${q.difficulty === 'easy' ? 'خفيف' : 'متوسط'}</span><span class="pill soft">${pointValueFor(q)} ${pointsWord(pointValueFor(q))}</span></div>
        <h2 class="q-text">${escapeHTML(q.text)}</h2>${meta}
      </article>
      <div class="q-actions"><button class="btn-dark" data-action="reveal-hint">${ico('bulb')} تلميح</button><button class="btn-dark" data-action="reveal-answer">${ico('eye')} إظهار الإجابة</button></div>
      ${resolvedHTML}
      <div class="home-actions">${mainBtn}</div>
      <div class="q-nav"><button class="btn-dark" data-action="previous" ${state.currentIndex <= 0 ? 'disabled' : ''}>${ico('arrow-right')} السابق</button>${navSecond}</div>
      <div class="q-tools"><button class="tool-chip" data-action="toggle-timer">${ico('clock')} <span id="timer-label">المؤقت</span></button><button class="tool-chip" data-action="results">${ico('trophy')} النتيجة</button></div>
      <div class="q-score"><span class="b">${escapeHTML(nameOf('boys'))} <b>${scoreOf('boys')}</b></span><span class="g">${escapeHTML(nameOf('girls'))} <b>${scoreOf('girls')}</b></span></div>
    </section>${sheets(q)}`;
  }

  function renderScored() {
    const event = state.history[state.history.length - 1];
    if (!event) { state.view = 'home'; return renderHome(); }
    const scoring = event.winner === 'boys' || event.winner === 'girls';
    const title = scoring ? 'تم تسجيل النقطة!' : event.winner === 'tie' ? 'تعادل!' : 'اتخطّى السؤال';
    const toast = scoring
      ? `<img src="assets/avatar-${event.winner === 'boys' ? 'boy' : 'girl'}.svg" alt=""> مبروك ${escapeHTML(nameOf(event.winner))}!`
      : event.winner === 'tie' ? '🤝 مفيش نقاط… والجولة الجاية تحسم' : '⏭️ مفيش نقاط في الجولة دي';
    const confetti = state.settings.animations && scoring ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>` : '';
    return `<section class="screen scored">${confetti}
      <img class="crown" src="assets/crown.svg" alt="">
      <h1>${title}</h1>
      <div class="teams">${teamCard('boys', { bonus: event.winner === 'boys' ? event.points : 0, winner: event.winner === 'boys' })}<span class="vs" aria-hidden="true">VS</span>${teamCard('girls', { bonus: event.winner === 'girls' ? event.points : 0, winner: event.winner === 'girls' })}</div>
      <div class="toast-pill">${toast}</div>
      <button class="btn-gold" data-action="next">الجولة التالية ${ico('arrow-left')}</button>
      <div class="scored-actions"><button class="mini-act" data-action="undo">${ico('undo')}تراجع</button><button class="mini-act" data-action="results">${ico('trophy')}النتيجة</button><button class="mini-act" data-action="categories">${ico('grid')}الفئات</button></div>
    </section>`;
  }

  function renderResults() {
    const b = scoreOf('boys');
    const g = scoreOf('girls');
    const winner = b === g ? null : (b > g ? 'boys' : 'girls');
    const rows = CATEGORIES.map(category => {
      const events = state.history.filter(item => item.categoryId === category.id && item.action === 'score');
      const boys = events.filter(item => item.winner === 'boys').reduce((sum, item) => sum + item.points, 0);
      const girls = events.filter(item => item.winner === 'girls').reduce((sum, item) => sum + item.points, 0);
      return `<div class="bd-row"><span class="cat-ico">${catIcon(category)}</span><div><strong>${escapeHTML(category.name)}</strong><small>${resolvedCount(category.id)} من ${questionsFor(category.id).length} محسومة</small></div><div class="bd-pts"><span class="b">${boys}</span><i>:</i><span class="g">${girls}</span></div></div>`;
    }).join('');
    const confetti = state.settings.animations && winner ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>` : '';
    return `<section class="screen">${confetti}
      ${appbar(`النتيجة النهائية ${ico('trophy')}`)}
      <div class="final-teams"><div class="final-card boys"><span>${escapeHTML(nameOf('boys'))}</span><b>${b}</b></div><img class="final-trophy" src="assets/trophy.svg" alt=""><div class="final-card girls"><span>${escapeHTML(nameOf('girls'))}</span><b>${g}</b></div></div>
      <div class="ribbon">${winner ? `${escapeHTML(nameOf(winner))} فاز!` : 'تعادل الأبطال!'}</div>
      <div class="result-stats">
        <div class="result-stat"><span>${ico('flag')} الأسئلة</span><b>${resolvedCount()}</b></div>
        <div class="result-stat"><span>${ico('trophy')} الفئات</span><b>${completedCategories()}</b></div>
        <div class="result-stat"><span>${ico('star')} جولات بفائز</span><b>${state.history.filter(item => item.action === 'score').length}</b></div>
      </div>
      <div class="result-btns"><button class="btn-dark" data-action="rematch">${ico('refresh')} إعادة اللعبة</button><button class="btn-gold" data-action="export-json">${ico('share')} تصدير النتيجة</button></div>
      <div class="section-title">النقاط حسب الفئة</div>
      <div class="breakdown">${rows}</div>
    </section>`;
  }

  function renderSettings() {
    const s = state.settings;
    const timerOn = Number(s.countdownSeconds) > 0;
    return `<section class="screen">${appbar('الإعدادات')}
      <form id="settings-form">
        <div class="set-title">تخصيص الفرق</div>
        <div class="team-edit-grid">
          <label class="team-edit boys">${avatar('boys')}<input class="name-input" name="boysName" maxlength="24" required value="${escapeHTML(s.boysName)}" aria-label="اسم الفريق الأزرق"></label>
          <label class="team-edit girls">${avatar('girls')}<input class="name-input" name="girlsName" maxlength="24" required value="${escapeHTML(s.girlsName)}" aria-label="اسم الفريق الوردي"></label>
        </div>
        <div class="set-section">
          <div class="set-title">قواعد اللعب</div>
          <div class="set-row"><span class="lbl">${ico('star')}<span>نقاط كل سؤال</span></span><span class="stepper"><button type="button" data-action="step" data-dir="-1" aria-label="أقل">${ico('minus')}</button><output id="pv-out">${Math.max(1, Number(s.pointValue) || 1)}</output><button type="button" data-action="step" data-dir="1" aria-label="أكتر">${ico('plus')}</button><input type="hidden" name="pointValue" value="${Math.max(1, Number(s.pointValue) || 1)}"></span></div>
          <div class="set-row"><span class="lbl">${ico('clock')}<span>المؤقت<small>بيشتغل بضغطة من المضيف</small></span></span><span style="display:flex;align-items:center;gap:10px"><select class="select-sm" name="countdownSeconds" aria-label="مدة المؤقت">${[5, 10, 15, 30, 60].map(v => `<option value="${v}" ${(timerOn ? Number(s.countdownSeconds) : 10) === v ? 'selected' : ''}>${v} ث</option>`).join('')}</select><span class="switch"><input type="checkbox" name="timerOn" aria-label="تشغيل المؤقت" ${timerOn ? 'checked' : ''}><i></i></span></span></div>
          <div class="set-row"><span class="lbl">${ico('volume')}<span>الأصوات<small>صوت بسيط عند تسجيل النقطة</small></span></span><span class="switch"><input type="checkbox" name="sounds" aria-label="الأصوات" ${s.sounds ? 'checked' : ''}><i></i></span></div>
          <div class="set-row"><span class="lbl">${ico('sparkle')}<span>الحركات والاحتفال<small>انتقالات وكونفيتي خفيف</small></span></span><span class="switch"><input type="checkbox" name="animations" aria-label="الحركات" ${s.animations ? 'checked' : ''}><i></i></span></div>
        </div>
        <div class="set-actions"><button type="button" class="btn-dark" data-action="reset-settings">${ico('refresh')} إعادة تعيين</button><button type="submit" class="btn-gold">${ico('save')} حفظ</button></div>
      </form>
      <div class="set-section"><div class="set-title">الجلسة والبيانات</div>
        <div class="util-row"><button class="btn-dark" data-action="export-json">تنزيل JSON</button><button class="btn-dark" data-action="export-csv">تنزيل CSV</button></div>
        <div class="util-row"><button class="btn-dark" data-action="print-results">طباعة النتيجة</button><button class="btn-dark btn-danger" data-action="new-match">ماتش جديد</button></div>
      </div>
      <p class="note">🔒 البيانات محفوظة في المتصفح على الجهاز ده فقط. «ماتش جديد» بيمسح النقاط وسجل الجولات؛ نزّل نسخة JSON لو محتاج تحتفظ بيها.</p>
    </section>`;
  }

  function renderCreator() {
    const defs = { github: ['github', 'GitHub'], linkedin: ['linkedin', 'LinkedIn'], instagram: ['instagram', 'Instagram'], cv: ['cv', 'CV'] };
    const links = Array.isArray(CONFIG.portfolioLinks) ? CONFIG.portfolioLinks : [];
    const social = ['github', 'linkedin', 'instagram', 'cv'].map(key => {
      const link = links.find(item => item.key === key) || {};
      const url = safeURL(link.url);
      const inner = `<span class="tile t-${key}">${ico(defs[key][0])}</span>${defs[key][1]}`;
      return url
        ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${defs[key][1]}">${inner}</a>`
        : `<span class="off" title="الرابط هيتضاف قريب" aria-label="${defs[key][1]} (غير متاح حاليًا)">${inner}</span>`;
    }).join('');
    const phone = String(CONFIG.whatsappNumber || '').replace(/\D/g, '');
    const waText = encodeURIComponent('أهلاً، أنا لعبت إيه يا عم؟ وعايز أكلمك 👋');
    const contact = phone.length >= 8
      ? `<a class="btn-dark" href="https://wa.me/${phone}?text=${waText}" target="_blank" rel="noopener noreferrer">تواصل معي على واتساب ${ico('whatsapp')}</a>`
      : `<button class="btn-dark" disabled>تواصل معي ${ico('whatsapp')}</button>`;
    return `<section class="screen">${appbar('عن المطوّر')}
      <div class="creator">
        <div class="dog-wrap"><img class="dog" src="assets/developer-dog.jpg" alt="كلب مبتسم بنظارة شمس، مدير الجودة والضحك" width="250" height="250"><img class="dog-crown" src="assets/crown.svg" alt=""><span class="dog-note">Good Vibes<br>Better Code</span></div>
        <h2>${escapeHTML(CONFIG.developerName || 'Pola Elea')}</h2>
        <p class="role">${escapeHTML(CONFIG.developerRole || 'Full Stack Developer')}</p>
        <p class="bio">${escapeHTML(CONFIG.developerBio || '')}</p>
        <div class="social">${social}</div>
        <div style="width:100%">${contact}</div>
        <p class="thanks">${ico('sparkle')} <span>شكرًا لكل من يدعم رحلتي</span></p>
      </div>
    </section>${drawer()}`;
  }

  function render() {
    stopTimer();
    document.body.classList.toggle('no-motion', !state.settings.animations);
    if (state.view === 'question' && !state.currentCategory) state.view = 'categories';
    const views = { home: renderHome, categories: renderCategories, question: renderQuestion, scored: renderScored, settings: renderSettings, results: renderResults, creator: renderCreator };
    app.innerHTML = (views[state.view] || renderHome)();
    persist();
    const names = { question: 'شاشة السؤال', results: 'النتيجة النهائية', settings: 'إعدادات اللعبة', categories: 'اختيار الفئة', creator: 'عن المطوّر', scored: 'تم تسجيل النتيجة' };
    announce(names[state.view] || 'الرئيسية');
    if (state.view !== 'home') window.scrollTo({ top: 0 });
  }

  /* ---------- Sound / game logic ---------- */
  function playTone(kind = 'score') {
    if (!state.settings.sounds) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.type = 'sine';
      if (kind === 'tie') {
        oscillator.frequency.setValueAtTime(280, now);
        oscillator.frequency.linearRampToValueAtTime(230, now + 0.16);
      } else {
        oscillator.frequency.setValueAtTime(520, now);
        oscillator.frequency.linearRampToValueAtTime(780, now + 0.13);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.075, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      oscillator.start(now);
      oscillator.stop(now + 0.24);
    } catch (error) { console.info('الصوت غير متاح في هذا المتصفح.', error); }
  }

  function clearTemps() { state.tempShowHint = false; state.tempShowAnswer = false; state.tempShowAward = false; state.tempMenu = false; }

  function startCategory(categoryId) {
    if (!categoryById(categoryId)) return;
    state.currentCategory = categoryId;
    const list = questionsFor(categoryId);
    const firstUnresolved = list.findIndex(q => !state.results[q.id]);
    state.currentIndex = firstUnresolved >= 0 ? firstUnresolved : 0;
    state.view = 'question';
    clearTemps();
    render();
  }

  function resumeGame() {
    if (!state.currentCategory) {
      const first = CATEGORIES.find(c => questionsFor(c.id).some(q => !state.results[q.id]));
      if (first) return startCategory(first.id);
      state.view = 'results';
      return render();
    }
    const list = currentQuestions();
    if (!list.length) return startCategory(CATEGORIES[0]?.id);
    if (state.currentIndex >= list.length) state.currentIndex = 0;
    state.view = 'question';
    clearTemps();
    render();
  }

  function recordResolution(winner) {
    const q = currentQuestion();
    if (!q) return;
    if (state.results[q.id]) {
      announce('السؤال ده اتحسم قبل كده. استخدم التراجع لو تسجيل النقطة كان بالغلط.');
      return;
    }
    const scoring = winner === 'boys' || winner === 'girls';
    const points = scoring ? pointValueFor(q) : 0;
    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: q.id,
      categoryId: q.categoryId,
      categoryName: categoryById(q.categoryId)?.name || '',
      question: q.text,
      questionNumber: state.currentIndex + 1,
      winner,
      winnerName: scoring ? nameOf(winner) : (winner === 'tie' ? 'تعادل' : winner === 'cancelled' ? 'ملغي' : 'تخطي'),
      points,
      action: scoring ? 'score' : winner === 'cancelled' ? 'cancel' : winner === 'skip' ? 'skip' : 'tie',
      timestamp: new Date().toISOString()
    };
    state.results[q.id] = { winner, points, timestamp: event.timestamp, eventId: event.id };
    if (scoring) state.scores[winner] += points;
    state.history.push(event);
    playTone(winner === 'tie' ? 'tie' : 'score');
    clearTemps();
    state.view = 'scored';
    render();
    announce(scoring ? `تم تسجيل ${points} نقطة لـ ${nameOf(winner)}` : winner === 'tie' ? 'تم تسجيل التعادل دون نقاط' : 'تم إنهاء السؤال دون نقاط');
  }

  function undoLast() {
    const event = state.history.pop();
    if (!event) return;
    if ((event.winner === 'boys' || event.winner === 'girls') && event.points) {
      state.scores[event.winner] = Math.max(0, state.scores[event.winner] - event.points);
    }
    delete state.results[event.questionId];
    const q = QUESTIONS.find(item => item.id === event.questionId);
    if (q) {
      state.currentCategory = q.categoryId;
      state.currentIndex = questionsFor(q.categoryId).findIndex(item => item.id === q.id);
    }
    state.view = 'question';
    clearTemps();
    render();
    announce('تم التراجع عن آخر تسجيل، والسؤال بقى متاح تاني.');
  }

  function goNext() {
    const list = currentQuestions();
    if (!list.length) return;
    clearTemps();
    if (state.currentIndex < list.length - 1) {
      state.currentIndex += 1;
      state.view = 'question';
      render();
    } else {
      state.view = 'categories';
      render();
      announce('انتهت أسئلة الفئة دي. اختاروا فئة تانية أو شوفوا النتيجة.');
    }
  }

  function newMatch() {
    if (!window.confirm('متأكد إنك عايز تبدأ ماتش جديد؟ النقاط وسجل الجولات الحالي هيتحذفوا من الجهاز ده.')) return;
    const priorSettings = { ...state.settings };
    state = DEFAULT_STATE();
    state.settings = priorSettings;
    render();
    announce('بدأ ماتش جديد.');
  }

  function downloadFile(filename, content, type) {
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('فشل تنزيل الملف', error);
      window.alert('المتصفح لم يستطع تنزيل الملف. جرّب متصفحًا أحدث.');
    }
  }

  function exportJSON() {
    const payload = {
      application: 'إيه يا عم؟ (EH YA AM)',
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      finalScore: { ...state.scores },
      totals: { questions: QUESTIONS.length, resolved: resolvedCount(), scoreEvents: state.history.filter(item => item.action === 'score').length },
      categoryBreakdown: CATEGORIES.map(category => ({ id: category.id, name: category.name, resolved: resolvedCount(category.id), questions: questionsFor(category.id).length })),
      results: state.results,
      scoreHistory: state.history
    };
    downloadFile('eh-ya-am-results.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  }

  function exportCSV() {
    const rows = [['التاريخ', 'الفئة', 'رقم السؤال', 'السؤال', 'الفائز', 'النقاط', 'نوع العملية']];
    state.history.forEach(item => rows.push([item.timestamp, item.categoryName, item.questionNumber, item.question, item.winnerName, item.points, item.action]));
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    downloadFile('eh-ya-am-score-history.csv', csv, 'text/csv;charset=utf-8');
  }

  function startTimer() {
    const duration = Math.max(0, Number(state.settings.countdownSeconds) || 0);
    if (!duration) {
      announce('المؤقت متوقف في الإعدادات.');
      window.alert('المؤقت متوقف حاليًا. شغّله من الإعدادات.');
      return;
    }
    stopTimer();
    timerRemaining = duration;
    const button = app.querySelector('[data-action="toggle-timer"]');
    if (button) { button.className = 'tool-chip timer-running'; button.innerHTML = `${ico('clock')} <span id="timer-label">${timerRemaining} ث</span>`; }
    timerInterval = window.setInterval(() => {
      timerRemaining -= 1;
      const label = app.querySelector('#timer-label');
      if (label) label.textContent = `${Math.max(0, timerRemaining)} ث`;
      if (timerRemaining <= 0) {
        stopTimer();
        const chip = app.querySelector('[data-action="toggle-timer"]');
        if (chip) { chip.className = 'tool-chip timer-finished'; chip.innerHTML = `${ico('clock')} <span>الوقت خلص</span>`; }
        playTone('tie');
        announce('انتهى وقت السؤال. المضيف يقرر الفائز يدويًا.');
      }
    }, 1000);
  }
  function stopTimer() {
    if (timerInterval) window.clearInterval(timerInterval);
    timerInterval = null;
  }

  /* ---------- Events ---------- */
  app.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    if (button.dataset.backdrop && event.target !== button) return;
    const action = button.dataset.action;
    if (action !== 'menu' && action !== 'step' && state.tempMenu) state.tempMenu = false;
    const go = view => { clearTemps(); state.view = view; render(); };
    switch (action) {
      case 'home': go('home'); break;
      case 'categories': go('categories'); break;
      case 'settings': go('settings'); break;
      case 'creator': go('creator'); break;
      case 'results': go('results'); break;
      case 'menu': state.tempMenu = true; render(); break;
      case 'close-menu': render(); break;
      case 'open-category': startCategory(button.dataset.category); break;
      case 'resume': resumeGame(); break;
      case 'reveal-hint': state.tempShowHint = true; render(); break;
      case 'reveal-answer': state.tempShowAnswer = true; render(); break;
      case 'close-hint': state.tempShowHint = false; render(); break;
      case 'answer-continue': state.tempShowAnswer = false; state.tempShowAward = !state.results[currentQuestion()?.id]; render(); break;
      case 'open-award': state.tempShowAward = true; render(); break;
      case 'close-award': state.tempShowAward = false; render(); break;
      case 'close-sheets': state.tempShowHint = false; state.tempShowAnswer = false; state.tempShowAward = false; render(); break;
      case 'award': recordResolution(button.dataset.team); break;
      case 'tie': recordResolution('tie'); break;
      case 'skip': recordResolution('skip'); break;
      case 'undo': undoLast(); break;
      case 'previous':
        if (state.currentIndex > 0) { state.currentIndex -= 1; clearTemps(); render(); }
        break;
      case 'next': goNext(); break;
      case 'toggle-timer': if (timerInterval) { stopTimer(); render(); } else startTimer(); break;
      case 'step': {
        const input = app.querySelector('input[name="pointValue"]');
        const out = app.querySelector('#pv-out');
        if (input && out) {
          const next = Math.max(1, Math.min(10, (Number(input.value) || 1) + Number(button.dataset.dir)));
          input.value = next;
          out.textContent = next;
        }
        break;
      }
      case 'reset-settings': state.settings = DEFAULT_SETTINGS(); render(); announce('تمت إعادة الإعدادات للوضع الافتراضي.'); break;
      case 'new-match': newMatch(); break;
      case 'rematch': newMatch(); break;
      case 'export-json': exportJSON(); announce('تم تجهيز ملف النتائج JSON.'); break;
      case 'export-csv': exportCSV(); announce('تم تجهيز ملف سجل النقاط CSV.'); break;
      case 'print-results': window.print(); break;
    }
  });

  app.addEventListener('submit', event => {
    if (event.target.id !== 'settings-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const boysName = String(form.get('boysName') || '').trim().slice(0, 24);
    const girlsName = String(form.get('girlsName') || '').trim().slice(0, 24);
    if (!boysName || !girlsName) {
      window.alert('اكتب اسمًا لكل فريق.');
      return;
    }
    state.settings.boysName = boysName;
    state.settings.girlsName = girlsName;
    state.settings.pointValue = Math.max(1, Math.min(10, Number(form.get('pointValue')) || 1));
    state.settings.countdownSeconds = form.get('timerOn') === 'on' ? Math.max(1, Number(form.get('countdownSeconds')) || 10) : 0;
    state.settings.sounds = form.get('sounds') === 'on';
    state.settings.animations = form.get('animations') === 'on';
    state.view = 'home';
    render();
    announce('تم حفظ الإعدادات.');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (state.tempMenu || state.tempShowHint || state.tempShowAnswer || state.tempShowAward) {
      clearTemps();
      render();
    }
  });

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try { state = hydrate(event.newValue); render(); } catch (_) { /* ignore invalid cross-tab state */ }
    }
  });

  if (/^https?:$/.test(window.location.protocol)) {
    const m = document.createElement('link'); m.rel = 'manifest'; m.href = 'manifest.json'; document.head.appendChild(m);
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => console.info('تعذر تسجيل Service Worker:', error)));
  }

  if (CATEGORIES.length !== 10 || QUESTIONS.length < 200 || CATEGORIES.some(category => questionsFor(category.id).length < 20)) {
    console.error('بنك الأسئلة غير مكتمل:', { categories: CATEGORIES.length, questions: QUESTIONS.length });
  }

  render();

  const splash = document.getElementById('splash');
  if (splash) {
    const quick = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => splash.classList.add('is-hidden'), quick ? 150 : 1300);
    setTimeout(() => splash.remove(), quick ? 600 : 1900);
  }
})();
