var  apiurl = 'http://gaeyou.com/api2/'
	,hash
	,admin = M.storage('admin') == 'romeoh' ? admin = true : admin = false
	,member
	
window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	var lang = navigator.language
	if (lang.indexOf('ja') != -1) {
		// location.href = 'https://t.gaeyou.com/?yh4XEWb4FwO62uyVQa1P'
	}
	
	member = isLogin();
	checkChulckeck(member);
	//initBanner();
	initNavi();
	initUserName();
	//initReplyBox();
	initMenu();
}

function initBanner() {
	if (M.browser().device != 'pc') {
		M('#makeTest').css('display', 'none');
		M('#kakaoMini').css('display', 'block');
	}
}

function initNavi() {
	if (M('[data-global]').selector.length > 0) {
		var  str = ''
			,page = M('[data-global]').data('global')
		
		str += '<ul class="navigation">';
		str += '	<li data-page="gag"><a href="../g/"><i class="fa fa-microphone" style="color: #fd4aff"></i> 아이돌 게시판</a></li>';
		str += '	<li data-page="test"><a href="../t/">깨알테스트</a></li>';
		//str += '	<li data-page="sa"><a href="../su/">베스트유머</a></li>';
		//str += '	<li data-page="poll"><a href="../poll/">카스투표</a></li>';
		//str += '	<li data-page="novel"><a href="../novel/list.html">썰픽</a></li>';
		//str += '	<li data-page="rank"><a href="../r/">랭킹</a></li>';
		str += '	<li data-page="worldcup"><a href="../w/">월드컵</a></li>';
		//str += '	<li data-page="quiz"><a href="https://quiz.gaeyou.com/">퀴즈</a></li>';
		//str += '	<li data-page="game"><a href="../game/list.html">웹게임 <i class="fa fa-star fa-yellow"></i></a></li>';
		//str += '	<li data-page="novel"><a href="../novel/list.html">썰픽</li>';
		//str += '	<li data-page="friend"><a href="../f/">친구만들기</a></li>';
		//str += '	<li data-page="tab"><a href="../tab/">탭탭탭!!!<span class="new"></span></a></li>';
		//str += '	<li data-page="game"><a href="http://game.gaeyou.com"><i class="fa fa-gamepad" aria-hidden="true" style="font-size: 22px; color: #fd4aff"></i> 깨유깨임<span class="new"></span></a></li>';
		str += '</ul>';
		str += '<div></div>';
		M('[data-global]').html(str);
		M('[data-page="' + page + '"]').addClass('on');
	}
}

// 이름과 카카오 아이디 설정
function initUserName() {
	if (M('[data-uname]').selector.length > 0) {
		var uname = M.storage('uname') || '';
		M('[data-uname]')
			.val(uname)
			.on('blur', function(evt, mp){
				M.storage('uname', M('[data-uname]').val())
			})
	}
	if (M('[data-kasid]').selector.length > 0) {
		var uname = M.storage('kasid') || '';
		M('[data-kasid]')
			.val(uname)
			.on('blur', function(){
				M.storage('kasid', M('[data-kasid]').val())
			})
	}
}

// hash 가져오기
function getHash() {
	var hash = window.location.hash.replace('#', '')
	if (hash == '') {
		return '';
	}
	return hash;
}

// hash 가져오기
function getParam() {
	var hash = window.location.search.replace('?', '')
	if (hash == '') {
		return '';
	}
	return hash;
}

// 로그인창 호출
function initLogin() {
	var  str = ''
		,screenWid = M.screen().width * 0.1 / 2
	
	str += '<div class="login">';
	str += '    <form role="form" id="loginform">';
	str += '    </form>';
	str += '</div>';
	str += '<div class="bglock" id="bglock"></div>';
	
	M('body').prepend('div', {
		'id':'popLogin',
		'className':'pop_login'
	})
	M('#popLogin').html(str);
	M('#bglock')
		.css('height', M('body').css('height'))
		.animate({
			'opacity': '0.3',
			'time': '.4s'
		})
	M('.login')
		.css('left', screenWid+'px')
		.animate({
			'top': '40px',
			'time': '.4s'
		})
	switchLogin();
}

function switchLogin(hash) {
	var str = ''
	
	str += '<div class="btn-group btn-group-justified">';
	str += '    <a class="btn btn-info">로그인</a>';
	str += '    <a class="btn btn-default" id="switchJoin">회원가입</a>';
	str += '</div>';
	str += '<div class="form-group">';
	str += '    <label for="uid">아이디</label>';
	str += '    <input type="text" class="form-control" id="uid" placeholder="아이디를 입력하세요." maxlength="30">';
	str += '</div>';
	str += '<div class="form-group">';
	str += '    <label for="upw">비밀번호</label>';
	str += '    <input type="password" class="form-control" id="upw" placeholder="비밀번호를 입력하세요." maxlength="30">';
	str += '</div>';
	str += '<div class="form-group">';
	str += '    <button type="button" class="btn btn-warning" id="btnLogin">로그인</button>';
	str += '    <button type="button" class="btn btn-default" id="cancelLogin">취소</button>';
	str += '</div>';
	
	M('#loginform').html(str);
	M('#cancelLogin').on('click', cancelLogin);
	M('#switchJoin').on('click', function(){
		switchJoin(hash);
	});
	M('#btnLogin').on('click', function(){
		var  tr = 'member_process_login'
			,data = {}
			
		if (M('#uid').val() == '') {
			alert('아이디를 입력해주세요.');
			M('#uid').focus();
			return false;
		}
		if (M('#upw').val() == '') {
			alert('비밀번호를 입력해주세요.');
			M('#upw').focus();
			return false;
		}
		
		data['uid'] = M('#uid').val()
		data['upw'] = M('#upw').val()
		request(tr, data, function(result){
			var  result = M.json(result) || {}
			
			if (result['idx']) {
				setLogin(result)
				if (hash != undefined) {
					window.location.href = hash;
					return false;
				}
				window.location.reload();
			} else {
				alert('등록된 회원이 없습니다.');
				return false;
			}
		})
	})
}

function switchJoin(hash) {
	var  str = ''
		,validuid = false	// 아이디 validation
		,validupw = false	// 비번 validation
		,validupw2 = false	// 비번 validation
		,validnickname = false	// 닉네임 validation
	
	str += '<div class="btn-group btn-group-justified">';
	str += '    <a class="btn btn-default" id="switchLogin">로그인</a>';
	str += '    <a class="btn btn-info">회원가입</a>';
	//str += '    <a class="btn btn-default" id="cancelLogin">취소</a>';
	str += '</div>';
	str += '<div class="form-group" id="groupid">';
	str += '    <label for="uid">아이디</label>';
	str += '    <input type="text" class="form-control" id="uid" placeholder="아이디를 입력하세요." maxlength="30">';
	str += '    <p class="help-block" id="idinfo"></p>';
	str += '</div>';
	str += '<div class="form-group" id="grouppw">';
	str += '    <label for="upw">비밀번호</label>';
	str += '    <input type="password" class="form-control" id="upw" placeholder="비밀번호를 입력하세요." maxlength="30">';
	str += '    <p class="help-block" id="pwinfo"></p>';
	str += '</div>';
	str += '<div class="form-group" id="grouppw2">';
	str += '    <label for="upw">비밀번호 확인</label>';
	str += '    <input type="password" class="form-control" id="upw2" placeholder="비밀번호를 한번더 입력하세요." maxlength="30">';
	str += '    <p class="help-block" id="pwinfo2"></p>';
	str += '</div>';
	str += '<div class="form-group">';
	str += '    <label for="upw">이메일</label>';
	str += '    <input type="email" class="form-control" id="email" placeholder="이메일을 입력하세요." maxlength="30">';
	str += '</div>';
	str += '<div class="form-group" id="groupnickname">';
	str += '    <label for="upw">닉네임</label>';
	str += '    <input type="text" class="form-control" id="nickname" placeholder="사용할 닉네임을 입력하세요." maxlength="30">';
	str += '    <p class="help-block" id="nicknameinfo"></p>';
	str += '</div>';
	str += '<div class="form-group">';
	str += '    <button type="button" class="btn btn-warning" id="btnJoin">회원가입</button>';
	str += '    <button type="button" class="btn btn-default" id="cancelLogin">취소</button>';
	str += '</div>';
	
	M('#loginform').html(str)
	M('#cancelLogin').on('click', cancelLogin);
	M('#switchLogin').on('click', switchLogin);
	
	// 아이디 체크
	M('#uid').on('focus', function(evt, mp){
		validuid = false;
		M('#groupid')
			.removeClass('has-error')
			.removeClass('has-success')
		M('#idinfo').html('');
	})
	M('#uid').on('blur', function(evt, mp){
		var  tr = 'member_checkid'
			,pattern = /(^[a-zA-Z0-9\-_]+$)/
			,data = {}
		
		if (mp.val().length == 0) {
			return false;
		}
		if (mp.val().length < 4) {
			M('#idinfo').html('4글자 이상 입력해주세요.');
			M('#groupid').addClass('has-error');
			return false;
		}

		if(!pattern.test(mp.val())){
			M('#idinfo').html('아이디는 한글로 입력할 수 없습니다.');
			M('#groupid').addClass('has-error');
			return false;
		}
		
		data['uid'] = M('#uid').val();
		request(tr, data, function(result){
			var result = M.json(result)
			if (result['result'] == '0') {
				M('#idinfo').html('사용할수 있는 아이디 입니다.');
				M('#groupid')
					.addClass('has-success')
					.removeClass('has-error');
				//if (M('#nickname').val() == '') {
				//	M('#nickname').val(mp.val())
				//}
				validuid = true;
			} else {
				M('#idinfo').html('사용할수 없는 아이디입니다.');
				M('#groupid')
					.addClass('has-error')
					.removeClass('has-success')
			}
		})
	})
	// 아이디 체크
	M('#nickname').on('focus', function(evt, mp){
		validnickname = false;
		M('#groupnickname')
			.removeClass('has-error')
			.removeClass('has-success')
		M('#nicknameinfo').html('');
	})
	M('#nickname').on('blur', function(evt, mp){
		var  tr = 'member_checkid'
			,data = {}
		
		if (M('#nickname').val() == '') {
			return false;
		}
		data['uid'] = M('#nickname').val();
		data['flag'] = 'nickname';
		
		request(tr, data, function(result){
			var result = M.json(result)
			if (result['result'] == '0') {
				M('#nicknameinfo').html('사용할수 있는 닉네임 입니다.');
				M('#groupnickname')
					.addClass('has-success')
					.removeClass('has-error');
				//if (M('#nickname').val() == '') {
				//	M('#nickname').val(mp.val())
				//}
				validnickname = true;
			} else {
				M('#nicknameinfo').html('사용할수 없는 닉네임입니다.');
				M('#groupnickname')
					.addClass('has-error')
					.removeClass('has-success')
			}
		})
	})
	M('#upw').on('focus', function(evt, mp){
		validupw = false;
		M('#grouppw')
			.removeClass('has-error')
			.removeClass('has-success')
		M('#pwinfo').html('');
	})
	M('#upw').on('blur', function(evt, mp){
		if (mp.val().length == 0) {
			return false;
		}
		if (mp.val().length < 4) {
			M('#pwinfo').html('비밀번호는 4글자 이상 입력해주세요.');
			M('#grouppw').addClass('has-error');
			return false;
		}
		M('#grouppw').addClass('has-success');
		M('#pwinfo').html('사용할수 있는 비밀번호입니다.');
		validupw = true;
	})
	M('#upw2').on('focus', function(evt, mp){
		validupw2 = false;
		M('#grouppw2')
			.removeClass('has-error')
			.removeClass('has-success')
		M('#pwinfo2').html('');
	})
	M('#upw2').on('blur', function(evt, mp){
		if (mp.val().length == 0) {
			return false;
		}
		if (M('#upw').val() != M('#upw2').val()) {
			M('#pwinfo2').html('비밀번호가 다릅니다.');
			M('#grouppw2').addClass('has-error');
			return false;
		}
		M('#pwinfo2').html('사용할 수 있습니다.');
		M('#grouppw2').addClass('has-success');
		validupw2 = true;
	})
	M('#btnJoin').on('click', function(){
		var  tr = 'member_process_join'
			,data = {}
			
		if (!validuid) {
			alert('아이디를 확인해주세요.');
			M('#uid').focus();
			return false;
		}
		if (!validupw) {
			alert('비밀번호를 확인해주세요.');
			M('#upw').focus();
			return false;
		}
		if (!validupw2) {
			alert('비밀번호를 확인해주세요.');
			M('#upw2').focus();
			return false;
		}
		if (M('#email').val() == '') {
			alert('이메일을 입력하세요.')
			M('#email').focus();
			return false;
		}
		if (!emailVerification(M('#email').val())) {
			alert('이메일을 잘못되었습니다.');
			M('#email').focus();
			return false;
		}
		if (M('#nickname').val() == '') {
			alert('닉네임을 입력하세요.')
			M('#nickname').focus();
			return false;
		}
		if (!validnickname) {
			alert('닉네임를 확인해주세요.');
			M('#nickname').focus();
			return false;
		}
		
		data['uid'] = M('#uid').val()
		data['upw'] = M('#upw').val()
		data['email'] = M('#email').val()
		data['nickname'] = M('#nickname').val()
		data['ua'] = navigator.userAgent;
		data['url'] = window.location.href;
		request(tr, data, function(result){
			var  result = M.json(result) || {}
			
			if (result['idx']) {
				setLogin(result);
				if (hash != undefined) {
					window.location.href = hash;
					return false;
				}
				window.location.reload();
			} else {
				window.location.href = '/';
			}
		})
	})
}

function emailVerification(email){
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(email)) {
		return false;
	} else {
		return true;
	}
}
    
function cancelLogin() {
	var topPos
	if (M('#btnLogin').selector.length == 0) {
		topPos = '-650px'
		posTime = '1.3s'
	} else {
		topPos = '-250px'
		posTime = '.4s'
	}
	M('#bglock').animate({
		'opacity': '0',
		'time': '.4s'
	})
	M('.login')
		.animate({
			'top': topPos,
			'time': '.4s'
		}, function(evt, mp){
			M('#popLogin').remove()
		})
}

// 로그인 확인
function isLogin() {
	var member = M.storage('member') || {}
	member = M.json(member);
	if (member['uid'] && 
		member['level'] &&
		member['maxlevel'] &&
		member['email']
		) {
			return member;
	}
	return false;
}

// 로그인 저장
function setLogin(result) {
	result['date'] = getDateTime()['date'];
	result['time'] = getDateTime()['time'];
	M.storage('member', M.json(result));
	return result;
}

function checkChulckeck(member) {
	if (!!member) {
		// 출석체크
		dateRage = calDateRange(member['date'], getDateTime()['date']);
		if (dateRage == '0') {
		} else if (dateRage == '1') {
			var  tr = 'member_chulcheck'
				,data = {}
			
			data['uid'] = member['uid'];
			data['uname'] = member['uname'];
			data['email'] = member['email'];
			data['flag'] = '1';
			request(tr, data, function(result){
				var result = M.json(result);
				member['level'] = result['level'];
				member['maxlevel'] = result['maxlevel'];
				member['date'] = getDateTime()['date'];
				member['time'] = getDateTime()['time'];
				M.storage('member', M.json(member));
				M('#replyName').html('<i class="fa fa-user"></i> ' + member['nickname'] + ' <i class="gae-level" id="gaeLevel">' + member['level'] + '일 연속 출첵중입니다. [?]</i>')
			})
		} else {
			var  tr = 'member_chulcheck'
				,data = {}
			
			data['uid'] = member['uid'];
			data['uname'] = member['uname'];
			data['email'] = member['email'];
			data['flag'] = '2';
			request(tr, data, function(result){
				var result = M.json(result);
				member['level'] = result['level'];
				member['maxlevel'] = result['maxlevel'];
				member['date'] = getDateTime()['date'];
				member['time'] = getDateTime()['time'];
				M.storage('member', M.json(member));
				M('#replyName').html('<i class="fa fa-user"></i> ' + member['nickname'] + ' <i class="gae-level" id="gaeLevel">' + member['level'] + '일 연속 출첵중입니다. [?]</i>')
			})
		}
	}	
}

// 로그인 체크
function checkLogin() {
	// 로그인 체크
	if (!!member) {
		// 로그인
		M('#replyName').html('<i class="fa fa-user"></i> ' + member['nickname'] + ' <i class="gae-level" id="gaeLevel">' + member['level'] + '일 연속 출첵중입니다. [?]</i>')
		/*M('#btnReg').on('click', function(evt, mp){
			var inpReply = M('#inpReply').val().replace(/\n/g, '<br>').substr(0, 170)
			if (inpReply == '') {
				alert('댓글을 입력하세요.');
				M('#inpReply').focus();
				return false;
			}
			
			imoidx = process(dataPhoto);
			imoticon = dataPhoto[imoidx]
			bodyData = {
				'idx': cuData['idx'],
				'uname': member['nickname'],
				'kasid': '',
				'photo': encodeURIComponent(imoticon),
				'text': encodeURIComponent(inpReply),
				'ua': navigator.userAgent,
				'url': window.location.href
			}
			$.ajax({
				 'url': apiurl + code + '_reply_add.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = M.json(result)
						,key = code + 'ReplyList'
					
					setUniq(key, result['id']);
					window.location.reload();
				}
			})
		})*/
	} else {
		// 로그인전 댓글
		/*M('#btnReg').on('click', initLogin);
		M('#inpReply').on('focus', function(evt, mp){
			mp.blur();
			initLogin()
		});*/
		// 썰픽 쓰기
		M('#btnfReg').on('click', initLogin);
		M('#fcontent').on('focus', function(evt, mp){
			mp.blur();
			initLogin()
		});
	}
	$('#gaeLevel').popover({
		 title: '출첵을 하면 뭐가 좋나요?'
		,content: '깨유에 연속 출첵을 하면 출첵한 날짜 만큼 "깨업, 깨따"할수 있습니다.'
		,html:true
		,placement:'top'
	})
}

// 시간 가져오기
function getDateTime() {
	var  d = new Date()
		,yyyy = d.getFullYear()
		,mm = d.getMonth() + Number(1)
		,dd = d.getDate()
		,hh = d.getHours()
		,da = d.getMinutes()
		,ss = d.getSeconds()
		
	mm < 10 ? mm = '0' + mm : mm;
	hh < 10 ? hh = '0' + hh : hh;
	da < 10 ? da = '0' + da : da;
	ss < 10 ? ss = '0' + ss : ss;
	return {
		'date': yyyy + '/' + mm + '/' + dd,
		'time': hh + ':' + da + ':' + ss
	}
}

// 날짜비교
function calDateRange(val1, val2){
	var FORMAT = "/";
	
	//if (val1.length != 10 || val2.length != 10) {
	//	return null;
	//}
	
	if (val1.indexOf(FORMAT) < 0 || val2.indexOf(FORMAT) < 0) {
		return null;
	}
	
	var start_dt = val1.split(FORMAT);
	var end_dt = val2.split(FORMAT);
	
	start_dt[1] = (Number(start_dt[1]) - 1) + "";
	end_dt[1] = (Number(end_dt[1]) - 1) + "";
	
	var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
	var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);
	
	return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24;
}

// 조회수 체크
function setView(code, hash, cb) {
	var	 key = code + 'ViewList'
		,api = apiurl + code + '_view.php'
		,view = M.storage(key)
		
	if (view == null) {
		view = [];
	}
	if (getDataType(view) == 'string') {
		view = M.json(view);
	}
	//if (!checkUniq(key, hash)) {
		bodyData = {
			'idx': hash,
			'code': code,
			'url': window.location.href,
			'ua': navigator.userAgent
		}
		//console.log(bodyData)
		$.ajax({
			 'url': api
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq(key, hash);
				cb(result);
			}
		})
	//}
}


// 게시물 등록완료
function addComplete(code, idx) {
	var key = code
	setUniq(key, idx);
}

// flag == 2 : 이름
function decodeText(txt, flag) {
	var  val = decodeURIComponent(txt)
		,filter = /쓰래기|쓰레기|스래기|스레기|찌레기|찌ㅡ레기|놈|시발놈|씨발놈|씨발|시발|시벌|시.발|시.벌|씨벌|시1발|시2발|씨1발|ㅅㅂ|ㅅ ㅂ|씨2발|지랄|빙시|병신|븅신|븅시|병 신|섹스|창녀|니미럴|자위중|병맛|새끼|새.끼|ㅁㅊ|ㅂㅅ|야동|또라이|돌아이|욕|짜증|뒤저라|뒤져라|나가뒤져|나가 뒤져/g
		
	if (flag == '2') {
		return val
			.replace(/깨유|운영자|깨알유머|관리자|admin/g, val+'화이팅')
			.replace(filter, '○')
			.replace(/romeoh/, '<i class="fa fa-plus-square"></i> 깨알유머')
	}
	return val
			.replace(filter, '○')
			.replace(/존나|졸라|존니|존내/g, '매우')
}

function sulFilter(txt, flag) {
	var  val = decodeURIComponent(txt)
		,filter = /섹스|색스|섻스|옷벗어봐|젖꼭지|빨았다|보지로|보지에|보지를|보짓물|보지물|ㅂㅈ|ㅈㅈ|애무|정액|애액|좆|불알을|발기가|처녀막|자위|보ㅈ|섻|핱았다|빤ㅅ|콘돔/g
		
	if (flag == '2') {
		return val
			.replace(/깨유|운영자|깨알유머|관리자|admin/g, val+'화이팅')
			.replace(filter, '○')
			.replace(/romeoh/, '<i class="fa fa-plus-square"></i> 깨알유머')
	}
	return val
			.replace(filter, '○')
			.replace(/존나|졸라|존니|존내/g, '매우')
}

// 댓글상자
/*function initReplyBox() {
	var str = ''
	
	if (M('[data-replybox]').selector.length > 0) {
		str += '<div class="kasid">';
		str += '	<input type="text" placeholder="이름을 입력하세요." maxlength="20" data-uname>';
		str += '	<input type="text" placeholder="카스아이디를 입력하세요." maxlength="20" data-kasid>';
		str += '</div>';
		str += '<div class="recon">';
		str += '	<div contenteditable="true" class="con msg" id="inpReply">이곳에 댓글을 써보세요~</div>';
		str += '<div class="btnbox"><a id="btnSubmit" class="btn_submit"><span>전송</span></a></div>';
		str += '</div>';
		
		M('[data-replybox]').html(str);
		
		// 댓글
		M('#inpReply')
			.on('focus', function(evt, mp){
				mp.focus();
				showReply();
			})
			.on('blur', function(evt, mp){
				hideReply();
			})
		
		M('[data-uname]')
			.on('focus', function(evt, mp){
				showReply();
			})
			.on('blur', function(evt, mp){
				M.storage('uname', mp.val())
				hideReply();
			})
			.val( M.storage('uname') || '' )
		
		M('[data-kasid]')
			.on('focus', function(evt, mp){
				showReply();
			})
			.on('blur', function(evt, mp){
				M.storage('kasid', mp.val())
				hideReply();
			})
			.val( M.storage('kasid') || '' )
		
		// 댓글 180자 제한
		M('#inpReply').on('keyup', function(evt, mp){
			var txt = mp.html()
			if (txt.length >= 180) {
				mp.html( txt.substr(0, 170) );
				alert('180자 이상 입력할수 없습니다.');
			}
		})
		
		// 댓글쓰기 전문통신
		M('#btnSubmit').on('click', function(evt, mp){
			if (M('#inpReply').html() == '') {
				alert('내용을 입력해주세요.');
				M('#inpReply').focus();
				return false;
			}
			if (M('#inpReply').hasClass('msg')) {
				alert('내용을 입력해주세요.');
				M('#inpReply').focus();
				return false;
			}
			
			if (M('[data-uname]').val() == '') {
				alert('이름을 입력해주세요.');
				M('[data-uname]').css('display', 'block');
				M('[data-kasid]').css('display', 'block');
				M('[data-uname]').focus();
				return false;
			}
			M.storage('uname', M.storage('uname'));
			M.storage('kasid', M.storage('kasid'));
			
			imoidx = process(dataPhoto);
			imoticon = dataPhoto[imoidx]
			bodyData = {
				'idx': cuData['idx'],
				'uname': encodeURIComponent(M('[data-uname]').val()),
				'kasid': encodeURIComponent(M('[data-kasid]').val()),
				'photo': encodeURIComponent(imoticon),
				'text': encodeURIComponent(M('#inpReply').html()),
				'ua': navigator.userAgent
			}
			$.ajax({
				 'url': apiurl + code + '_reply_add.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = M.json(result)
						,key = code + 'ReplyList'
					
					setUniq(key, result['id']);
					window.location.reload();
				}
			})
		})
	}
}

function showReply() {
	if (M('#inpReply').hasClass('msg')) {
		M('#inpReply')
			.removeClass('msg')
			.html('')
	}
	M('[data-uname]').css('display', 'block');
	M('[data-kasid]').css('display', 'block');
}
function hideReply() {
	M('[data-uname]').css('display', 'none');
	M('[data-kasid]').css('display', 'none');
}


function setReply(code, hash, cd) {
	var	 key = code + 'ViewList'
		,api = apiurl + code + '_view.php'
		,view = M.storage(key)
		
	if (view == null) {
		view = [];
	}
	if (getDataType(view) == 'string') {
		view = M.json(view);
	}
	
	if (!checkUniq(key, hash)) {
		bodyData = {
			'idx': hash
		}
		$.ajax({
			 'url': api
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq(key, hash);
				cb(result);
			}
		})
	}
}
*/

// 전체 메뉴보기
function initMenu() {
	var  gnb = M('[data-gnb]')
		,speed = '0.5s'
	
	if (gnb.selector.length > 0) {
		gnb.on('click', function(){
			showGnb();
		})
	}
	
	function showGnb() {
		var  str = ''
			,uname = M.storage('uname')
		
		M('body')
			.prepend('div', {
				'className': 'bg',
				'id': 'bg'
			})
			.prepend('div', {
				'className': 'gnb',
				'id': 'gnb'
			})
		
		M('#bg').animate({
				'opacity': '0.7',
				'time': speed
			})
			.on('click', function(){
				hideGnb();
			})
		M('#gnb').animate({
			'left': '0',
			'time': speed
		})
		
		if (!!isLogin()) {
			str += '<div class="head">';
			str += '	<div class="welcome" id="user">';
			str += '		' + member['nickname'] + '님, 안녕하세요. ';
			str += '	</div>';
			str += '	<button type="button" class="close" aria-hidden="true" id="btnClose">&times;</button>';
			str += '</div>';
			str += '<div class="member">';
			str += '	<button type="button" class="btn btn-default btn-block" id="btnLogout">로그아웃</button>';
			str += '</div>';	
		} else {
			str += '<div class="head">';
			str += '	<div class="welcome" id="user">';
			str += '		안녕하세요. ';
			str += '	</div>';
			str += '	<button type="button" class="close" aria-hidden="true" id="btnClose">&times;</button>';
			str += '</div>';
			str += '<div class="member">';
			str += '	<button type="button" class="btn btn-success btn-block" id="btnPopLogin">로그인</button>';
			str += '	로그인 하시면 계급에 따라 <br><i class="fa fa-thumbs-up"></i> 깨업 / <i class="fa fa-thumbs-down"></i> 깨따 할수있는 갯수가 달라집니다.';
			str += '</div>';
		}
		
		str += '<div class="menu">';
		str += '	<dl>';
		str += '		<dt>깨알테스트</dt>';
		str += '		<dd><a href="/t"><span class="ico arrow"></span>내가만든 테스트</a></dd>';
		str += '		<dd><a href="http://romeoh.github.io/kakaoStory/html/makeme.html"><span class="ico arrow"></span>깨알테스트</a></dd>';
		
		str += '		<dt>유머게시판</dt>';
		str += '		<dd><a href="/s"><span class="ico arrow"></span>베스트유머</a></dd>';
		//str += '		<dd><a href="/s2"><span class="ico arrow"></span>움직이는 짤방 <i class="fa fa-thumbs-up fa-red"></i></a></dd>';
		
		str += '		<dt>설치가 필요없는: 웹게임</dt>';
		str += '		<dd><a href="/game/list.html"><span class="ico arrow"></span>웹게임 <i class="fa fa-star fa-red"></i></a></dd>';
		
		str += '		<dt>함께쓰는 소설: 썰픽</dt>';
		str += '		<dd><a href="/novel/list.html"><span class="ico arrow"></span>썰픽</a></dd>';
		
		str += '		<dt>슈퍼랭킹</dt>';
		str += '		<dd><a href="/w"><span class="ico arrow"></span>슈퍼랭킹</a></dd>';
		str += '		<dd><a href="/r"><span class="ico arrow"></span>깨알랭킹</a></dd>';
		
		//str += '		<dt>탭탭탭!!!</dt>';
		//str += '		<dd><a href="/tab"><span class="ico arrow"></span>탭탭탭!!!<span class="ico new"></span></a></dd>';
		//str += '		<dd><a href="/tab/history.html"><span class="ico arrow"></span>역대전적</a></dd>';
		//str += '		<dd><a href="/tab/bunker.html"><span class="ico arrow"></span>우리학교 벙커</a></dd>';
		
		str += '		<dt>친구만들기</dt>';
		str += '		<dd><a href="/f2"><span class="ico arrow"></span>카스 품앗이</a></dd>';
		str += '		<dd><a href="/f"><span class="ico arrow"></span>카톡 친구만들기</a></dd>';
		
		str += '	</dl>';
		str += '</div>';
		
		M('#gnb').html(str);
		//if (uname) {
		//	M('#user').html(uname + '님, 안녕하세요.')
		//}
		M('#gnb').css('height', M('body').css('height'))
		M('#bg').css('height', M('body').css('height'))
		
		M('#btnClose').on('click', function(){
			hideGnb()
		})
		M('#btnLogout').on('click', function(){
			M.storage('member', '');
			window.location.reload();
		})
		M('#btnPopLogin').on('click', function(){
			hideGnb();
			initLogin();
		})
	}
	
	function hideGnb() {
		M('#bg').animate({
			'opacity':'0',
			'time': speed
		}, function(evt, mp){
			mp.remove();
		})
		M('#gnb').animate({
			'left': '-250px',
			'time': speed
		}, function(evt, mp){
			mp.remove()
		}
		);
	}
}


// 유니크 저장소 체크하기
function checkUniq(key, value) {
	var storageKey = M.storage(key)
	if (!storageKey) {
		return false;
	}
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	for (var i=0; i<storageKey.length; i++) {
		if ( storageKey[i] == value ) {
			return true;
		}
	}
	return false;
}

// 유니크 저장소 설정
function setUniq(key, value) {
	var  storageKey = M.storage(key) || []
		
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	storageKey.push(value);
	M.storage(key, M.json(storageKey));
}

function getSmile() {
	var idx = process(dataPhoto);
	return dataPhoto[idx]
}

/*M('#btnStory').on('click', function(){
	var data = {}
	data.media = 'story'
	validation(data)
});
M('#btnTwitter').on('click', function(){
	var data = {}
	data.media = 'twitter'
	validation(data)
});
M('#btnFacebook').on('click', function(){
	var data = {}
	data.media = 'facebook'
	validation(data)
});
M('#btnMe2day').on('click', function(){
	var data = {}
	data.media = 'me2day'
	validation(data)
});
M('#btnKakao').on('click', function(){
	var data = {}
	data.media = 'talk'
	action(data);
});

function validation(data) {
	action(data);
}*/

// 공유
function shareData(_obj, _opt) {
	var  obj = _obj || {}
		,media = obj.media || 'story'
		,id = obj.id || 'gaeyou'
		,ver = obj.ver || '1.0'
		,app = obj.app || '★깨알유머★를 검색하세요!!'
		,title = obj.title || ''
		,url = obj.url || ''
	
	try{
		Kakao.init('77a3ab1c153e43f5d6b00426dfd02985');
	} catch(e){}
	
	
	if (media == 'talk') {
		var  msg = obj.msg || title || ''

		/*kakao.link('talk').send({
			msg: msg,
			url: url,
			appid: id,
			appver: ver,
			appname: app,
			type: 'link'
		});*/
		//return false;
		Kakao.Link.sendTalkLink({
			image: {
				src: obj.img,
				width: '380',
				height: '380'
			},
			label: obj.post + '\n\n' + obj.url
		});
		
		test  = '♥♥ [카톡친구 초대] ♥♥\n'
		test += 'appId: ' + id + '\n'
		test += 'appVersion: ' + ver + '\n'
		test += 'appName: ' + app + '\n'
		test += 'msg: \n'
		test += '-----------\n'
		test += msg + '\n'
		test += '-----------\n'
		test += 'url: ' + url + '\n'
		test += '--------------------------------------------\n'
		console.log(test)
		return false;
	}

	if (media == 'story') {
		var  post = obj.post || ''
			,desc = obj.desc || ''
			,img = obj.img || ''
			,urlinfo = {
				'title': title,
				'desc': desc,
				'imageurl': [img],
				'type': 'article'
			}
		//post = post + '\n\n' + url + '\n';//\n\n\n\n\n\n' + '★ 깨유 플친되고 선물받자 ★\nhttp://goo.gl/ElNRl3';
		if (_opt === '1') {
			// 옵션이 1이면 url없음
			post = post;
		} else {
			post = post + '\n\n' + url;
		}
		//post = post + '\n\n\n\n\n\n' + '★ 흔남 흔녀들의 필수플친! 깨유! ★\nhttp://goo.gl/ElNRl3';
		
		/*kakao.link("story").send({   
	        appid : id,
			appver : ver,
			appname : app,
	        post : post,
			urlinfo : M.json(urlinfo)
	    });*/
	    Kakao.Story.open({
			url: obj.url,
			text: obj.post
		});
		//return false;
		
		test  = '♥♥ [카스로 공유] ♥♥\n'
		test += 'appId: ' + id + '\n'
		test += 'appVersion: ' + ver + '\n'
		test += 'appName: ' + app + '\n'
		test += 'post: \n'
		test += '-----------\n'
		test += post + '\n'
		test += '-----------\n'
		test += 'title: ' + title + '\n'
		test += 'desc: ' + desc + '\n'
		test += 'img: ' + img + '\n'
		test += '--------------------------------------------\n'
		console.log(test);
		
		return false;
	}

	if (media == 'twitter') {
		var  str = ''
			,post = obj.twit || obj.post || ''
			,urlLength = url.length + 5
			,postLength = post.length + urlLength + 1
			,textLimit = 140
		
		if (postLength >= textLimit) {
			twit = post.substr(0, (textLimit-urlLength)) + '...\n' + url;
		} else {
			twit = post + '\n' + url;
		}
		twit = twit.replace(/\n\n/g, '\n')

		str += 'https://twitter.com/intent/tweet?text=';
		str += encodeURIComponent(twit);
		top.location.href = str;
		//return false;

		test  = '♥♥ [트위터로 공유] ♥♥\n'
		test += 'twit: \n'
		test += '-----------\n'
		test += twit + '\n'
		test += '-----------\n'
		console.log(test)
		return false;
	}

	if (media == 'me2day') {
		var  str = ''
			,post =  obj.twit || obj.post || ''
			,tag = obj.tag || '미투데이를 더 재미있게 깨알유머 SNS 테스트 심리테스트'
			,urlLength = url.length + 5
			,postLength = post.length + urlLength + 1
			,textLimit = 150

		if (postLength >= textLimit) {
			me2 = post.substr(0, (textLimit-urlLength)) + '...\n' + url;
		} else {
			me2 = post + '\n' + url;
		}
		me2 = me2.replace(/\n\n/g, '\n')

		str += 'http://me2day.net/posts/new';
		str += '?new_post[body]=';
		str += encodeURIComponent(me2)
		str += '&new_post[tags]='
		str += encodeURIComponent(tag)
		top.location.href = str;
		//return false;

		test  = '♥♥ [미투데이로 공유] ♥♥\n'
		test += 'post: \n'
		test += '-----------\n'
		test += me2 + '\n'
		test += '-----------\n'
		console.log(test)
		return false;
	}

	// facebook sharer
	if (media == 'facebookSharer') {//
		var  str = ''
			,post = obj.post || ''
			,img = obj.img || ''
		
		str += 'http://www.facebook.com/sharer.php';
		str += '?s=100';
		str += '&p[title]=' + encodeURIComponent( post.replace(/\[.+\]/g, '') );
		str += '&p[summary]=' + encodeURIComponent( title );
		str += '&p[url]=' + encodeURIComponent(url);
		str += '&p[images][0]=' + encodeURIComponent(img);
		top.location.href = str;
		return false;
	}

	// facebook open API
	if (media == 'facebook') {//API
		M('body').prepend('script', {
			'src':'https://connect.facebook.net/en_US/all.js',
			'type': 'text/javascript',
			'id': 'facebookScript'
		})

		M('#facebookScript').on('load', function(evt, mp){
			var  obj = _obj || {}
				,mode = obj.mode || 'real'
				,feed = obj.feed || 'feed'
				,method = obj.method || 'post'
				,img = obj.img || ''
				,photo = obj.photo || obj.img || ''
				,post = obj.post || ''
				,scope = obj.scope || 'publish_actions, user_photos'
				,success = obj.success || null
				,error = obj.error || null
				,faceappid
				,message = {}

			post = post + '\n\n' + url;

			if (mode == 'real') {
				faceappid = '193169104219931';
			} else {
				faceappid = '199304076906232';
			}

			if (feed == 'feed') {
				message = {
					'message': post,
					'picture': photo
				}
			} else if (feed == 'photo') {
				message = {
					'message': post,
					'url': photo
				}
			}

			FB.init({
				'appId'     : faceappid, // App ID
				'channelUrl': '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
				'status'    : true, // check login status
				'cookie'    : true, // enable cookies to allow the server to access the session
				'xfbml'     : true  // parse XFBML
			})

			FB.login(function(response) {
				if (response.authResponse) {
					FB.api(/me/ + feed, method, message, function (response) {
						console.log(response);
						if (!response || response.error) {
							//if (error) {
							alert('죄송합니다.\n오류가 발생했습니다.');
								//error();
							//}
						} else {
							//if (success) {
							alert('페이스북에 등록 되었습니다.');
								//success();
							//}
						}
					});
				}
			}, {'scope': scope});

			//return false;
			test  = '♥♥ [페이스북으로 공유] ♥♥\n'
			test += 'feed: ' + feed + '\n'
			test += 'method: ' + method + '\n'
			test += 'photo: ' + photo + '\n'
			test += 'message: \n'
			test += '-----------\n'
			test += post + '\n'
			test += '-----------\n'
			console.log(test)

		})
		return false;
	}

	if (media == 'band') {
		var  src = ''
			,post = obj.post || ''
			,urlLength = url.length + 3
			,postLength = post.length + urlLength + 1
			,textLimit = 300

		bandPost += '[' + app + ']\n'
		bandPost += title + ': ' + post

		if (postLength >= textLimit) {
			b = bandPost.substr(0, (textLimit-urlLength)) + '...' + url;
		} else {
			b = bandPost + ' ' + url;
		}

		src += 'bandapp://create/post?text=';
		src += encodeURIComponent(bandPost);
		src += '#Intent;package=com.nhn.android.band;end;';
		top.location = str;
		return false;
	}
}



function process(_min, _max){
	var data, min, max

	if ( getDataType(_min) === 'object' || getDataType(_min) === 'array' ) {
		data = _min;
		return Math.floor(Math.random() * data.length);
	} else {
		min = _min;
		max = _max;
		return Math.floor(Math.random() * (max-min) + min)
	}
}

function getDataType(_value) {
	if (typeof _value === 'string') {
		return 'string';
	}
	if (typeof _value === 'number') {
		return 'number';
	}
	if (_value.constructor === Object) {
		return 'object';
	}
	if (_value.constructor === Array) {
		return 'array';
	}
	if (_value.constructor === Function) {
		return 'function';
	}
	if (_value.constructor === Boolean) {
		return 'boolean';
	}
	return undefined;
}



dataPhoto = [
	'smile1',
	'smile2',
	'smile3',
	'smile4',
	'smile5'
]



/*function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}*/

function shuffle(array, length) {
	var counter = array.length,
		length = length || counter,
		temp,
		index

	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
		//console.log(arr)
	}
	array.length = length;
	return array;
}


function getSpecial() {
	var data = [
		'🐍',
		'🐎',
		'🐚',
		'🐛',
		'🐜',
		'🐝',
		'🐯',
		'🐮',
		'🐭',
		'🐬',
		'🐫',
		'🐟',
		'🐞',
		'🐺',
		'🐻',
		'🐼',
		'🐽',
		'🐾',
		'🐑',
		'🐒',
		'🐢',
		'🐡',
		'🐠',
		'🐙',
		'🐘',
		'🐗',
		'🐔',
		'🐣',
		'🐤',
		'🐥',
		'🐦',
		'🐧',
		'🐨',
		'🐩'
	],
	sc = process(data)
	return data[sc]
	
}


// 전문통신
function request(tr, data, callback) {
	if (data['file']) {
		$.ajaxFileUpload({ 
			url : apiurl + tr + '.php',
			type: "POST",
			secureuri : false, 
			fileElementId : data['file'], //'photo'
			dataType : 'json', 
			data : data,
			complete:function(result){
				callback(result);
			}
		})
	} else {
		$.ajax({
			 'url': apiurl + tr + '.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': data
			,'type': 'POST'
			,'success': function(result){
				callback(result);
			}
		})
	}
}


















