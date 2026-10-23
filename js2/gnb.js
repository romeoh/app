/*!
 * 깨알유머 공통 네비게이션 (GNB)
 * 사용법:
 *   <nav id="gyGnb" data-current="w"></nav>
 *   <script src="//romeoh.github.io/app/js2/gnb.js?v=20261021"></script>
 * - data-current: 아래 MENUS의 id. 없으면 URL 경로로 자동 판별
 * - data-header="1": 공통 타이틀(깨알유머) 바도 함께 그림. 자체 헤더가 없는 페이지용
 *   색상은 MENUS의 header: [그라데이션 시작, 끝, 로고 배경]
 * - 의존성 없음(jQuery/Bootstrap 버전 무관), ES5
 *
 * 통계(GA4, 깨알유머 통합 속성 G-HDR3T58QC9)도 여기서 한다 — 메뉴를 쓰는 모든 페이지가 이 파일을 불러오므로.
 * - GA_SERVICES에 있는 서비스만 이 파일이 gtag를 넣는다(서비스별로 차례로 옮기는 중). 이미 같은 속성 gtag가 있으면 다시 넣지 않는다.
 * - 모든 이벤트에 service(메뉴 id), page_type(파일 이름: main/add/list…), content_id(주소의 글 번호)가 붙는다.
 * - 서비스 JS에서: GaeyouGnb.track('이벤트', { 값 }, { next: true })
 *     next: true = 곧 같은 사이트의 다른 화면으로 이동 → 다음 화면이 보낸다 (GA가 이벤트를 몇 초씩 모아 보내서 이동하면 사라짐)
 * - 이벤트 목록: lumo/docs/analytics-gaeyou.md
 */
(function (window, document) {
	'use strict';

	// 메뉴 순서 = 노출 순서. hidden:true 는 노출 안 함
	var MENUS = [
		{ id: 'lumo',      name: '루모',       href: '/lumo/', accent: true }, // 예측 코너. 다른 메뉴보다 눈에 띄게(.gy-gnb-acc)
		{ id: 't',         name: '깨알테스트', href: '/t/' },
		{ id: 'w',         name: '월드컵',     href: '/w/' },
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
	var GA_ID = 'G-HDR3T58QC9';
	var GA_SERVICES = ['t', 'w'];   // 여기 있는 서비스만 gnb.js가 gtag를 넣는다. 다음: 'm', ...
	// 글 제목을 불러온 뒤에 페이지 조회를 보내는 서비스 (HTML 제목이 모두 '깨알유머'라 GA에서 구분이 안 되므로).
	// 서비스 JS가 GaeyouGnb.pageView(제목)를 부른다. 4초 안에 안 부르면 기본 제목으로 보낸다.
	var GA_LATE_VIEW = ['t', 'w'];
	var SERVICE_NAMES = { t: '깨알테스트', w: '월드컵' };
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
				if (nx && nx[0]) window.gtag('event', nx[0], nx[1] || {});
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
		track('page_view', { page_title: title ? title + ' - ' + name : name, page_location: window.location.href, content_title: title || '' });
	}

	/** 이벤트 보내기. opts.next: 곧 같은 사이트 다른 화면으로 이동 → 다음 화면이 보냄 */
	function track(name, params, opts) {
		var p = {}, k;
		params = params || {};
		for (k in gaBase || {}) if (gaBase.hasOwnProperty(k)) p[k] = gaBase[k];
		for (k in params) if (params.hasOwnProperty(k)) p[k] = params[k];
		if (opts && opts.next) {   // 도착 화면이 보내므로 지금 화면에 gtag가 없어도 된다
			try { window.sessionStorage.setItem('gyGaNext', JSON.stringify([name, p])); return; } catch (x) {}
		}
		if (typeof window.gtag !== 'function') return;
		if (opts && opts.beacon) p.transport_type = 'beacon';
		window.gtag('event', name, p);
	}
	var IMG = '//romeoh.github.io/app/img/';

	var CSS = '' +
		'.gy-hd{position:relative;height:44px;margin:0;padding:0;text-align:center;line-height:0}' +
		'.gy-hd-logo{position:absolute;left:0;top:0;width:47px;height:44px;' +
			'background:url(' + IMG + 'logo.png) 11px 9px/26px no-repeat}' +
		'.gy-hd-title{display:inline-block;height:44px;padding-top:9px}' +
		'.gy-hd-title img{display:inline-block;width:90px;height:auto;vertical-align:top;border:0}' +
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
				'<a class="gy-hd-title" href="/"><img src="' + IMG + 'logo_title_v2.png" alt="깨알유머"></a></div>';
		}
		html += '<div class="gy-gnb">';
		if (cur) {
			html += '<div class="gy-gnb-cur">' +
				'<a href="' + esc(cur.href) + '" data-gnb="' + esc(cur.id) + '" aria-current="page">' + esc(cur.name) + '</a></div>';
		}
		html += '<ul class="gy-gnb-scroll">';
		for (i = 0; i < rest.length; i++) {
			html += rest[i].accent
				? '<li class="gy-gnb-acc"><a href="' + esc(rest[i].href) + '" data-gnb="' + esc(rest[i].id) + '">' + esc(rest[i].name) + '<span class="gy-gnb-acc-dot"></span></a></li>'
				: '<li><a href="' + esc(rest[i].href) + '" data-gnb="' + esc(rest[i].id) + '">' + esc(rest[i].name) + '</a></li>';
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

	function init() {
		if (!gaBase) gaInit();
		injectCss();
		var el = document.getElementById('gyGnb');
		if (el) render(el);
	}

	window.GaeyouGnb = { menus: MENUS, init: init, track: track, pageView: pageView };
	init();
	if (!document.getElementById('gyGnb') && document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	}
})(window, document);
