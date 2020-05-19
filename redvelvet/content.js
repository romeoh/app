var  pageTitle = '나와 맞는 레드벨벳 멤버를 찾아드립니다.'
    ,resultMsg = '님과 맞는 레드벨벳 멤버는 바로!!!'
    ,appId = 'redvelvet'
    ,duration = 2
    ,results = [
    {
        title: '아이린',
        type: '2',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/redvelvet/redvelvet1.jpg'
    },{
        title: '슬기',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/redvelvet/redvelvet2.jpg'
    },{
        title: '웬디',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/redvelvet/redvelvet3.jpg'
    },{
        title: '조이',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/redvelvet/redvelvet4.jpg'
    },{
        title: '예리',
        type: '1',
        image: 'http://gaeyoucom2.cdn3.cafe24.com/president/redvelvet/redvelvet5.jpg'
    }
]

var shareMessage = ''
function shareResult() {
    var  president = makeString1(results[resultIndex])
        ,hashtag = '레드벨벳'
        ,url = 'https://bit.ly/2Yooets'
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