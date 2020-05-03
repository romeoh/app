var  pageTitle = '나와 맞는 에이프릴 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 에이프릴 멤버는 바로!!!'
    ,appId = 'april'
    ,duration = 2
    ,results = [
    {
        title: '윤채경',
        type: '2',
        image: './img/april1.jpg'
    },{
        title: '김채원',
        type: '2',
        image: './img/april2.jpg'
    },{
        title: '이나은',
        type: '2',
        image: './img/april3.jpg'
    },{
        title: '양예나',
        type: '1',
        image: './img/april4.jpg'
    },{
        title: '레이첼',
        type: '2',
        image: './img/april5.jpg'
    },{
        title: '이진솔',
        type: '2',
        image: './img/april6.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '에이프릴'
        ,url = 'https://bit.ly/3cXoPqg'
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