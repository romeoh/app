var  code = 'novel'
    ,charLength = 2
    ,novelLimite = 0

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
    
    /*if (!admin) {
        alert('서비스 점검중입니다.');
        window.location.href = '/t/';
        return false;
    }*/
    
    if(!isLogin()){
        alert('로그인이 필요합니다.')
        window.location.href = '../member/login.html#../novel/add.html'
        return false;
    }
    
    checkCount();
    viewChar();
    
    var help1 = ''
    help1 += '<p><strong>모두쓰기:</strong> 다른 사람과 함께 소설을 쓸수있습니다.</p>'
    help1 += '<p><strong>혼자쓰기:</strong> 혼자 쓸 수 있는 소설을 개설합니다.</p>'
    $('#helpMode').popover({
         title: '모드란?'
        ,content: help1
        ,html:true
        ,placement:'bottom'
    })
    var help2 = ''
    help2 += '<p><strong>전체가:</strong> "전체가"등급에서 19금 내용은 금지됩니다.</p>'
    help2 += '<p><strong>19금:</strong> 표현의 자유를 인정하지만 과도하고 주제없는 성적 표현은 삭제될 수 있습니다.</p>'
    $('#helpLevel').popover({
         title: '등급에 관한 알림'
        ,content: help2
        ,html:true
        ,placement:'top'
    })
    
    $('#btnAdd').on('click', function(){
        if (charLength > 4) {
            alert('기본 등장인물을 추가할 수 없습니다.');
            return false;
        }
        charLength++;
        viewChar();
    })
    $('#btnDel').on('click', function(){
        if (charLength == 1) {
            alert('등장인물은 최소 1명 이상이어야 합니다.');
            return false;
        }
        charLength--;
        viewChar();
    })
    
    $('#level').on('change', function(evt, mp){
        if ($(this).val() === '0') {
            $('#popLevel').html('전체가 등급에서 선정적인 표현은 금지되어 있습니다.')
        }
        if ($(this).val() === '1') {
            $('#popLevel').html('19금 등급도 과도하고 주제없는 표현과 소재는 예고없이 삭제될 수 있습니다.')
        }
        $('.alert').show()
    })
    
    reloadNotice();
    $('#btnReload').on('click', reloadNotice);
    
    // 유효성 검사
    $('#btnReg').on('click', function(){
        var  bodyData
            ,title = $('#title').val()
            ,genre = $('#genre').val()
            ,level = $('#level').val()
            ,mode = $('#mode').val()
            ,startFic = $('#startFic').val()
            ,charactor = []
        
        checkCount();
        if (title === '') {
            alert('제목을 입력해주세요.');
            $('#title').focus()
            return false;
        }
        if (mode == '-1') {
            alert('모드를 선택해주세요.');
            $('#mode').focus()
            return false;
        }
        if (genre == '-1') {
            alert('소설의 장르를 선택해주세요.');
            $('#genre').focus()
            return false;
        }
        /*if (level == '-1') {
            alert('등급을 선택해주세요.');
            $('#level').focus()
            return false;
        }
        if (kasid === '') {
            alert('카스아이디를 입력해주세요.');
            return false;
        }*/
        for (var i=1; i<charLength+1; i++) {
            var chara = {}
            if ($('[data-name="'+i+'"]').val() == '') {
                alert('등장인물'+i+'의 이름을 입력해주세요.');
                $('[data-name="'+i+'"]').focus()
                return false;
            }
            /*
            if ($('[data-sex="'+i+'"]').val() == '') {
                alert('등장인물'+i+'의 성별을 입력해주세요.');
                $('[data-sex="'+i+'"]').focus()
                return false;
            }
            if ($('[data-age="'+i+'"]').val() == '') {
                alert('등장인물'+i+'의 나이을 입력해주세요.');
                $('[data-age="'+i+'"]').focus()
                return false;
            }
            if ($('[data-job="'+i+'"]').val() == '') {
                alert('등장인물'+i+'의 직업을 입력해주세요.');
                $('[data-job="'+i+'"]').focus()
                return false;
            }
            if ($('[data-point="'+i+'"]').val() == '') {
                alert('등장인물'+i+'의 특징을 입력해주세요.');
                $('[data-point="'+i+'"]').focus();
                return false;
            }
            */
            chara['name'] = encodeURIComponent( $('[data-name="'+i+'"]').val() );
            chara['sex'] = encodeURIComponent( $('[data-sex="'+i+'"]').val() );
            chara['age'] = encodeURIComponent( $('[data-age="'+i+'"]').val() );
            chara['job'] = encodeURIComponent( $('[data-job="'+i+'"]').val() );
            chara['point'] = encodeURIComponent( $('[data-point="'+i+'"]').val() );
            charactor.push(chara);
        }
        if (startFic === '') {
            alert('도입부를 적어주세요.');
            $('#startFic').focus()
            return false;
        }
        
        $('#btnReg').off('click');
        bodyData = {
            'title': encodeURIComponent(title),
            'author': member['nickname'],
            'kasid': '',
            'mode': encodeURIComponent(mode),
            'genre': encodeURIComponent(genre),
            'adult': 0,
            'startFic': encodeURIComponent(startFic),
            'charactor': charactor,
            'ua': navigator.userAgent,
            'url': window.location.href
        }
        $.ajax({
             'url' : apiurl + code + '_add.php'
            ,'contentType': 'application/x-www-form-urlencoded'
            ,'data': bodyData
            ,'type': 'POST'
            ,'success': function(result){
                var  result = JSON.parse(result)
                    ,idx = result['result']
                    
                // 썸네일 만들기
                bodyData = {
                    'title': title,
                    'idx': result.result
                }
                $.ajax({
                     'url': apiurl + code + '_make_thum.php'
                    ,'contentType': 'application/x-www-form-urlencoded'
                    ,'data': bodyData
                    ,'type': 'POST'
                    ,'success': function(){
                        localStorage.setItem(code+'_count', '0');
                        addComplete(code, result.result);
                        alert('등록되었습니다.');
                        window.location.href = '//gaeyou.com/novel/?' + result.result;
                    }
                })
            }
        })
    })
    
    $('#btnCancel').on('click', function(){
        /**
        $('#title').val('몬스터주식회사')
        $('#genre').val('로맨스')
        $('[data-name="1"]').val('철수')
        $('[data-sex="1"]').val('남자')
        $('[data-age="1"]').val('19')
        $('[data-job="1"]').val('학생')
        $('[data-point="1"]').val('엄청 소심하고\n착하다')
        $('[data-name="2"]').val('영희')
        $('[data-sex="2"]').val('여자')
        $('[data-age="2"]').val('22')
        $('[data-job="2"]').val('백수')
        $('[data-point="2"]').val('예쁘지만\n터프하다')
        /**/
        window.history.go(-1)
    })    
}

function viewChar() {
    for (var i=1; i<charLength+1; i++) {
        $('[data-charactor="' + i + '"]').css('display', 'block');
    }
    for (var i=charLength+1; i<6; i++) {
        $('[data-charactor="' + i + '"]').css('display', 'none');
    }
}

function checkCount() {
    novelCount = localStorage.getItem(code+'_count') || 0;
    novelCount = parseInt(novelCount, 10);
    if (novelCount < novelLimite) {
        alert('새로운 소설을 개설하려면 다른 소설에 최소 '+novelLimite+'번 이상 썰을 작성하셔야 합니다.');
        window.location.href = './list.html';
    }
}

function reloadNotice() {
    var str = shuffle(database);
    $('#addNotice').html('예) '+str[0])
}

database = [
    '친구에게 배신당한 썰',
    '엄마가 감동한 썰',
    '친구에게 애인을 뺏긴 썰',
    '선생님을 속인 썰',
    '웃긴 거짓말한 썰',
    '친구의 뒷통수를 친 썰',
    '이상형과 마주친 썰',
    '첫키스한 썰',
    '이상형에게 차인 썰',
    '친척이랑 싸운 썰',
    '친구랑 화해한 썰',
    '친구와 오해가 풀린 썰',
    '옛날에 사고났던 썰',
    '부모님이랑 싸운 썰',
    '형제랑 싸운 썰',
    '친구가 나때문에 오해한 썰',
    '친구를 따돌린 썰',
    '카톡할때 웃꼈던 썰',
    '시험 0점 맞은 썰',
    '선생님한테 억울하게 엄청 맞은 썰',
    '단체로 벌 받은 썰',
    '친구랑 치고박고 싸운 썰',
    '친구랑 절교한 썰',
    '애인이랑 헤어진 이유 썰'
]





