const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 2727;
const PUBLIC_DIR = __dirname;
const DIET_LIST_URL = 'https://school.busanedu.net/bmt-h/dv/dietView/selectDvList.do';
const NEIS_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const SCHOOL_CODE = 'C10';
const SCHOOL_SD_CODE = '1421117';
const CACHE_TTL = 10 * 60 * 1000;

const cache = new Map();

function lastDayOfMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function toIsoDate(s) {
  return s.slice(0, 4) + '-' + s.slice(5, 7) + '-' + s.slice(8, 10);
}

function emptyMeals() {
  return {};
}

function ensureSlot(meals, dkey) {
  if (!meals[dkey]) meals[dkey] = {};
  return meals[dkey];
}

function putMeal(meals, dkey, label, menu, cal) {
  const slot = ensureSlot(meals, dkey);
  if (!slot[label] && menu.length) {
    slot[label] = { menu, cal: cal || '' };
  }
}

async function fetchFromSchoolSite(month) {
  const [y, m] = month.split('-').map(Number);
  const last = String(lastDayOfMonth(y, m)).padStart(2, '0');
  const body = new URLSearchParams({
    dietTy: '',
    sysId: 'bmt-h',
    monthFirst: month + '-01',
    monthEnmt: month + '-' + last,
  });
  const res = await fetch(DIET_LIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://school.busanedu.net/bmt-h/dv/dietView/selectDietCalendarView.do?mi=605226',
      'User-Agent': 'Mozilla/5.0',
    },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('학교 서버 응답 오류 (' + res.status + ')');
  const arr = JSON.parse(await res.text());
  const meals = emptyMeals();
  const typeMap = { '조식': 'breakfast', '중식': 'lunch', '석식': 'dinner' };
  for (const item of arr) {
    if (!item || item.dietSeq === 'holiday' || !item.dietSeq) continue;
    if (!item.dietDate || typeof item.dietCn !== 'string') continue;
    const label = typeMap[item.dietTy];
    if (!label) continue;
    const dkey = toIsoDate(item.dietDate);
    const menu = item.dietCn.split('\n').map(s => s.trim()).filter(Boolean);
    putMeal(meals, dkey, label, menu, item.dietCal || '');
  }
  return meals;
}

async function fetchFromNeis(month) {
  const [y, m] = month.split('-').map(Number);
  const from = month + '-01';
  const to = month + '-' + String(lastDayOfMonth(y, m)).padStart(2, '0');
  const qs = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: SCHOOL_CODE,
    SD_SCHUL_CODE: SCHOOL_SD_CODE,
    MLSV_FROM_YMD: from.replace(/-/g, ''),
    MLSV_TO_YMD: to.replace(/-/g, ''),
  });
  const res = await fetch(NEIS_URL + '?' + qs.toString(), {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error('NEIS 응답 오류 (' + res.status + ')');
  const j = JSON.parse(await res.text());
  const meals = emptyMeals();
  const typeMap = { '조식': 'breakfast', '중식': 'lunch', '석식': 'dinner' };
  if (!Array.isArray(j.mealServiceDietInfo)) return meals;
  for (const block of j.mealServiceDietInfo) {
    if (!block.row) continue;
    for (const row of block.row) {
      const label = typeMap[row.MMEAL_SC_NM];
      if (!label || !row.MLSV_YMD) continue;
      const dkey = toIsoDate(row.MLSV_YMD.replace(/-/g, '/'));
      const menu = String(row.DDISH_NM || '')
        .split(/<br\s*\/?>/i)
        .map(s => s.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean);
      const cal = String(row.CAL_INFO || '').match(/[\d.]+/);
      putMeal(meals, dkey, label, menu, cal ? cal[0] : '');
    }
  }
  return meals;
}

async function getDietMonth(month) {
  const results = await Promise.allSettled([
    fetchFromSchoolSite(month),
    fetchFromNeis(month),
  ]);
  const meals = emptyMeals();
  const neis = results[1].status === 'fulfilled' ? results[1].value : null;
  const school = results[0].status === 'fulfilled' ? results[0].value : null;
  if (neis) {
    for (const [dkey, day] of Object.entries(neis)) {
      for (const [label, val] of Object.entries(day)) {
        putMeal(meals, dkey, label, val.menu, val.cal);
      }
    }
  }
  if (school) {
    for (const [dkey, day] of Object.entries(school)) {
      for (const [label, val] of Object.entries(day)) {
        putMeal(meals, dkey, label, val.menu, val.cal);
      }
    }
  }
  if (!school && !neis) {
    const reasons = results.map(r => (r.status === 'rejected' ? r.reason.message : '빈 데이터')).join(' / ');
    throw new Error(reasons);
  }
  return meals;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');

    if (u.pathname === '/api/diet') {
      const month = u.searchParams.get('month') || '';
      if (!/^\d{4}-\d{2}$/.test(month)) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'month 파라미터가 올바르지 않습니다 (YYYY-MM)' }));
        return;
      }
      let entry = cache.get(month);
      if (!entry || Date.now() - entry.t > CACHE_TTL) {
        const data = await getDietMonth(month);
        entry = { t: Date.now(), data };
        cache.set(month, entry);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(entry.data));
      return;
    }

    let pathname = u.pathname === '/' ? '/index.html' : decodeURIComponent(u.pathname);
    pathname = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const lower = pathname.toLowerCase().replace(/\\/g, '/');
    const blocked = lower.startsWith('/server.js') || lower.startsWith('/package')
      || lower.startsWith('/start.bat') || lower.startsWith('/.git') || lower.startsWith('/bmt.img');
    if (blocked) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const file = path.join(PUBLIC_DIR, pathname);
    if (!file.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }
      const ext = path.extname(file).toLowerCase();
      const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
      if (['.html', '.css', '.js'].includes(ext)) headers['Cache-Control'] = 'no-cache';
      res.writeHead(200, headers);
      res.end(buf);
    });
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '급식 정보를 가져오지 못했습니다: ' + e.message }));
  }
});

server.listen(PORT, () => {
  console.log('BMT 2-7 알림 서버 실행 중: http://localhost:' + PORT);
});
