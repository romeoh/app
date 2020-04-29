var  pageTitle = '나와 맞는 EXO 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 EXO 멤버는 바로!!!'
    ,appId = 'exo'
    ,duration = 0.5
    ,results = [
    {
        title: '시우민',
        image: './img/exo1.png'
    },{
        title: '크리스',
        image: './img/exo11.png'
    },{
        title: '수호',
        image: './img/exo2.png'
    },{
        title: '레이',
        image: './img/exo3.png'
    },{
        title: '백현',
        image: './img/exo4.png'
    },{
        title: '첸',
        image: './img/exo5.png'
    },{
        title: '루한',
        image: './img/exo10.png'
    },{
        title: '찬열',
        image: './img/exo6.png'
    },{
        title: '디오',
        image: './img/exo7.png'
    },{
        title: '카이',
        image: './img/exo8.png'
    },{
        title: '세훈',
        image: './img/exo9.png'
    },{
        title: '타오',
        image: './img/exo12.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = 'EXO 테스트'
        ,url = 'https://bit.ly/2yVVEFa'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 EXO 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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