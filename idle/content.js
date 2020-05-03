var  pageTitle = '나와 맞는 아이들 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 아이들 멤버는 바로!!!'
    ,appId = 'idle'
    ,duration = 2
    ,results = [
    {
        title: '미연',
        type: '2',
        image: './img/idle1.jpg'
    },{
        title: '민니',
        type: '1',
        image: './img/idle2.jpg'
    },{
        title: '수진',
        type: '2',
        image: './img/idle3.jpg'
    },{
        title: '소연',
        type: '2',
        image: './img/idle4.jpg'
    },{
        title: '우기',
        type: '1',
        image: './img/idle5.jpg'
    },{
        title: '슈화',
        type: '1',
        image: './img/idle6.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '아이들'
        ,url = 'https://bit.ly/3fezONQ'
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