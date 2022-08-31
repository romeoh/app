var  pollList = M.storage('pollList') || []
	,code = 'test'
	,hash
	,testReplyList = M.storage('testReplyList') || []
	,userId = localStorage.getItem('user_id')
	,testTitle
	,cuTest
	,cuData = {}
	,searchKeyword = ''
	
	// 신규테스트 불러오기
	,newStart = 0
	,newTotal = 20
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 10
	
	// 급상승인기테스트 불러오기
	,hotStart = 0
	,hotTotal = 10
	,listFlag = M.storage('listFlag') || 'hot'
	
window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	/*if (!admin) {
		alert('서버 점검중입니다.');
		window.location.href = 'http://goo.gl/7g0kn1';
		return false;
	}*/
	
	if (!userId) {
		this.userId = new Date().getTime()
        localStorage.setItem('user_id', this.userId)
	}
	
	var uname = M.storage('uname') || ''
	hash = window.location.hash.replace('#', '')
	if (hash) {
		//window.location = '/t/?' + hash
		window.location.replace('/t/?' + hash)
		return;
	}
	hash = getParam();
	
	M('#btnNew').css('display', 'block')
	
	if (uname) {
		M('#userName')
			.on('blur', function(evt, mp){
				M.storage('uname', mp.val())
			})
			.val(uname)
		M('#nickname').val(uname)
	}
	
	checkLogin()
	
	// 댓글 콜백임
	var isReplyCallback = hash.split('&')[1]
	if (isReplyCallback) {
		
	}
	
	// 현재 테스트 전문통신
	bodyData = {
		'idx': hash.split('&')[0]
	}
	$.ajax({
		 'url': apiurl + code + '_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result)
				,author = ''
			
			if (result['idx'] == undefined) {
				return window.location.href = '/t';
			}
			hash = result.idx
			cuData.idx = result.idx;
			cuData.uname = decodeURIComponent(result.uname);
			cuData.kasid = decodeURIComponent(result.kasid);
			cuData.title = decodeURIComponent(result.title);
			testTitle = cuData.title
			cuData.exp = decodeURIComponent(result.exp);
			cuData.result = decodeURIComponent(result.result);
			cuData.view = result.view;
			cuData.gaeup = result.gaeup;
			cuData.gaedown = result.gaedown;
			cuData.excute = result.excute;
			cuData.modifyDate = result.modifyDate;
			cuData.regDate = result.regDate;
			cuData.resultLeng = result.resultLeng;
			cuData.good = result.good;
			cuData.keyword = result.keyword;
			
			deleteAble = checkUniq('test', cuData['idx']);
			if (admin) {
				deleteAble = true;
			}
			M('#qtitle').html( cuData['title'] );
			if (cuData['uname'] != 'romeoh' && cuData['uname'] != 'coffee') {
				author = '작성자: ' + cuData['uname'] + ' | ';
			}
			author += '<span>조회: <span id="viewCount">' + M.toCurrency(result['view']) + '</span>회</span>';
			author += ' | <a href="/report/?title=' + result.title + '&url=' + encodeURIComponent('https://gaeyou.com/t/?' + result.idx) + '">신고하기</a>';
			//author += ' | <span>깨업: <span id="viewGaeup">' + M.toCurrency(result['gaeup']) + '</span>회</span>';
			if (deleteAble) {
				author += ' | <span data-delrank="' + cuData['idx'] + '">삭제</span>';
			} else {
				//author += ' | <span data-declaration="' + cuData['idx'] + '">신고</span>';
			}
			/*if (admin) {
				author += ' | <span data-good="' + cuData['idx'] + '">추천</span>';
			}*/
			M('#qauthor').html(author)
			M('#exp').html(cuData['exp']);
			M('#total').html('<i class="fa fa-flask"></i> 총 ' + M.toCurrency(cuData['resultLeng']) + '개의 결과가 있습니다.');
			/*M('#btnTest')
				.html('<span><em class="ico_star_check"></em> 카스로 확인(' + excute + ')</span></a>')
				.on('click', testExcute)*/
			M('[data-share]').on('click', testExcute);
			M('#btnGaeup').html('<span><i class="fa fa-thumbs-up"></i> 깨업(' + M.toCurrency(result['gaeup']) + '회)</span></a>')
			M('#btnGaedown').html('<span><i class="fa fa-thumbs-down"></i> 깨따(' + M.toCurrency(result['gaedown']) + '회)</span></a>')
			document.getElementById('description').setAttribute('content', cuData.title)
			
			getTestList();
			getTestAll();
			initReply();
			initGaeup();
			initSearch();
			//initView();
			
			// 검색키워드 처리
			if (!cuData.keyword) {
				var  keytitle = getKeyword(cuData.title)
					,keyexp = getKeyword(cuData.exp)
					
				cuData.keyword = keytitle + keyexp
				
				bodyData = {
					'idx': cuData.idx,
					'keyword': cuData.keyword
				}
				$.ajax({
					 'url': apiurl + code + '_update_keyword.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result) {}
				})
			}
			
			
			if (deleteAble) {
				// 삭제하기
				M('[data-delrank]').on('click', function(evt, mp){
					if(!confirm('테스트를 정말 삭제하시겠습니까?')) {
						return false;
					}
					id = mp.data('delrank');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + code + '_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								test = M.json(M.storage('test'))
								popList = []
								
							for (var i=0; i<test.length; i++) {
								if (result['id'] != test[i]) {
									popList.push(test[i])
								}
							}
							M.storage('test', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			M('[data-declaration]').on('click', function(evt, mp) {
				var  str = ''
					,twit = []
				
				twit.push('@gaeyoukr ' + location.origin + location.pathname + '?' + mp.data('declaration') + ' 신고사유: ')
				str += 'https://twitter.com/intent/tweet?text=';
				str += encodeURIComponent(twit.join(''))
				top.location.href = str;
			})
		}
	})
	
	var games = [
		'<a href="https://bit.ly/36r3dR6" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_animal.png" alt="미래 남편의 동물관상" style="height: 40px;"></a>',
		//'<a href="https://bit.ly/2yWdO9O" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_cosmicgirls.png" alt="우주소녀 테스트" style="height: 40px;"></a>',
		'<a href="https://bit.ly/2zKoiK9" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_exo.png" alt="EXO 테스트" style="height: 40px;"></a>',
		//'<a href="https://bit.ly/2Yooets" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_redvelvet.png" alt="레드벨벳 테스트" style="height: 40px;"></a>',
		//'<a href="https://bit.ly/3cXoPqg" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_april.png" alt="에이프릴 테스트" style="height: 40px;"></a>',
		//'<a href="https://bit.ly/2SjchSd" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_b1a4.png" alt="B1A4 테스트" style="height: 40px;"></a>',
		'<a href="https://bit.ly/2yVVEFa" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_bts.png" alt="BTS 테스트" style="height: 40px;"></a>',
		//'<a href="https://bit.ly/2xbvz4E" class="link-to-president"><img src="https://romeoh.github.io/app/img/banner_president.png" alt="대통령 테스트" style="height: 40px;"></a>',
	]
	var gameIdx = process(0, games.length)
	$('#kakaoMini').html(games[gameIdx])
}

function getKeyword(keyword) {
	return keyword.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '')
}

// 현재 테스트 항목 가져오기
function getTestList(){
	// 현재 랭킹 리스트 전문통신
	bodyData = {
		'idx': cuData['idx']
	}
	$.ajax({
		 'url': apiurl + code + '_get_list.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);

			cuData.lists = [];
			for (var i=0; i<result.length; i++) {
				cuData.lists.push(decodeURIComponent(result[i]['text']).split('|'));
			}
		}
	})
}


// 다른 테스트 리스트 가져오기
function getTestAll() {
	// 인기 리스트 전문
	if (M('#hotContainer').selector.length > 0) {
		getHotTest();
	}
	
	// 신규 리스트 전문
	getNewTest()
}


// 신규 테스트 더보기
function getHotTest() {
	bodyData = {
		'total': newTotal,
		'start': newStart,
		'searchKeyword': searchKeyword
	}
	$.ajax({
		 'url': apiurl + code + '_get_all_hot.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			//console.log(result)
			newStart = newTotal + newStart;
			for (var i=0; i<result.length; i++) {
				if (cuData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				if (result[i]['resultLeng'] < 5) {
					rstlength = '<i class="fa fa-flask"></i> ' + M.toCurrency(result[i]['resultLeng']) + '개의 결과'
				} else {
					rstlength = '<i class="fa fa-flask strong"></i> <span class="strong"> ' + M.toCurrency(result[i]['resultLeng']) + '개의 결과</span>'
				}
				thum = result[i]['gaeup']; //- result[i]['gaedown'];
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/t/?' + result[i]['idx'] + '">';
				str += '		<strong class="tit">' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '		<em>';
				str += '			<i class="fa fa-eye"></i> ' + M.toCurrency(result[i]['view']) + '회';
				str += '			<i class="fa fa-thumbs-up"></i> ' + M.toCurrency(thum) + '회';
				str += '			' + rstlength;
				str += '		</em>';
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < newTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morehot=""><button class="btn btn-primary btn-block">더 불러오기</button></li>';
			}
			M('#hotContainer').html( M('#hotContainer').html() + str );
			
			// 더 불러오기
			M('[data-morehot]').on('click', function(evt, mp){
				mp.remove();
				getHotTest();
			})
			newTotal = 20;
		}
	})
}

// 다른 테스트 리스트 전문통신
function getNewTest() {
	return false
	bodyData = {
		'total': hotTotal,
		'start': hotStart,
		'flag': listFlag
	}
	$.ajax({
		 'url': apiurl + code + '_get_all.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			hotStart = hotTotal + hotStart;
			for (var i=0; i<result.length; i++) {
				if (cuData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				if (result[i]['resultLeng'] < 5) {
					rstlength = '<i class="fa fa-flask"></i> ' + M.toCurrency(result[i]['resultLeng']) + '개의 결과'
				} else {
					rstlength = '<i class="fa fa-flask strong"></i> <span class="strong"> ' + M.toCurrency(result[i]['resultLeng']) + '개의 결과</span>'
				}
				thum = result[i]['gaeup'];// - result[i]['gaedown'];
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/t/?' + result[i]['idx'] + '">';
				str += '		<strong>' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '		<em>';
				str += '		<i class="fa fa-eye"></i> ' + M.toCurrency(result[i]['view']) + '회';
				str += '		<i class="fa fa-thumbs-up"></i> ' + M.toCurrency(thum) + '회';
				str += '		' + rstlength;
				str += '		</em>';
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < hotTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morenew=""><button class="btn btn-primary btn-block">더 불러오기</button></li>';
			}
			M('#replyContainer').html( M('#replyContainer').html() + str );
			// 더 불러오기
			M('[data-morenew]').on('click', function(evt, mp){
				mp.remove();
				getNewTest();
			})
			hotTotal = 30;
		}
	})
}

// 테스트 깨업
function initGaeup() {
	// 깨업
	M('#btnGaeup').on('click', function(evt, mp){
		if ( checkUniq(code + 'GaeupList', cuData['idx']) ) {
			alert('이미 평가하셨습니다.');
			return false;
		}
		
		// 깨업 전문 통신
		bodyData = {
			'uid': member['uid'],
			'uname': member['uname'],
			'email': member['email'],
			'idx': cuData['idx'],
			'code': code,
			'flag': 'UP'
		}
		$.ajax({
			 'url': apiurl + 'member_gaeup.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				setUniq(code + 'GaeupList', cuData['idx']);
				//M('#viewGaeup').html(result['total']);
				M('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업('+result['total']+'회)');
				if (!!member) {
					alert('"' + member['level'] + '" 깨업했습니다.\n' + member['nickname'] + '님은 ' + member['level'] + '일째 연속 출첵중입니다.');
				} else {
					alert('깨업했습니다.');
					//if (confirm('"1" 깨업했습니다.\n회원가입하면 한번에 더 많은 깨업을 할수 있습니다.\n회원 가입 하시겠습니까?')) {
					//	initLogin();
					//}
				}
				
			}
		})
	})
	
	// 깨따
	M('#btnGaedown').on('click', function(evt, mp){
		if ( checkUniq(code + 'GaeupList', cuData['idx']) ) {
			alert('이미 평가하셨습니다.');
			return false;
		}
		
		// 깨업 전문 통신
		bodyData = {
			'uid': member['uid'],
			'uname': member['uname'],
			'email': member['email'],
			'idx': cuData['idx'],
			'code': code,
			'flag': 'DOWN'
		}
		$.ajax({
			 'url': apiurl + 'member_gaeup.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				setUniq(code + 'GaeupList', cuData['idx']);
				M('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따('+result['total']+'회)')
				return alert('깨따했습니다.');
				//M('#viewGaeup').html(result['total']);
				alert('"' + member['level'] + '" 깨따했습니다.\n'+member['uname'] + '님은 ' + member['level'] + '일째 연속 출첵중입니다.');
			}
		})
	})
}

// 조회수 올리기
function initView() {
	// 조회수 업데이트
	//if ( !checkUniq('testViewList', cuData['idx']) ) {
		bodyData = {
			'idx': cuData['idx'],
			'code': code,
			'url': window.location.href,
			'ua': navigator.userAgent
		}
		$.ajax({
			 'url': apiurl + code + '_view.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq('testViewList', cuData['idx']);
				M('#viewCount').html(M.toCurrency(result['total']));
			}
		})
	//}
}


// 테스트 실행
function testExcute(evt, mp) {
	var  userName = M('[data-uname]').val()
		,result = cuData['result']
		,data = {}
		,post = ''
	
	if (userName == '') {
		alert('이름을 입력해주세요.');
		M('[data-uname]').focus();
		return false;
	}
	result = result.replace(/#이름#/, userName)
	if (result.indexOf('#항목1#') != -1) {
		ranList1 = cuData['lists'][0]
		idx1 = process(ranList1)
		result = result.replace(/#항목1#/, ranList1[idx1])
	}
	if (result.indexOf('#항목2#') != -1) {
		ranList2 = cuData['lists'][1]
		idx2 = process(ranList2)
		result = result.replace(/#항목2#/, ranList2[idx2])
	}
	if (result.indexOf('#항목3#') != -1) {
		ranList3 = cuData['lists'][2]
		idx3 = process(ranList3)
		result = result.replace(/#항목3#/, ranList3[idx3])
	}
	if (result.indexOf('#항목4#') != -1) {
		ranList4 = cuData['lists'][3]
		idx4 = process(ranList4)
		result = result.replace(/#항목4#/, ranList4[idx4])
	}
	if (result.indexOf('#항목5#') != -1) {
		ranList5 = cuData['lists'][4]
		idx5 = process(ranList5)
		result = result.replace(/#항목5#/, ranList5[idx5])
	}
	
	post += getSpecial() + ' ' + cuData['title'] + '\n'
	post += '──────────────────\n'
	post += result;
	//post += 'https://gaeyou.com/t/?' + cuData['idx'];
	
	data['media'] = mp.data('share');
	data.post = post;
	data.desc = cuData['exp'];
	data.img = 'https://www.gaeyou.com/upload/fonts/'+cuData['idx']+'.png';
	data.title = getSpecial() + ' ' +cuData['title'];
	data.url = 'https://www.gaeyou.com/t/?'+hash;
	data.app = '깨알테스트'
	
	// 테스트 전문 통신
	bodyData = {
		'idx': cuData['idx']
	}
	$.ajax({
		 'url': apiurl + code + '_excute.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result);
			shareData(data);
		}
	})
}



// 댓글 가져오기 전문통신
var readyReply = true
function initReply(){
	// set
	if (!member) {
		M('#replyNickname').css('display', 'block');
		M('#replyName').css('display', 'none');
	}
	
	M('#btnRegReply').on('click', function(evt, mp){
		if (!readyReply) {
			return
		}
		var inpReply = M('#inpReply').val().replace(/\n/g, '<br>').substr(0, 170)
		if (!!member) {
			uname = member['nickname'];
		} else {
			M('#replyNickname').css('display', 'block');
			
			if (M('#nickname').val() == '') {
				alert('닉네임을 입력하세요.');
				M('#nickname').focus();
				return false;
			}
			uname = M('#nickname').val();
		}
		if (inpReply == '') {
			alert('댓글을 입력하세요.');
			M('#inpReply').focus();
			return false;
		}
		
		imoidx = process(dataPhoto);
		imoticon = dataPhoto[imoidx]
		bodyData = {
			'idx': cuData['idx'],
			'uname': uname,
			'kasid': '',
			'userId': userId,
			'testTitle': testTitle,
			'photo': encodeURIComponent(imoticon),
			'text': encodeURIComponent(inpReply),
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		readyReply = false
		$.ajax({
			 'url': apiurl + code + '_reply_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
					,key = code + 'ReplyList'
				
				readyReply = true
				setUniq(key, result['id']);
				window.location.href = 'https://gaeyou.com/t/?' + cuData['idx']
				//window.location.reload();
			}
		})
	})
	
	// get
	bodyData = {
		'idx': cuData['idx'],
		'total': replyTotal,
		'start': replyStart
	}
	$.ajax({
		 'url': apiurl + code + '_reply_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json( result )
			//console.log(result)
			replyStart = replyTotal + replyStart;
			
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="no_reply" id="noReply">';
				str += '		<i class="fa fa-frown-o"></i> 처음으로 댓글을 써보세요.';
				//str += '		<p>이제 <a href="/g">#아무말 게시판</a>에서 댓글도 모아볼 수 있네요.</p>';
				str += '	</div>';
				str += '</li>';
				
				M('#replyList').html(str)
				M('#noReply').on('click', function(){
					M('#inpReply').focus();
				})
			} else {
				//console.log(result)
				if (result.length < replyTotal) {
					//str += '<li class="more">마지막입니다.</li>';
				} else {
					str += '<li class="more" data-replymore><button class="btn btn-default btn-block">댓글 더 불러오기</button></li>';
				}
				
				for (var i=result.length-1; i>=0; i--) {
					var  content = result[i]['text']
						
					deleteable = deleteAble(result[i]['idx']);
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="https://romeoh.github.io/app/img/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + result[i]['uname'].substr(0, 10) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(content) + '</div>';
					
					/*if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '</div>';
					} else {
						//str += '	<div class="kas"><a href="../r/u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '님카스</a></div>';
					}*/
					str += '</li>';
				}
				//str += '<li>';
				//str += '	<div style="padding: 10px 0 10px 44px;">';
				//str += '		<p>이제 <a href="/g">#아무말 게시판</a>에서 댓글도 모아볼 수 있네요.</p>';
				//str += '	</div>';
				//str += '</li>';
				M('#replyList').html(str + M('#replyList').html());
				
				// 댓글 더보기
				M('[data-replymore]').on('click', function(evt, mp){
					mp.remove()
					initReply();
				})
				
				M('[data-delreply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('delreply');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + code + '_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								testReplyList = M.json(M.storage('testReplyList'))
								popList = []
								
							for (var i=0; i<testReplyList.length; i++) {
								if (result['id'] != testReplyList[i]) {
									popList.push(testReplyList[i])
								}
							}
							M.storage('testReplyList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var testReplyList = M.storage('testReplyList') || []
				
				if (typeof testReplyList === 'string') {
					testReplyList = M.json(testReplyList);
				}

				for (var i=0; i<testReplyList.length; i++) {
					if (testReplyList[i] == idx) {
						return true;
					}
				}
				return false;
			}
			replyTotal = 20;
		}
	})
}


dataThum = [
	'myTest0.png',
	'myTest1.png',
	'myTest2.png',
	'myTest3.png',
	'myTest4.png',
	'myTest5.png',
	'myTest6.png',
	'myTest7.png',
	'myTest8.png',
	'myTest9.png',
	'myTest10.png',
	'myTest11.png',
	'myTest12.png',
	'myTest13.png',
	'myTest14.png',
	'myTest15.png',
	'myTest16.png',
	'myTest17.png',
	'myTest18.png',
	'myTest19.png',
	'myTest20.png',
	'myTest21.png',
	'myTest22.png',
	'myTest23.png'
]


/**
 * 검색
 */
function initSearch() {
	$('#searchKeyword').on('keyup', function(e) {
		if (e.keyCode == 13) {
			onSearch()
		}
	})
	$('#btnSearch').on('click', onSearch)
}

function onSearch() {
	searchKeyword = $('#searchKeyword').val()
	if (!searchKeyword) return;

	newStart = 0
	newTotal = 20
	M('#hotContainer').html('');
	$('#searchKeyword').val('')
	$('#myModal').modal('hide')
	
	getHotTest()
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








