var  code = 'novel'
	// 인기리스트 가져오기
    ,hotTotal = 5
    ,hotStart = 0
    ,listFlag = localStorage.getItem('listFlag') || 'hot'
    ,adult = localStorage.getItem('novel_adult_block') || 'true'

	,hash
	,cuData = {}
	,novelComp = localStorage.getItem('novel_comp') || '{}'

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	//M.scroll(0);
}, false);

function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	initNovel();
	getNovelInfo();
	
	// 소설쓰기
	initWriteFiction();

	getHotList();
}

// 초기화
function initNovel() {
	$('#btnNew').css('display', 'block');
	
	hash = getHash();
	novelComp = JSON.parse(novelComp);

	checkLogin();
	
	$('#btnDetail').on('click', function(evt, mp){
		if ($('#storyBox').hasClass('close_panel')) {
			$('#storyBox').removeClass('close_panel');
			$('#btnDetail').html('<i class="fa fa-chevron-circle-up"></i> 닫기')
		} else {
			$('#storyBox').addClass('close_panel')
			$('#btnDetail').html('<i class="fa fa-chevron-circle-down"></i> 더보기')
		}
	})
	
	$('#btnGaeup').on('click', function(){
		setGaeup('UP')
	})
    $('#btnGaedown').on('click', function(){
        setGaeup('DOWN')
    })
	$('[data-share]').on('click', shareFic);
}

function getNovelInfo() {
	if (!hash) return window.location.href = './list.html';
	// 소설 전문통신
	databody = {
		'idx': hash
	}
	request(code+'_get', databody, function(result){
		var  result = JSON.parse(result)
			,str = ''
			,novelStr = ''
		
		if (result['idx'] == undefined) {
			window.location.href = './list.html';
		}
		cuData['idx'] = hash = result.idx;
		cuData['author'] = decodeURIComponent(result.author);
		cuData['kasid'] = decodeURIComponent(result.kasid);
		cuData['mode'] = decodeURIComponent(result.mode);
		cuData['genre'] = decodeURIComponent(result.genre);
		cuData['adult'] = result.adult;
		cuData['reply'] = result.reply;
		cuData['gaeup'] = result.gaeup;
		cuData['gaedown'] = result.gaedown;
		cuData['fic_count'] = result.fic_count;
		cuData['view'] = result.view;
		cuData['regDate'] = result.regDate;
		cuData['charactor'] = [];
		deleteAble = checkUniq(code, cuData['idx']);
		
		if (cuData['adult'] == '1') {
			if ( !checkUniq(code + '_adult', cuData['idx']) ) {
				$('#notice').css('display', 'block');
				$('#btnGoback').on('click', function(){
					window.location.href = 'list.html'
				})
				$('#btnContinue').on('click', function(){
					$('.alert').hide();
					setUniq(code + '_adult', cuData['idx']);
				})
				$('#chkNoAdult').on('click', function(evt, mp){
					if ($(this).attr('checked')) {
						localStorage.setItem('novel_adult_block', 'true');
					} else {
						localStorage.setItem('novel_adult_block', 'false');
					}
				})
			}
			
			cuData['title'] = decodeURIComponent(result.title);
			cuData['first_fic'] = decodeURIComponent(result.first_fic);
		} else {
			//cuData['title'] = sulFilter(result.title);
			//cuData['first_fic'] = sulFilter(result.first_fic);
            cuData['title'] = decodeURIComponent(result.title);
			cuData['first_fic'] = decodeURIComponent(result.first_fic);
		}
		for (var i=0; i<result.charactor.length; i++) {
			var  chara = {}
				,n = i+1
				
			chara['name'] = decodeURIComponent( result.charactor[i]['name'] );
			chara['age'] = decodeURIComponent( result.charactor[i]['age'] );
			chara['sex'] = decodeURIComponent( result.charactor[i]['sex'] );
			chara['job'] = decodeURIComponent( result.charactor[i]['job'] );
			chara['point'] = decodeURIComponent( result.charactor[i]['point'] );
			cuData['charactor'].push(chara);
			
			str += '<dt><i class="fa fa-male"></i> 등장인물' + n + '</dt>';
			str += '<dd><span>이름:</span> ' + cuData['charactor'][i]['name'] + '</dd>';
			if (cuData['charactor'][i]['age']) {
				str += '<dd><span>나이:</span> ' + cuData['charactor'][i]['age'] + '</dd>';
			}
			if (cuData['charactor'][i]['sex']) {
				str += '<dd><span>성별:</span> ' + cuData['charactor'][i]['sex'] + '</dd>';
			}
			if (cuData['charactor'][i]['job']) {
				str += '<dd><span>직업:</span> ' + cuData['charactor'][i]['job'] + '</dd>';
			}
			if (cuData['charactor'][i]['point']) {
				str += '<dd><span>특징:</span> ' + cuData['charactor'][i]['point'] + '</dd>';
			}
		}
		if (cuData['mode'] == 'public') {
			$('#writeBook').css('display', 'block')
			$('#mode').html('<i class="fas fa-people-carry"></i> 모두쓰기');
		} else {
			if (getPrivate(cuData['idx'])) {
				$('#writeBook').css('display', 'block');
				$('#writeTitle').html('<i class="fa fa-lock"></i> 소설을 전개 해보세요.')
			}
			$('#mode').html('<i class="fas fa-people-carry"></i> 혼자쓰기');
		}
		
		$('#fictitle').html('<a href="./list.html"><i class="fa fa-arrow-circle-left fa-lg"></i> ' + cuData['title'] + '</a>');

		$('#title').html('<i class="far fa-bookmark"></i> ' + cuData['title']);
		$('#genre').html('<i class="fas fa-film"></i> ' + cuData['genre']);
		$('#author').html('<i class="fas fa-pen-nib"></i> ' + cuData['author']);
        $('#viewCount').html('<i class="fas fa-eye"></i> ' + $.number(cuData['view']) + ' 회');
        $('#ficCount').html('<i class="fas fa-book"></i> ' + $.number(cuData['fic_count']) + ' 썰');
		$('#replyTitle').html('<i class="fa fa-reply fa-rotate-180"></i> 댓글('+cuData['reply']+')');
		$('#charactor').html(str);
		$('#btnGoReply').attr('href', './reply.html#'+cuData['idx']);
		$('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업 (' + cuData['gaeup'] + '회)')
		$('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따 (' + cuData['gaedown'] + ')')
		$('#goReport').html('신고하기').on('click', function() {
			location.href = '/report/?title=' + encodeURIComponent(cuData['title']) + '&url=' + encodeURIComponent('https://gaeyou.com/novel?' + cuData['idx'])
		})
		//console.log(cuData)
		if (deleteAble || admin) {
			$('#trash').html('<a id="delfic"><i class="fas fa-trash-alt"></i> 소설 삭제</a>')
            if (cuData['adult'] == '0') {
                $('#level').html('<a id="changeMode"><i class="fa fa-ban"></i> 19금으로 변경</a>')
            }
			$('#delfic')
				.data('trash', cuData['idx'])
				.on('click', function(evt, mp){
					if(!confirm('이 소설을 삭제하시겠습니까?')) {
						return false;
					}
					id = $(this).data('trash');
					
					bodyData = {
						'idx': id,
						'ua': navigator.userAgent,
                        'author': member.nickname,
                        'admin': admin
					}
					$.ajax({
						 'url': apiurl + code + '_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var test = JSON.parse(localStorage.getItem(code))
								popList = []
								
							for (var i=0; i<test.length; i++) {
								if (cuData['id'] != test[i]) {
									popList.push(test[i])
								}
							}
							localStorage.setItem(code, JSON.stringify(popList));
							window.location.href = './list.html';
						}
					})
				})
			$('#changeMode')
				.data('trash', cuData['idx'])
				.on('click', function(evt, mp){
					if(!confirm('19금으로 변경하면 전체가로 다시 변경할수 없습니다.\n19금으로 변경할까요?')) {
						return false;
					}
					id = $(this).data('trash');
					if (cuData['adult'] == '1') {
						l = '0'
						m = '전체가 등급으로 변경되었습니다.'
					} else {
						l = '1'
						m = '19금 등급으로 변경되었습니다.'
					}
					bodyData = {
						'idx': id,
						'level': l
					}
					$.ajax({
						 'url': apiurl + code + '_change_level.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = JSON.parse(result)
								
							alert(m)
							window.location.reload();
						}
					})
					
				})
		}
		
		novelStr += '	<h3 class="blockquote-footer">도입부</h3>';
		novelStr += '	<p class="lead">' + cuData['first_fic'].replace(/\n/g, '<br>') + '</p>';
		novelStr += '<div class="data" id="novel">';
		novelStr += '</div>';

		$('#novelBook').html(novelStr);
		
		// 소설 가져오기
		getFiction();
		initReply();
		initView();
	})
}


// 썰 가져오기 전문
function getFiction() {
	// 썰 전문통신
	databody = {
		'idx': hash
	}
	request(code+'_fictions_get', databody, function(result){
		var  result = JSON.parse(result)
			,str = ''
			,fiction = cuData['first_fic'] + '\n\n'
		
		for (var i=0; i<result.length; i++) {
			if (cuData['adult'] == '0') {
				contents = sulFilter(result[i]['text']).replace(/\n/g, '<br>')
			} else {
				contents = decodeURIComponent(result[i]['text']).replace(/\n/g, '<br>')
			}
			
			str += '	<h3 class="blockquote-footer">';
			str += '		<span>' + decodeURIComponent(result[i]['author']) + '</span> 님의 썰 ';
			if (getComp(result[i]['idx'])) {
				str += '	| <i class="far fa-trash-alt" data-del="' + result[i]['idx'] + '"></i>';
			}
			str += '	</h3>';
			str += '	<p class="lead">' + contents + '</p>';
			fiction += decodeURIComponent(result[i]['text']) + '\n\n';

			/*if (i%5 == 4) {
				str += '<div style="text-align:center; margin: 0 0 0 0" id="adMiddle">'
				str += '	<ins class="kakao_ad_area" style="display:none;" '
				str += '	 data-ad-unit    = "DAN-wVybJKcwRAaLG58g" '
				str += '	 data-ad-width   = "320" '
				str += '	 data-ad-height  = "100"></ins> '
				str += '</div>'
			}*/
		}
		cuData['fiction'] = fiction
		$('#novel').html(str);
		$('[data-del]').on('click', function(evt, mp){
			if(!confirm('썰을 정말 삭제하시겠습니까?')) {
				return false;
			}
			var idx = $(this).data('del')
			bodyData = {
				'idx': idx,
				'novelIdx': cuData['idx'],
				'ua': navigator.userAgent,
                'author': encodeURIComponent(member.nickname),
				'url': window.location.href
			}
			$.ajax({
				 'url': apiurl + code + '_fiction_del.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = JSON.parse(result)
						,popList = []
						,comps = novelComp[cuData['idx']]
						
					for (i in comps) {
						if (result['id'] != comps[i]) {
							popList.push(comps[i]);
						}
					}
					novelComp[cuData['idx']] = popList;
					localStorage.setItem('novel_comp', JSON.stringify(novelComp));
					window.location.reload();
				}
			})
		})
	})
}

// 깨업
function setGaeup(flag) {
	if ( checkUniq('novel_gaeup_list', cuData['idx']) ) {
		alert('이미 평가 하셨습니다.');
		return false;
	}
	if (window.GaeyouGnb && window.GaeyouGnb.track) window.GaeyouGnb.track('novel_like', { kind: flag == 'UP' ? 'up' : 'down' });

	// 깨업
	databody = {
		'uid': member['uid'],
		'uname': member['uname'],
		'email': member['email'],
		'idx': cuData['idx'],
		'code': code,
		'flag': flag
	}
	request('novel_gaeup', databody, function(result){
        if (flag == 'UP') {
            var cuGaeup = parseInt(cuData['gaeup']) + 1
            setUniq(code + '_gaeup_list', cuData['idx']);
            
            $('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업(' + cuGaeup + '회)');
            alert('깨업했습니다.')
        }
        if (flag == 'DOWN') {
            var cuGaeup = parseInt(cuData['gaedown']) + 1
            setUniq(code + '_gaeup_list', cuData['idx']);
            
            $('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따(' + cuGaeup + '회)');
            alert('깨따했습니다.')
        }
	})
}

// 조회수 올리기
function initView() {
	// 조회수 업데이트
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
		}
	})
}


// 소설쓰기 전문
function initWriteFiction() {
	$('#fcontent').on('keyup', function(evt, mp){
		$('#ficleng').html($(this).val().length+'/1000')
	})
	$('#btnfReg').on('click', function(evt, mp){
		if (!member) {
			alert('로그인이 필요합니다.')
			var search = location.search
			return window.location.href = '../member/login.html#/novel/' + search
		}
		if (!$('#fcontent').val()) {
			alert('썰을 적어주세요.');
			$('#fcontent').focus();
			return false;
		}
		databody = {
			'idx': cuData['idx'],
			'author': encodeURIComponent(member['nickname']),
			'kasid': '',
			'content': encodeURIComponent($('#fcontent').val()),
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		request(code+'_fiction_add', databody, function(result){
			var  result = JSON.parse(result)
				,fic_count = localStorage.getItem(code+'_count') || 0
			fic_count = Number(fic_count) + Number(1);
			localStorage.setItem(code+'_count', fic_count);
			
			if (setComp(result['result']) ) {
				if (window.GaeyouGnb && window.GaeyouGnb.track) window.GaeyouGnb.track('novel_write', {}, { next: true });
				window.location.reload();
			}
		})
	})
	/*var infostr = ''
	infostr += '<p>1. <i class="fa fa-ban"></i>19금 마크가 없는 썰은 선정적인 단어가 필터링 될수 있습니다.</p>'
	infostr += '<p>2. 선정적인 소재의 썰을 <i class="fa fa-ban"></i>19금 마크없이 연재할 경우 예고없이 삭제될 수 있습니다.</p>'
	$('#plan').popover({
		 title: '<i class="fa fa-info-circle"></i> 소설 운영정책'
		,content: infostr
		,html:true
		,placement:'top'
	})*/
}

// 댓글가져오기
function initReply() {
	// set
	if (!member) {
		$('#replyNickname').css('display', 'block');
		$('#replyName').css('display', 'none');
	} else {
        $('#nickname').val(member.nickname).attr('disabled', 'disabled')
    }
	
	$('#btnRegReply').on('click', function(evt, mp){
		var inpReply = $('#inpReply').val().replace(/\n/g, '<br>').substr(0, 170)
		if (!!member) {
			uname = member['nickname'];
		} else {
			$('#replyNickname').css('display', 'block');
			
			if ($('#nickname').val() == '') {
				alert('닉네임을 입력하세요.');
				$('#nickname').focus();
				return false;
			}
			uname = $('#nickname').val();
		}
		if (inpReply == '') {
			alert('댓글을 입력하세요.');
			$('#inpReply').focus();
			return false;
		}
		
		imoidx = process(dataPhoto);
		imoticon = dataPhoto[imoidx]
		bodyData = {
			'idx': cuData['idx'],
			'uname': uname,
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
				var  result = JSON.parse(result)
					,key = code + 'ReplyList'
				
				setUniq(key, result['id']);
				window.location.reload();
			}
		})
	})
	
	// get
	databody = {
		'idx': cuData['idx']
	}
	request(code+'_reply_get_all', databody, function(result){
		
		var  result = JSON.parse(result)
			,rstr = ''
		//	,fic_count = localStorage.getItem(code+'_count') || 0
		
		for (var i=0; i<result.length; i++) {
			var  replys = {}
				,deleteAble = checkUniq(code + 'ReplyList', result[i]['idx'])
				//,n = i+1
			replys['uname'] = decodeURIComponent( result[i]['uname'] );
			replys['kasid'] = decodeURIComponent( result[i]['kasid'] );
			replys['text'] = decodeText( result[i]['text'] );
			replys['idx'] = decodeURIComponent( result[i]['idx'] );
			replys['regDate'] = result[i]['regDate'];
			//cuData['replyList'].push(replys);
            rstr += '       <div class="card-reply">';
			rstr += '		  <h5 class="card-title reply-author">' + replys['uname'] + '</h5>';
            rstr += '           <div class="reply-info">';
            //rstr += '		     <span>' + moment(replys['regDate'], 'YYYY-MM-DD HH:mm:SS').locale('ko').fromNow() + '</span>';
			if (deleteAble || admin) {
				rstr += '		 <span> | <i class="far fa-trash-alt" data-delreply="' + replys['idx'] + '"></i></span>';
			}
            rstr += '           </div>';
            rstr += '       </div>';
			rstr += '	<p class="card-text">' + replys['text'] + '</p>';
			
		}
        if (!rstr) {
            rstr = '<i class="far fa-grin-tongue"></i> 아직 댓글이 없어요.'
        }
		$('#replyList').html(rstr);
		
		// 삭제하기
		if (deleteAble || admin) {
            var ad = ''
			if (admin) {
				ad = 'true'
			}
			$('[data-delreply]').on('click', function(evt, mp){
				if(!confirm('댓글을 정말 삭제하시겠습니까?')) {
					return false;
				}
				id = $(this).data('delreply');
				
				bodyData = {
					'idx': id,
					'novelIdx': cuData['idx'],
					'ua': navigator.userAgent,
					'admin': ad
				}
				$.ajax({
					 'url': apiurl + code + '_reply_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var result = JSON.parse(result)
							test = JSON.parse(localStorage.getItem(code + 'ReplyList'))
							popList = []
							
						for (var i=0; i<test.length; i++) {
							if (result['id'] != test[i]) {
								popList.push(test[i]);
							}
						}
						localStorage.setItem(code + 'ReplyList', JSON.stringify(popList));
						window.location.reload();
					}
				})
			})
		}
	})
}

function shareFic(evt, mp) {
	// 공유 (2026-10-24): X·쓰레드·폰 공유창 (버튼은 novel/index.html의 .gy-share)
	if (window.GaeyouGnb && GaeyouGnb.share && cuData && cuData['idx']) {
		var  gyMedia = $(this).attr('data-share')
			,gyPost = '🎩 소설: 함께 쓰는 소셜픽션\n────────────────────\n[' + cuData['title'] + ']\n\n' + cuData['first_fic']
		if (gyMedia == 'twitter' && gyPost.length > 110) gyPost = gyPost.substr(0, 110) + '...'
		GaeyouGnb.share(gyMedia, { title: cuData['title'], text: gyPost, url: 'https://gaeyou.com/novel/?' + cuData['idx'] })
		return false
	}
	var  data = {}
		,media = $(this).data('share') || 'story'
		,post = ''
		,twit = ''
		,data = {}
	
	if (!getAd()) {
		setUniq(code + '_ad', cuData['idx']);
	}
	data.title = cuData['title'];
	data.app = '소설: 함께 쓰는 소셜픽션';
	data.url = 'http://gaeyou.com/novel/#'+cuData['idx'];
	data['media'] = $(this).data('share') || 'story';

	if (data['media'] == 'talk') {
		shareData(data);
		return false;
	}
	
	post += '🎩 소설: 함께 쓰는 소셜픽션\n';
	post += '────────────────────\n'
	post += '[' + data.title + ']\n\n';
	post += cuData['fiction']+'';
	data.post = post;

	
	data['media'] = $(this).data('share');
	data.post = post;
	data.desc = cuData['exp'];
	data.img = 'http://www.gaeyou.com/upload/novel/'+cuData['idx']+'.png';
	
	shareData(data);
}

function getAd() {
	var adList = localStorage.getItem(code + '_ad') || '[]'
	adList = JSON.parse(adList)
	
	for (var i in adList) {
		if (adList[i] == cuData['idx']) {
			return true;
		}
	}
	return true;
	//return false;
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

function getComp(idx) {
	compList = novelComp[cuData['idx']];
	for (i in compList) {
		if (compList[i] == idx) {
			return true;
		}
	}
	return false;
}

function getPrivate(idx) {
	var private = localStorage.getItem(code) || '[]';
	private = JSON.parse(private);
	for (i in private) {
		if (private[i] == idx) {
			return true;
		}
	}
	return false;
}

function setComp(idx) {
	var complist = novelComp[cuData['idx']] || []
	complist.push(idx);
	novelComp[cuData['idx']] = complist;
	localStorage.setItem('novel_comp', JSON.stringify(novelComp));
	return true;
}





