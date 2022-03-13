$(function(){

    moment.locale('ko');
    $.goSecre()
    getMbti()

    var  total = 10
        ,start = 0
        ,commentTotal = 10
        ,commentStart = 0
        ,mbtiIndex
        ,mbti
        ,resultMbti
        ,currentIndex = 0
        ,answers = []
        ,photoUrl = '/apps/mbti/upload/mbti/thum/'

    Kakao.init('eaed55751e121f59b09594ba64fa7558');

    // 더 많은 취향테스트 불러오기
    $('#btnMoreMbti').on('click', getMbtiList)
    goStage(0)

    /**
     * 현재 MBTI 가져오기
     */
    function getMbti() {
        mbtiIndex = $.getIndex()

        var  url = '/apps/mbti/api/mbti_get'
            ,data = {
                 flag: 'get'
                ,idx: mbtiIndex
            }

        $.get(url, data, function(res) {
            if (!mbtiIndex) {
                history.pushState(null, null, '/apps/mbti/?' + res[0].idx)
            }
            if (!res) {
                return location.href = './'
            }
            mbtiIndex = res[0].idx
            mbti = res[0]
            mbti.questions = _.shuffle(mbti.questions)
            mbti.view++
            $('[data-gaeupdown="gaeup"]').html('(' + $.currency(mbti.gaeup) + ')')
            $('[data-gaeupdown="gaedown"]').html('(' + $.currency(mbti.gaedown) + ')')
            $('[data-reply-count]').html('(' + $.currency(mbti.reply) + ')')
            $('[data-info-mbti]').html('작성자: '+ mbti.author +' | 조회: ' + $.currency(mbti.view) + '회 | ')
            if (mbti.reply > 0) {
                $('#no-reply').hide()
            }
            //console.log(res)
            startMbti()
            getMbtiList()
            getMbtiComment()
        })
    }

    /**
     * 바로 시작하기
     */
    function startMbti() {
        var uname = $.storage('uname')

        $('[data-title]').html(mbti.description)
        $('[data-info]').html(mbti.questionCount + '개 질문이 준비되었습니다.')
        $('[data-uname]').val(uname)
        $('#startMbti').on('click', function() {
            var uname = $('[data-uname]').val();
            if (!uname) return $.showToast('닉네임을 입력하세요.');
            goStage(1)
            nextQuestion()
        })
    }
    $('[data-uname]').on('change', function() {
        var uname = $(this).val()
        if (uname) {
            $.storage('uname', uname)
            $('[data-uname]').val(uname);
        }
    })
    function goStage(stg) {
        if (stg === 0) {
            $('#start').show()
            $('#question').hide()
            $('#result').hide()
            $('[data-retry]').hide()
            $('[data-back]').hide()
        } else if (stg === 1) {
            $('#start').hide()
            $('#question').show()
            $('#result').hide()
            $('[data-retry]').hide()
            $('[data-back]').hide()
        } else if (stg === 2) {
            $('#start').hide()
            $('#question').hide()
            $('#result').show()
            $('[data-retry]').show()
            $('[data-back]').hide()
        }
    }

    /**
     * 질문하기
     */
    function nextQuestion() {
        var  question = mbti.questions[currentIndex]
            ,qCount = currentIndex + 1
            ,percent = (qCount / mbti.questionCount) * 100

        $('[data-question]').html('<i class="fa-brands fa-quora"></i> ' + question.question)
        $('[data-answer-text="0"]').html(question.answer0)
        $('[data-answer-text="1"]').html(question.answer1)
        $('#progress').width(percent + '%').html(qCount + '/' + mbti.questionCount)

        if (currentIndex > 0) {
            $('[data-back]').show()
        }

        if (question.picture0) {
            $('[data-picture="0"]').show()
            $('[data-img="0"]').attr('src', photoUrl + question.picture0)
        } else {
            $('[data-picture="0"]').hide()
            $('[data-img="0"]').attr('src', '')
        }
        if (question.answer0) {
            $('[data-text="0"]').show()
        } else {
            $('[data-text="0"]').hide()
        }
        if (question.picture1) {
            $('[data-picture="1"]').show()
            $('[data-img="1"]').attr('src', photoUrl + question.picture1)
        } else {
            $('[data-picture="1"]').hide()
            $('[data-img="1"]').attr('src', '')
        }
        if (question.answer1) {
            $('[data-text="1"]').show()
        } else {
            $('[data-text="1"]').hide()
        }
    }

    /**
     * 답변
     */
    $('[data-answer]').on('click', function() {
        var  ans = $(this).attr('data-answer')
            ,question = mbti.questions[currentIndex]
        
        answers.push(question.type.substr(ans, 1))
        currentIndex++;
        if (mbti.questionCount == currentIndex) {
            goStage(2)
            parseResult()
        } else {
            nextQuestion()    
        }
    })

    /**
     * 결과 보여주기
     */
    function parseResult() {
        var myType = $.getType(answers)
        
        var  url = '/apps/mbti/api/mbti_get'
            ,data = {
                 flag: 'result'
                ,mbtiIdx: mbtiIndex
                ,type: myType
            }

        $.get(url, data, function(res) {
            resultMbti = res[0]

            var  uname = $.storage('uname')
                ,type = resultMbti.type
                ,typeString = $.getTypeString(type)
            
            //console.log(res)
            $('[data-description-type]').html(uname + '님은 ' + typeString + '(' + type + ')타입 입니다.')
            $('[data-description]').html(resultMbti.description)
            if (resultMbti.picture) {
                $('[data-result-picture]').show().attr('src', photoUrl + resultMbti.picture)
            }
        })
    }

    /**
     * 깨업 깨따
     */
    $('[data-updown]').on('click', function() {
        var  url = '/apps/mbti/api/mbti_update'
            ,flag = $(this).attr('data-updown')
            ,canUpDown = $.canUpDown(mbtiIndex)
            ,data = {
                 flag: flag
                ,mbtiIdx: mbtiIndex
            }

        if (!canUpDown) {
            return $.showToast('이미 평가했습니다.')
        }
        $.get(url, data, function(res) {
            $.setUpdown(mbtiIndex)
            if (flag == 'gaeup') {
                $.showToast('깨업 했습니다.')
                mbti.gaeup++
                var gaeupCount = parseInt(mbti.gaeup, 10)
                $('[data-gaeupdown="gaeup"]').html('(' + $.currency(gaeupCount) + ')')
            } else {
                $.showToast('깨따 했습니다.')
                mbti.gaedown++
                var gaedownCount = parseInt(mbti.gaedown, 10)
                $('[data-gaeupdown="gaedown"]').html('(' + $.currency(gaedownCount) + ')')
            }
            
        })
    })

    /**
     * 다시하기
     */
    $('[data-retry]').on('click', function() {
        answers = []
        currentIndex = 0;
        goStage(0)
    })

    /**
     * 이전으로
     */
    $('[data-back]').on('click', function() {
        if (currentIndex > 0) {
            answers.pop()
            currentIndex--
            nextQuestion()
        } 
        if (currentIndex == 0) {
            $('[data-back]').hide()
        }
    })

    /**
     * 수정/삭제
     */
    $('[data-edit-mbti]').on('click', function() {
        var mode = $(this).attr('data-edit-mbti')
        location.href = './add.html?mode=' + mode + '&idx=' + mbtiIndex
    })

    /**
     * 공유하기
     */
    $('[data-share]').on('click', function() {
        var  platform = $(this).attr('data-share')
            ,title = mbti.description
            ,typeString = $.getTypeString(resultMbti.type)
            ,uname = $.storage('uname')
            ,desc = []
            ,url = 'https://gaeyou.com/apps/mbti/?' + mbtiIndex
            ,textLimit = 140

        desc.push(title)
        desc.push('──────────────────')
        desc.push(uname + '님은 ' + resultMbti.type + '(' + typeString + ')')
        desc.push(resultMbti.description)
        //desc.push('https://gaeyou.com/apps/mbti/?' + mbtiIndex)
        shareData = desc.join('\n')
        
        if (platform == 'twitter') {
            if (shareData.length > textLimit) {
                shareData = shareData.substr(0, textLimit) + '...'
            }
            shareData += '\n\n' + url
            console.log(shareData)
            str  = 'https://twitter.com/intent/tweet?text=';
            str += encodeURIComponent(shareData);
            top.location.href = str;
        }
        if (platform == 'kakaotalk') {
            if (resultMbti.picture) {
                var picture = 'https://gaeyou.com/apps/mbti/upload/mbti/thum/' + resultMbti.picture
            }
            
            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: mbti.description,
                    description: shareData,
                    imageUrl: picture,
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
                social: {
                    likeCount: parseInt(mbti.gaeup, 10),
                    commentCount: parseInt(mbti.reply, 10),
                    sharedCount: parseInt(mbti.play, 10),
                },
                buttons: [
                    {
                      title: '웹으로 보기',
                      link: {
                        mobileWebUrl: url,
                        webUrl: url,
                      },
                    }
                ]
            })
        }
    })

    /**
     * MBTI 목록 가져오기
     */
    function getMbtiList() {
        var  url = '/apps/mbti/api/mbti_get'
            ,data = {
                 flag: 'list'
                ,total: total
                ,start: start
            }

        $.get(url, data, function(res) {
            
            if (res.length < total) {
                $('#btnMoreMbti').prop('disabled', true);
            }
            res.forEach((redata) => {
                redata.fromNow = moment(redata.regDate).fromNow();
                redata.replyCurrency = $.currency(redata.reply)
                redata.gaeupCurrency = $.currency(redata.gaeup)
                redata.gaedownCurrency = $.currency(redata.gaedown)
                redata.viewCurrency = $.currency(redata.view)
                redata.questionCountCurrency = $.currency(redata.questionCount)
                //console.log(redata)
            })
            start = total + start;

            $.each(res, function(index, obj) {
                var  container = $('#container-list')
                    ,template = $('#template-list')
                //console.log(obj)
                $.renderTemplate(container, template, obj, true)
                //initEvent();
            })
        })
    }

    /**
     * 댓글 가져오기
     */
    function getMbtiComment() {
        var  url = '/apps/mbti/api/comment_get'
            ,data = {
                 flag: 'list'
                ,mbtiIdx: mbtiIndex
                ,total: commentTotal
                ,start: commentStart
            }

        $.get(url, data, function(res) {
            if (res.length < commentTotal) {
                $('#btnMoreComment').prop('disabled', true);
            }
            res.forEach((redata) => {
                redata.fromNow = moment(redata.regDate).fromNow();
                //console.log(redata)
            })
            commentStart = commentTotal + commentStart;

            $.each(res, function(index, obj) {
                var  container = $('#container-comment')
                    ,template = $('#template-comment')
                //console.log(obj)
                $.renderTemplate(container, template, obj, false)
                initCommentEvent();
            })
        })
    }
    $('#btnMoreComment').on('click', getMbtiComment)

    // 댓글 입력
    $('#btnRegComment').on('click', function() {
        var  userName = $('#userName').val()
            ,password = $('#password').val()
            ,comment = _.trim($('#comment').val())

        if (!userName) return $.showToast('닉네임을 입력하세요.');
        if (!password) return $.showToast('비밀번호를 입력하세요.');
        if (!comment) return $.showToast('댓글을 입력하세요.');

        var url = '/apps/mbti/api/comment_add';
        var data = {
             flag: 'add'
            ,userName: userName
            ,password: password
            ,comment: comment
            ,mbtiIdx: mbtiIndex
        };
        //console.log(data)
        $.post(url, data, function(res) {
            // console.log(res)
            var commentIdx = res;
            data.idx = res;
            data.fromNow = moment().fromNow();
            $.each([data], function(index, obj) {
                var  container = $('#container-comment')
                    ,template = $('#template-comment')
                //console.log(obj)
                $.renderTemplate(container, template, obj, true)
                initCommentEvent()
            })
            $('#password').val('')
            $('#comment').val('')
            mbti.reply++
            $('[data-reply-count]').html('(' + mbti.reply + ')')
            $('#no-reply').hide()
        })
    })

    // 댓글 삭제
    var deleteCommentId
    function initCommentEvent() {
        $('[data-delete-comment]').off().on('click', function() {
            deleteCommentId = $(this).attr('data-delete-comment')
            $('#inputPassword').val('')
        })    
    }
    // 댓글 삭제 모달
    $('#btnDeleteComment').on('click', function(e) {
        var inputPassword = $('#inputPassword').val()
        var url = '/apps/mbti/api/comment_delete';
        var data = {
             flag: 'delete'
            ,idx: deleteCommentId
            ,password: inputPassword
            ,mbtiIdx: mbtiIndex
        };

        if (!inputPassword) {
            return $.showToast('비밀번호를 입력하세요.');
        }
        console.log(data)
        $.post(url, data, function(res) {
            $('#passModal').modal('hide');
            if (res == 0) {
                return alert('삭제 할 수 없습니다.')
            }
            if (res == 1) {
                $('[data-index="' + deleteCommentId + '"]').remove();
                $.showToast('댓글을 삭제했습니다.');
            }
        })
    })

})
































