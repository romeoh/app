var  code = 'novel'
    
    // 신규리스트 가져오기
    ,newTotal = 10
    ,newStart = 0
    
    // 인기리스트 가져오기
    ,hotTotal = 10
    ,hotStart = 0
    
    ,listFlag = localStorage.getItem('listFlag') || 'hot'
    ,adult = localStorage.getItem('novel_adult_block') || 'true'

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
    location.reload();
    $.scroll(0);
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
    $('#btnNew').css('display', 'block')
    var novel_adult_block = localStorage.getItem('novel_adult_block');
    if (novel_adult_block == 'false') {
        $('#dropdownMenuLink').html('19금 포함')
    }
}

// 신규
function getNewList() {
    var databody = {
        'start': newStart,
        'total': newTotal,
        'adult': adult
    }
    request(code+'_get_list', databody, function(result){
        var  result = JSON.parse(result)
            ,str = []
        
        newStart = newTotal + newStart;
            
        for (var i=0; i<result.length; i++) {
            //if (result[i]['adult'] == '1') {
                sultitle = decodeURIComponent(result[i]['title']);
                sulfirst = decodeURIComponent(result[i]['first_fic']);
                author = decodeURIComponent(result[i]['author']);
            //} else {
        //sultitle = sulFilter(result[i]['title']);
                //sulfirst = sulFilter(result[i]['first_fic']);
            //}
            if (result[i]['mode'] == 'private') {
                sultitle = '<i class="fas fa-lock fa-red"></i> ' + sultitle
            } else {
                sultitle = '<i class="fas fa-lock-open fa-green"></i> ' + sultitle
            }

            str.push('<a href="./?' + result[i].idx + '" class="list-group-item list-group-item-action">')
            str.push('    <div class="d-flex w-100 justify-content-between">')
            str.push('        <h5 class="mb-1">' + sultitle + '</h5>')
            str.push('        <small><i class="fas fa-pen-nib"></i> ' + author + '</small>')
            str.push('    </div>')
            str.push('    <p class="mb-1">' + sulfirst + '</p>')
            str.push('    <small>')
            str.push('                   <i class="fas fa-book"></i> ' + result[i].fic_count)
            //str.push('        <em>|</em> <i class="far fa-eye"></i> ' + result[i].view)
            str.push('        <em>|</em> <i class="far fa-comments"></i> ' + result[i].reply)
            str.push('        <em>|</em> <i class="far fa-thumbs-up"></i> ' + result[i].gaeup)
            str.push('        <em>|</em> <i class="far fa-thumbs-down"></i> ' + result[i].gaedown)
            /*
            if (result[i]['mode'] == 'private') {
                str.push('        <em>|</em> <i class="fas fa-lock fa-red"></i>')
            } else {
                str.push('        <em>|</em> <i class="fas fa-lock-open fa-green"></i>')
            }
            */
            if (result[i]['adult'] == '1') {
                str.push('        <em>|</em> <i class="fas fa-ban fa-red"></i>19금')
            }
            str.push('    </small>')
            str.push('</a>')
        }
        /*
        if (result.length < newTotal) {
            str.push('마지막입니다.')
        } else {
            str.push('<button data-morenew="" class="btn btn-block btn-info">더보기</button>')
        }
        */
        $('#newList').html( $('#newList').html() + str.join('') )
        // 더 불러오기
        $('[data-morenew]').on('click', function(evt, mp){
            //mp.remove();
            getNewList();
        })
        newTotal = 15;
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
        $('#btnView').html('일반 보기 <span class="caret"></span>')
    } else if (adult == 'false') {
        $('#btnView').html('19금 포함 <span class="caret"></span>')
    }
    $('#btnViewAll').on('click', function(){
        localStorage.setItem('novel_adult_block', 'true');
        window.location.reload()
    })
    $('#btnViewAdult').on('click', function(){
        localStorage.setItem('novel_adult_block', 'false')
        window.location.reload()
    })
}











