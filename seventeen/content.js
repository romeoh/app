var  pageTitle = '나와 맞는 세븐틴 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 세븐틴 멤버는 바로!!!'
    ,appId = 'seventeen'
    ,duration = 2
    ,results = [
    {
        title: '에스쿱스',
        image: './img/seventeen1.png'
    },{
        title: '정한',
        image: './img/seventeen2.png'
    },{
        title: '조슈아',
        image: './img/seventeen3.png'
    },{
        title: '준',
        image: './img/seventeen4.png'
    },{
        title: '호시',
        image: './img/seventeen5.png'
    },{
        title: '원우',
        image: './img/seventeen6.png'
    },{
        title: '우지',
        image: './img/seventeen7.png'
    },{
        title: '도겸',
        image: './img/seventeen8.png'
    },{
        title: '민규',
        image: './img/seventeen9.png'
    },{
        title: '디에잇',
        image: './img/seventeen10.png'
    },{
        title: '승관',
        image: './img/seventeen11.png'
    },{
        title: '버논',
        image: './img/seventeen12.png'
    },{
        title: '디노',
        image: './img/seventeen13.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '세븐틴 테스트'
        ,url = 'https://bit.ly/2Sj4zau'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 세븐틴 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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