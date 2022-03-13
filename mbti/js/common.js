// 질문 Rendering
$.renderTemplate = function(container, template, obj, append) {
    var x = $.trim(template.html());
    obj.index = container.children().length;
    for (var i in obj) {
        var pattern = new RegExp('\\{\\{' + i + '\\}\\}', 'g')
        x = x.replace(pattern, obj[i])
    }
    if (append) {
        container.append(x)
    } else {
        container.prepend(x)
    }
}

$.removeQuestion = function(type, index) {
    var $container = $('#container-' + type)
    if ($container.children().length < 2) return;
    
    $container.children()[index].remove()

    $container.children().each(function(index, el) {
        $(el).find('[data-index]').attr('data-index', index)
    })
}

/**
 * text trim 처리
 */
$.trimText = function(that) {
    var value = _.trim($(that).val())
    $(that).val(value)
}

/**
 * 질문을 검증한다.
 */
$.validQuestion = function(that) {
    var  $answer0       = $($(that).find('[answer0Place]'))
        ,$answer0File   = $($(that).find('[answer0File]'))
        ,$answer1       = $($(that).find('[answer1Place]'))
        ,$answer1File   = $($(that).find('[answer1File]'))

    // 0번
    if ($answer0.val() == '' && $answer0File.val() == '') {
        $answer0.prop('required', true)
        $answer0File.prop('required', true)
    } else if ($answer0.val() != '') {
        $answer0File.prop('required', false)
    } else if ($answer0File.val() != '') {
        $answer0.prop('required', false)
    }

    // 1번
    if ($answer1.val() == '' && $answer1File.val() == '') {
        $answer1.prop('required', true)
        $answer1File.prop('required', true)
    } else if ($answer1.val() != '') {
        $answer1File.prop('required', false)
    } else if ($answer1File.val() != '') {
        $answer1.prop('required', false)
    }
}

/**
 * 유형을 검증한다.
 */
$.validResult = function(that) {
    var  $result         = $($(that).find('[result]'))
        ,$resultFile     = $($(that).find('[resultFile]'))

    if ($result.val() == '' && $resultFile.val() == '') {
        $result.prop('required', true)
        $resultFile.prop('required', true)
    } else if ($result.val() != '') {
        $resultFile.prop('required', false)
    } else if ($resultFile.val() != '') {
        $result.prop('required', false)
    }
}

/**
 * 갯수검증
 */
$.checkCount = function() {
    var  types = ['EI', 'SN', 'TF', 'JP']
        ,canPass = true;

    types.forEach(function(type) {
        if ($('[data-name="' + type + '"]').length % 2 == 0) {
            canPass = false;
        }
    })
    return canPass;
}

/**
 * 이미지 미리보기
 */
$.readImage = function(input, index) {
    if (input.files && input.files[0]) {
        var  form = $('#question-form')[0]
            ,formData = new FormData(form)
            ,reader = new FileReader()
            ,preview = $(input).parent().parent().find('.previewImage' + index)
        
        formData.append('attachment', input.files[0])

        $.ajax({
             type: 'POST'
            ,enctype: 'multipart/form-data'
            ,processData: false
            ,contentType: false
            ,cache: false
            ,url: "/apps/mbti/api/upload"
            ,data: formData
            ,success: function(data) {
                if (data.filename) {
                    $(input).attr('data-picture', data.filename)
                    $(input).parent().find('.picture-box').show()
                }
                //console.log(data)
            }
            ,error: function(e) {
                console.error(e)
            }
        })

        reader.onload = (e) => {
            var previewImage = preview[0];
            previewImage.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$.ran = function() {
    return _.random(100, 200);
}

$.showToast = function(message) {
    $('.message').html(message)
    $('.toast').toast('show');
}

/**
 * HTTPS
 */
$.goSecre = function() {
    if (location.href.indexOf('http:') == 0) {
        var sUrl = location.href.replace('http:', 'https:')
        window.location.replace(sUrl)
    }
}

$.getIndex = function() {
    return location.search.replace('?', '')
}

$.storage = function(key, value) {
    if (!value) {
        // set
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch {
            return localStorage.getItem(key)
        }
    }
    if (typeof value == 'string') {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

$.getType = function (answers) {
    var  e = 0, i = 0
        ,s = 0, n = 0
        ,t = 0, f = 0
        ,j = 0, p = 0
        ,type = []

    answers.forEach(function(ans){
        if (ans === 'E') {
            e++
        } else if (ans === 'I') {
            i++
        } else if (ans === 'S') {
            s++
        } else if (ans === 'N') {
            n++
        } else if (ans === 'T') {
            t++
        } else if (ans === 'F') {
            f++
        } else if (ans === 'J') {
            j++
        } else if (ans === 'P') {
            p++
        }
    })
    if (e > i) {
        type.push('E')
    } else {
        type.push('I')
    }
    if (s > n) {
        type.push('S')
    } else {
        type.push('N')
    }
    if (t > f) {
        type.push('T')
    } else {
        type.push('F')
    }
    if (j > p) {
        type.push('J')
    } else {
        type.push('P')
    }
    return type.join('')
}

$.currency = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

$.canUpDown = function(mbtiIndex) {
    var  updown = $.storage('mbti_gaeup_down') || []
        ,can = true

    updown.forEach(function(idx) {
        if (idx == mbtiIndex) {
            can = false
        }
    })
    return can;
}
$.setUpdown = function(mbtiIndex) {
    var  updown = $.storage('mbti_gaeup_down') || []
    updown.push(mbtiIndex)
    $.storage('mbti_gaeup_down', updown)
}

$.getTypeString = function(type) {
    var typeSring
    resultData.forEach(function(data) {
        if (data.type == type) {
            typeSring = data.name
        }
    })
    return typeSring
}

$.getParameter = function(key) {
    var  urls = location.search.replace('?', '').split('&')
        ,param = {}

    urls.forEach(function(u) {
        var  us = u.split('=')
        param[us[0]] = us[1]
    })
    return param[key]
}

$.mergeQuestion = function(obj) {
    var type = obj.type.toLowerCase()
    return _.merge(obj, questionData[type])
}

$.mergeResult = function(obj) {
    var  type = obj.type
        ,rdata = {}

    resultData.forEach(function(result) {
        if (type == result.type) {
            rdata = _.merge(obj, result)
        }
    })
    return rdata
}












