var results = [
    {
        title: '전두환',
        image: './img/president3.png'
    },{
        title: '김대중',
        image: './img/president6.png'
    },{
        title: '이승만',
        image: './img/president1.png'
    },{
        title: '문재인',
        image: './img/president10.png'
    },{
        title: '시진핑',
        image: './img/president13.png'
    },{
        title: '박정희',
        image: './img/president2.png'
    },{
        title: '트럼프',
        image: './img/president11.png'
    },{
        title: '노태우',
        image: './img/president4.png'
    },{
        title: '김영삼',
        image: './img/president5.png'
    },{
        title: '노무현',
        image: './img/president7.png'
    },{
        title: '아베',
        image: './img/president12.png'
    },{
        title: '이명박',
        image: './img/president8.png'
    },{
        title: '박근혜',
        image: './img/president9.png'
    },{
        title: '김정은',
        image: './img/president14.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '대통령테스트'
        ,url = 'https://bit.ly/2xbvz4E'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 대통령은\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'
    
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