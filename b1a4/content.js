var  pageTitle = '나와 맞는 B1A4 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 B1A4 멤버는 바로!!!'
    ,appId = 'b1a4'
    ,duration = 2
    ,results = [
    {
        title: '신우',
        image: './img/b1a41.png'
    },{
        title: '진영',
        image: './img/b1a42.png'
    },{
        title: '산들',
        image: './img/b1a43.png'
    },{
        title: '바로',
        image: './img/b1a44.png'
    },{
        title: '공찬',
        image: './img/b1a45.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = 'B1A4 테스트'
        ,url = 'https://bit.ly/2SjchSd'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 B1A4 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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