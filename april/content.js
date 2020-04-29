var  pageTitle = '나와 맞는 에이프릴 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 에이프릴 멤버는 바로!!!'
    ,appId = 'april'
    ,duration = 2
    ,results = [
    {
        title: '윤채경',
        image: './img/april1.png'
    },{
        title: '김채원',
        image: './img/april2.png'
    },{
        title: '이나은',
        image: './img/april3.png'
    },{
        title: '양예나',
        image: './img/april4.png'
    },{
        title: '레이첼',
        image: './img/april5.png'
    },{
        title: '이진솔',
        image: './img/april6.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '에이프릴 테스트'
        ,url = 'https://bit.ly/3cXoPqg'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 에이프릴 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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