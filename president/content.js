var  pageTitle = '나와 맞는 대통령을 찾아드립니다.'
    ,resultMsg = '님과 맞는 대통령은 바로!!!'
    ,appId = 'president'
    ,duration = 0.5
    ,results = [
    {
        title: '전두환',
        type: '2',
        image: './img/president3.jpg'
    },{
        title: '김대중 대통령',
        type: '2',
        image: './img/president6.jpg'
    },{
        title: '이승만 대통령',
        type: '2',
        image: './img/president1.jpg'
    },{
        title: '문재인 대통령',
        type: '2',
        image: './img/president10.jpg'
    },{
        title: '시진핑 주석',
        type: '2',
        image: './img/president13.jpg'
    },{
        title: '박정희 대통령',
        type: '2',
        image: './img/president2.jpg'
    },{
        title: '트럼프 대통령',
        type: '2',
        image: './img/president11.jpg'
    },{
        title: '노태우 대통령',
        type: '2',
        image: './img/president4.jpg'
    },{
        title: '김영삼 대통령',
        type: '',
        image: './img/president5.jpg'
    },{
        title: '노무현 대통령',
        type: '2',
        image: './img/president7.jpg'
    },{
        title: '아베 총리',
        type: '1',
        image: './img/president12.jpg'
    },{
        title: '이명박 대통령',
        type: '2',
        image: './img/president8.jpg'
    },{
        title: '박근혜 대통령',
        type: '2',
        image: './img/president9.jpg'
    },{
        title: '김정은 위원장',
        type: '2',
        image: './img/president14.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '대통령테스트'
        ,url = 'https://bit.ly/2xbvz4E'
        ,str = ''
    
    shareMessage += secondAnswer[1] + '보다 ' + secondAnswer[0] + ' 더 좋아하는 \n'
    shareMessage += userName + '님은 '
    shareMessage += president + ' 더 잘 어울립니다.\n'
    shareMessage += '유형율: ' + resultPercent + '%\n'

    str += '<button type="button" class="button btn btn-success" data-sharer="twitter" '
    str += 'data-title="' + shareMessage + '" '
    str += 'data-hashtags="' + hashtag + '" '
    str += 'data-url="' + url + '">트위터</button>'

    str += '<button type="button" class="button btn btn-primary" data-sharer="facebook" '
    str += 'data-hashtag="' + hashtag + '" '
    str += 'data-url="' + url + '">페이스북</button>'

    str += '<button type="button" class="button btn btn-warning" data-sharer="line" '
    str += 'data-title="' + shareMessage + '" '
    str += 'data-url="' + url + '">라인</button>'

    $('#snsbtn').html(str)
    window.Sharer.init();
}