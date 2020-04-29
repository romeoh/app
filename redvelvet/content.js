var  pageTitle = '나와 맞는 레드벨벳 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 레드벨벳 멤버는 바로!!!'
    ,appId = 'redvelvet'
    ,duration = 2
    ,results = [
    {
        title: '아이린',
        image: './img/redvelvet1.png'
    },{
        title: '슬기',
        image: './img/redvelvet2.png'
    },{
        title: '웬디',
        image: './img/redvelvet3.png'
    },{
        title: '조이',
        image: './img/redvelvet4.png'
    },{
        title: '예리',
        image: './img/redvelvet5.png'
    }
]

var shareMessage
function shareResult() {
    var  president = results[resultIndex].title
        ,hashtag = '레드벨벳 테스트'
        ,url = 'https://bit.ly/2Yooets'
        ,str = ''
    
    shareMessage = userName + '님과 맞는 레드벨벳 멤버는\n' + president + '입니다.\n유형율: ' + resultPercent + '%\n'

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