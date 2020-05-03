var  pageTitle = '나와 맞는 VIXX 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 VIXX 멤버는 바로!!!'
    ,appId = 'vixx'
    ,duration = 2
    ,results = [
    {
        title: '엔',
        type: '2',
        image: './img/vixx1.jpg'
    },{
        title: '레오',
        type: '1',
        image: './img/vixx2.jpg'
    },{
        title: '켄',
        type: '2',
        image: './img/vixx3.jpg'
    },{
        title: '라비',
        type: '2',
        image: './img/vixx4.jpg'
    },{
        title: '홍빈',
        type: '1',
        image: './img/vixx5.jpg'
    },{
        title: '혁',
        type: '1',
        image: './img/vixx6.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = 'VIXX'
        ,url = 'https://bit.ly/35h4I3w'
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