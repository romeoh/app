/*!
 * 깨알유머 공통 네비게이션 (GNB)
 * 사용법:
 *   <nav id="gyGnb" data-current="w"></nav>
 *   <script src="//romeoh.github.io/app/js2/gnb.js?v=20261021"></script>
 * - data-current: 아래 MENUS의 id. 없으면 URL 경로로 자동 판별
 * - data-header="1": 공통 타이틀(깨알유머) 바도 함께 그림. 자체 헤더가 없는 페이지용
 *   색상은 MENUS의 header: [그라데이션 시작, 끝, 로고 배경]
 * - 의존성 없음(jQuery/Bootstrap 버전 무관), ES5
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
			var params = { menu: a.getAttribute('data-gnb'), from: curId || 'none', link_url: a.getAttribute('href'), transport_type: 'beacon' };
			if (typeof window.gtag === 'function') {
				// 이동하면서 이벤트가 사라지지 않게: 보낸 뒤(최대 0.7초) 이동
				if (!(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) && !a.target) {
					e.preventDefault();
					var href = a.href, gone = false;
					var go = function () { if (!gone) { gone = true; window.location.href = href; } };
					params.event_callback = go;
					params.event_timeout = 600;
					setTimeout(go, 700);
				}
				window.gtag('event', 'gnb_click', params);
			} else if (window.dataLayer && window.dataLayer.push) {
				window.dataLayer.push({ event: 'gnb_click', gnb_menu: params.menu, gnb_from: params.from });
			}
		});
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
		injectCss();
		var el = document.getElementById('gyGnb');
		if (el) render(el);
	}

	window.GaeyouGnb = { menus: MENUS, init: init };
	init();
	if (!document.getElementById('gyGnb') && document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	}
})(window, document);
