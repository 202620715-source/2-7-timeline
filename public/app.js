'use strict';

const CLASSROOM = '교실 (2학년 7반)';

const SUBJECT_LOC = {
  '중국어': '2학년관 1층 중국어실',
  '피복아크용접': '무상관 3층 강의실',
  '냉동': '4층 냉동실',
  '영어': CLASSROOM,
  '통합사회': CLASSROOM,
  'AI': '창조관 2층 AI Lab',
  '티그용접': '무상관 3층 강의실',
  '국어': CLASSROOM,
  '음악': '학생회관 1층 음악실',
  '기계요소설계': '무상관 4층 CAD실',
  '배관': '무상관 4층 배관 강의실',
  '수학': CLASSROOM,
  '미술': '1학년관 5층 미술실',
  '체육': '강당',
  '동아리': '교실 (동아리/창체 활동)',
};

const SUBJECT_CLASS = {
  '중국어': 'c-cn',
  '피복아크용접': 'c-weld',
  '냉동': 'c-frz',
  '영어': 'c-en',
  '통합사회': 'c-so',
  'AI': 'c-ai',
  '티그용접': 'c-weld',
  '국어': 'c-ko',
  '음악': 'c-mu',
  '기계요소설계': 'c-cad',
  '배관': 'c-pipe',
  '수학': 'c-ma',
  '미술': 'c-ar',
  '체육': 'c-pe',
  '동아리': 'c-club',
};

const SUBJECT_IMG = {
  '영어': 'subjects/eng.jpg',
  '국어': 'subjects/kor.jpg',
  '수학': 'subjects/math.jpg',
  '통합사회': 'subjects/soc.jpg',
  '피복아크용접': 'subjects/aw.jpg',
  '티그용접': 'subjects/tig.jpg',
  '배관': 'subjects/pipe.jpg',
  '냉동': 'subjects/frz.jpg',
  '기계요소설계': 'subjects/cad.png',
  '미술': 'subjects/art.jpg',
  '중국어': 'subjects/cn.jpg',
  '체육': 'subjects/pe.jpg',
};

const TIMETABLE = {
  1: ['중국어', '피복아크용접', '피복아크용접', '피복아크용접', '냉동', '냉동', '냉동'],
  2: ['영어', '통합사회', 'AI', 'AI', '티그용접', '티그용접', '티그용접'],
  3: ['국어', '음악', '기계요소설계', '기계요소설계', '배관', '배관', '배관'],
  4: ['통합사회', '국어', '수학', '미술', '티그용접', '티그용접', '티그용접'],
  5: ['통합사회', '수학', '체육', '국어', '동아리', '동아리', '동아리'],
};

const DAY_NAMES = { 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 0: '일' };

const PERIOD_START = { 1: '08:30', 2: '09:30', 3: '10:30', 4: '11:30', 5: '13:20', 6: '14:20', 7: '15:20' };
const PERIOD_END = { 1: '09:20', 2: '10:20', 3: '11:20', 4: '12:20', 5: '14:10', 6: '15:10', 7: '16:10' };

const SCHOOL_START_MIN = 8 * 60 + 30;
const HOME_MIN = 16 * 60 + 20;
const PARTY_END_MIN = HOME_MIN + 70;

const ALARMS = [
  { time: '08:30', kind: 'class', period: 1 },
  { time: '09:30', kind: 'class', period: 2 },
  { time: '10:30', kind: 'class', period: 3 },
  { time: '11:30', kind: 'class', period: 4 },
  { time: '12:30', kind: 'lunch' },
  { time: '13:20', kind: 'class', period: 5 },
  { time: '14:20', kind: 'class', period: 6 },
  { time: '15:20', kind: 'class', period: 7 },
  { time: '16:20', kind: 'home' },
  { time: '21:50', kind: 'phone' },
];

const ALARM_ON_KEY = 'bmt27-alarmOn';

function alarmKey(a) {
  return a.kind + ':' + a.time;
}

let alarmOnMap = {};
try {
  const saved = JSON.parse(localStorage.getItem(ALARM_ON_KEY) || '{}');
  if (saved && typeof saved === 'object') alarmOnMap = saved;
} catch (e) {}

function isAlarmOn(a) {
  return alarmOnMap[alarmKey(a)] !== false;
}

function setAlarmOn(a, on) {
  alarmOnMap[alarmKey(a)] = on;
  try { localStorage.setItem(ALARM_ON_KEY, JSON.stringify(alarmOnMap)); } catch (e) {}
}

const MEAL_META = {
  breakfast: { icon: '🌅', name: '조식', sub: '아침 급식', cardClass: 'breakfast' },
  lunch: { icon: '🍱', name: '중식', sub: '점심 급식', cardClass: 'lunch' },
  dinner: { icon: '🌙', name: '석식', sub: '저녁 급식', cardClass: 'dinner' },
};

const STATIC_DIET = {
 "2026-09-15": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "물만두국",
    "두부찜/양념장",
    "돈육김치두루치기",
    "알타리김치",
    "딸기우유"
   ],
   "cal": "1102.5"
  },
  "lunch": {
   "menu": [
    "돼지국밥",
    "부추겉절이",
    "마늘종부들어묵볶음",
    "깻잎튀김",
    "깍두기",
    "하겐다즈아이스크림"
   ],
   "cal": "1169.0"
  },
  "dinner": {
   "menu": [
    "차조밥",
    "건새우아욱국",
    "안동찜닭",
    "게맛살겨자무침",
    "미역줄기볶음",
    "배추김치"
   ],
   "cal": "816.8"
  }
 },
 "2026-09-16": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "한우우거지국",
    "콩나물무침",
    "콩닥콩닥심쿵햄구이",
    "배추김치",
    "우유"
   ],
   "cal": "908.7"
  },
  "lunch": {
   "menu": [
    "커리돈까스덮밥",
    "마들렌",
    "미소된장국",
    "카프리제샐러드",
    "명엽채볶음",
    "배추김치"
   ],
   "cal": "1066.1"
  },
  "dinner": {
   "menu": [
    "크림새우파스타",
    "그린샐러드/유자드레싱",
    "오이피클",
    "우리쌀모짜콤비네이션피자",
    "샤인머스켓스파클링"
   ],
   "cal": "1161.6"
  }
 },
 "2026-09-17": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "꽃게된장찌개",
    "쇠고기장조림",
    "감자채볶음",
    "배추김치",
    "딸기잼설기",
    "우유"
   ],
   "cal": "993.8"
  },
  "lunch": {
   "menu": [
    "백미밥(중식)",
    "잔치국수",
    "김자반",
    "스윗소코순살치킨",
    "배추김치",
    "샤인머스켓"
   ],
   "cal": "1046.4"
  },
  "dinner": {
   "menu": [
    "김치볶음밥",
    "계란파국",
    "궁중떡볶이",
    "생선까스/타르타르소스(23공통유치원)",
    "깍두기",
    "얼려먹는요구르트"
   ],
   "cal": "1051.5"
  }
 },
 "2026-09-18": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "맑은한우소머리국",
    "검은콩조림",
    "도라지일미무침",
    "방울오징어곤약조림",
    "배추김치",
    "우유"
   ],
   "cal": "761.4"
  },
  "lunch": {
   "menu": [
    "기장밥",
    "한우미역국",
    "쪽파무생채",
    "건취나물볶음",
    "무항생제오리불고기",
    "배추김치"
   ],
   "cal": "770.1"
  },
  "dinner": {
   "menu": [
    "혼합잡곡밥",
    "경상도식소고기국",
    "코다리조림",
    "배추김치",
    "초코링비요뜨",
    "깻잎지"
   ],
   "cal": "927.3"
  }
 },
 "2026-09-19": {
  "breakfast": {
   "menu": [
    "양송이스프",
    "모닝빵/딸기잼",
    "멕시칸샐러드",
    "방울토마토",
    "우유"
   ],
   "cal": "540.9"
  },
  "lunch": {
   "menu": [
    "백미밥(중식)",
    "청양시락국",
    "느타리버섯볶음",
    "돈육모듬볶음",
    "깍두기",
    "쌈무"
   ],
   "cal": "694.3"
  },
  "dinner": {
   "menu": [
    "백미밥(석식)",
    "조랭이떡국",
    "햄프시드갈비살미트볼",
    "미역줄기볶음",
    "건새우볶음",
    "배추김치"
   ],
   "cal": "923.5"
  }
 },
 "2026-09-20": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "콩나물국",
    "김자반",
    "모듬수제소시지볶음",
    "김치볶음",
    "우유"
   ],
   "cal": "869.4"
  },
  "lunch": {
   "menu": [
    "기장밥",
    "토종순대국",
    "아삭고추쌈장무침",
    "사각어묵볶음",
    "깻잎튀김",
    "깍두기"
   ],
   "cal": "1037.9"
  },
  "dinner": {
   "menu": [
    "백미밥(석식)",
    "두부김치찌개",
    "오이생채",
    "소고기육전",
    "석박지",
    "바나나"
   ],
   "cal": "809.6"
  }
 },
 "2026-09-21": {
  "breakfast": {
   "menu": [
    "햄계란토스트/딸기잼",
    "허니버터아몬드",
    "초코씨리얼",
    "사과",
    "우유"
   ],
   "cal": "857.5"
  },
  "lunch": {
   "menu": [
    "흑미밥",
    "들깨무채국",
    "불족발숙주볶음",
    "궁채무침",
    "상추/쌈장",
    "배추김치"
   ],
   "cal": "863.4"
  },
  "dinner": {
   "menu": [
    "차조밥",
    "버섯국",
    "콩나물무침",
    "아귀건포채볶음",
    "떡매갈비지짐",
    "깍두기"
   ],
   "cal": "1124.6"
  }
 },
 "2026-09-22": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "어묵국",
    "고추참치야채볶음",
    "베이컨감자볶음",
    "배추김치",
    "꿀설기",
    "우유"
   ],
   "cal": "1185.6"
  },
  "lunch": {
   "menu": [
    "혼합잡곡밥",
    "한우우거지국",
    "두부엿장튀김",
    "꽁치김치조림",
    "고구마샐러드",
    "알타리김치"
   ],
   "cal": "965.4"
  },
  "dinner": {
   "menu": [
    "소고기야채볶음밥",
    "미역두부된장국",
    "완자어묵볶음",
    "칠리깐쇼새우",
    "배추김치",
    "샤인머스켓"
   ],
   "cal": "1436.5"
  }
 },
 "2026-09-23": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "맑은소고기국",
    "건새우마늘종볶음",
    "김치볶음",
    "구이김",
    "두부구이/양념장",
    "우유"
   ],
   "cal": "795.2"
  },
  "lunch": {
   "menu": [
    "기장밥",
    "오징어무국",
    "우엉편조림",
    "한돈단호박된장불고기/파채무침",
    "배추김치",
    "유기농식혜",
    "양배추쌈/쌈장",
    "송편"
   ],
   "cal": "1055.7"
  }
 },
 "2026-09-28": {
  "breakfast": {
   "menu": [
    "바질치즈치아바타",
    "삶은계란",
    "사과",
    "씨리얼",
    "우유"
   ],
   "cal": "734.1"
  },
  "lunch": {
   "menu": [
    "혼합잡곡밥",
    "근대된장나물",
    "돈육김치찌개",
    "명엽채볶음",
    "간장찹쌀꿔바로우",
    "알타리김치"
   ],
   "cal": "1071.6"
  },
  "dinner": {
   "menu": [
    "우동장국",
    "옥수수샐러드",
    "단무지",
    "쫄면",
    "상하이지파이",
    "쁘띠첼복숭아맛"
   ],
   "cal": "1294.6"
  }
 },
 "2026-09-29": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "한우우거지국",
    "곤약메추리알조림",
    "도라지일미무침",
    "알타리김치",
    "딸기우유"
   ],
   "cal": "730.9"
  },
  "lunch": {
   "menu": [
    "카레라이스",
    "유부장국",
    "오이스틱무침",
    "멸치고추장볶음",
    "빅킬바사찰핫도그",
    "배추김치"
   ],
   "cal": "1154.9"
  },
  "dinner": {
   "menu": [
    "흑미밥",
    "건새우아욱국",
    "연근조림",
    "골뱅이야채무침",
    "오징어부추전",
    "배추김치"
   ],
   "cal": "811.7"
  }
 },
 "2026-09-30": {
  "breakfast": {
   "menu": [
    "백미밥(조식)",
    "닭곰탕",
    "감자조림",
    "시금치나물",
    "오리햄구이",
    "배추김치",
    "우유"
   ],
   "cal": "1035.6"
  },
  "lunch": {
   "menu": [
    "기장밥",
    "한우설렁탕",
    "부추겉절이",
    "아삭고추,양파/쌈장",
    "완자어묵볶음",
    "깍두기",
    "골드파인애플"
   ],
   "cal": "836.3"
  },
  "dinner": {
   "menu": [
    "차조밥",
    "부대찌개",
    "우엉채조림",
    "콩나물무침",
    "탕수만두",
    "석박지"
   ],
   "cal": "1051.9"
  }
 }
};

const $ = id => document.getElementById(id);

function seoulNow() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const p = {};
  for (const part of fmt.formatToParts(new Date())) p[part.type] = part.value;
  let h = parseInt(p.hour, 10);
  if (h === 24) h = 0;
  const y = parseInt(p.year, 10), m = parseInt(p.month, 10), d = parseInt(p.day, 10);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const mi = parseInt(p.minute, 10);
  return { y, m, d, h, mi, s: parseInt(p.second, 10), dow, dateKey: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, minutes: h * 60 + mi };
}

function hhmmToMin(s) {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function formatKoreanDate(n) {
  return `${n.y}년 ${n.m}월 ${n.d}일 ${DAY_NAMES[n.dow]}요일`;
}

function subjectOf(dow, period) {
  const row = TIMETABLE[dow];
  if (!row) return null;
  return row[period - 1];
}

function locOf(subject) {
  return SUBJECT_LOC[subject] || '교실';
}

function displayName(subject) {
  return subject === '동아리' ? '동아리/창체' : subject;
}

function pillClass(subject) {
  return SUBJECT_CLASS[subject] || '';
}

const timetableBody = document.querySelector('#timetable tbody');
function renderTimetable() {
  timetableBody.innerHTML = '';
  for (let period = 1; period <= 7; period++) {
    const tr = document.createElement('tr');
    let html = `<td class="period-col">${period}교시<span class="period-time">${PERIOD_START[period]}</span></td>`;
    for (let dow = 1; dow <= 5; dow++) {
      const subject = TIMETABLE[dow][period - 1];
      const img = SUBJECT_IMG[subject];
      const imgHtml = img ? `<img class="subj-img" src="${img}" alt="${displayName(subject)}" loading="lazy">` : '';
      html += `<td data-day="${dow}" data-period="${period}"><span class="pill ${pillClass(subject)}">${displayName(subject)}</span>${imgHtml}<span class="loc">${locOf(subject)}</span></td>`;
    }
    tr.innerHTML = html;
    timetableBody.appendChild(tr);
  }
}

function renderAlarmTimeline() {
  $('alarmTimeline').innerHTML = ALARMS.map(a => {
    const label = a.kind === 'class' ? `${a.period}교시` : a.kind === 'lunch' ? '점심' : a.kind === 'home' ? '집 가기' : '폰 제출';
    const cls = a.kind === 'phone' ? 'phone' : a.kind === 'lunch' ? 'lunch' : a.kind === 'home' ? 'home' : '';
    const on = isAlarmOn(a);
    return `<div class="tl-item ${cls}${on ? '' : ' off'}" data-time="${a.time}" data-key="${alarmKey(a)}" role="button" tabindex="0" title="클릭해서 알림 ${on ? '끄기' : '켜기'}"><span class="tl-dot"></span><span class="tl-time">${a.time}</span><span class="tl-label">${label}</span><span class="tl-switch"><span class="tl-knob"></span></span></div>`;
  }).join('');
  $('alarmTimeline').querySelectorAll('.tl-item').forEach(el => {
    el.addEventListener('click', () => {
      const a = ALARMS.find(x => alarmKey(x) === el.dataset.key);
      if (!a) return;
      setAlarmOn(a, !isAlarmOn(a));
      renderAlarmTimeline();
      updateStatus(seoulNow());
    });
  });
}

function currentPeriod(n) {
  const mins = n.minutes;
  const ranges = [
    [1, 8 * 60 + 30, 9 * 60 + 30], [2, 9 * 60 + 30, 10 * 60 + 30],
    [3, 10 * 60 + 30, 11 * 60 + 30], [4, 11 * 60 + 30, 12 * 60 + 30],
    [5, 13 * 60 + 20, 14 * 60 + 20], [6, 14 * 60 + 20, 15 * 60 + 20],
    [7, 15 * 60 + 20, 16 * 60 + 10],
  ];
  for (const [p, s, e] of ranges) if (mins >= s && mins < e) return p;
  return null;
}

function nextAlarm(n) {
  for (const a of ALARMS) {
    if (!isAlarmOn(a)) continue;
    if (hhmmToMin(a.time) > n.minutes) return a;
  }
  return null;
}

function periodAnnounceText(dow, period) {
  const subject = subjectOf(dow, period);
  if (!subject) return null;
  return { subject: displayName(subject), loc: locOf(subject) };
}

function remainingText(minsLeft) {
  const total = Math.max(0, Math.round(minsLeft));
  const h = Math.floor(total / 60), m = total % 60;
  if (h <= 0) return `${m}분`;
  return `${h}시간 ${m}분`;
}

function updateProgress(n) {
  const track = $('snailTrack');
  const label = $('snailLabel');
  const snail = $('snail');
  const slime = $('snailSlime');
  if (!track) return;
  if (n.dow === 0 || n.dow === 6) {
    track.classList.add('off');
    label.classList.remove('party');
    label.textContent = '오늘은 학교 없는 날 😴 달팽이도 쉬는 중…';
    snail.style.left = '4%';
    slime.style.width = '0%';
    return;
  }
  track.classList.remove('off');
  const now = n.minutes + n.s / 60;
  let pct;
  if (now >= HOME_MIN) {
    pct = 100;
    label.textContent = '🎉 집 가는 시간! 달팽이도 집에 갔어요!';
    label.classList.add('party');
  } else {
    pct = Math.max(0, (now - SCHOOL_START_MIN) / (HOME_MIN - SCHOOL_START_MIN) * 100);
    label.textContent = `🏠 집가려면 ${remainingText(HOME_MIN - now)} 남았어요! 달팽이가 기어가는 중…`;
    label.classList.remove('party');
  }
  const left = 4 + pct * 0.92;
  snail.style.left = left + '%';
  slime.style.width = (left - 4) + '%';
}

const PERF_KEY = 'bmt27-perfStars';
let perfStars = {};
try {
  const saved = JSON.parse(localStorage.getItem(PERF_KEY) || '{}');
  if (saved && typeof saved === 'object') perfStars = saved;
} catch (e) {}

function savePerfStars() {
  try { localStorage.setItem(PERF_KEY, JSON.stringify(perfStars)); } catch (e) {}
}

function perfSet(dateKey) {
  return new Set(perfStars[dateKey] || []);
}

function updatePerfBadges(n) {
  const starred = perfSet(n.dateKey);
  document.querySelectorAll('#timetable td[data-day]').forEach(td => {
    td.classList.toggle(
      'perf-starred',
      td.dataset.day === String(n.dow) && starred.has(Number(td.dataset.period))
    );
  });
}

function weekDates(n) {
  const offset = n.dow === 0 ? 6 : n.dow - 1;
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(Date.UTC(n.y, n.m - 1, n.d - offset + i));
    dates.push({
      key: d.toISOString().slice(0, 10),
      dow: i + 1,
      label: DAY_NAMES[i + 1],
      day: d.getUTCDate(),
    });
  }
  return dates;
}

function renderPerf(n) {
  const grid = $('perfGrid');
  const week = weekDates(n);
  grid.innerHTML = '';

  const corner = document.createElement('div');
  corner.className = 'perf-corner';
  corner.textContent = '교시';
  grid.appendChild(corner);

  for (const d of week) {
    const h = document.createElement('div');
    h.className = 'perf-day-head' + (d.key === n.dateKey ? ' today' : '');
    h.textContent = `${d.label} ${d.day}일`;
    grid.appendChild(h);
  }

  for (let p = 1; p <= 7; p++) {
    const pc = document.createElement('div');
    pc.className = 'perf-period-cell';
    pc.innerHTML = `${p}교시<span class="perf-period-time">${PERIOD_START[p]}</span>`;
    grid.appendChild(pc);
    for (const d of week) {
      const subj = subjectOf(d.dow, p);
      const on = perfSet(d.key).has(p);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'perf-btn' + (on ? ' starred' : '') + (d.key === n.dateKey ? ' today' : '');
      btn.title = `${d.label}요일 ${p}교시${subj ? ' ' + displayName(subj) : ''} · 클릭해서 별표 ${on ? '제거' : '추가'}`;
      btn.innerHTML = `<span class="perf-star-ico">${on ? '★' : '☆'}</span><span class="perf-subject">${subj ? displayName(subj) : '—'}</span>`;
      btn.addEventListener('click', () => {
        ensureAudio();
        beep(on ? 494 : 659, 0, .09, .25);
        const s = perfSet(d.key);
        if (s.has(p)) s.delete(p); else s.add(p);
        if (s.size) perfStars[d.key] = [...s].sort((a, b) => a - b);
        else delete perfStars[d.key];
        savePerfStars();
        renderPerf(n);
        updatePerfBadges(n);
      });
      grid.appendChild(btn);
    }
  }
  updatePerfBadges(n);
}

$('perfResetBtn').addEventListener('click', () => {
  const n = seoulNow();
  for (const d of weekDates(n)) delete perfStars[d.key];
  savePerfStars();
  renderPerf(n);
});

function highlightTimetable(n) {
  document.querySelectorAll('#timetable thead th').forEach(th => th.classList.remove('today'));
  const todayTh = document.querySelector(`#timetable thead th[data-day="${n.dow}"]`);
  if (todayTh) todayTh.classList.add('today');
  document.querySelectorAll('#timetable td').forEach(td => {
    td.classList.remove('today-col', 'current-cell');
    if (td.dataset.day === String(n.dow)) td.classList.add('today-col');
  });
  const cur = currentPeriod(n);
  if (cur) {
    const cell = document.querySelector(`#timetable td[data-day="${n.dow}"][data-period="${cur}"]`);
    if (cell) cell.classList.add('current-cell');
  }
}

function updateStatus(n) {
  const clockEl = $('clock');
  clockEl.innerHTML = `${String(n.h).padStart(2, '0')}:${String(n.mi).padStart(2, '0')}<span class="sec">:${String(n.s).padStart(2, '0')}</span>`;
  $('dateLine').textContent = formatKoreanDate(n);
  $('mealDate').textContent = `${n.m}월 ${n.d}일 (${DAY_NAMES[n.dow]})`;
  highlightTimetable(n);
  updateProgress(n);

  const label = $('statusLabel'), main = $('statusMain'), locEl = $('statusLoc'), nextEl = $('statusNext');

  if (n.dow === 0 || n.dow === 6) {
    label.textContent = '주말';
    label.classList.remove('live');
    main.textContent = `오늘은 ${DAY_NAMES[n.dow]}요일`;
    locEl.textContent = '학교 안 가는 날! 푹 쉬세요.';
  } else {
    const cur = currentPeriod(n);
    if (cur) {
      const info = periodAnnounceText(n.dow, cur);
      label.textContent = `${cur}교시 진행 중`;
      label.classList.add('live');
      main.textContent = info.subject;
      locEl.textContent = `위치: ${info.loc}`;
    } else if (n.minutes >= hhmmToMin('12:30') && n.minutes < hhmmToMin('13:20')) {
      label.textContent = '점심시간';
      label.classList.add('live');
      main.textContent = '점심 먹으러 갑시다!';
      locEl.textContent = '5교시는 13:20 시작';
    } else if (n.minutes >= hhmmToMin('21:50') && n.minutes < 22 * 60 + 40) {
      label.textContent = '폰 제출';
      label.classList.add('live');
      main.textContent = '폰 제출 시간입니다!';
      locEl.textContent = '휴대폰을 제출해 주세요.';
    } else if (n.minutes < hhmmToMin('08:30')) {
      const info = periodAnnounceText(n.dow, 1);
      label.textContent = '아침';
      label.classList.remove('live');
      main.textContent = `1교시는 ${info.subject}`;
      locEl.textContent = `위치: ${info.loc} · 08:30 시작`;
    } else if (n.minutes >= hhmmToMin('16:10') && n.minutes < hhmmToMin('16:20')) {
      label.textContent = '귀가 준비';
      label.classList.remove('live');
      main.textContent = '7교시 끝! 정리하고 나가자';
      locEl.textContent = '16:20에 하교합니다!';
    } else if (n.minutes >= hhmmToMin('16:20') && n.minutes < hhmmToMin('21:50')) {
      label.textContent = '하교 🎉';
      label.classList.remove('live');
      main.textContent = '집 가는 시간! 🎉🎊';
      locEl.textContent = n.dow < 5
        ? `오늘 하루도 수고했어요! 내일 1교시: ${displayName(TIMETABLE[n.dow + 1][0])} (${locOf(TIMETABLE[n.dow + 1][0])})`
        : '오늘 하루도 수고했어요!';
    } else {
      label.textContent = '하루 정리';
      label.classList.remove('live');
      main.textContent = '좋은 하루 보내세요.';
      locEl.textContent = '';
    }
  }

  document.querySelectorAll('.tl-item').forEach(el => el.classList.remove('next'));
  const na = nextAlarm(n);
  if (na) {
    const item = document.querySelector(`.tl-item[data-time="${na.time}"]`);
    if (item) item.classList.add('next');
    const diff = hhmmToMin(na.time) - n.minutes - (n.s > 0 ? 1 : 0);
    let desc = '';
    if (na.kind === 'class') {
      const info = periodAnnounceText(n.dow, na.period);
      desc = info ? ` - ${info.subject} (${info.loc})` : '';
    } else if (na.kind === 'lunch') {
      desc = ' - 오늘의 점심 메뉴';
    } else if (na.kind === 'home') {
      desc = ' - 집 가는 시간! 🎉';
    } else if (na.kind === 'phone') {
      desc = ' - 폰 제출 시간 알림';
    }
    nextEl.textContent = `다음 알림 ${na.time}까지 ${diff}분${desc}`;
  } else {
    nextEl.textContent = '오늘 알림은 모두 끝났습니다.';
  }
}

let dietData = {};
let dietFetchedKey = '';
let dietFailUntil = 0;

function mergeStatic(apiData) {
  const merged = { ...apiData };
  for (const [dkey, meals] of Object.entries(STATIC_DIET)) {
    if (!merged[dkey]) merged[dkey] = {};
    for (const [k, v] of Object.entries(meals)) {
      if (!merged[dkey][k]) merged[dkey][k] = v;
    }
  }
  return merged;
}

async function loadDiet(n, force) {
  const month = n.dateKey.slice(0, 7);
  if (!force && dietFetchedKey === month) { renderDiet(n); return; }
  if (!force && Date.now() < dietFailUntil) return;
  try {
    const res = await fetch(`/api/diet?month=${month}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    dietData = mergeStatic(await res.json());
    dietFetchedKey = month;
    renderDiet(n);
  } catch (e) {
    dietFailUntil = Date.now() + 30000;
    dietData = mergeStatic({});
    renderDiet(n);
    if (!dietData[n.dateKey]) {
      $('mealGrid').innerHTML = `
        <div class="meal-error">
          급식 정보를 불러올 수 없습니다.<br>
          <b>start.bat</b>을 실행해서 서버를 켜고, 이 페이지를 새로고침해 주세요.<br><br>
          <button class="btn primary" id="retryDietBtn">다시 시도</button>
        </div>`;
      $('retryDietBtn').addEventListener('click', () => loadDiet(seoulNow(), true));
    }
  }
}

function cleanMenu(item) {
  return item.replace(/(\s*\([0-9.,\s]+\))+\s*$/g, '').trim() || item;
}

function mealCardHtml(key, meal) {
  const meta = MEAL_META[key];
  const menuHtml = meal && meal.menu && meal.menu.length
    ? `<ul class="menu">${meal.menu.map(m => `<li>${cleanMenu(m)}</li>`).join('')}</ul>`
    : `<p class="meal-empty">이 날 ${meta.name}은 운영되지 않았거나<br>정보가 등록되지 않았습니다.</p>`;
  const kcal = meal && meal.cal ? `<span class="kcal">${meal.cal} kcal</span>` : '';
  return `
    <div class="meal-card ${meta.cardClass}${key === 'lunch' ? ' featured' : ''}">
      <div class="meal-card-head">
        <span class="meal-ico">${meta.icon}</span>
        <div class="meal-name">${meta.name}<small>${meta.sub}</small></div>
        ${kcal}
      </div>
      ${menuHtml}
    </div>`;
}

function renderDiet(n) {
  $('mealGrid').innerHTML = ['breakfast', 'lunch', 'dinner']
    .map(key => mealCardHtml(key, (dietData[n.dateKey] || {})[key]))
    .join('');
}

let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function beep(freq, start, dur, vol = 0.4, type = 'sine') {
  const ctx = audioCtx;
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

function playClassChime() {
  ensureAudio();
  beep(880, 0, 0.18); beep(1108, 0.22, 0.18); beep(1318, 0.44, 0.3);
}

let phoneAlarmTimer = null;
function startPhoneAlarmSound() {
  ensureAudio();
  stopPhoneAlarmSound();
  const pattern = () => {
    for (let i = 0; i < 4; i++) {
      beep(i % 2 ? 988 : 740, i * 0.18, 0.14, 0.5, 'square');
    }
    beep(740, 0.78, 0.4, 0.5, 'square');
    beep(494, 0.78, 0.4, 0.35, 'square');
  };
  pattern();
  phoneAlarmTimer = setInterval(pattern, 1600);
}
function stopPhoneAlarmSound() {
  if (phoneAlarmTimer) { clearInterval(phoneAlarmTimer); phoneAlarmTimer = null; }
}

const fwCanvas = $('fw');
const fctx = fwCanvas.getContext('2d');
const FW_COLORS = ['#fbbf24', '#f43f5e', '#a78bfa', '#34d399', '#38bdf8', '#f472b6', '#fde047'];
const FW_EMOJIS = ['🎉', '🎊', '✨', '🥳', '🎈', '💖', '💥'];
let fwRunning = false;
let fwRafId = null;
let fwStopAt = 0;
let fwRockets = [];
let fwParticles = [];
let fwEmojis = [];
let fwLastLaunch = 0;

function fwResize() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', fwResize);

function fwLaunch() {
  const h = fwCanvas.height;
  fwRockets.push({
    x: fwCanvas.width * (0.15 + Math.random() * 0.7),
    y: h + 10,
    vy: -(h / 110 + Math.random() * (h / 130)),
    targetY: h * (0.14 + Math.random() * 0.3),
    color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
  });
}

function fwExplode(x, y, color) {
  const count = 46 + Math.floor(Math.random() * 26);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
    const speed = 1.6 + Math.random() * 3.4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.011 + Math.random() * 0.013,
      color: Math.random() < 0.75 ? color : FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
      size: 1.6 + Math.random() * 2.2,
    });
  }
  if (Math.random() < 0.5) {
    for (let i = 0; i < 3; i++) {
      fwEmojis.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 40,
        vy: -(0.9 + Math.random() * 1.4),
        rot: (Math.random() - 0.5) * 0.6,
        emoji: FW_EMOJIS[Math.floor(Math.random() * FW_EMOJIS.length)],
        life: 1,
        size: 20 + Math.random() * 14,
      });
    }
  }
}

function fwLoop() {
  if (!fwRunning) return;
  if (fwStopAt && Date.now() > fwStopAt) { fwStop(); return; }
  const w = fwCanvas.width, h = fwCanvas.height;
  fctx.globalCompositeOperation = 'destination-out';
  fctx.fillStyle = 'rgba(0,0,0,0.14)';
  fctx.fillRect(0, 0, w, h);

  const now = performance.now();
  if (now - fwLastLaunch > 520 + Math.random() * 480) {
    fwLaunch();
    fwLastLaunch = now;
  }

  fctx.globalCompositeOperation = 'lighter';
  for (let i = fwRockets.length - 1; i >= 0; i--) {
    const r = fwRockets[i];
    r.y += r.vy;
    fctx.globalAlpha = 1;
    fctx.fillStyle = r.color;
    fctx.beginPath();
    fctx.arc(r.x, r.y, 2.6, 0, Math.PI * 2);
    fctx.fill();
    if (r.y <= r.targetY || r.vy >= 0) {
      fwExplode(r.x, r.y, r.color);
      fwRockets.splice(i, 1);
    }
  }
  for (let i = fwParticles.length - 1; i >= 0; i--) {
    const p = fwParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.vx *= 0.985;
    p.life -= p.decay;
    if (p.life <= 0) { fwParticles.splice(i, 1); continue; }
    fctx.globalAlpha = Math.max(0, p.life);
    fctx.fillStyle = p.color;
    fctx.beginPath();
    fctx.arc(p.x, p.y, p.size * p.life + 0.4, 0, Math.PI * 2);
    fctx.fill();
  }
  fctx.globalCompositeOperation = 'source-over';
  for (let i = fwEmojis.length - 1; i >= 0; i--) {
    const e = fwEmojis[i];
    e.y += e.vy;
    e.rot *= 1.02;
    e.life -= 0.008;
    if (e.life <= 0) { fwEmojis.splice(i, 1); continue; }
    fctx.save();
    fctx.globalAlpha = Math.max(0, e.life);
    fctx.translate(e.x, e.y);
    fctx.rotate(e.rot);
    fctx.font = e.size + 'px sans-serif';
    fctx.textAlign = 'center';
    fctx.fillText(e.emoji, 0, 0);
    fctx.restore();
  }
  fctx.globalAlpha = 1;
  fwRafId = requestAnimationFrame(fwLoop);
}

function fwStart(durationMs) {
  fwResize();
  fwCanvas.style.display = 'block';
  fwStopAt = durationMs ? Date.now() + durationMs : 0;
  if (fwRunning) return;
  fwRunning = true;
  fwLastLaunch = 0;
  fwRafId = requestAnimationFrame(fwLoop);
}

function fwStop() {
  fwRunning = false;
  if (fwRafId) cancelAnimationFrame(fwRafId);
  fwCanvas.style.display = 'none';
  fwRockets = [];
  fwParticles = [];
  fwEmojis = [];
}

function browserNotify(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body, tag: 'bmt27-' + Date.now(), icon: 'logo.jpg' }); } catch (e) {}
  }
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

const overlay = $('overlay');

function showModal({ icon, title, sub, bodyHtml, type }) {
  const modal = $('modal');
  modal.className = 'modal ' + type;
  overlay.classList.toggle('party', type === 'home');
  $('modalIcon').textContent = icon;
  $('modalTitle').textContent = title;
  $('modalSub').textContent = sub || '';
  $('modalBody').innerHTML = bodyHtml || '';
  overlay.classList.remove('hidden');
}

$('modalCloseBtn').addEventListener('click', () => {
  overlay.classList.add('hidden');
  overlay.classList.remove('party');
  stopPhoneAlarmSound();
});

function lunchBodyHtml(n) {
  const day = dietData[n.dateKey];
  if (!day || !day.lunch) return '<p class="meal-empty">오늘 중식 정보가 없습니다.</p>';
  return `<ul class="modal-menu">${day.lunch.menu.map(m => `<li>${cleanMenu(m)}</li>`).join('')}</ul>
    ${day.lunch.cal ? `<p class="meal-cal">총 열량: ${day.lunch.cal} kcal</p>` : ''}`;
}

function fireClassAlarm(n, period) {
  const info = periodAnnounceText(n.dow, period);
  if (!info) return;
  playClassChime();
  vibrate([200, 100, 200]);
  showModal({
    type: 'class',
    icon: '📚',
    title: `${period}교시 - ${info.subject}`,
    sub: `${PERIOD_START[period]} 시작 · 위치: ${info.loc}`,
  });
  browserNotify(`${period}교시: ${info.subject}`, `위치: ${info.loc} (${PERIOD_START[period]} 시작)`);
}

function fireLunchAlarm(n) {
  playClassChime();
  vibrate([200, 100, 200]);
  renderDiet(n);
  showModal({
    type: 'lunch',
    icon: '🍱',
    title: '점심시간입니다!',
    sub: `${n.m}월 ${n.d}일 중식`,
    bodyHtml: lunchBodyHtml(n),
  });
  browserNotify('점심시간입니다!', '오늘의 중식 메뉴를 확인하세요.');
}

function firePhoneAlarm(n) {
  startPhoneAlarmSound();
  vibrate([500, 200, 500, 200, 800]);
  showModal({
    type: 'phone',
    icon: '📱',
    title: '폰 제출 시간!',
    sub: '21:50 - 휴대폰을 제출해 주세요',
  });
  browserNotify('폰 제출 시간!', '휴대폰을 제출해 주세요.');
}

function playHomeFanfare() {
  ensureAudio();
  const seq = [
    // 상행 런
    [523.25, 0, .09, .4], [659.25, .09, .09, .4], [783.99, .18, .09, .4], [1046.5, .27, .2, .45],
    // 신나는 멜로디
    [1046.5, .55, .11, .45], [783.99, .68, .11, .4], [880, .81, .11, .4], [1046.5, .94, .24, .45],
    [932.33, 1.26, .11, .4], [880, 1.39, .11, .4], [783.99, 1.52, .34, .48],
    // 피날레 대코드
    [523.25, 1.95, .55, .38], [659.25, 1.95, .55, .38], [783.99, 1.95, .55, .38], [1046.5, 1.95, .55, .5],
    // 반주 베이스
    [261.63, 0, .25, .35], [261.63, .55, .15, .3], [329.63, .81, .15, .3], [392, 1.26, .26, .3],
    [392, 1.52, .15, .3], [523.25, 1.7, .12, .3], [261.63, 1.95, .55, .35],
    // 반짝 트릴
    [1567.98, 2.0, .07, .28], [2093, 2.12, .07, .3], [1567.98, 2.24, .07, .28], [2093, 2.36, .25, .32],
  ];
  for (const [f, s, d, v] of seq) beep(f, s, d, v, 'triangle');
}

function fireHomeAlarm(n, isTest) {
  playHomeFanfare();
  vibrate([300, 120, 300, 120, 600]);
  fwStart(isTest ? 9000 : 0);
  showModal({
    type: 'home',
    icon: '🎉',
    title: '집 가는 시간!',
    sub: '16:20 - 오늘 하루도 수고했어요!',
    bodyHtml: '<div class="party-emojis">🎉🎊✨🥳🎈</div><p style="text-align:center;font-size:15px;">학교 끝! 신나게 집에 가자~ 🏃💨</p>',
  });
  browserNotify('집 가는 시간! 🎉', '오늘 하루도 수고했어요!');
}

const fired = new Set();

function checkAlarms(n) {
  for (const a of ALARMS) {
    if (!isAlarmOn(a)) continue;
    if ((a.kind === 'class' || a.kind === 'home') && (n.dow === 0 || n.dow === 6)) continue;
    const key = n.dateKey + ' ' + a.time;
    if (fired.has(key)) continue;
    const t = hhmmToMin(a.time);
    if (n.minutes === t && n.s <= 30) {
      fired.add(key);
      if (a.kind === 'class') fireClassAlarm(n, a.period);
      else if (a.kind === 'lunch') fireLunchAlarm(n);
      else if (a.kind === 'home') fireHomeAlarm(n);
      else if (a.kind === 'phone') firePhoneAlarm(n);
    }
  }
}

function enableNotifications() {
  ensureAudio();
  playClassChime();
  if ('Notification' in window) {
    Notification.requestPermission().then(updateNotiState);
  } else {
    updateNotiState('unsupported');
  }
}

function updateNotiState(p) {
  const el = $('notiState');
  if (p === 'granted') el.textContent = '알림과 소리가 켜졌습니다. 지정된 시간에 자동으로 알려드립니다.';
  else if (p === 'denied') el.textContent = '브라우저 알림이 차단되었습니다. 화면 팝업과 소리는 계속 동작합니다.';
  else if (p === 'unsupported') el.textContent = '이 브라우저는 알림을 지원하지 않지만, 화면 팝업과 소리는 동작합니다.';
  else el.textContent = '버튼을 눌러 소리와 알림을 켜주세요.';
}

$('enableNotiBtn').addEventListener('click', enableNotifications);
$('testHomeBtn').addEventListener('click', () => fireHomeAlarm(seoulNow(), true));
$('testPhoneBtn').addEventListener('click', () => firePhoneAlarm(seoulNow()));
$('testClassBtn').addEventListener('click', () => fireClassAlarm(seoulNow(), currentPeriod(seoulNow()) || 1));

let lastTickKey = '';
function tick() {
  const n = seoulNow();
  if (lastTickKey !== n.dateKey) { fired.clear(); lastTickKey = n.dateKey; renderPerf(n); }
  updateStatus(n);
  if (dietFetchedKey !== n.dateKey.slice(0, 7)) loadDiet(n);
  checkAlarms(n);
  const celebrating = n.dow >= 1 && n.dow <= 5 && n.minutes >= HOME_MIN && n.minutes < PARTY_END_MIN;
  if (celebrating) {
    if (!fwRunning) fwStart(0);
  } else if (fwRunning && fwStopAt === 0) {
    fwStop();
  }
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
});

renderTimetable();
renderAlarmTimeline();

const IMG_KEY = 'bmt27-showSubjImg';
function applyImgSetting(show) {
  document.getElementById('timetable').classList.toggle('no-img', !show);
  $('imgToggleBtn').classList.toggle('on', show);
  $('imgToggleLabel').textContent = show ? '과목 사진 켜짐' : '과목 사진 꺼짐';
  try { localStorage.setItem(IMG_KEY, show ? '1' : '0'); } catch (e) {}
}
let showSubjImg = true;
try {
  const saved = localStorage.getItem(IMG_KEY);
  if (saved !== null) showSubjImg = saved === '1';
} catch (e) {}
applyImgSetting(showSubjImg);
$('imgToggleBtn').addEventListener('click', () => {
  applyImgSetting(!$('imgToggleBtn').classList.contains('on'));
});

updateNotiState('Notification' in window ? Notification.permission : 'unsupported');
tick();
setInterval(tick, 1000);
