var  pageTitle = '나와 맞는 우주소녀 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 우주소녀 멤버는 바로!!!'
    ,appId = 'cosmicgirls'
    ,duration = 0.5
    ,results = [
    {
        title: '설아',
        type: '1',
        image: './img/cosmicgirls1.jpg'
    },{
        title: '보나',
        type: '1',
        image: './img/cosmicgirls2.jpg'
    },{
        title: '루다',
        type: '1',
        image: './img/cosmicgirls3.jpg'
    },{
        title: '다원',
        type: '2',
        image: './img/cosmicgirls4.jpg'
    },{
        title: '미기',
        type: '1',
        image: './img/cosmicgirls5.jpg'
    },{
        title: '선의',
        type: '1',
        image: './img/cosmicgirls6.jpg'
    },{
        title: '엑시',
        type: '1',
        image: './img/cosmicgirls7.jpg'
    },{
        title: '수빈',
        type: '2',
        image: './img/cosmicgirls8.jpg'
    },{
        title: '성소',
        type: '1',
        image: './img/cosmicgirls9.jpg'
    },{
        title: '은서',
        type: '1',
        image: './img/cosmicgirls10.jpg'
    },{
        title: '여름',
        type: '2',
        image: './img/cosmicgirls11.jpg'
    },{
        title: '다영',
        type: '2',
        image: './img/cosmicgirls12.jpg'
    },{
        title: '연정',
        type: '2',
        image: './img/cosmicgirls13.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '우주소녀'
        ,url = 'https://bit.ly/2yWdO9O'
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