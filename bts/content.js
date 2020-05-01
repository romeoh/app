var  pageTitle = '나와 맞는 BTS 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 BTS 멤버는 바로!!!'
    ,appId = 'bts'
    ,duration = 1
    ,results = [
    {
        title: '진',
        image: './img/bts1.jpg'
    },{
        title: '슈가',
        image: './img/bts2.jpg'
    },{
        title: '제이홉',
        image: './img/bts3.jpg'
    },{
        title: 'RM',
        image: './img/bts4.jpg'
    },{
        title: '지민',
        image: './img/bts5.jpg'
    },{
        title: '뷔',
        image: './img/bts6.jpg'
    },{
        title: '정국',
        image: './img/bts7.jpg'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = 'BTS 테스트'
        ,url = 'https://bit.ly/2yVVEFa'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 BTS 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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