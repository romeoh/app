var  swiper
    ,maxValue = 0
    ,minValue = 0
    ,resultValue
    ,resultPercent
    ,resultIndex
    ,userName

$(document).ready(function () {
    initUserName()
    initScore()
    initQuestion()
    initSwiper()
    initResult()
    initAppList()
});

function initUserName() {
    userName = localStorage.getItem('io.github.romeoh.user.name')
    $('#nickname').val(userName)

    $('#pageTitle').html(pageTitle)
    $('#resultMessage').html(userName + resultMsg)
}

function initScore() {
    shuffle(questions)
    questions.length = 5
}
function initQuestion() {
    questions.forEach(function(q, i) {
        shuffle(q)

        var  str = ''
            ,aw = q[0].weight
            ,bw = q[1].weight
        
        maxValue = maxValue + Math.max(aw, bw)
        minValue = minValue + Math.min(aw, bw)
        
        str += '<div class="jumbotron">'
        str += '    <h1 class="display-4">'
        str += '        <img src="../img/q' + i + '.png" alt="title" style="height:30px">'
        str += '        <img src="../img/question.png" alt="title" style="height:30px">'
        str += '    </h1>'
        str += '    <p>더 좋아하는것을 고르세요.</p>'
        str += '    <hr class="my-2">'
        str += '    <div class="row">'
        str += '        <div class="col" data-weight="' + q[1].weight + '">'
        str += '            <div class="card" style="width: ">'
        str += '                <img src="../img/source/' + q[0].image + '" class="card-img-top" alt="...">'
        str += '                <div class="card-body">'
        str += '                    <p class="card-text">' + q[0].title + '</p>'
        str += '                </div>'
        str += '            </div>'
        str += '        </div>'
        str += '        <div class="col" data-weight="' + q[1].weight + '">'
        str += '            <div class="card" style="width: ">'
        str += '                <img src="../img/source/' + q[1].image + '" class="card-img-top" alt="...">'
        str += '                <div class="card-body">'
        str += '                    <p class="card-text">' + q[1].title + '</p>'
        str += '                </div>'
        str += '            </div>'
        str += '        </div>'
        str += '    </div>'
        str += '</div>'
        $('#q'+i).html(str)
    })
    
    $('[data-weight]').on('click', function() {
        var  weight = $(this).attr('data-weight')
        resultValue = resultValue + parseInt(weight, 10)
        //console.log(weight, resultValue, maxValue)
        swiper.slideNext()
    })
}

function initSwiper() {
    swiper = new Swiper('.swiper-container', {
        navigation: {
            //nextEl: '.btn.btn-primary'
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'progressbar',
        },
        clickable: true,
        autoHeight: true,
        //effect : 'slide',
        allowTouchMove: false,
        mousewheel: false,
        keyboard: true,
        cssMode: false
    });
    swiper.on('slideChange', function (e) {
        if (swiper.snapIndex == 6) {
            calculateResult()
            shareResult()
            getResult()
        }
    });
    $('#startGame').on('click', function() {
        userName = $('#nickname').val()
        localStorage.setItem('io.github.romeoh.user.name', userName)
        if (!userName) {
            return alert('닉네임을 입력하세요.')
        }
        swiper.slideNext()
    })
}

function initResult() {
    var str = ''
    results.forEach(function(result, index) {
        str += '<img src="' + result.image + '" width="200" height="200" />'
    })
    $('#result').html(str)
}

function calculateResult() {
    var total = 0
    resultPercent = Math.round(resultValue/maxValue*100)
    resultArr = resultPercent.toString().split('')
    resultArr.forEach(function(v) {
        total = total + parseInt(v, 10)
    })
    resultIndex = (total * 2) % results.length
    //console.log(resultPercent, total, resultIndex)
}

function getResult() {
    var option = {
        speed: 10,
        duration: duration,
        stopImageNumber: resultIndex,
        stopCallback: function ($stopElm) {
            $('#resultMessage').html(shareMessage.replace(/\n/g, '<br>'))
            $('#resultTxt').html(results[resultIndex].title)
            //$('#resultPercent').html('유형율: ' + resultPercent + '%')
        }
    }
    $('div.roulette').roulette(option);
    $('div.roulette').roulette('start');
}

function initAppList() {
    $('#apps').html(appList)
    $('[data-app-id="' + appId + '"]').addClass('active')
}

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
	}
	array.length = length;
	return array;
}