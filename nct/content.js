var  pageTitle = '나와 맞는 NCT 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 NCT 멤버는 바로!!!'
    ,appId = 'nct'
    ,duration = 0.5
    ,results = [
    {
        title: '태일',
        type: '2',
        image: './img/nct1.jpg'
    },{
        title: '쟈니',
        type: '1',
        image: './img/nct2.jpg'
    },{
        title: '태용',
        type: '2',
        image: './img/nct3.jpg'
    },{
        title: '유타',
        type: '1',
        image: './img/nct4.jpg'
    },{
        title: '쿤',
        type: '2',
        image: './img/nct5.jpg'
    },{
        title: '도영',
        type: '2',
        image: './img/nct6.jpg'
    },{
        title: '텐',
        type: '2',
        image: './img/nct7.jpg'
    },{
        title: '재현',
        type: '2',
        image: './img/nct8.jpg'
    },{
        title: '윈윈',
        type: '2',
        image: './img/nct9.jpg'
    },{
        title: '정우',
        type: '1',
        image: './img/nct10.jpg'
    },{
        title: '루카스',
        type: '1',
        image: './img/nct11.jpg'
    },{
        title: '마크',
        type: '1',
        image: './img/nct12.jpg'
    },{
        title: '런쥔',
        type: '2',
        image: './img/nct13.jpg'
    },{
        title: '제노',
        type: '1',
        image: './img/nct14.jpg'
    },{
        title: '해찬',
        type: '2',
        image: './img/nct15.jpg'
    },{
        title: '재민',
        type: '2',
        image: './img/nct16.jpg'
    },{
        title: '천러',
        type: '1',
        image: './img/nct17.jpg'
    },{
        title: '지성',
        type: '2',
        image: './img/nct18.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = 'NCT'
        ,url = 'https://bit.ly/35hDZnz'
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