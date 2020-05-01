var  pageTitle = '나와 맞는 트와이스 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 트와이스 멤버는 바로!!!'
    ,appId = 'twice'
    ,duration = 2
    ,results = [
    {
        title: '사나',
        image: './img/twice1.jpg'
    },{
        title: '다현',
        image: './img/twice2.jpg'
    },{
        title: '채영',
        image: './img/twice3.jpg'
    },{
        title: '쯔위',
        image: './img/twice4.jpg'
    },{
        title: '나연',
        image: './img/twice5.jpg'
    },{
        title: '모모',
        image: './img/twice6.jpg'
    },{
        title: '미나',
        image: './img/twice7.jpg'
    },{
        title: '정연',
        image: './img/twice8.jpg'
    },{
        title: '지효',
        image: './img/twice9.jpg'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '트와이스 테스트'
        ,url = 'https://bit.ly/2SiRoXp'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 트와이스 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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