var  pageTitle = '나와 맞는 트와이스 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 트와이스 멤버는 바로!!!'
    ,appId = 'twice'
    ,duration = 2
    ,results = [
    {
        title: '사나',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice1.jpg'
    },{
        title: '다현',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice2.jpg'
    },{
        title: '채영',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice3.jpg'
    },{
        title: '쯔위',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice4.jpg'
    },{
        title: '나연',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice5.jpg'
    },{
        title: '모모',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice6.jpg'
    },{
        title: '미나',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice7.jpg'
    },{
        title: '정연',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice8.jpg'
    },{
        title: '지효',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/twice/twice9.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '트와이스'
        ,url = 'https://bit.ly/2SiRoXp'
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