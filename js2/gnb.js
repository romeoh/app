/*!
 * 깨알유머 공통 네비게이션 (GNB)
 * 사용법:
 *   <nav id="gyGnb" data-current="w"></nav>
 *   <script src="//romeoh.github.io/app/js2/gnb.js?v=20261021"></script>
 * - data-current: 아래 MENUS의 id. 없으면 URL 경로로 자동 판별
 * - data-header="1": 공통 타이틀(깨알유머) 바도 함께 그림. 자체 헤더가 없는 페이지용
 *   색상은 MENUS의 header: [그라데이션 시작, 끝, 로고 배경]
 *   data-home="/w/": 가운데 "깨알유머" 글자 링크(없으면 메인 /). G 로고는 늘 메인
 *   data-make="/w/make.php": 오른쪽에 + 만들기 버튼
 * - 의존성 없음(jQuery/Bootstrap 버전 무관), ES5
 *
 * 통계(GA4, 깨알유머 통합 속성 G-BCZM5VJWJM)도 여기서 한다 — 메뉴를 쓰는 모든 페이지가 이 파일을 불러오므로.
 * - GA_SERVICES에 있는 서비스만 이 파일이 gtag를 넣는다(서비스별로 차례로 옮기는 중). 이미 같은 속성 gtag가 있으면 다시 넣지 않는다.
 * - 모든 이벤트에 service(메뉴 id), page_type(파일 이름: main/add/list…), content_id(주소의 글 번호)가 붙는다.
 * - 서비스 JS에서: GaeyouGnb.track('이벤트', { 값 }, { next: true })
 *     next: true = 곧 같은 사이트의 다른 화면으로 이동 → 다음 화면이 보낸다 (GA가 이벤트를 몇 초씩 모아 보내서 이동하면 사라짐)
 * - 이벤트 목록: lumo/docs/analytics-gaeyou.md
 * - 하단 공통 줄(공식 X·제휴 문의·개인정보처리방침)도 여기서 body 끝에 붙인다(2026-10-27). 빼려면 <body data-gy-foot="0">
 */
(function (window, document) {
	'use strict';

	// 메뉴 순서 = 노출 순서. hidden:true 는 노출 안 함
	var MENUS = [
		{ id: 'dn',        name: '덕능',       href: '/dn/', underline: true }, // 덕질능력시험(2026-10-26). 글자 아래 빨간 밑줄(.gy-gnb-ul)
		{ id: 't',         name: '깨알테스트', href: '/t/' },
		{ id: 'w',         name: '월드컵',     href: '/w/' },
		{ id: 'lumo',      name: '루모',       href: '/lumo/' }, // 2026-10-26 강조(accent) 뺌 — 다시 켜려면 accent: true
		{ id: 'm',         name: '이름궁합',   href: '/m/' },
		{ id: 'mbti',      name: 'MBTI',       href: '/mbti/ko/' },
		{ id: 'apps/mbti', name: '심리테스트', href: '/apps/mbti/' },
		{ id: 'novel',     name: '소설',       href: '/novel/' },
		{ id: 'game',      name: '깨임',       href: '/game/' },
		{ id: 'gpt',       name: '고민상담소', href: '/gpt/', header: ['#ffb13b', '#ff7e45', '#e88f2a'] },
		{ id: 'merit',     name: '나의장점',   href: '/merit/' },
		{ id: 'saju',      name: '사주운세',   href: '/saju/' },
		{ id: 's',         name: '깨위바위보', href: '/s/add.html' },
		{ id: 'iq',        name: '아이큐테스트', href: '/iq/', hidden: true } // 수리 후 hidden 제거
	];

	var DEFAULT_HEADER = ['#ff6eda', '#ff6868', '#d66db8'];

	// ---- 통계 (GA4) ----
	var GA_ID = 'G-BCZM5VJWJM';
	var GA_SERVICES = ['t', 'w', 'm', 'mbti', 'apps/mbti', 'novel', 'game', 'gpt', 'merit', 's'];   // 여기 있는 서비스만 gnb.js가 gtag를 넣는다 (사주는 astro_web 앱으로 넘어가서 제외)
	// 공유 버튼(data-share·data-sharer·data-sns 등)을 자동으로 share 이벤트로. 서비스 JS가 직접 보내는 곳은 뺀다.
	var GA_SHARE_SELF = ['t', 'w', 'm', 'gpt'];
	// 글 제목을 불러온 뒤에 페이지 조회를 보내는 서비스 (HTML 제목이 모두 '깨알유머'라 GA에서 구분이 안 되므로).
	// 서비스 JS가 GaeyouGnb.pageView(제목)를 부른다. 4초 안에 안 부르면 기본 제목으로 보낸다.
	var GA_LATE_VIEW = ['t', 'w'];
	var SERVICE_NAMES = { t: '깨알테스트', w: '월드컵' };
	// GA 보고서의 페이지 제목 앞에 붙이는 서비스 표시 (브라우저 탭 제목에는 안 붙음). 루모(🔮)는 lumo/src/analytics.php
	var SERVICE_EMOJI = { t: '🧪', w: '🏆', m: '💞', mbti: '🧠', apps_mbti: '🧩', novel: '📖', game: '🎮', gpt: '💬', merit: '🌟', s: '✊', saju: '🔯' };
	function gaTitle(t) {
		var e = gaBase && SERVICE_EMOJI[gaBase.service];
		return (e ? e + ' ' : '') + t;
	}
	var gaViewSent = true;
	var gaBase = null;

	function gaHasTag() {
		var i, d = window.dataLayer || [], sc = document.getElementsByTagName('script');
		for (i = 0; i < sc.length; i++) if ((sc[i].src || '').indexOf('gtag/js?id=' + GA_ID) >= 0) return true;
		for (i = 0; i < d.length; i++) if (d[i] && d[i][0] === 'config' && d[i][1] === GA_ID) return true;
		return false;
	}

	function gaInit() {
		var cur = detectCurrent() || 'etc';
		var file = window.location.pathname.split('/').pop();
		var m = /^\?(\d+)/.exec(window.location.search) || /[?&](?:id|idx)=(\d+)/.exec(window.location.search) || /^#(\d+)/.exec(window.location.hash);
		gaBase = {
			service: cur.replace(/\//g, '_'),
			page_type: !file || file === 'index.html' ? 'main' : file.replace(/\.(html?|php)$/, ''),
			content_group: cur.replace(/\//g, '_')
		};
		if (m) gaBase.content_id = m[1];
		if (GA_SERVICES.indexOf(cur) < 0 || /^\/lumo\//.test(window.location.pathname)) return;   // 루모는 자체 gtag
		if (cur === 't' && !window.location.search && /^#\d+$/.test(window.location.hash)) return;   // test.js가 곧 /t/?번호 로 바꾼다 (page_view 두 번 방지)
		if (!gaHasTag()) {
			window.dataLayer = window.dataLayer || [];
			if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments); };
			var js = document.createElement('script');
			js.async = true;
			js.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
			(document.head || document.documentElement).appendChild(js);
			window.gtag('js', new Date());
			var cfg = {}, k;
			for (k in gaBase) if (gaBase.hasOwnProperty(k)) cfg[k] = gaBase[k];
			if (/[?&]ga_debug=1/.test(window.location.search)) cfg.debug_mode = true;
			cfg.page_title = gaTitle(document.title);
			window.gtag('set', { page_title: cfg.page_title });   // 이벤트에도 같은 제목
			if (GA_LATE_VIEW.indexOf(cur) >= 0 && gaBase.content_id) {
				cfg.send_page_view = false;
				gaViewSent = false;
				setTimeout(function () { pageView(); }, 4000);
			}
			window.gtag('config', GA_ID, cfg);
		}
		// 이전 화면이 넘긴 이벤트
		try {
			var nx = window.sessionStorage.getItem('gyGaNext');
			if (nx) {
				window.sessionStorage.removeItem('gyGaNext');
				nx = JSON.parse(nx);
				if (nx && nx[0]) { nx[1] = nx[1] || {}; nx[1].send_to = GA_ID; window.gtag('event', nx[0], nx[1]); }
			}
		} catch (x) {}
	}

	/** 늦은 페이지 조회: 글 제목이 붙은 page_title로. 한 번만 보낸다 */
	function pageView(title) {
		if (gaViewSent || typeof window.gtag !== 'function') return;
		gaViewSent = true;
		var name = SERVICE_NAMES[gaBase.service] || '깨알유머';
		if (title) {
			try { document.title = title + ' - ' + name; } catch (x) {}   // 브라우저 탭에도
		}
		var m = /^\?(\d+)/.exec(window.location.search) || /[?&](?:id|idx)=(\d+)/.exec(window.location.search) || /^#(\d+)/.exec(window.location.hash);
		if (m) gaBase.content_id = m[1];
		var pt = gaTitle(title ? title + ' - ' + name : name);
		window.gtag('set', { page_title: pt });
		track('page_view', { page_title: pt, page_location: window.location.href, content_title: title || '' });
	}

	/** 이벤트 보내기. opts.next: 곧 같은 사이트 다른 화면으로 이동 → 다음 화면이 보냄 */
	function track(name, params, opts) {
		var p = {}, k;
		params = params || {};
		if (MAKE_EVENTS.indexOf(name) >= 0) made();   // 재방문 재기: 만든 사람 표시
		for (k in gaBase || {}) if (gaBase.hasOwnProperty(k)) p[k] = gaBase[k];
		for (k in params) if (params.hasOwnProperty(k)) p[k] = params[k];
		if (opts && opts.next) {   // 도착 화면이 보내므로 지금 화면에 gtag가 없어도 된다
			try { window.sessionStorage.setItem('gyGaNext', JSON.stringify([name, p])); return; } catch (x) {}
		}
		if (typeof window.gtag !== 'function') return;
		if (opts && opts.beacon) p.transport_type = 'beacon';
		p.send_to = GA_ID;   // 예전 속성의 gtag가 같이 있는 페이지(고민상담소 등)에서 그쪽으로 새지 않게
		window.gtag('event', name, p);
	}

	// ---- 재방문 재기 (2026-10-27, 플랫폼 로드맵 0단계 — gaeyou.com/growth/CLAUDE.md) ----
	// 이 브라우저가 다녀간 날·그날 들른 서비스를 localStorage 'gyVisit'에만 적는다(서버·DB에 안 씀). 그날 처음 화면에서 GA로:
	//   gy_day(오늘 왔음) · gy_back7(지난 방문이 1~7일 전 = 다시 옴) · gy_maker_day / gy_maker_back7(무언가 만든 적 있는 브라우저)
	//   gy_multi(오늘 두 번째 서비스에 들어감, 하루 한 번)
	// 루모(lumo.js)에 같은 규칙의 사본이 있다 — 고치면 같이 고칠 것.
	var MAKE_EVENTS = ['test_create', 'wc_create', 'dn_create', 'lumo_create', 'psy_create', 'novel_create', 'srp_create'];
	function ymd(t) {
		return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
	}
	function dayDiff(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5); }
	function visitLoad() {
		try { return JSON.parse(window.localStorage.getItem('gyVisit') || 'null') || {}; } catch (x) { return null; }
	}
	function visitSave(v) {
		try { window.localStorage.setItem('gyVisit', JSON.stringify(v)); } catch (x) {}
	}
	/** 만든 적 있는 브라우저: 만들기 이벤트로 남긴 표시, 또는 깨알테스트 만들기가 남기는 'test' 목록 */
	function isMaker(v) {
		if (v.m) return true;
		try { var t = JSON.parse(window.localStorage.getItem('test') || '[]'); return !!(t && t.length); } catch (x) { return false; }
	}
	function made() {
		var v = visitLoad();
		if (v) { v.m = 1; visitSave(v); }
	}
	function visit() {
		var svc = gaBase && gaBase.service, v = visitLoad();
		if (!svc || svc === 'etc' || v === null || typeof window.gtag !== 'function') return;   // gtag 없는 화면은 적지도 않음 → 다음 화면이 보냄
		var today = ymd(new Date()), d = v.d || [], last = d.length ? d[d.length - 1] : '', ev = [], gap, p, n7 = 0, i, k, c = 0;
		if (last !== today) {
			gap = last ? dayDiff(last, today) : -1;
			d.push(today);
			while (d.length && dayDiff(d[0], today) > 27) d.shift();
			for (i = 0; i < d.length; i++) if (dayDiff(d[i], today) < 7) n7++;
			v.d = d;
			v.f = v.f || today;
			v.s = {};
			p = { days7: n7, days28: d.length, gap: gap < 0 ? 'new' : gap > 7 ? '8+' : String(gap), maker: isMaker(v) ? 'yes' : 'no' };
			ev.push(['gy_day', p]);
			if (gap >= 1 && gap <= 7) ev.push(['gy_back7', p]);
			if (p.maker === 'yes') {
				ev.push(['gy_maker_day', p]);
				if (gap >= 1 && gap <= 7) ev.push(['gy_maker_back7', p]);
			}
		}
		v.s = v.s || {};
		if (!v.s[svc]) {
			v.s[svc] = 1;
			for (k in v.s) if (v.s.hasOwnProperty(k)) c++;
			if (c === 2) ev.push(['gy_multi', { services: Object.keys ? Object.keys(v.s).join(',') : '' }]);
		}
		visitSave(v);
		for (i = 0; i < ev.length; i++) track(ev[i][0], ev[i][1]);
	}

	// 공유 버튼 자동 수집
	function bindShare() {
		var cur = gaBase ? gaBase.service : '';
		if (!cur || GA_SHARE_SELF.indexOf(cur) >= 0) return;
		document.addEventListener('click', function (e) {
			var a = e.target, attrs = ['data-share', 'data-sharer', 'data-sharer-extend', 'data-sns'], i, v;
			while (a && a !== document) {
				for (i = 0; i < attrs.length; i++) {
					v = a.getAttribute && a.getAttribute(attrs[i]);
					if (v !== null && v !== undefined) return track('share', { method: v || attrs[i] }, { beacon: true });
				}
				a = a.parentNode;
			}
		}, true);
	}
	// 배너(data-gy-promo="이름") 클릭 = select_promotion. 루모로 가면 도착한 루모 화면이 보낸다(lumoGaNext)
	function bindPromo() {
		document.addEventListener('click', function (e) {
			var a = e.target;
			while (a && a !== document && !(a.getAttribute && a.getAttribute('data-gy-promo'))) a = a.parentNode;
			if (!a || a === document) return;
			var href = a.getAttribute('href') || '';
			var params = { promotion_name: a.getAttribute('data-gy-promo'), creative_slot: a.getAttribute('data-gy-slot') || '', link_url: href };
			var plain = !(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) && !a.target;
			if (plain && href.indexOf('/lumo/') === 0) {
				try { window.sessionStorage.setItem('lumoGaNext', JSON.stringify(['select_promotion', merge(params)])); return; } catch (x) {}
			}
			track('select_promotion', params, { beacon: true });
		}, true);
	}

	var IMG = '//romeoh.github.io/app/img/';

	var CSS = '' +
		/* 공유 버튼 (2026-10-24): 1줄 X·쓰레드(반반) / 2줄 카톡·주소 복사(같게)·공유 아이콘(작게) — GaeyouGnb.shareButtons() */
		'.gy-foot{clear:both;margin:28px auto 0;padding:18px 16px 26px;max-width:640px;text-align:center;font:13px/1.9 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:#8a8790;word-break:keep-all}' +
		'.gy-foot a{color:#6f6b78;text-decoration:none;white-space:nowrap}.gy-foot a:hover{text-decoration:underline}' +
		'.gy-foot svg{vertical-align:-2px;margin-right:4px}.gy-foot i{font-style:normal;margin:0 8px;color:#c9c5cf}' +
		'.gy-foot p{margin:2px 0 0;font-size:12px;color:#a9a5b0}' +
		'.gy-share{display:flex;flex-direction:column;gap:6px;margin:0}' +
		'.gy-share-row{display:flex;gap:6px;margin:0}' +
		'.gy-share-btn{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:6px;height:44px;margin:0;padding:0 6px;border-radius:6px;' +
			'font-size:15px;font-weight:bold;line-height:1;text-decoration:none!important;cursor:pointer;box-sizing:border-box;-webkit-tap-highlight-color:transparent;white-space:nowrap}' +
		'.gy-share-x{background:#000;color:#fff!important;border:1px solid #000}' +
		'.gy-share-th{background:#fff;color:#000!important;border:1px solid #000}' +
		'.gy-share-at{font-size:18px;line-height:1;font-weight:900;margin-top:-2px}' +
		'.gy-share-kakao{background:#FEE500;color:#191919!important;border:1px solid #FEE500}' +
		'.gy-share-copy{background:#fff;color:#333!important;border:1px solid #ccc}' +
		'.gy-share-more{flex:0 0 48px;background:#f2f2f2;color:#333!important;border:1px solid #ccc}' +
		'.gy-share-btn:active{opacity:.8}' +
		'.gy-hd{position:relative;height:44px;margin:0;padding:0;text-align:center;line-height:0}' +
		'.gy-hd-logo{position:absolute;left:0;top:0;width:47px;height:44px;' +
			'background:url(' + IMG + 'logo.png) 11px 9px/26px no-repeat}' +
		'.gy-hd-title{display:inline-block;height:44px;padding-top:9px}' +
		'.gy-hd-title img{display:inline-block;width:90px;height:auto;vertical-align:top;border:0}' +
		'.gy-hd-make{position:absolute;right:6px;top:7px;display:flex;align-items:center;gap:3px;height:30px;padding:0 10px 0 7px;border-radius:15px;' +
			'background:rgba(255,255,255,.95);color:#222!important;font:700 13px/1 -apple-system,"Apple SD Gothic Neo",sans-serif;text-decoration:none!important}' +
		'.gy-hd-make svg{display:block}' +
		'#gyGnb{display:block;margin:0;padding:0}' +
		'.gy-gnb{display:flex;align-items:stretch;height:40px;background:#fff;border-bottom:1px solid #dbdcdf;' +
			'font-family:"나눔고딕",NanumGothic,"맑은 고딕","Malgun Gothic",Helvetica,sans-serif;box-sizing:border-box;' +
			'position:relative;overflow:hidden;-webkit-user-select:none;user-select:none;margin:0;padding:0}' +
		'.gy-gnb *{box-sizing:border-box}' +
		'.gy-gnb a{display:flex;align-items:center;height:100%;padding:0 14px;font-size:14px;font-weight:600;' +
			'line-height:1;color:#222;text-decoration:none;white-space:nowrap;-webkit-tap-highlight-color:transparent}' +
		'.gy-gnb a:hover,.gy-gnb a:focus{text-decoration:none;color:#000}' +
		'.gy-gnb-cur{flex:0 0 auto;position:relative;z-index:2;background:#e6e8eb;box-shadow:2px 0 4px rgba(0,0,0,.08)}' +
		'.gy-gnb-cur a,.gy-gnb-cur a:hover,.gy-gnb-cur a:focus{color:#111;font-weight:800}' +
		'.gy-gnb-scroll{flex:1 1 auto;min-width:0;display:flex;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;' +
			'scrollbar-width:none;-ms-overflow-style:none;list-style:none;margin:0;padding:0 24px 0 4px}' +
		'.gy-gnb-scroll::-webkit-scrollbar{display:none}' +
		'.gy-gnb-scroll li{flex:0 0 auto;margin:0;padding:0}' +
		'.gy-gnb-fade{position:absolute;top:0;right:0;bottom:0;width:36px;pointer-events:none;z-index:1;' +
			'background:linear-gradient(to right,rgba(255,255,255,0),#fff 75%);transition:opacity .2s}' +
		'.gy-gnb-fade:after{content:"\\203A";position:absolute;right:6px;top:50%;margin-top:-11px;font-size:20px;' +
			'line-height:20px;color:#aaa}' +
		'.gy-gnb.is-end .gy-gnb-fade{opacity:0}' +
		'.gy-gnb-gap{height:8px;background:#eaecef}' +
		// 루모: 루모 로고처럼 노랑 바탕 + 검정 테두리 + 분홍 그림자
		'.gy-gnb-acc{display:flex;align-items:center;padding:0 6px 0 4px}' +
		'.gy-gnb .gy-gnb-acc a{height:28px;padding:0 11px;border:2px solid #1C1A17;border-radius:8px;background:#FFE45C;' +
			'box-shadow:2px 2px 0 #D6246E;color:#1C1A17;font-weight:900;letter-spacing:-.2px}' +
		'.gy-gnb .gy-gnb-acc a:hover,.gy-gnb .gy-gnb-acc a:focus{color:#1C1A17;background:#ffdd2e}' +
		'.gy-gnb-acc a:active{transform:translate(1px,1px);box-shadow:1px 1px 0 #D6246E}' +
		// 덕능: 글자 아래 빨간 밑줄 (2026-10-26)
		'.gy-gnb .gy-gnb-ul a{text-decoration:underline!important;text-decoration-color:#D3364C!important;text-decoration-thickness:3px!important;text-underline-offset:5px}' +
		'.gy-gnb-acc-dot{display:inline-block;width:6px;height:6px;margin:0 0 0 5px;border-radius:50%;background:#D6246E;vertical-align:middle}';

	function detectCurrent() {
		var path = window.location.pathname.replace(/^\/+/, '');
		var i, id;
		for (i = 0; i < MENUS.length; i++) {
			id = MENUS[i].id;
			if (path === id || path.indexOf(id + '/') === 0) return id;
		}
		return null;
	}

	function esc(s) {
		return String(s).replace(/[&<>"]/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
		});
	}

	function injectCss() {
		if (document.getElementById('gyGnbCss')) return;
		var style = document.createElement('style');
		style.id = 'gyGnbCss';
		style.appendChild(document.createTextNode(CSS));
		(document.head || document.getElementsByTagName('head')[0]).appendChild(style);
	}

	function render(el) {
		if (el.getAttribute('data-gnb-ready')) return;
		var curId = el.getAttribute('data-current') || detectCurrent();
		var cur = null, rest = [], i, m;

		for (i = 0; i < MENUS.length; i++) {
			m = MENUS[i];
			if (m.id === curId) cur = m;
			else if (!m.hidden) rest.push(m);
		}

		var html = '';
		if (el.getAttribute('data-header') === '1') {
			var hc = (cur && cur.header) || DEFAULT_HEADER;
			html += '<div class="gy-hd" style="background-image:linear-gradient(99deg,' + esc(hc[0]) + ',' + esc(hc[1]) + ')">' +
				'<a class="gy-hd-logo" href="/" style="background-color:' + esc(hc[2]) + '" aria-label="깨알유머 홈"></a>' +
				'<a class="gy-hd-title" href="' + esc(el.getAttribute('data-home') || '/') + '"><img src="' + IMG + 'logo_title_v2.png" alt="깨알유머"></a>' +
				(el.getAttribute('data-make') ? '<a class="gy-hd-make" href="' + esc(el.getAttribute('data-make')) + '" data-gnb-make>' +
					'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>만들기</a>' : '') +
				'</div>';
		}
		html += '<div class="gy-gnb">';
		if (cur) {
			html += '<div class="gy-gnb-cur' + (cur.underline ? ' gy-gnb-ul' : '') + '">' +
				'<a href="' + esc(cur.href) + '" data-gnb="' + esc(cur.id) + '" aria-current="page">' + esc(cur.name) + '</a></div>';
		}
		html += '<ul class="gy-gnb-scroll">';
		for (i = 0; i < rest.length; i++) {
			html += rest[i].accent
				? '<li class="gy-gnb-acc"><a href="' + esc(rest[i].href) + '" data-gnb="' + esc(rest[i].id) + '">' + esc(rest[i].name) + '<span class="gy-gnb-acc-dot"></span></a></li>'
				: '<li' + (rest[i].underline ? ' class="gy-gnb-ul"' : '') + '><a href="' + esc(rest[i].href) + '" data-gnb="' + esc(rest[i].id) + '">' + esc(rest[i].name) + '</a></li>';
		}
		html += '</ul><span class="gy-gnb-fade"></span></div><div class="gy-gnb-gap"></div>';

		// 기존 헤더의 float 로고(.gaeyou)가 3px 넘쳐 네비를 밀어내는 것 방지
		var prev = el.previousElementSibling;
		if (prev && prev.tagName === 'HEADER') prev.style.overflow = 'hidden';

		el.innerHTML = html;
		el.setAttribute('data-gnb-ready', '1');
		bindTrack(el, curId);
		bindScroll(el.querySelector('.gy-gnb'), el.querySelector('.gy-gnb-scroll'));
	}

	// 메뉴 클릭을 구글 애널리틱스(GA4) 이벤트로: 콘텐츠 사이 이동 동선 (gtag가 있는 페이지에서만)
	function bindTrack(el, curId) {
		el.addEventListener('click', function (e) {
			var a = e.target;
			while (a && a !== el && !(a.getAttribute && a.getAttribute('data-gnb'))) a = a.parentNode;
			if (!a || a === el) return;
			var menu = a.getAttribute('data-gnb'), href = a.getAttribute('href');
			var to = null, i;
			for (i = 0; i < MENUS.length; i++) if (MENUS[i].id === menu) to = MENUS[i];
			var params = { menu: menu, from: curId || 'none', link_url: href };
			var plain = !(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) && !a.target;
			// GA는 이벤트를 몇 초씩 모아 보내서 바로 이동하면 사라진다 → 도착한 화면이 대신 보낸다.
			// 루모는 lumoGaNext, 다른 메뉴는 gyGaNext. 도착 화면에 아직 이 속성 gtag가 없는 서비스면 잠깐 기다렸다 이동.
			if (plain && href.indexOf('/lumo/') === 0) {
				try { window.sessionStorage.setItem('lumoGaNext', JSON.stringify(['gnb_click', merge(params)])); return; } catch (x) {}
			}
			if (plain && to && GA_SERVICES.indexOf(to.id) >= 0) return track('gnb_click', params, { next: true });
			if (typeof window.gtag !== 'function') return;
			track('gnb_click', params, { beacon: true });
			if (plain) {
				e.preventDefault();
				setTimeout(function () { window.location.href = a.href; }, 350);
			}
		});
	}

	function merge(params) {
		var p = {}, k;
		for (k in gaBase || {}) if (gaBase.hasOwnProperty(k)) p[k] = gaBase[k];
		for (k in params) if (params.hasOwnProperty(k)) p[k] = params[k];
		return p;
	}

	function bindScroll(bar, scroller) {
		function update() {
			var end = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
			bar.className = end ? 'gy-gnb is-end' : 'gy-gnb';
		}
		scroller.addEventListener('scroll', update);
		window.addEventListener('resize', update);
		window.addEventListener('load', update);
		// PC: 세로 휠을 가로 스크롤로 변환
		scroller.addEventListener('wheel', function (e) {
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && scroller.scrollWidth > scroller.clientWidth) {
				scroller.scrollLeft += e.deltaY;
				e.preventDefault();
			}
		}, { passive: false });
		update();
	}

	// ---- 공유 (2026-10-24) ----
	// 서비스마다 글·주소는 각자 만들고, 보내는 곳(X·쓰레드·폰 공유창)과 버튼 모양은 여기서 같게 한다.
	var X_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
	var SHARE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

	var KAKAO_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.48 3 2 6.54 2 10.9c0 2.8 1.86 5.27 4.66 6.67l-.95 3.48c-.08.31.27.56.54.38l4.13-2.74c.53.06 1.07.1 1.62.1 5.52 0 10-3.54 10-7.89S17.52 3 12 3z"/></svg>';
	var LINK_SVG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

	/**
	 * 공유 버튼 HTML. verb: '확인'(공유해야 결과가 보이는 곳) 또는 '공유'. 버튼마다 data-share="twitter|threads|kakao|copy|native".
	 * attr를 주면 data-share 대신 그 속성 이름을 쓴다(예: 'data-alert' — 누르면 안내만).
	 */
	function shareButtons(verb, attr) {
		verb = verb || '공유';
		attr = attr || 'data-share';
		setTimeout(preloadKakao, 0);   // 화면에 그려진 뒤 카톡 SDK 미리 불러오기
		var b = function (cls, v, inner, extra) {
			return '<a class="gy-share-btn ' + cls + '" ' + attr + '="' + v + '" role="button"' + (extra || '') + '>' + inner + '</a>';
		};
		return '<div class="gy-share">' +
			'<div class="gy-share-row">' +
				b('gy-share-x', 'twitter', X_SVG + 'X로 ' + verb) +
				b('gy-share-th', 'threads', '<span class="gy-share-at" aria-hidden="true">@</span>쓰레드로 ' + verb) +
			'</div><div class="gy-share-row">' +
				b('gy-share-kakao', 'kakao', KAKAO_SVG + '카톡 공유') +
				b('gy-share-copy', 'copy', LINK_SVG + '주소 복사') +
				b('gy-share-more', 'native', SHARE_SVG, ' aria-label="다른 앱으로 공유" title="다른 앱으로 공유"') +
			'</div></div>';
	}

	// 카카오톡 공유: Kakao SDK v2. 공유 버튼이 있는 화면이면 미리 불러 둔다(누르는 순간 바로 열리게).
	// 예전 화면의 v1 SDK(developers.kakao.com)는 Kakao.Share가 없어서 v2로 바꿔 끼운다.
	var KAKAO_KEY = 'eaed55751e121f59b09594ba64fa7558';
	var kakaoWait = null, kakaoTried = false;
	function kakaoV2() { return !!(window.Kakao && String(window.Kakao.VERSION || '').charAt(0) === '2'); }
	// Kakao.Share는 v2에서 init()한 뒤에 생긴다
	function kakaoReady(cb) {
		if (kakaoV2()) {
			try { if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY); } catch (e) { return cb(false); }
			return cb(!!window.Kakao.Share);
		}
		if (kakaoWait) return kakaoWait.push(cb);
		if (kakaoTried && !kakaoV2()) {   // 불러왔는데 예전 v1이 다시 덮어썼으면 한 번 더
			kakaoTried = false;
		}
		kakaoWait = [cb];
		kakaoTried = true;
		var sc = document.createElement('script');
		sc.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
		sc.crossOrigin = 'anonymous';
		var done = function (ok) {
			var list = kakaoWait; kakaoWait = null;
			for (var i = 0; i < list.length; i++) {
				if (!ok || !kakaoV2()) list[i](false); else kakaoReady(list[i]);
			}
		};
		sc.onload = function () { done(true); };
		sc.onerror = function () { done(false); };
		document.head.appendChild(sc);
	}
	function preloadKakao() {
		if (document.querySelector('.gy-share, [data-share="kakao"]')) kakaoReady(function () {});
	}

	function sendKakao(o, text, url) {
		var link = { mobileWebUrl: url || location.href, webUrl: url || location.href };
		kakaoReady(function (ok) {
			if (!ok) return copyText((text ? text + '\n' : '') + (url || ''), '카카오톡을 열 수 없어 복사했어요. 카톡에 붙여 넣어 주세요.');
			try {
				if (o.image) {
					window.Kakao.Share.sendDefault({ objectType: 'feed',
						content: { title: (o.title || '깨알유머').substr(0, 100), description: text.substr(0, 200), imageUrl: o.image, link: link },
						buttons: [{ title: o.button || '보러 가기', link: link }] });
				} else {
					window.Kakao.Share.sendDefault({ objectType: 'text', text: (text || o.title || '').substr(0, 200), link: link, buttonTitle: o.button || '보러 가기' });
				}
			} catch (e) {
				copyText((text ? text + '\n' : '') + (url || ''), '카카오톡을 열 수 없어 복사했어요. 카톡에 붙여 넣어 주세요.');
			}
		});
	}

	function copyText(text, msg) {
		var done = function () { alert(msg || '복사했어요. 원하는 곳에 붙여 넣어 공유하세요.'); };
		var ask = function () { window.prompt('아래 내용을 복사해 공유하세요.', text); };
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(done, ask);
			return;
		}
		var ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		try { if (document.execCommand('copy')) done(); else ask(); } catch (e) { ask(); }
		document.body.removeChild(ta);
	}

	/**
	 * 보내기. method: twitter|x, threads, kakao, copy(주소만), native. o: { text, url, title, image(카톡 카드 그림), button, newWindow }
	 * X·쓰레드는 같은 창에서 이동(newWindow면 새 창, 막히면 같은 창). 폰 공유창은 클릭 직후에 불러야 열리고, 없거나 막히면 복사한다.
	 */
	function share(method, o) {
		o = o || {};
		var text = (o.text || '').replace(/\n{3,}/g, '\n\n'), url = o.url || '', go;
		go = function (u) {
			if (o.newWindow) {
				var w = window.open(u, '_blank');
				if (w) return;
			}
			top.location.href = u;
		};
		if (method === 'twitter' || method === 'x') {
			return go('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + (url ? '\n' + url : '')));
		}
		if (method === 'threads') {
			if (text.length > 450) text = text.substr(0, 450) + '...';
			return go('https://www.threads.com/intent/post?text=' + encodeURIComponent(text) + (url ? '&url=' + encodeURIComponent(url) : ''));
		}
		if (!url && (method === 'kakao' || method === 'copy')) {   // 글 안에 주소를 넣는 서비스(이름궁합·깨위바위보 등)
			var m = text.match(/https?:\/\/[^\s]+/);
			if (m) url = m[0];
		}
		if (method === 'kakao') return sendKakao(o, text, url);
		if (method === 'copy') return copyText(url || text, '주소를 복사했어요.');
		if (method === 'native') {
			if (navigator.share) {
				var d = { text: text };
				if (o.title) d.title = o.title;
				if (url) d.url = url;
				navigator.share(d)['catch'](function (e) {
					if (!e || e.name !== 'AbortError') copyText(text + (url ? '\n' + url : ''));
				});
			} else {
				copyText(text + (url ? '\n' + url : ''));
			}
		}
	}

	// ---- 하단 공통 줄: 공식 X·제휴 문의 (2026-10-27) ----
	var FOOT_X = 'gaeyoukr';
	var FOOT_MAIL = ['romeoh', 'naver.com'];   // 소스에 주소를 통째로 두지 않는다(수집 봇)
	function renderFoot() {
		if (!document.body || document.body.getAttribute('data-gy-foot') === '0' || document.querySelector('.gy-foot')) return;
		var mail = FOOT_MAIL.join('@'), f = document.createElement('footer');
		f.className = 'gy-foot';
		f.innerHTML = '<a href="https://x.com/' + FOOT_X + '" target="_blank" rel="noopener" data-gy-foot="x">' +
			'<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
			'@' + FOOT_X + '</a><i>·</i><a href="mailto:' + mail + '" data-gy-foot="mail">제휴·문의 ' + mail + '</a>' +
			'<p><a href="/privacy.html" data-gy-foot="privacy">개인정보처리방침</a><i>·</i>© 깨알유머</p>';
		document.body.appendChild(f);
		f.addEventListener('click', function (e) {
			var a = e.target.closest ? e.target.closest('[data-gy-foot]') : null;
			if (a) track('footer_click', { link: a.getAttribute('data-gy-foot') });
		});
	}

	function init() {
		if (!gaBase) { gaInit(); bindShare(); bindPromo(); setTimeout(visit, 2000); }   // 서비스가 gtag를 늦게 넣는 화면(덕능 등)도 기다렸다가
		if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preloadKakao); else preloadKakao();
		if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderFoot); else renderFoot();
		injectCss();
		var el = document.getElementById('gyGnb');
		if (el) render(el);
	}

	window.GaeyouGnb = { menus: MENUS, init: init, track: track, made: made, pageView: pageView, share: share, shareButtons: shareButtons };
	init();
	if (!document.getElementById('gyGnb') && document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	}
})(window, document);
