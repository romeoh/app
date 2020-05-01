var  pageTitle = '나와 맞는 세븐틴 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 세븐틴 멤버는 바로!!!'
    ,appId = 'seventeen'
    ,duration = 2
    ,results = [
    {
        title: '에스쿱스',
        image: './img/seventeen1.jpg'
    },{
        title: '정한',
        image: './img/seventeen2.jpg'
    },{
        title: '조슈아',
        image: './img/seventeen3.jpg'
    },{
        title: '준',
        image: './img/seventeen4.jpg'
    },{
        title: '호시',
        image: './img/seventeen5.jpg'
    },{
        title: '원우',
        image: './img/seventeen6.jpg'
    },{
        title: '우지',
        image: './img/seventeen7.jpg'
    },{
        title: '도겸',
        image: './img/seventeen8.jpg'
    },{
        title: '민규',
        image: './img/seventeen9.jpg'
    },{
        title: '디에잇',
        image: './img/seventeen10.jpg'
    },{
        title: '승관',
        image: './img/seventeen11.jpg'
    },{
        title: '버논',
        image: './img/seventeen12.jpg'
    },{
        title: '디노',
        image: './img/seventeen13.jpg'
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