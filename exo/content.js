var  pageTitle = '나와 맞는 EXO 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 EXO 멤버는 바로!!!'
    ,appId = 'exo'
    ,duration = 0.5
    ,results = [
    {
        title: '시우민',
        type: '2',
        image: './img/exo1.jpg'
    },{
        title: '크리스',
        type: '1',
        image: './img/exo11.jpg'
    },{
        title: '수호',
        type: '1',
        image: './img/exo2.jpg'
    },{
        title: '레이',
        type: '1',
        image: './img/exo3.jpg'
    },{
        title: '백현',
        type: '2',
        image: './img/exo4.jpg'
    },{
        title: '첸',
        type: '2',
        image: './img/exo5.jpg'
    },{
        title: '루한',
        type: '2',
        image: './img/exo10.jpg'
    },{
        title: '찬열',
        type: '2',
        image: './img/exo6.jpg'
    },{
        title: '디오',
        type: '1',
        image: './img/exo7.jpg'
    },{
        title: '카이',
        type: '1',
        image: './img/exo8.jpg'
    },{
        title: '세훈',
        type: '2',
        image: './img/exo9.jpg'
    },{
        title: '타오',
        type: '1',
        image: './img/exo12.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = 'EXO'
        ,url = 'https://bit.ly/2yVVEFa'
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