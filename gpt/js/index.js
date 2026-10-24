// 통계: 공통 메뉴(gnb.js)의 GA 도우미. 이벤트 목록은 lumo/docs/analytics-gaeyou.md
function gyTrack(name, params, opts) {
	if (window.GaeyouGnb && window.GaeyouGnb.track) window.GaeyouGnb.track(name, params || {}, opts);
}
var concernFrom = 0
var concernTotal = 10

/**
 * Index
 */
if ($('body.main').length == 1) {
	$.ajax({
	    url: './api/service.php',
	    method: 'POST',
	    dataType: 'json',
	    data: {
		    action: 'index_list'
	    },
	    success: function(data) {
		    var html = ''
		    $.each(data, function(index, item) {
			    html += '<a class="card" href="concern.html?idx=' + item.idx + '">'
				html += '    <h5 class="card-title">' + item.title + '</h5>'
			    html += '    <img src="' + item.thumnail + '" class="card-img-top" alt="' + item.title + '">'
			    html += '    <div class="card-body">'
			    html += '        <p>'
				html += '            <span>😊 <i>' + toNumber(item.view_count) + '</i> 회</span>'
			    html += '            <span>👍 <i>' + toNumber(item.gaeup_count) + '</i> 개</span>'
			    html += '            <span>💬 <i>' + toNumber(item.reply_count) + '</i> 개</span>'
				html += '        </p>'
			    html += '    </div>'
			    html += '</a>'
		    })
		    $('#indexList').html(html)
		    
		    localStorage.setItem('concern_list', JSON.stringify(data))
	        // console.log(data);
	    }
	});
}



/**
 * Concern
 */
if ($('body.concern').length == 1) {
	var concernIdx = getQueryParams().idx
	$.ajax({
	    url: './api/service.php',
	    method: 'POST',
	    dataType: 'json',
	    data: {
		    action: 'concern_content',
		    concern_idx: concernIdx
	    },
	    success: function(data) {
		    var charactor = data[0].charactor
		    var concern_idx = data[0].idx
	        //console.log(data);
	        setUserName($('#nickname'))
	        
	        $('#title').html(data[0].title)
	        $('#description').html(data[0].description)
	        $('#thumnail').attr('src', data[0].thumnail).attr('alt', data[0].title)
	        $('#concern').attr('placeholder', charactor + '에게 고민을 말해보세요. \n챗GPT가 답해줍니다.\n폭력적이거나, 해로운 콘텐츠는 사용이 제한 됩니다.')
	                     .on('keyup', function(e) {
		                     var keyLength = $(this).val().length
		                     $('#typeLength').text(keyLength)
	                     })
	        $('#results').html(charactor+'의 고민들')
	        $('#btnConcern')
	        	.html(charactor + '에게 물어보기')
		        .on('click', function() {
			        var userName = $('#nickname').val()
			        var concern = $('#concern').val()
			        if (!userName) {
				        return alert('닉네임을 입력하세요.')
			        }
			        if (!concern) {
				        return alert(charactor + '에게 고민을 말해보세요.')
			        }
			        gyTrack('concern_ask', { length_bucket: concern.length < 100 ? 'short' : 'long' })
			        showProgress()
					$.ajax({
					    url: './api/chatgpt.php',
					    method: 'POST',
					    dataType: 'json',
					    data: {
						    action: getQueryParams().idx,
						    prompt: replaceReturnNewline(concern),
						    uname: userName
					    },
					    success: function(data) {
					        //hideProgress()
					        $.ajax({
							    url: './api/service.php',
							    method: 'POST',
							    dataType: 'json',
							    data: {
								    action: 'save_concern',
								    concern_idx: concern_idx,
								    nickname: userName,
								    concern: concern,
								    gpt_result: data.choices[0].message.content,
								    gpt_all: JSON.stringify(data),
								    completion_tokens: data.usage.completion_tokens,
								    prompt_tokens: data.usage.prompt_tokens,
								    total_tokens: data.usage.total_tokens
							    },
							    success: function(data) {
								    var idx = data.id
									hideProgress()
									var result = {
										concern_idx: getQueryParams().idx+'',
										concern_result_idx: idx+''
									}
									addToStorage("concernResult", result)
									gyTrack('concern_result', {}, { next: true })
									window.location.href = 'result.html?idx='+idx;
							    }
							});
					    }
					});
	        	})
	    }
	});
	getConcernList(concernIdx)
}



/**
 * List
 */
if ($('body.list').length == 1) {
	var concern_list = localStorage.getItem('concern_list')
	if (!concern_list) {
		window.location.href = './';
	}
	concern_list = JSON.parse(concern_list)
	
	var concernIdx = getQueryParams().idx
	var html = ''
	
	if (!concernIdx) {
		window.location.href = './list.html?idx=1';
	}
	$.each(concern_list, function(index, item) {
		if (concernIdx == item.idx) {
			html += '<li class="active"><a href="">' + item.title + '</a></li>'
			$('#commentTitle').html(item.charactor + '의 고민들')
			$('#ask').attr('href', './concern.html?idx=' + item.idx)
		} else {
			html += '<li><a href="list.html?idx=' + item.idx + '">' + item.title + '</a></li>'
		}
    })
    $('#navi').html(html)
    getConcernList(concernIdx)
}


function getConcernList(concernIdx) {
	$.ajax({
	    url: './api/service.php',
	    method: 'POST',
	    dataType: 'json',
	    data: {
		    action: 'concern_list',
		    concern_idx: concernIdx,
		    concern_from: concernFrom
	    },
	    success: function(data) {
		    var html = ''
		    if (data.length < concernTotal) {
			    $('#btnMore').hide()
		    }
		    if (data.length == 0) {
			    html += '<p class="no-concern">아직 고민이 없어요.</p>'
			    $('#btnMore').hide()
		    } else {
			   $.each(data, function(index, item) {
				    html += '<a class="post" href="result.html?idx=' + item.idx + '">'
				    html += '    <h5>' + item.concern + '</h5>'
				    html += '    <p>' + item.gpt_result + '</p>'
				    html += '    <div class="details">'
				    html += '        <span>' + item.nickname + ' <i>|</i> ' + toHumanize(item.reg_date) + '</span>'
				    html += '        <div>'
				    html += '            <span>👁️ <i>' + toNumber(item.view_count) + '</i> 회</span>'
				    html += '            <span>👍 <i>' + toNumber(item.gaeup_count) + '</i> 개</span>'
				    html += '            <span>💬 <i>' + toNumber(item.reply_count) + '</i> 개</span>'
				    html += '        </div>'
				    html += '    </div>'
				    html += '</a>'
			    })
			    $('#btnMore').off().on('click', function() {
				    if ($('body.concern').length == 1) {
					    window.location.href = 'list.html?idx='+data[0].concern_idx
				    } else {
					    getConcernList(concernIdx)
				    }
			    })
		    }
		    $('#commentList').html($('#commentList').html() + html)
	        concernFrom = concernFrom + concernTotal
		}
	})
}

/**
 * Result
 */
if ($('body.result').length == 1) {
	setUserName($('#nickname'))
	var concernResultIdx = getQueryParams().idx
	var concernIdx
	$.ajax({
	    url: './api/service.php',
	    method: 'POST',
	    dataType: 'json',
	    data: {
		    action: 'concern_result',
		    concern_result_idx: concernResultIdx
	    },
	    success: function(data) {
		    if (data.length == 0) {
			    return location.href = './'
		    }
		    var info = '작성자: ' + data[0].nickname + ' | 조회수: ' + toNumber(data[0].view_count) + '회 | ' + toHumanize(data[0].reg_date)
		    var more = '<a href="./list.html?idx=' + data[0].concern_idx + '">고민 더보기</a>'
		    var result = {
				concern_idx: data[0].concern_idx,
				concern_result_idx: concernResultIdx
			}
			var concern = truncateString(data[0].concern, 50)
	        var line = '\n-----------------\n'
	        var gpt_result = data[0].gpt_result
	        var shareUrl = 'https://www.gaeyou.com/gpt/result.html?idx=' + concernResultIdx
	        
			if (checkToStorage("concernResult", result)) {
				info += ' | <span id="deleteConcern" data-concern-idx="' + data[0].concern_idx + '" data-result-idx="' + concernResultIdx + '">삭제</span>'
			}
		    $('#info').html(info)
	        $('#title').html(data[0].title + more)
	        $('#concern').html(replaceReturn(data[0].concern))
	        $('#gpt_result').html(replaceReturn(data[0].gpt_result))
	        $('#thumnail').attr('src', data[0].thumnail).attr('alt', data[0].title)
	        $('#gaeup_count i').html(toNumber(data[0].gaeup_count))
	        $('#gaedown_count i').html(toNumber(data[0].gaedown_count))
	        $('#ask').attr('href', './concern.html?idx=' + data[0].concern_idx)
	        $('#toList').attr('href', './list.html?idx=' + data[0].concern_idx)
	        concernIdx = data[0].concern_idx
	        
	        // 공유 (2026-10-24): X·쓰레드·폰 공유창 (예전 X·카톡 버튼). 공유 수 기록 뒤 같은 창에서 이동, 폰 공유창은 바로
	        $('#gptShare [data-share]').on('click', function() {
	        	var media = $(this).attr('data-share')
	        	var shareText = concern + line + gpt_result
	        	gyTrack('share', { method: media }, { beacon: true })
	        	var go = function () {
	        		var img = data[0].thumnail ? (data[0].thumnail.indexOf('//') === 0 ? 'https:' + data[0].thumnail : data[0].thumnail) : ''
	        		GaeyouGnb.share(media, { title: data[0].title, text: media == 'twitter' ? shareText + '\n#깨유고민상담소 #chatGPT' : shareText, url: shareUrl, image: img, button: '답변 보기' })
	        	}
	        	var instant = media == 'native' || media == 'kakao' || media == 'copy'
	        	if (instant) go()
		        $.ajax({
				    url: './api/service.php',
				    method: 'POST',
				    dataType: 'json',
				    data: {
					    action: 'result_share',
					    flag: media == 'twitter' ? 'twitter' : media,
					    concern_idx: data[0].concern_idx,
					    concern_result_idx: concernResultIdx
				    },
				    complete: function() {
					    if (!instant) go()
				    }
				})
	        })
	        /* 예전 X 버튼 (2026-10-24 바꿈)
	        $('#shareTwitter').on('click', function() {
	        	gyTrack('share', { method: 'twitter' }, { beacon: true })
		        $.ajax({
				    url: './api/service.php',
				    method: 'POST',
				    dataType: 'json',
				    data: {
					    action: 'result_share',
					    flag: 'twitter',
					    concern_idx: data[0].concern_idx,
					    concern_result_idx: concernResultIdx
				    },
				    success: function() {
					    var text = encodeURIComponent(concern + line + gpt_result);
			            var url = encodeURIComponent(shareUrl);
			            var hashtags = encodeURIComponent('깨유고민상담소,chatGPT');
			            var twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
			
			            window.open(twitterUrl, '_blank');					}
				})
		        
	        })
	        */
	        $('#shareKakaotalk').on('click', function() {
	        	gyTrack('share', { method: 'kakaotalk' }, { beacon: true })
		        $.ajax({
				    url: './api/service.php',
				    method: 'POST',
				    dataType: 'json',
				    data: {
					    action: 'result_share',
					    flag: 'kakao',
					    concern_idx: data[0].concern_idx,
					    concern_result_idx: concernResultIdx
				    },
				    success: function() {
					    Kakao.init('eaed55751e121f59b09594ba64fa7558');
				        Kakao.Link.sendDefault({
			                objectType: 'feed',
			                content: {
			                    title: concern,
			                    description: gpt_result,
			                    imageUrl: 'http:'+data[0].thumnail,
			                    link: {
			                        mobileWebUrl: shareUrl,
			                        webUrl: shareUrl
			                    }
			                },
			                buttons: [{
		                        title: 'Open',
		                        link: {
		                            mobileWebUrl: shareUrl,
		                            webUrl: shareUrl
		                        }
		                    }]
			            });
					}
				})
	        })
	        
	        $('#deleteConcern').on('click', function() {
		        var concernIdx = $(this).data('concern-idx')
		        var resultIdx = $(this).data('result-idx')
		        var result = {
					concern_idx: concernIdx+'',
					concern_result_idx: resultIdx+''
				}
				if (!checkToStorage("concernResult", result)) {
					return
				}
				if (confirm('정말 삭제하세요?')) {
					$.ajax({
					    url: './api/service.php',
					    method: 'POST',
					    dataType: 'json',
					    data: {
						    action: 'concern_delete',
						    concern_result_idx: resultIdx,
						    concern_idx: concernIdx
					    },
					    success: function(data) {
						    removeToStorage("concernResult", result)
						    alert('고민을 삭제했어요.\n꼭 고민이 해결되었기를 바라요.')
						    location.href = './'
					    }
					});
				}
	        })
	        
	        $('#gaeup_count')
	        	.on('click', function() {
		        	if (getGaeupIdx(concernResultIdx)) {
			        	$.ajax({
						    url: './api/service.php',
						    method: 'POST',
						    dataType: 'json',
						    data: {
							    action: 'concern_gaeup',
							    concern_result_idx: concernResultIdx,
							    concern_idx: concernIdx
						    },
						    success: function(data) {
							    //console.log(data);
						        $('#gaeup_count i').html(toNumber(data.gaeup_count))
						        gyTrack('concern_like', { kind: 'up' })
						    }
						});
		        	} else {
			        	alert('이미 깨업 했습니다.')
		        	}
	        	})
	        
	        $('#gaedown_count')
	        	.on('click', function() {
		        	if (getGaedownIdx(concernResultIdx)) {
			        	$.ajax({
						    url: './api/service.php',
						    method: 'POST',
						    dataType: 'json',
						    data: {
							    action: 'concern_gaedown',
							    concern_result_idx: concernResultIdx,
							    concern_idx: concernIdx
						    },
						    success: function(data) {
							    //console.log(data);
						        $('#gaedown_count i').html(toNumber(data.gaedown_count))
						        gyTrack('concern_like', { kind: 'down' })
						    }
						});
					} else {
						alert('이미 깨따 했습니다.')
					}
	        	})
	        
	        // 댓글가져오기
	        $.ajax({
			    url: './api/service.php',
			    method: 'POST',
			    dataType: 'json',
			    data: {
				    action: 'comment_list',
				    concern_result_idx: concernResultIdx,
				    concern_idx: concernIdx
			    },
			    success: function(data) {
				    // console.log(data);
			        var html = ''
			        if (data.length > 0) {
						$.each(data, function(index, item) {
							var replyInfo = {
							    concernIdx: item.concern_idx+'',
							    concernResultIdx: item.result_idx+'',
							    commentIdx: item.idx+''
						    }
						    html += '<div class="post">'
						    html += '    <p class="comment">' + replaceReturn(item.content) + '</p>'
						    html += '    <div class="details">'
						    html += '        <span>' + item.nickname + ' <i>|</i> ' + toHumanize(item.reg_date)
						    if (checkToStorage('concernComment', replyInfo)) {
								html += ' | <a data-delete-comment="' + item.idx + '" data-concern="' + item.concern_idx + '" data-result="' + item.result_idx + '">삭제</a>'
						    }
						    html += '</span>'
						    html += '        <div>'
						    html += '            <span data-gaeup="UP" data-comment="' + item.idx + '" data-concern="' + item.concern_idx + '" data-result="' + item.result_idx + '">👍 <i>' + toNumber(item.gaeup_count) + '</i> 개</span>'
						    html += '            <span data-gaeup="DOWN" data-comment="' + item.idx + '" data-concern="' + item.concern_idx + '" data-result="' + item.result_idx + '">👎 <i>' + toNumber(item.gaedown_count) + '</i> 개</span>'
						    html += '        </div>'
						    html += '    </div>'
						    html += '</div>'
					    })
					    $('#noComment').hide()
					    $('#commentList').html(html)
					    
					    // 댓글 삭제
					    $('[data-delete-comment]').on('click', function() {
						    var commentIdx = $(this).data('delete-comment')
						    var concernIdx = $(this).data('concern')
						    var resultIdx = $(this).data('result')
						    var replyInfo = {
							    concernIdx: concernIdx+'',
							    concernResultIdx: concernResultIdx+'',
							    commentIdx: commentIdx+''
						    }
						    if (!checkToStorage('concernComment', replyInfo)) {
							    return alert('삭제할 수 없습니다.')
						    }
						    if (confirm('정말 삭제하실거에요?')) {
							    showProgress()
							    $.ajax({
								    url: './api/service.php',
								    method: 'POST',
								    dataType: 'json',
								    data: {
									    action: 'delete_comment',
									    concern_result_idx: concernResultIdx,
										concern_idx: concernIdx,
										comment_idx: commentIdx
								    },
								    success: function(data) {
									    removeToStorage('concernComment', {
										    concernIdx: concernIdx+'',
										    concernResultIdx: concernResultIdx+'',
										    commentIdx: commentIdx+''
									    })
									    location.reload()
								    }
								});
						    }
					    })
					    
					    // 댓글 깨업
					    $('[data-gaeup]').on('click', function() {
						    var flag = $(this).data('gaeup')
						    var $target = $(this).find('i')
						    var commentIdx = $(this).data('comment')
						    var concernIdx = $(this).data('concern')
						    var resultIdx = $(this).data('result')
						    var replyInfo = {
							    concernIdx: concernIdx+'',
							    concernResultIdx: concernResultIdx+'',
							    commentIdx: commentIdx+''
						    }
						    if (flag == 'UP') {
							    if (checkToStorage('concernComment_UP', replyInfo)) {
								    return alert('이미 깨업했습니다.')
							    }
						    } else if (flag == 'DOWN') {
							    if (checkToStorage('concernComment_DOWN', replyInfo)) {
								    return alert('이미 깨따했습니다.')
							    }
						    }
						    
						    showProgress()
						    $.ajax({
							    url: './api/service.php',
							    method: 'POST',
							    dataType: 'json',
							    data: {
								    action: 'comment_gaeup',
								    concern_result_idx: concernResultIdx,
									concern_idx: concernIdx,
									comment_idx: commentIdx,
									flag: flag
							    },
							    success: function(data) {
								    addToStorage('concernComment_'+flag, replyInfo)
								    if (data.gaeup_count) {
									    $target.html(toNumber(data.gaeup_count))
								    }
								    if (data.gaedown_count) {
									    $target.html(toNumber(data.gaedown_count))
								    }
								    hideProgress()
								    //location.reload()
								    //console.log(data);
							    }
							});
					    })
				    }
			    }
			});
			
	        $('#btnComment').on('click', function() {
				var nickname = $('#nickname').val()
				var content = $('#content').val()
				if (!nickname) {
			        return alert('닉네임을 입력하세요.')
		        }
				if (!content) {
			        return alert('고민을 같이 해결해주세요.')
		        }
		        showProgress()
		        
		        $.ajax({
				    url: './api/service.php',
				    method: 'POST',
				    dataType: 'json',
				    data: {
					    action: 'add_comment',
					    concern_result_idx: concernResultIdx,
						concern_idx: concernIdx,
						nickname: nickname,
						content: content
				    },
				    success: function(data) {
					    gyTrack('comment_add', {}, { next: true })
					    addToStorage('concernComment', {
						    concernIdx: concernIdx+'',
						    concernResultIdx: concernResultIdx+'',
						    commentIdx: data.id+''
					    })
					    location.reload()
					    //console.log(data);
				    }
				});
			})
	    }
	});
}


/**
 * getQueryParams
 */
function getQueryParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var regex = /([^&=]+)=([^&]*)/g;
    var m;

    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

function setUserName($uname) {
	var uname = localStorage.getItem('uname')
    if (uname) {
        $uname.val(uname)
    }
    $uname.on('keyup', function() {
	    localStorage.setItem('uname', $(this).val())
    })
}
function addToStorage(key, value) {
	var savedData = localStorage.getItem(key)
	if (!savedData) {
        savedData = '[]'
    }
    savedData = JSON.parse(savedData)
    savedData.push(value)
    localStorage.setItem(key, JSON.stringify(savedData))
}
function removeToStorage(key, value) {
	var savedData = localStorage.getItem(key)
	if (!savedData) {
        savedData = '[]'
    }
    savedData = JSON.parse(savedData)
    $.each(savedData, function(index, savedItem) {
	    if (compareJSON(savedItem, value)) {
		    savedData.splice(index, 1)
	    } 	
    })
    localStorage.setItem(key, JSON.stringify(savedData))
}
function checkToStorage(targetKey, targetValue) {
	var savedData = localStorage.getItem(targetKey)
	var isEqual = false
	if (!savedData) {
        savedData = '[]'
    }
    savedData = JSON.parse(savedData)
    $.each(savedData, function(savedIndex, savedItem) {
		isEqual = compareJSON(savedItem, targetValue) 	
    })
    return isEqual
}
function compareJSON(obj1, obj2) {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (var i = 0; i < keys1.length; i++) {
        var key = keys1[i];
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}
function getGaeupIdx(concernIdx) {
	var concern_gaeup = localStorage.getItem('concern_gaeup')
	concern_gaeup = JSON.parse(concern_gaeup) || []
	if (concern_gaeup) {
		if (concern_gaeup.includes(concernIdx)) {
			return false
		} else {
			concern_gaeup.push(concernIdx)
			localStorage.setItem('concern_gaeup', JSON.stringify(concern_gaeup))
			return true
		}
	}
}
function getGaedownIdx(concernIdx) {
	var concern_gaedown = localStorage.getItem('concern_gaedown')
	concern_gaedown = JSON.parse(concern_gaedown) || []
	if (concern_gaedown) {
		if (concern_gaedown.includes(concernIdx)) {
			return false
		} else {
			concern_gaedown.push(concernIdx)
			localStorage.setItem('concern_gaedown', JSON.stringify(concern_gaedown))
			return true
		}
	}
}

function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    } else {
        return str;
    }
}
function toNumber(count) {
	return parseInt(count).toLocaleString()
}
function toHumanize(date) {
	moment.locale('ko');
	return moment(date).fromNow()
}
function showProgress() {
	$('.progress').removeClass('d-none')
	$('body').addClass('no-scroll')
}
function hideProgress() {
	$('.progress').addClass('d-none')
	$('body').removeClass('no-scroll')
}
function replaceReturn(content) {
	return content.replace(/\n/g, '<br>')
}
function replaceReturnNewline(content) {
	return content.replace(/\r?\n/g, '\\n')
}































