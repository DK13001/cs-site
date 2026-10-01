// 홍보사이트 공통 스크립트 — 헤더, 주요실적 필터·검색·페이지, 견적문의(메일)
(() => {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40 || document.body.classList.contains('sub'));
  window.addEventListener('scroll', onScroll); onScroll();

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // 주요실적
  const list = document.getElementById('plist');
  if (list) {
    const data = (window.PERF || []).slice().sort((a, b) => String(b.year).localeCompare(String(a.year)));
    let cat = '', q = '', pg = 1; const N = 10;
    const render = () => {
      const f = data.filter((d) => (!cat || d.category === cat) && (!q || `${d.title} ${d.client} ${d.designer}`.includes(q)));
      document.getElementById('pcount').textContent = `전체 ${f.length}건`;
      const pages = Math.max(1, Math.ceil(f.length / N)); pg = Math.min(pg, pages);
      list.innerHTML = f.slice((pg - 1) * N, pg * N).map((d) => `<tr><td>${esc(d.year)}</td><td>${esc(d.category)}</td><td class="l">${esc(d.title)}</td><td>${esc(d.client)}</td><td>${esc(d.designer)}</td></tr>`).join('')
        || '<tr><td colspan="5" style="padding:50px;color:var(--muted)">실적 자료를 준비하고 있습니다.</td></tr>';
      document.getElementById('ppager').innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === pg ? 'on' : ''}" data-p="${i + 1}">${i + 1}</button>`).join('') : '';
    };
    document.getElementById('pcat').addEventListener('click', (e) => {
      if (e.target.dataset.c === undefined) return;
      cat = e.target.dataset.c; pg = 1;
      document.querySelectorAll('#pcat button').forEach((b) => b.classList.toggle('on', b === e.target)); render();
    });
    document.getElementById('pq').addEventListener('input', (e) => { q = e.target.value.trim(); pg = 1; render(); });
    document.getElementById('ppager').addEventListener('click', (e) => { if (e.target.dataset.p) { pg = +e.target.dataset.p; render(); } });
    render();
  }

  // 견적문의 — 정적 사이트이므로 메일 프로그램으로 전송
  const form = document.getElementById('inq');
  if (form) {
    if (!window.CO_EMAIL) {
      document.getElementById('inqBtn').disabled = true;
      document.getElementById('inqMsg').textContent = '온라인 문의 창구를 준비하고 있습니다. 전화로 문의해 주세요.';
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const body = `성함/회사: ${d.name}\n연락처: ${d.contact}\n이메일: ${d.email}\n문의 업무: ${d.service}\n\n${d.message}`;
      location.href = `mailto:${window.CO_EMAIL}?subject=${encodeURIComponent(`[홈페이지 견적문의] ${d.service} - ${d.name}`)}&body=${encodeURIComponent(body)}`;
      document.getElementById('inqMsg').textContent = '메일 프로그램에서 보내기를 눌러 주세요.';
    });
  }
})();
