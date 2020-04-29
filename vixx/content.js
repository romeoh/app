var  pageTitle = '나와 맞는 VIXX 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 VIXX 멤버는 바로!!!'
    ,appId = 'vixx'
    ,duration = 2
    ,results = [
    {
        title: '엔',
        image: './img/vixx1.png'
    },{
        title: '레오',
        image: './img/vixx2.png'
    },{
        title: '켄',
        image: './img/vixx3.png'
    },{
        title: '라비',
        image: './img/vixx4.png'
    },{
        title: '홍빈',
        image: './img/vixx5.png'
    },{
        title: '혁',
        image: './img/vixx6.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = 'VIXX 테스트'
        ,url = 'https://bit.ly/35h4I3w'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 VIXX 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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