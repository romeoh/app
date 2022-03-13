$(function(){

    // Tab 처리
    var  questionCount = 0
        ,searchWord = []
        ,mode = $.getParameter('mode')
        ,idx = $.getParameter('idx')
        ,photoUrl = '/apps/mbti/upload/mbti/thum/'
        ,lastpw
        ,$selectedQuestion

    $('[data-tab]').on('click', function(e) {
        e.preventDefault();
        var tabIndex = $(this).data('tab')
        $('[data-tab]').removeClass('active')
        if (tabIndex === 0) {
            $('.content0').show()
            $('.content1').hide()
        } else {
            $('.content0').hide()
            $('.content1').show()
        }
        $('[data-tab="'+tabIndex+'"]').addClass('active')
    })

    /**
     * 삭제/수정모드
     */
    if (mode) {
        var modeTitle = mode == 'edit' ? '수정' : '삭제'
        
        $('[data-modal-title]').html(modeTitle)
        $('#passModal').modal({backdrop: 'static', keyboard: false})

        // 취소
        $('#btnCancelEdit').on('click', function() {
            history.back()
        })

        // 비밀번호 검증
        $('#btnDeleteComment').on('click', function() {
            var password = $('#inputPassword').val()

            if (!password) {
                return $.showToast('비밀번호를 입력하세요.')
            }

            if (mode == 'edit') {
                var  url = '/apps/mbti/api/mbti_get'
                    ,data = {
                         flag: mode
                        ,idx: idx
                        ,password: password
                    }

                $('[data-submit]').html('수정')
                $.get(url, data, function(res) {
                    if (res === 0) {
                        alert('권한이 없습니다.')
                        return history.back();
                    }
                    var mbti = res[0]
                    lastpw = password
                    $('#passModal').modal('hide')
                    $('[data-name="author"]').val(mbti.author)
                    $('[data-name="password"]').val('')
                    $('[data-name="description"]').val(mbti.description)

                    $.each(mbti.questions, function(index, obj) {
                        var  container = $('#container-' + obj.type.toLowerCase())
                            ,template = $('#template-question')

                        obj = $.mergeQuestion(obj)
                        $.renderTemplate(container, template, obj, true)
                    })

                    $.each(mbti.results, function(index, obj) {
                        var  container = $('#result-list')
                            ,template = $('#template-result')

                        obj = $.mergeResult(obj)
                        $.renderTemplate(container, template, obj, true)
                    })

                    mbti.questions.forEach(function(question) {
                        var $typeDom = $($('[data-name="' + question.type + '"]')[question.index])

                        $typeDom.find('[data-name="question"]').val(question.question)
                        $typeDom.find('[data-name="answer0"]').val(question.answer0)
                        $typeDom.find('[data-name="answer1"]').val(question.answer1)
                        $typeDom.find('[data-name="answer0File"]').attr('data-picture', question.picture0)
                        $typeDom.find('[data-name="answer1File"]').attr('data-picture', question.picture1)
                        if (question.picture0) {
                            $typeDom.find('[data-name="answer0Picture"]').attr('src', photoUrl + question.picture0)    
                            $typeDom.find('[data-answer-image-box="0"]').show()
                        } else {
                            $typeDom.find('[data-answer-image-box="0"]').hide()
                        }
                        if (question.picture1) {
                            $typeDom.find('[data-name="answer1Picture"]').attr('src', photoUrl + question.picture1)    
                            $typeDom.find('[data-answer-image-box="1"]').show()
                        } else {
                            $typeDom.find('[data-answer-image-box="1"]').hide()
                        }
                        // console.log(question)
                    })
                    mbti.results.forEach(function(result) {
                        var type = result.type

                        $('[data-name="result_' + type + '"]').val(result.description)
                        if (result.picture) {
                            $('[data-name="result_file_' + type + '"]').attr('data-picture', result.picture)
                            $('[data-name="resultPicture_' + type + '"]').attr('src', photoUrl + result.picture)
                            $('[data-result-image-box="' + type + '"]').show()
                        } else {
                            $('[data-result-image-box="' + type + '"]').hide()
                        }
                        //console.log(result)
                    })
                    initEvent();
                })
            }
            if (mode == 'delete') {
                var  url = '/apps/mbti/api/mbti_update'
                    ,data = {
                         flag: mode
                        ,idx: idx
                        ,password: password
                    }

                $.post(url, data, function(res) {
                    if (res === 1) {
                        alert('삭제되었습니다.\n감사합니다.')
                        location.href = './'
                    } else {
                        alert('권한이 없습니다.')
                        return history.back();
                    }
                })
            }
            
        })
    }

    /**
     * Question
     */
    // 질문 Rendering
    if (!mode) {
        $.each(questionData, function(index, obj) {
            var  container = $('#container-' + obj.type.toLowerCase())
                ,template = $('#template-question')

            $.renderTemplate(container, template, obj, true)
        })

        // 이름넣기
        var uname = $.storage('uname')
        if (uname) {
            $('[data-name="author"]').val(uname)
        }
        initEvent();
    }
    $('[data-name="author"]').on('change', function() {
        var uname = $(this).val()
        if (uname) {
            $.storage('uname', uname)
        }
    })
    
    
    /**
     * Event
     */
    function initEvent() {
        // 질문 추가
        $('[data-add]').off('click').on('click', function(e) {
            e.preventDefault();
            var  type = $(this).data('add').toLowerCase()
                ,container = $('#container-' + type)
                ,template = $('#template-question')
                ,obj = questionData[type]

            $.renderTemplate(container, template, obj, true)
            if ($('[data-name="' + $(this).data('add') + '"]').length % 2 == 0) {
                $.renderTemplate(container, template, obj, true)
                $.showToast('아래로 <b>' + obj['title'] + '</b>에 관한 질문 두 개가 추가됩니다.')
            }
            initEvent();
            console.log($(this).data('add'), $(this).data('index'))
        })
        // 질문 삭제
        $('[data-del]').off('click').on('click', function(e) {
            e.preventDefault();
            var  type = $(this).data('del').toLowerCase()
                ,index = $(this).data('index')
                ,container = $('#container-' + type)
                ,obj = questionData[type]

            // 1개는 삭제안됨
            if (container.children().length < 2) {
                return $.showToast('최소 1개의 ' + obj['title'] + '질문은 해야되요.')
            }

            if (confirm('이 질문을 삭제하실건가요?\n저장 할 때 ' + obj['type'] + ' 질문의 갯수는 홀수개여야 합니다.')) {
                console.log('삭제함')
                $.removeQuestion(type, index)
            }
            console.log($(this).data('del'), $(this).data('index'))
        })

        // 이미지 삭제
        $('[data-delete-picture]').off('click').on('click', function(e) {
            e.preventDefault();
            var idx = $(this).attr('data-delete-picture')
            $('[data-name="answer' + idx + 'File"]').removeAttr('data-picture').val('')
            $('[data-name="answer' + idx + 'Picture"]').attr('src', '')
            $('[data-answer-image-box="' + idx + '"]').hide()
        })
        // 이미지 삭제
        $('[data-delete-picture-result]').off('click').on('click', function(e) {
            e.preventDefault();
            var type = $(this).attr('data-delete-picture-result')
            $('[data-name="result_file_' + type + '"]').removeAttr('data-picture').val('')
            $('[data-name="resultPicture_' + type + '"]').attr('src', '')
            $('[data-result-image-box="' + type + '"]').hide()
        })

        /**
         * 질문 샘플보기
         */
        $('[data-sample]').off('click').on('click', function(e) {
            e.preventDefault();
            var  type = $(this).attr('data-sample').toLowerCase()
                ,index = $(this).attr('data-index')
                ,samples = questionData[type].sample
                ,sampleTitle = samples[index].title
                ,sampleDesc = samples[index].samples

            $('#mbtiModal').modal('show')
            $('[data-modal-title]').html(sampleTitle)
            $('[data-modal-description]').html('<ul>' + sampleDesc.join('') + '</ul>')
            
        })

        /**
         * 유형 샘플보기
         */
        $('[data-sample-result]').off('click').on('click', function(e) {
            e.preventDefault();
            var  index = $(this).attr('data-sample-result')
                ,sample = resultData[index].sample
                ,sampleTitle = resultData[index].icon + ' ' + resultData[index].name + '[' + resultData[index].type + '] 캐릭터의 특징'
                ,sampleDesc = sample.samples

            $('#mbtiModal').modal('show')
            $('[data-modal-title]').html(sampleTitle)
            $('[data-modal-description]').html('<ul>' + sampleDesc.join('') + '</ul>')
        })
        
        /**
         * 유형 비교
         */
        $('[data-diff]').off('click').on('click', function(e) {
            var  type = $(this).attr('data-diff').toLowerCase()
                ,questions = questionData[type]
                ,samples = _.shuffle(questionData[type].diff)
                ,sampleDesc = []

            $selectedQuestion = $($(this).closest('[data-name]'))
            // console.log($selectedQuestion)

            // console.log(samples)
            sampleDesc.push('<colgroup><col width="*" /><col width="*" /><col width="80px" /></colgroup>')
            sampleDesc.push('<thead><tr>')
            sampleDesc.push('   <th>' + questions.type0Str + '</th>')
            sampleDesc.push('   <th>' + questions.type1Str + '</th>')
            sampleDesc.push('   <th> </th>')
            sampleDesc.push('</tr></thead>')
            sampleDesc.push('<tbody>')
            samples.forEach(function(sample, i) {
                sampleDesc.push('<tr>')
                sampleDesc.push('   <td>' + sample[0] + '</td>')
                sampleDesc.push('   <td>' + sample[1] + '</td>')
                sampleDesc.push('   <td><a href="javascript:;" data-use="' + i + '" data-type="' + type + '" class="diff-type">사용하기</a></td>')
                sampleDesc.push('</tr>')
            })
            sampleDesc.push('</tbody>')

            $('#mbtiModal').modal('show')
            $('[data-modal-title]').html('외향[E]  vs  내향[I] 특징 비교')
            $('[data-modal-description]').html('<table class="table table-striped">' + sampleDesc.join('') + '</table>')
            $('[data-use]').on('click', function() {
                var  type = $(this).attr('data-type')
                    ,index = $(this).attr('data-use')
                    ,diffData = samples[index]

                $selectedQuestion.find('[data-name="question"]').val(diffData[2])
                $selectedQuestion.find('[data-name="answer0"]').val(diffData[3])
                $selectedQuestion.find('[data-name="answer1"]').val(diffData[4])
                $('#mbtiModal').modal('hide')
            })
        })

        /**
         * 이미지 미리보기
         */
        $('[answer0File]').off('change').on('change', function(e) {
            $.readImage(e.currentTarget, 0)
        })
        $('[answer1File]').off('change').on('change', function(e) {
            $.readImage(e.currentTarget, 1)
        })
        $('[resultFile]').off('change').on('change', function(e) {
            $.readImage(e.currentTarget, 0)
        })
    }

    /**
     * Result
     */
    // 유형 Rendering
    if (!mode) {
        $.each(resultData, function(index, obj) {
            var  container = $('#result-list')
                ,template = $('#template-result')

            $.renderTemplate(container, template, obj, true)
        })
        initEvent()
    }

    // 유형 modal열림
    // $('#mbtiModal').on('show.bs.modal', function (e) {
    //     console.log(e);
    // });

    // 유형 modal 창 열기
    $('[data-modal]').on('click', function() {
        var  index    = $(this).data('modal')
            ,data     = resultData[index]
            ,title    = data.title
            ,type     = data.type
            ,name     = data.name
            ,modalTitle = type + ' - [' + name + '] ' + title

        $('.modal-title').html(modalTitle)
    })

    /**
     * 등록하기
     */
    $('#btnRegister').on('click', function(e) {
        e.preventDefault();
        // $('#btnRegister').prop('disabled', true);
        
        var form = $('#question-form')

        // trim 처리
        $('[answer0Place]').each(function() { $.trimText(this) })
        $('[answer1Place]').each(function() { $.trimText(this) })
        $('[result]').each(function() { $.trimText(this) })

        // 질문 검증
        // EI
        $('#container-ei .card').each(function() { $.validQuestion(this) })
        // SN
        $('#container-sn .card').each(function() { $.validQuestion(this) })
        // TF
        $('#container-tf .card').each(function() { $.validQuestion(this) })
        // JP
        $('#container-jp .card').each(function() { $.validQuestion(this) })

        // 유형 검증
        $('#result-list .card').each(function() { $.validResult(this) })

        form.addClass('was-validated')
        // console.log(form)
        if (form[0].checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            return $.showToast('더 작성해야 할 항목이 남아있어요.')
        }

        // 갯수 검증
        if (!$.checkCount()) {
            return $.showToast('각 타입의 질문 갯수는 홀수가 되어야 합니다.')
        }

        var  url = '/apps/mbti/api/mbti_add'
            ,flag = 'add'
            ,message = '등록했습니다.'

        var  author = $('[data-name="author"]').val()
            ,password = $('[data-name="password"]').val()
            ,description = $('[data-name="description"]').val()

        // 수정하기
        if (mode == 'edit') {
            // url = '/apps/mbti/api/mbti_update'
            flag = 'update'
            message = '수정했습니다.'
        }
        var data = {
             flag: flag
            ,info: {
                 idx: idx
                ,author: author
                ,password: password
                ,lastpw: lastpw
                ,description: description
             }
            ,questions: getQuestions()
            ,results: getResult()
        };
        data.info.questionCount = questionCount;
        data.info.searchWord = searchWord.join(',')
        //console.log(data)
        $.post(url, data, function(res) {
            if (res) {
                alert(message)
                location.href = './?' + res
            }
            
        })
    })
    function getQuestions() {
        var result = []
        questionCount = 0;
        result.push(getQuestionElement('EI', 0))
        result.push(getQuestionElement('SN', 1))
        result.push(getQuestionElement('TF', 2))
        result.push(getQuestionElement('JP', 3))
        return result;
    }
    function getQuestionElement(flag, index) {
        var result = []
        $('[data-name="' + flag + '"]').each(function(i, ele) {
            var $ele = $(ele)

            result.push({
                 type: flag
                ,typeSeq: index
                ,question: $ele.find('[data-name="question"]').val()
                ,questionSeq: i
                ,answer0: $ele.find('[data-name="answer0"]').val()
                ,picture0: $ele.find('[data-name="answer0File"]').attr('data-picture')
                ,answer1: $ele.find('[data-name="answer1"]').val()
                ,picture1: $ele.find('[data-name="answer1File"]').attr('data-picture')
            })
            searchWord.push($ele.find('[data-name="question"]').val())
            searchWord.push($ele.find('[data-name="answer0"]').val())
            searchWord.push($ele.find('[data-name="answer1"]').val())
            questionCount++;
        })
        return result;
    }
    function getResult() {
        var result = []
        resultData.forEach(function(res, i) {
            result.push({
                 type: res.type
                ,typeSeq: i
                ,description: $('[data-name="result_' + res.type + '"]').val()
                ,picture: $('[data-name="result_file_' + res.type + '"]').attr('data-picture')
            })
            searchWord.push($('[data-name="result_' + res.type + '"]').val())
        })
        return result;
    }

    /**
     * 테스트 삭제하기
     */
    $('[data-cancel2]').on('click', function() {
        if (confirm('취소 하시나요?')) {
            history.back()
        }
    })
    $('[data-cancel]').on('click', function() {
        var  form = $('#question-form')[0]
            ,prefix = 'A_'

        $('[data-name="author"]').val(prefix + 'romeoh_' + $.ran())
        $('[data-name="password"]').val('111111')
        $('[data-name="description"]').val(prefix + '새로운 MBTI 테스트 입니다.' + $.ran())

        $('[data-name="EI"] [data-name="question"]').val(prefix + '외향/내향 질문입니다._' + $.ran())
        $('[data-name="EI"] [data-name="answer0"]').val(prefix + '외향 답변입니다._' + $.ran())
        $('[data-name="EI"] [data-name="answer1"]').val(prefix + '내향 답변입니다._' + $.ran())

        $('[data-name="SN"] [data-name="question"]').val(prefix + '감각/직관 질문입니다._' + $.ran())
        $('[data-name="SN"] [data-name="answer0"]').val(prefix + '감각 답변입니다._' + $.ran())
        $('[data-name="SN"] [data-name="answer1"]').val(prefix + '직관 답변입니다._' + $.ran())

        $('[data-name="TF"] [data-name="question"]').val(prefix + '사고/감정 질문입니다._' + $.ran())
        $('[data-name="TF"] [data-name="answer0"]').val(prefix + '사고 답변입니다._' + $.ran())
        $('[data-name="TF"] [data-name="answer1"]').val(prefix + '감정 답변입니다._' + $.ran())

        $('[data-name="JP"] [data-name="question"]').val(prefix + '판단/인식 질문입니다._' + $.ran())
        $('[data-name="JP"] [data-name="answer0"]').val(prefix + '판단 답변입니다._' + $.ran())
        $('[data-name="JP"] [data-name="answer1"]').val(prefix + '인식 답변입니다._' + $.ran())

        resultData.forEach(function(result) {
            $('[data-name="result_' + result.type + '"]').val(prefix + result.type + ' 결과입니다._' + $.ran())
        })    
    })

    

});




































