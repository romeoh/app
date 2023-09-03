var  apiUrl = './api/v1/share.php'
	,listApiUrl = './api/v1/list.php'
	,myName
	,yourName
	,percents

function getNumber(key) {
	var dic = { 'ㄱ': 2,'ㄲ': 3,'ㄴ': 2,'ㄷ': 3,'ㄸ': 6,'ㄹ': 5,'ㅁ': 4,'ㅂ': 4,'ㅃ': 8,
				'ㅅ': 2,'ㅆ': 4,'ㅇ': 1,'ㅈ': 3,'ㅉ': 6,'ㅊ': 4,'ㅋ': 3,'ㅌ': 4,'ㅍ': 4,
				'ㅎ': 3,'ㅏ': 2,'ㅐ': 3,'ㅑ': 3,'ㅒ': 4,'ㅓ': 2,'ㅔ': 3,'ㅕ': 3,'ㅖ': 4,
				'ㅗ': 2,'ㅘ': 4,'ㅙ': 5,'ㅚ': 3,'ㅛ': 3,'ㅜ': 2,'ㅝ': 4,'ㅞ': 5,'ㅟ': 3,
				'ㅠ': 3,'ㅡ': 1,'ㅢ': 2,'ㅣ': 1,'ㄳ': 4,'ㄵ': 5,'ㄶ': 5,'ㄺ': 7,'ㄻ': 9,
				'ㄼ': 9,'ㄽ': 6,'ㄾ': 9,'ㄿ': 9,'ㅀ': 8,'ㅄ': 6}
	return dic[key] || 0
}

function getConstantVowel(kor) {
    const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
    const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
    const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
               'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588);
    let sn = parseInt((uni - (fn * 588)) / 28);
    let tn = parseInt(uni % 28);

    return [ f[fn], s[sn], t[tn] ].join('')
}

function getCho(korName) {
    var chs = []
    for (var i in korName) {
        var c = getConstantVowel(korName[i])
        for (var j in c) {
            chs.push(c[j])
        }
    }
    return chs
}

function onlyKorean(value) {
	var pattern = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g
	return value.replace(pattern, '')
};

function parseResult(myChoArr, yourChoArr, nameNumber) {
	var  k = 0
		,str = []
	
	str.push(getSpecial()[0] + ' 너의이름으로 궁합\n------------------')
	for (var i=nameNumber[0].length; i>2; i--) {
		var nums = []
		for (var j in nameNumber[k]) {
			if (j != 0) {
				var  lastNum = nameNumber[k][j-1]
					,res = (lastNum + nameNumber[k][j]) % 10
				nums.push(res)
			}
		}
		if (i == 3) {
			percents = parseInt(nums.join(''), 10)
		}
		nameNumber.push(nums)
		k++
	}
	
	//str.push(myChoArr.join(''))
	if ($('#mySecret').is(':checked')) {
		var myNameArrSecret = []
		for (var i in myChoArr) {
			if (i == 0) {
				myNameArrSecret.push(myChoArr[0]+' ')
			} else {
				myNameArrSecret.push('X ')
			}
		}
		str.push(myNameArrSecret.join(''))
	} else {
		str.push(myChoArr.join(''))
	}

	if ($('#yourSecret').is(':checked')) {
		var yourNameArrSecret = []
		for (var i in yourChoArr) {
			if (i == 0) {
				yourNameArrSecret.push(yourChoArr[0]+' ')
			} else {
				yourNameArrSecret.push('X ')
			}
		}
		str.push(yourNameArrSecret.join(''))
	} else {
		str.push(yourChoArr.join(''))
	}

	for (var i in nameNumber) {
		var  line = nameNumber[i].join(' ')
			,spce = ''
		for (var k=0; k<i; k++) {
			spce = spce + ' '
		}
		line = spce + line
		str.push(line)
	}
	return str.join('\n') + ' %\n------------------\n' + 'http://gaeyou.com/m/'
}

function getSpecial() {
	var data = ['🐍','🐎','🐚','🐛','🐜','🐝','🐯','🐮','🐭','🐬','🐫','🐟','🐞','🐺','🐻','🐼','🐽',
				'🐾','🐑','🐒','🐢','🐡','🐠','🐙','🐘','🐗','🐔','🐣','🐤','🐥','🐦','🐧','🐨','🐩'
	]
	shuffle(data)
	return data
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5)
}


function init() {

	myName = localStorage.getItem('uname') || ''
	if (myName) {
		$('#myName').val(onlyKorean(myName))
		myName = onlyKorean(myName)
	}
	
	var url = new URL(window.location.href);
	var your = url.searchParams.get('your')
	if (your) {
		$('#yourName').val(onlyKorean(your))
		yourName = onlyKorean(your)
	}

	$('#myName').on('change', function() {
		var value = $(this).val()
		$('#myName').val(onlyKorean(value))
		localStorage.setItem('uname', onlyKorean(value))
		myName = onlyKorean(value)
	})
	$('#yourName').on('change', function() {
		var value = $(this).val()
		$('#yourName').val(onlyKorean(value))
		yourName = onlyKorean(value)
	})
	$('#mySecret').on('change', function() {
		var mySecret = $(this).is(':checked')
		
		if (mySecret) {
			$('#yourSecret').prop('checked', false)
		}
	})
	$('#yourSecret').on('change', function() {
		var yourSecret = $(this).is(':checked')
		
		if (yourSecret) {
			$('#mySecret').prop('checked', false)
		}
	})

	$('[data-share]').on('click', function() {
		var platform = $(this).attr('data-share')
		
		myName = onlyKorean($('#myName').val())
		yourName = onlyKorean($('#yourName').val())
		if (!myName) {
			return alert('나의 이름을 입력하세요.')
		}
		if (!yourName) {
			return alert('너의 이름을 입력하세요.')
		}
		
		var myChoArr = getCho(myName)
		var yourChoArr = getCho(yourName)
		var choLeng = Math.max(myChoArr.length, yourChoArr.length)
		var nameNumber = []
		
		for (var i=0; i<choLeng; i++) {
			var  myCho = getNumber(myChoArr[i])
				,yourCho = getNumber(yourChoArr[i])

			nameNumber.push(myCho + yourCho)
		}
		var resultTxt = parseResult(myChoArr, yourChoArr, [nameNumber])

		var settings = {
		    'url': apiUrl,
		    'method': 'POST',
		    'data': {
		         flag: 'saveMatch'
		        ,myName: myName
		        ,mySecret: $('#mySecret').is(':checked') ? 1 : 0
		        ,yourName: yourName
		        ,yourSecret: $('#yourSecret').is(':checked') ? 1 : 0
		        ,percents: percents
		        ,platform: platform
		    },
		};
		
		$.ajax(settings).done(function (res) {
			var  idx = JSON.parse(res)
				,str = ''
			
			resultTxt = resultTxt + '?' + idx

			if (platform == 'kakaostory') {
                if (!Kakao.isInitialized()) {
                    Kakao.init('eaed55751e121f59b09594ba64fa7558')
                }
                Kakao.Story.share({
                    url: 'http://gaeyou.com/m/',
                    text: resultTxt
                });
            }
            if (platform == 'twitter') {
                str += 'https://twitter.com/intent/tweet?text='
                str += encodeURIComponent(resultTxt)
                top.location.href = str;
            }

			console.log(resultTxt)
		});
		
	})
}

// 이름 목록 가져오기
function getNameList() {
	var  url = listApiUrl
        ,data = {
             flag: 'list'
            ,total: 50
            ,start: 0
        }

    $.get(url, data, function(res) {
		var str = ''
        res = JSON.parse(res)
        res.forEach((redata, index) => {
	        var order = index + 1
	        var count = parseInt(redata.CNT).toLocaleString()
            str += `
            <div class="card-body p-0">
	            <div class="border-top p-3 px-md-4 mx-0">
	                <a class="row justify-content-between small mb-2" href="index.html?your=${redata.YOUR_NAME}">
	                    <h5 class="col">
	                        <em style="color: #aaa">${order}위 </em>
	                        <span class="mr-3">${redata.YOUR_NAME}</span> 
	                        <i class="fa-regular fa-share-from-square"></i>
	                    </h5>
	                    <div class="col-auto">
	                        ${count} 회
	                    </div>
	                </a>
	            </div>
	        </div>
	        `
        })
        $('#container-list').html(str)
    })
}


window.addEventListener('DOMContentLoaded', function() {
	if ($('#container-list').length === 0) {
		// index
		init()	
	} else {
		// 목록
		getNameList()
	}
    
}, false);
































