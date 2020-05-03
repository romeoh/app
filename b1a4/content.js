var  pageTitle = '나와 맞는 B1A4 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 B1A4 멤버는 바로!!!'
    ,appId = 'b1a4'
    ,duration = 2
    ,results = [
    {
        title: '신우',
        type: '1',
        image: './img/b1a41.jpg'
    },{
        title: '진영',
        type: '2',
        image: './img/b1a42.jpg'
    },{
        title: '산들',
        type: '2',
        image: './img/b1a43.jpg'
    },{
        title: '바로',
        type: '1',
        image: './img/b1a44.jpg'
    },{
        title: '공찬',
        type: '2',
        image: './img/b1a45.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = 'B1A4'
        ,url = 'https://bit.ly/2SjchSd'
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