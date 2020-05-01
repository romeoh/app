var  pageTitle = '나와 맞는 NCT 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 NCT 멤버는 바로!!!'
    ,appId = 'nct'
    ,duration = 0.5
    ,results = [
    {
        title: '태일',
        image: './img/nct1.jpg'
    },{
        title: '쟈니',
        image: './img/nct2.jpg'
    },{
        title: '태용',
        image: './img/nct3.jpg'
    },{
        title: '유타',
        image: './img/nct4.jpg'
    },{
        title: '쿤',
        image: './img/nct5.jpg'
    },{
        title: '도영',
        image: './img/nct6.jpg'
    },{
        title: '텐',
        image: './img/nct7.jpg'
    },{
        title: '재현',
        image: './img/nct8.jpg'
    },{
        title: '윈윈',
        image: './img/nct9.jpg'
    },{
        title: '정우',
        image: './img/nct10.jpg'
    },{
        title: '루카스',
        image: './img/nct11.jpg'
    },{
        title: '마크',
        image: './img/nct12.jpg'
    },{
        title: '런쥔',
        image: './img/nct13.jpg'
    },{
        title: '제노',
        image: './img/nct14.jpg'
    },{
        title: '해찬',
        image: './img/nct15.jpg'
    },{
        title: '재민',
        image: './img/nct16.jpg'
    },{
        title: '천러',
        image: './img/nct17.jpg'
    },{
        title: '지성',
        image: './img/nct18.jpg'
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