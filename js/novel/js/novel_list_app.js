var  code = 'novel'
    
    // 신규리스트 가져오기
    ,newTotal = 5
    ,newStart = 0
    
    // 인기리스트 가져오기
    ,hotTotal = 20
    ,hotStart = 0
    
    ,listFlag = M.storage('listFlag') || 'hot'
    ,adult = M.storage('novel_adult_block') || 'true'

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
    location.reload();
    M.scroll(0);
}, false);

function ready() {
    /*if (!admin) {
        alert('서비스 점검중입니다.');
        window.location.href = '/t/';
        return false;
    }*/
    initNovel();
    getNewList();
    getHotList();
    initCategory()
}

// 초기화
function initNovel() {
    M('#btnNew').css('display', 'block')
}

// 신규
function getNewList() {
    var databody = {
        'start': newStart,
        'total': newTotal,
        'adult': adult
    }
    request(code+'_get_list', databody, function(result){
        var  result = M.json(result)
            ,str = ''
        
        newStart = newTotal + newStart;
            
        for (var i=0; i<result.length; i++) {
            if (result[i]['adult'] == '1') {
                sultitle = decodeURIComponent(result[i]['title']);
                sulfirst = decodeURIComponent(result[i]['first_fic']);
            } else {
                sultitle = sulFilter(result[i]['title']);
                sulfirst = sulFilter(result[i]['first_fic']);
            }
            str += '<li>';
            str += '    <a href="./#' + result[i]['idx'] + '">';
            str += '        <strong class="tit">' + sultitle + '</strong>';
            str += '        <p class="first_fic">' + sulfirst + '</p>';
            str += '        <em>';
            str += '            <i class="fa fa-book"></i> ' + result[i]['fic_count'];
            str += '            <i class="fa fa-eye"></i> ' + result[i]['view'];
            str += '            <i class="fa fa-comments"></i> ' + result[i]['reply'];
            str += '            <i class="fa fa-thumbs-up"></i> ' + result[i]['gaeup'];
            if (result[i]['mode'] == 'private') {
                str += '            <i class="fa fa-lock fa-red"></i>';
            } else {
                str += '            <i class="fa fa-unlock fa-green"></i>';
            }
            if (result[i]['adult'] == '1') {
                str += '            <i class="fa fa-ban fa-red"></i>19금';
            }
            str += '        </em>';
            str += '    </a>';
            str += '</li>';
        }
        if (result.length < newTotal) {
            str += '<li class="more">마지막입니다.</li>';
        } else {
            str += '<li class="more" data-morenew=""><button class="btn btn-primary btn-block">신규 소설 더 불러오기</button></li>';
        }
        M('#newContainer').html( M('#newContainer').html() + str )
        // 더 불러오기
        M('[data-morenew]').on('click', function(evt, mp){
            mp.remove();
            getNewList();
        })
        newTotal = 15;
    })
}

// 인기
function getHotList() {
    var databody = {
        'start': hotStart,
        'total': hotTotal,
        'flag': listFlag,
        'adult': adult
    }
    request(code+'_get_list_hot', databody, function(result){
        var  result = M.json(result)
            ,str = ''
        
        hotStart = hotTotal + hotStart;
            
        for (var i=0; i<result.length; i++) {
            var recommand = parseInt(result[i]['gaeup'], 10) - parseInt(result[i]['gaedown'], 10)
            if (result[i]['adult'] == '1') {
                sultitle = decodeURIComponent(result[i]['title']);
                sulfirst = decodeURIComponent(result[i]['first_fic']);
            } else {
                sultitle = sulFilter(result[i]['title']);
                sulfirst = sulFilter(result[i]['first_fic']);
            }
            str += '<li>';
            str += '    <a href="./#' + result[i]['idx'] + '">';
            str += '        <strong class="tit">' + sultitle + '</strong>';
            str += '        <p class="first_fic">' + sulfirst + '</p>';
            str += '        <em>';
            str += '            <i class="fa fa-book"></i> ' + result[i]['fic_count'];
            str += '            <i class="fa fa-eye"></i> ' + result[i]['view'];
            str += '            <i class="fa fa-comments"></i> ' + result[i]['reply'];
            str += '            <i class="fa fa-thumbs-up"></i> ' + result[i]['gaeup'];
            if (result[i]['mode'] == 'private') {
                str += '            <i class="fa fa-lock fa-red"></i>';
            } else {
                str += '            <i class="fa fa-unlock fa-green"></i>';
            }
            if (result[i]['adult'] == '1') {
                str += '            <i class="fa fa-ban fa-red"></i>19금';
            }
            str += '        </em>';
            str += '    </a>';
            str += '</li>';
        }
        if (result.length < hotTotal) {
            str += '<li class="more">마지막입니다.</li>';
        } else {
            str += '<li class="more" data-morehot=""><button class="btn btn-primary btn-block">급상승 인기 소설 더 불러오기</button></li>';
        }
        M('#hotContainer').html( M('#hotContainer').html() + str )
        // 더 불러오기
        M('[data-morehot]').on('click', function(evt, mp){
            mp.remove();
            getHotList();
        })
    })
}

// 전문통신
function request(tr, data, callback) {
    if (data['file']) {
        $.ajaxFileUpload({ 
            url : apiurl + tr + '.php',
            type: "POST",
            secureuri : false, 
            fileElementId : data['file'], //'photo'
            dataType : 'json', 
            data : data,
            complete:function(result){
                callback(result);
            }
        })
    } else {
        $.ajax({
             'url': apiurl + tr + '.php'
            ,'contentType': 'application/x-www-form-urlencoded'
            ,'data': data
            ,'type': 'POST'
            ,'success': function(result){
                callback(result);
            }
        })
    }
}

function initCategory() {
    if (adult == 'true') {
        M('#btnView').html('일반 보기 <span class="caret"></span>')
    } else if (adult == 'false') {
        M('#btnView').html('19금 포함 <span class="caret"></span>')
    }
    M('#btnViewAll').on('click', function(){
        M.storage('novel_adult_block', 'true');
        window.location.reload()
    })
    M('#btnViewAdult').on('click', function(){
        M.storage('novel_adult_block', 'false')
        window.location.reload()
    })
}











