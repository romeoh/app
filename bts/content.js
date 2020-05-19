var  pageTitle = '나와 맞는 BTS 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 BTS 멤버는 바로!!!'
    ,appId = 'bts'
    ,duration = 1
    ,results = [
    {
        title: '진',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts1.jpg'
    },{
        title: '슈가',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts2.jpg'
    },{
        title: '제이홉',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts3.jpg'
    },{
        title: 'RM',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts4.jpg'
    },{
        title: '지민',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts5.jpg'
    },{
        title: '뷔',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts6.jpg'
    },{
        title: '정국',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/bts/bts7.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = 'BTS'
        ,url = 'https://bit.ly/2yVVEFa'
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