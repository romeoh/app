var  params = getParameter()
    ,apiUrl = '../api/v1/share.php'
    ,peopleDetail

if (params.idx) {
    // 상세보기
    getDetail()
    initReply()
    getReplyList()
    $('.people-detail').show()
    $('.people-type').show()

} else if (params.category) {
    // 목록
    getList()
    $('.people-list').show()
} else {
    $('.people-type').show()
    $('.list-title').html('성격유형을 선택하세요.')
}

// 상세목록 가져오기
function getDetail() {
    var settings = {
        "url": apiUrl,
        "method": "POST",
        "data": {
            flag: 'get_people',
            idx: params.idx
        },
    };
    $.ajax(settings).done(function (res) {
        var result = JSON.parse(res)[0]
        peopleDetail = result
        console.log(result)
        $('.p-title').html(result.name + '님 갤입니다.')
        $('.p-detail').html('<strong>' + result.name + '님</strong>의 MBTI 성격유형은 <strong>' + result.type + '</strong> 입니다.')
        $('.gaeup').text(result.gaeup)
        $('.gaedown').text(result.gaedown)
        $('[data-category="' + result.type + '"]').addClass('active')
    });
}

// 목록 가져오기
function getList() {
    // 인물 가져오기
    var settings = {
        "url": apiUrl,
        "method": "POST",
        "data": {
            flag: 'get_people_list',
            type: params.category
        },
    };
    $.ajax(settings).done(function (res) {
        var  result = JSON.parse(res)
            ,str = ''

        for (var i=0; i<result.length; i++) {
            str += '<a href="people.html?idx=' + result[i].idx + '" class="list-group-item d-flex justify-content-between align-items-center">'
            str += '    ' + result[i].name
            str += '    <span class="badge badge-primary badge-pill">' + result[i].reply + '</span>'
            str += '</a>'
        }
        $('.people-lists').html(str)
        $('.people-type').html(params.category)
        console.log(params.category)
    });
}



// 댓글 설정
function initReply() {
    var nickname = localStorage.getItem('uname') || ''
    
    $('#nickname')
        .val(nickname)
        .on('change', function() {
            localStorage.setItem('uname', $(this).val())
        })
    
    // 상세보기 깨업
    $('#btnGaeup').on('click', onGagGaeupdown)
    $('#btnGaedown').on('click', onGagGaeupdown)

    // 동영상
    $('#video').on('change', this.onChangeVideo.bind(this))

    // 댓글 작성
    $('#btnApply').on('click', onApplyReply)

    $('#btnAddReply').on('click', function() {
        var myMbti = localStorage.getItem('mbti')
        //if (myMbti == peopleDetail.type) {
        $('#newReply').modal({})
        //} else {
        //    alert('같은 MBTI만 댓글을 입력할 수 있습니다.')
        //}
        
    })
}

/**
 * 깨업 / 깨따
 */
function onGagGaeupdown(event) {
    //console.log(event)
    var  flag = event.currentTarget.id == 'btnGaeup' ? 'update_people_gaeup' : 'update_people_gaedown'
        ,jsonData = {
             flag : flag
            ,idx  : params.idx
        }
        ,gaeupdownList = JSON.parse(localStorage.getItem('mbti.people.gaeupdown')) || []

    for (var i=0; i<gaeupdownList.length; i++) {
        if (gaeupdownList[i] == params.idx) {
            return alert('이미 처리했습니다.')
        }
    }

    $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'json',
        data: jsonData
    }).then(function(res) {
        if (flag == 'update_people_gaeup') {
            peopleDetail.gaeup++
            $('.gaeup').html(peopleDetail.gaeup)
        } else {
            peopleDetail.gaedown++
            $('.gaedown').html(peopleDetail.gaedown)
        }
        gaeupdownList.push(params.idx)
        localStorage.setItem('mbti.people.gaeupdown', JSON.stringify(gaeupdownList))
    })
}

 /**
 * 동영상 추가
 */
function onChangeVideo() {
    var that = this

    getVideoSrc('#previewVideo', $('#video').val()).then(function(res) {
        if (res) {
            return $('#previewVideo').html(res.html)
        } else if (res == '') {
            $('#video').val('')
            $('#previewVideo').html('')
        } else {
            alert('알수 없는 경로입니다.')
            $('#video').val('')
            $('#previewVideo').html('')
        }
    })
}
// https://www.tiktok.com/@justdoitali2/video/6840380975935966469
// https://www.youtube.com/watch?v=i1R4R84-EPA&list=PL4C2OaC1jQqQdd3YBfrEy_EL0NaJHiyjs

// https://www.tiktok.com/@justdoitali2/video/6840380975935966469123
// https://www.youtube.com/watch?v=i1R4R84123-EPA&list=PL4C2OaC1jQqQdd3YBfrEy_EL0NaJHiyjs

/**
 * 댓글 작성
 */
var ready = true
function onApplyReply(e) {
    e.preventDefault()

    var jsonData = {
             nickname  : $('#nickname').val()
            ,content   : $('#content').val()
            ,flag      : 'insert_reply'
            ,userId    : localStorage.getItem('user_id')
            ,people_idx: params.idx
            ,videoUrl  : $('#video').val()
            ,userAgent : navigator.userAgent
        }
        ,form       = $('#file_form')[0]
        ,formData   = new FormData(form)
        ,attachment = $('#attachment').val()
        ,that       = this
        ,myRepy     = JSON.parse(localStorage.getItem('mbti.myRepy')) || []

    if (!ready) {
        return
    }
    if (!jsonData.nickname) {
        return alert('닉네임을 입력하세요.')
    }
    if (!jsonData.content) {
        return alert('내용을 입력하세요.')
    }
    if (attachment) {
        if (attachment.indexOf('.gif') == '-1' && attachment.indexOf('.GIF') == '-1' &&
            attachment.indexOf('.png') == '-1' && attachment.indexOf('.PNG') == '-1' &&
            attachment.indexOf('.jpg') == '-1' && attachment.indexOf('.JPG') == '-1' &&
            attachment.indexOf('.jpeg') == '-1' && attachment.indexOf('.JPEG') == '-1' &&
            attachment.indexOf('.octet-stream') == '-1' && attachment.indexOf('.OCTET-STREAM')
            ) {
            return alert('지원하지 않는 파일형식입니다.')
        }
    }
    
    formData.append('flag'       , jsonData.flag)
    formData.append('people_idx' , jsonData.people_idx)
    formData.append('nickname'   , jsonData.nickname)
    formData.append('user_id'    , jsonData.userId)
    formData.append('password'   , '')
    formData.append('content'    , jsonData.content)
    formData.append('user_agent' , jsonData.userAgent)
    
    if (jsonData.videoUrl) {
        formData.append('video_url' , jsonData.videoUrl)
    }
    if (attachment) {
        formData.append('attachment' , $('#attachment')[0].files[0])
    }
    ready = false

    $.ajax({
        type: 'POST',
        url: apiUrl,
        processData: false,
        contentType: false,
        //traditional: true,
        data: formData,
        success: function(res) {
            console.log(res)
            var replyIdx = res.replace(/\n/g, '')
            // console.log(res)
            myRepy.push({
                id: replyIdx
            })
            localStorage.setItem('mbti.myRepy', JSON.stringify(myRepy))
            alert('댓글이 등록되었습니다.')
            $('#content').val('')
            $('#video').val('')
            $('#attachment').val('')
            $('#previewVideo').html('')
            $('#newReply').modal('hide')
            getReplyList()
            ready = true
        }
    })
}

/**
 * 댓글 목록 가져오기
 */
var replyList
function getReplyList() {
    var jsonData = {
             flag : 'select_reply_list'
            ,idx  : params.idx
        }

    $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'json',
        //traditional: true,
        data: jsonData
    }).then(function(res) {
        var str = ''
        replyList = res

        console.log(res)
        for (var i=0; i<res.length; i++) {
            var fromNow = moment(res[i].reg_date, 'YYYY-MM-DD HH:mm:SS').locale('ko').fromNow()

            str += '<div class="list-group-item list-group-item-action">'
            str += '    <div class="d-flex w-100 justify-content-between" style="margin-bottom:10px">'
            str += '        <h5 class="mb-1" style="font-size: 12px;">' + res[i].user_name + '</h5>'
            str += '        <small>'
            if (isOwner('mbti.myRepy', res[i].idx)) {
                str += '            <a href="#" data-reply-delete="' + res[i].idx + '"><i class="far fa-trash-alt"></i> 삭제</a>'
            }
//                str += '            | ' + fromNow
            str += '        </small>'
            str += '    </div>'

            str += '    <p class="mb-1 reply-video" data-reply-video="' + res[i].idx + '"></p>'

            if (res[i].file) {
                str += '    <p class="mb-1 attachment"><img src="../upload/thum/' + res[i].file + '" alt="' + res[i].content + '"></p>'
            }
            str += '    <p class="mb-1">' + res[i].content.replace(/\n/g, '<br>') + '</p>'
            
            str += '    <div style="margin-top: 15px; text-align: center;">'
            str += '        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">'
            str += '            <button type="button" class="btn btn-outline-dark btn-sm" data-reply-gaeup="' + res[i].idx + '"><i class="far fa-thumbs-up"></i> '
            str += '                깨업 (<span data-reply-gaeup-count="' + res[i].idx + '">' + $.number(res[i].gaeup) + '</span> 회)'
            str += '            </button>'
            str += '            <button type="button" class="btn btn-outline-dark btn-sm" data-reply-gaedown="' + res[i].idx + '"><i class="far fa-thumbs-down"></i> '
            str += '                깨따 (<span data-reply-gaedown-count="' + res[i].idx + '">' + $.number(res[i].gaedown) + '</span> 회)'
            str += '            </button>'
            str += '        </div>'
            str += '    </div>'
            str += '</div>'

            if (res[i].video_url) {
                getVideoSrc('.card-body', res[i].video_url, res[i].idx).then(function(res) {
                    if (res) {
                        return $('[data-reply-video="' + res.index + '"]').html(res.html)
                    }
                })
            }

            $('#replyCount').html($.number(i + 1) + ' 개의 ')
        }

        if (str) {
            $('#replayList').html(str)
        }

        $('[data-reply-gaeup]').on('click', function() {
            var replyIdx = $(this).attr('data-reply-gaeup')
            replyGaeupdown(replyIdx, 'update_reply_gaeup')
        })

        $('[data-reply-gaedown]').on('click', function() {
            var replyIdx = $(this).attr('data-reply-gaedown')
            replyGaeupdown(replyIdx, 'update_reply_gaedown')
        })

        $('[data-reply-delete]').on('click', function() {
            var replyIdx = $(this).attr('data-reply-delete')
            replyDelete(replyIdx)
        })
    })
}

/**
 * 글쓴이 확인
 */
function isOwner(flag, gagId) {
    var myGag = JSON.parse(localStorage.getItem(flag).replace(/\\r/gi, ''))

    if (myGag) {
        for (var i=0; i<myGag.length; i++) {
            if (myGag[i].id == gagId) return true
        }
        return false
    }
    return false
}

/**
 * 댓글 깨업
 */
function replyGaeupdown(replyIdx, flag) {
    var  jsonData = {
             flag       : flag
            ,people_idx : params.idx
            ,idx        : replyIdx
        }
        ,that = this
        ,gaeupdownList = JSON.parse(localStorage.getItem('mbti.replyGaeupdown')) || []

    for (var i=0; i<gaeupdownList.length; i++) {
        if (gaeupdownList[i] == replyIdx) {
            return alert('이미 처리했습니다.')
        }
    }
    $.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'json',
        //traditional: true,
        data: jsonData
    }).then(function(res) {
        var currentReply = that.getReplyId(replyIdx)
        if (flag == 'update_reply_gaeup') {
            currentReply.gaeup++
            $('[data-reply-gaeup-count="' + replyIdx + '"]').html($.number(currentReply.gaeup))
        } else {
            currentReply.gaedown++
            $('[data-reply-gaedown-count="' + replyIdx + '"]').html($.number(currentReply.gaedown))
        }
        gaeupdownList.push(replyIdx)
        localStorage.setItem('mbti.replyGaeupdown', JSON.stringify(gaeupdownList))
    })
}

/**
 * 댓글 삭제
 */
function replyDelete(replyIdx) {
    if (confirm('진짜 삭제하시게요?')) {
        var  jsonData = {
                 flag       : 'delete_reply'
                ,people_idx : params.idx
                ,reply_id   : replyIdx
                ,user_id    : localStorage.getItem('user_id')
            }
            
        $.ajax({
            type: 'POST',
            url: apiUrl,
            dataType: 'json',
            //traditional: true,
            data: jsonData
        }).then(function(res) {
            alert('삭제했습니다.')
            location.reload()
        })
    }
}

/**
 *
 */
function getReplyId(replyIdx) {
    this.replyList
    for (var i=0; i<this.replyList.length; i++) {
        if (this.replyList[i].idx == replyIdx) {
            return this.replyList[i]
        }
    }
    return {}
}

/**
 * get parameter
 */
function getParameter() {
    var params = location.search.replace('?', '').split('&')
        parameter = {}

    params.forEach(function(p) {
        var param = p.split('=')
        parameter[param[0]] = param[1]
    })
    return parameter
}