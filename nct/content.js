var  pageTitle = '나와 맞는 NCT 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 NCT 멤버는 바로!!!'
    ,appId = 'nct'
    ,duration = 0.5
    ,results = [
    {
        title: '태일',
        image: './img/nct1.png'
    },{
        title: '쟈니',
        image: './img/nct2.png'
    },{
        title: '태용',
        image: './img/nct3.png'
    },{
        title: '유타',
        image: './img/nct4.png'
    },{
        title: '쿤',
        image: './img/nct5.png'
    },{
        title: '도영',
        image: './img/nct6.png'
    },{
        title: '텐',
        image: './img/nct7.png'
    },{
        title: '재현',
        image: './img/nct8.png'
    },{
        title: '윈윈',
        image: './img/nct9.png'
    },{
        title: '정우',
        image: './img/nct10.png'
    },{
        title: '루카스',
        image: './img/nct11.png'
    },{
        title: '마크',
        image: './img/nct12.png'
    },{
        title: '런쥔',
        image: './img/nct13.png'
    },{
        title: '제노',
        image: './img/nct14.png'
    },{
        title: '해찬',
        image: './img/nct15.png'
    },{
        title: '재민',
        image: './img/nct16.png'
    },{
        title: '천러',
        image: './img/nct17.png'
    },{
        title: '지성',
        image: './img/nct18.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = 'NCT 테스트'
        ,url = 'https://bit.ly/35hDZnz'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 NCT 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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