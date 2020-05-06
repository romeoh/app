var  hasTest = false
	,cuList = 1
	,bodyData
	,sendPollData
	,uname
	,kasid
	,testTitle
	,textExp
	,result
	,li1
	,li2
	,li3
	,li4
	,li5
	,lists = []
	,testLists = []
	,listLength = []
	,testData = []
	,listLeng = 1
	,code = 'test'

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/**
	if (!admin) {
		alert('서버 점검중입니다.');
		window.location.href = 'http://gaeyou.com/s/';
		return false;
	}
	/**/
	
	var  kas = M.storage('kasid') || ''
		,uname = M.storage('uname') || ''
	
	if(!isLogin()){
		M('#nickGroup').css('display', 'block');
	}
	
	$('#helpTitle').popover({
		 title: '테스트 제목은 어디에 표시되나요?'
		,content: '<img src="http://gaeyou.com/images/common/img_test1.png" />'
		,html:true
		,placement:'bottom'
	})
	$('#helpExp').popover({
		 title: '테스트 설명은 어디에 표시되나요?'
		,content: '<img src="http://gaeyou.com/images/common/img_test2.png" />'
		,html:true
		,placement:'bottom'
	})
	$('#helpText').popover({
		 title: '테스트 결과문장은 뭔가요?'
		,content: '카카오스토리에 올라가는 완성된 문장입니다. <br><span style="color:#39b3d7">[이름]</span>은 사용자가 입력한 이름이 대신 표시됩니다. <br><span style="color:#39b3d7">[항목1]~[항목5]</span>는 제작자가 만든 항목중 <br>1개가 랜덤으로 교체되어 표시됩니다.'
		,html:true
		,placement:'bottom'
	})
	$('#helpList').popover({
		 title: '항목은 뭔가요?'
		,content: '항목은 줄바꿈(엔터키)로 구분해주세요.<br>항목들중에 1개가 랜덤으로 선택되어 카스에 올라갑니다.'
		,html:true
		,placement:'bottom'
	})
	
	M('#uname')
		.on('blur', function(evt, mp){
			M.storage('uname', mp.val())
		})
		.val(uname);
	M('#kasid')
		.on('blur', function(evt, mp){
			M.storage('kasid', mp.val())
		})
		.val(kas);
	
	// 항목 추가
	M('#btnAdd').on('click', function(){
		if (cuList == 5) {
			alert('더이상 추가할수 없습니다.');
			return false;
		}
		cuList++;
		M('[data-list="'+cuList+'"]').css('display', 'block');
	})
	
	// 항목 삭제
	M('#btnDel').on('click', function(){
		if (cuList == 1) {
			alert('삭제할 수 없습니다.');
			return false;
		}
		M('[data-list="'+cuList+'"]').css('display', 'none');
		cuList--;
	})
	
	M('#result').on('blur', function(){
		hasTest = false;
	})
	M('#list1')
		.on('blur', function(){
			hasTest = false;
		})
		.on('keyup', function(evt, mp){
			var  val = mp.val()
				,listLength = val.split('\n').length
				,id = mp.parent().data('list')
			
			M('[data-length="' + id + '"]').html('총 ' + listLength + '개')	
		})
	M('#list2')
		.on('blur', function(){
			hasTest = false;
		})
		.on('keyup', function(evt, mp){
			var  val = mp.val()
				,listLength = val.split('\n').length
				,id = mp.parent().data('list')
			
			M('[data-length="' + id + '"]').html('총 ' + listLength + '개')	
		})
	M('#list3')
		.on('blur', function(){
			hasTest = false;
		})
		.on('keyup', function(evt, mp){
			var  val = mp.val()
				,listLength = val.split('\n').length
				,id = mp.parent().data('list')
				
			M('[data-length="' + id + '"]').html('총 ' + listLength + '개')	
		})
	M('#list4')
		.on('blur', function(){
			hasTest = false;
		})
		.on('keyup', function(evt, mp){
			var  val = mp.val()
				,listLength = val.split('\n').length
				,id = mp.parent().data('list')
			
			M('[data-length="' + id + '"]').html('총 ' + listLength + '개')	
		})
	M('#list5')
		.on('blur', function(){
			hasTest = false;
		})
		.on('keyup', function(evt, mp){
			var  val = mp.val()
				,listLength = val.split('\n').length
				,id = mp.parent().data('list')
			
			M('[data-length="' + id + '"]').html('총 ' + listLength + '개')	
		})
	
	// 테스트 검사
	M('#btnTest').on('click', function(){
		for (var i=cuList+1; i<6; i++) {
			M('#list'+i).val('');
		}
		
		kasid = ''
		testTitle = M('#testTitle').val()
		textExp = M('#textExp').val()
		result = M('#result').val()
		li1 = M('#list1').val()
		li2 = M('#list2').val()
		li3 = M('#list3').val()
		li4 = M('#list4').val()
		li5 = M('#list5').val()
		lists.length = 0
		listLength.length = 0
		testLists.length = 0
		
		if(!isLogin()){
			if (M('#uname').val() === '') {
				alert('닉네임을 입력해주세요.');
				M('#uname').focus()
				return false;
			}
			uname = M('#uname').val()
		} else {
			uname = member['nickname']
		}
		
		if (testTitle === '') {
			alert('테스트 제목을 입력해주세요.');
			M('#testTitle').focus()
			return false;
		}
		if (textExp === '') {
			alert('테스트 설명을 입력해주세요.');
			M('#textExp').focus()
			return false;
		}
		
		// 결과문장 검증
		if (result === '') {
			alert('결과 문장을 입력해주세요.');
			M('#result').focus()
			return false;
		}
		
		for (var i=0; i<cuList; i++) {
			var  n = i+1
				,val = M('#list'+n).val()
							.replace(/\n\n/g, '\n')
							.replace(/\n\n\n/g, '\n')
							.replace(/\n/g, '|')
							.replace(/\|\s\s$/, '')
							.replace(/\|\s$/, '')
							.replace(/\|$/, '')
							.replace(/^\|/, '')
							.replace(/\|\|\|\|/g, '|').replace(/\|\|\|/g, '|').replace(/\|\|/g, '|')
				,valLength = val.split('|').length
				//,reArr = val.match(re).length			
			
			lists.push( encodeURIComponent(val) )
			testLists.push(val.split('|'))
			listLength.push( valLength )
		}
		
		if ((/\[항목1\]/).test(result)) {
			if (lists[0] === '') {
				alert('[항목1]이 비어 있습니다.');
				M('#list1').focus()
				return false;
			}
		}
		if ((/\[항목2\]/).test(result)) {
			if (cuList < 2) {
				alert('결과문장에 "[항목2]"가 있기때문에 항목을 더 추가해야 합니다.');
				return false;
			}
			if (lists[1] === '') {
				alert('[항목2]가 비어 있습니다.');
				M('#list2').focus()
				return false;
			}
		}
		if ((/\[항목3\]/).test(result)) {
			if (cuList < 3) {
				alert('결과문장에 "[항목3]"가 있기때문에 항목을 더 추가해야 합니다.');
				return false;
			}
			if (lists[2] === '') {
				alert('[항목3]이 비어 있습니다.');
				M('#list3').focus()
				return false;
			}
		}
		if ((/\[항목4\]/).test(result)) {
			if (cuList < 4) {
				alert('결과문장에 "[항목4]"가 있기때문에 항목을 더 추가해야 합니다.');
				return false;
			}
			if (lists[3] === '') {
				alert('[항목4]가 비어 있습니다.');
				M('#list4').focus()
				return false;
			}
		}
		if ((/\[항목5\]/).test(result)) {
			if (cuList < 5) {
				alert('결과문장에 "[항목5]"가 있기때문에 항목을 더 추가해야 합니다.');
				return false;
			}
			if (lists[4] === '') {
				alert('[항목5]가 비어 있습니다.');
				M('#list5').focus()
				return false;
			}
		}
		
		result = result.replace(/\[이름\]/g, '#이름#')
				.replace(/\[항목1\]/g, '#항목1#')
				.replace(/\[항목2\]/g, '#항목2#')
				.replace(/\[항목3\]/g, '#항목3#')
				.replace(/\[항목4\]/g, '#항목4#')
				.replace(/\[항목5\]/g, '#항목5#')
		
		if ((/\[/).test(result)) {
			alert('결과에 문구에 "[이름]", "[항목1]", "[항목2]", "[항목3]", "[항목4]", "[항목5]" 이외의 항목은 들어갈 수 없습니다.');
			return false;
		}
		
		for (var i=0; i<listLength.length; i++) {
			if (i == 0) {
				listLeng = listLength[i]
			} else {
				listLeng = listLeng * listLength[i]
			}
		}
		
		var  str = ''
			,testname = M('#testname').val()
			,resultTxt = result.replace(/#이름#/, testname)
			
		for (var i=0; i<lists.length; i++) {
			testData.push(decodeURIComponent(lists[i]));
		}
				
		
		if (resultTxt.indexOf('#항목1#') != -1) {
			val1 = testLists[0]
			idx1 = process(val1)
			resultTxt = resultTxt.replace(/#항목1#/, val1[idx1])
		}
		if (resultTxt.indexOf('#항목2#') != -1) {
			val2 = testLists[1]
			idx2 = process(val2)
			resultTxt = resultTxt.replace(/#항목2#/, val2[idx2])
		}
		if (resultTxt.indexOf('#항목3#') != -1) {
			val3 = testLists[2]
			idx3 = process(val3)
			resultTxt = resultTxt.replace(/#항목3#/, val3[idx3])
		}
		if (resultTxt.indexOf('#항목4#') != -1) {
			val4 = testLists[3]
			idx4 = process(val4)
			resultTxt = resultTxt.replace(/#항목4#/, val4[idx4])
		}
		if (resultTxt.indexOf('#항목5#') != -1) {
			val5 = testLists[4]
			idx5 = process(val5)
			resultTxt = resultTxt.replace(/#항목5#/, val5[idx5])
		}
		str = resultTxt.replace(/\n/g, '<br>')
		M('#resultText').html(str)
		M('#btnTest').html('<div class="inner">총 ' + listLeng + '개의 결과를 다시 테스트합니다.</div>');
		hasTest = true;
	})
	
	M('#btnReg').on('click', addTest);
	// 등록
	function addTest() {
		if (!hasTest) {
			alert('위에 파란색 버튼을 눌러 결과값을 미리 확인해보세요.');
			return false;
		}
		if (listLeng == 1) {
			if (!confirm('결과가 1개밖에 없습니다. 그래도 등록할까요?\n예상되는 결과가 많으면 인기를 얻을 확률이 많습니다.\n엔터키로 항목을 추가할수 있습니다.')) {
				return false;
			}
		}
		M('#btnReg').off('click');
			
		bodyData = {
			'uname': encodeURIComponent(uname),
			'kasid': encodeURIComponent(kasid),
			'title': encodeURIComponent(testTitle),
			'exp': encodeURIComponent(textExp),
			'result': encodeURIComponent(result),
			'resultLeng': listLeng,
			'lists': lists
		}
		$.ajax({
			 'url': apiurl + code + '_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var result = M.json(result);
				setUniq('test', result.result);
				
				// 썸네일 만들기
				bodyData = {
					'title': testTitle,
					'idx': result.result
				}
				$.ajax({
					 'url': apiurl + code + '_make_thum.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(){
						alert('테스트가 등록되었습니다.');
						//console.log(result.result)
						window.location.href = 'http://gaeyou.com/t/#' + result.result;
					}
				})
			}
		})
	}
	
	M('#btnCancel').on('click', function(){
/**
M('#testTitle').val('닮을꼴 연예인 찾기')
M('#textExp').val('이름만으로 미래에 닮을꼴 연예인을 찾아드립니다.')
M('#result').val('[이름]님과 닮을 연예인은 [항목1]이며, [항목2] 닮았습니다.')
M('#list1').val('이순재\n김혜자\n신구')
M('#list2').val('100%\n80%\n60%\n40%\n20%\n0%')
//M('#contents').html('안녕하세요<div>ㅋㅋㅋㅋㅋㅋㅋ</div>')
/**/
		window.location.href = 'http://gaeyou.com/t/';
	})
	
	M('[data-addlist]').on('click', function(evt, mp){
		var  idx = mp.data('addlist')
			,result = M('#result').val()
			,items = ['[이름]', '[항목1]', '[항목2]', '[항목3]', '[항목4]', '[항목5]']
		
		if (hasItem(result, items[idx])) {
			result = result.replace(items[idx], '')
		} else {
			result = result + items[idx]
		}
		M('#result').val(result);
	})
	function hasItem(result, idx) {
		if (result.indexOf(idx) == '-1') {
			return false;
		} else {
			return true;
		}
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


