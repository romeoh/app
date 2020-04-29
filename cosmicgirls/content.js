var  pageTitle = '나와 맞는 우주소녀 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 우주소녀 멤버는 바로!!!'
    ,appId = 'cosmicgirls'
    ,duration = 0.5
    ,results = [
    {
        title: '설아',
        image: './img/cosmicgirls1.png'
    },{
        title: '보나',
        image: './img/cosmicgirls2.png'
    },{
        title: '루다',
        image: './img/cosmicgirls3.png'
    },{
        title: '다원',
        image: './img/cosmicgirls4.png'
    },{
        title: '미기',
        image: './img/cosmicgirls5.png'
    },{
        title: '선의',
        image: './img/cosmicgirls6.png'
    },{
        title: '엑시',
        image: './img/cosmicgirls7.png'
    },{
        title: '수빈',
        image: './img/cosmicgirls8.png'
    },{
        title: '성소',
        image: './img/cosmicgirls9.png'
    },{
        title: '은서',
        image: './img/cosmicgirls10.png'
    },{
        title: '여름',
        image: './img/cosmicgirls11.png'
    },{
        title: '다영',
        image: './img/cosmicgirls12.png'
    },{
        title: '연정',
        image: './img/cosmicgirls13.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '우주소녀 테스트'
        ,url = 'https://bit.ly/2yWdO9O'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 우주소녀 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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