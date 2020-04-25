var results = [
    {
        index: 0,
        title: '이승만',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '박정희',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '전두환',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '노태우',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '김영삼',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '김대중',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '노무현',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '이명박',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '박근혜',
        image: './img/leesungman.png',
        content: ''
    },{
        index: 1,
        title: '문재인',
        image: './img/leesungman.png',
        content: ''
    }
]

function shareResult() {
    var  president = results[resultIndex].title
        ,shareMessage = userName + '님과 맞는 대통령은\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'
        ,hashtag = '대통령테스트'
        ,url = 'https://ellisonleao.github.io/sharer.js/'
        ,str = ''
    
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