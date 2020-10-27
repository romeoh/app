//https://cdnjs.cloudflare.com/ajax/libs/js-signals/1.0.0/js-signals.min.js
//https://cdnjs.cloudflare.com/ajax/libs/crossroads/0.9.0/dist/crossroads.min.js
//https://cdnjs.cloudflare.com/ajax/libs/hasher/1.1.0/hasher.min.js


define([
   "https://romeoh.github.io/app/js/mbti/ko/js/animation.js"
  ,"https://romeoh.github.io/app/js/mbti/ko/js/utils.js"
  ,"https://romeoh.github.io/app/js/mbti/ko/data/questions.js"
  ,"https://romeoh.github.io/app/js/mbti/ko/js/signals.js"
  ,"hasher"
  ,"https://romeoh.github.io/app/js/mbti/ko/js/crossroads.js"
  ,"https://romeoh.github.io/app/js/mbti/ko/data/description.js"
  ,"https://cdn.jsdelivr.net/npm/sharer.js@latest/sharer.min.js"
  //,""
], function(slide, utils, questions, signals, hasher, crossroads, description) {
  var hasTouch = 'ontouchstart' in window,
      resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
      startEvent = hasTouch ? 'touchstart' : 'mousedown',
      moveEvent = hasTouch ? 'touchmove' : 'mousemove',
      endEvent = hasTouch ? 'touchend' : 'mouseup',
      cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';
  
  var categoryName = {
        'ENTJ': '엔티제',
        'ENTP': '엔팁',
        'INTJ': '인티제',
        'INTP': '인팁',
        'ENFP': '엔프피',
        'ENFJ': '엔프제',
        'INFP': '인프피',
        'INFJ': '인프제',
        'ESTJ': '엣티제',
        'ESFJ': '엣프제',
        'ISTJ': '잇티제',
        'ISFJ': '잇프제',
        'ESTP': '엣팁',
        'ESFP': '엣프피',
        'ISTP': '잇팁',
        'ISFP': '잇프피'
      }
  var TOTAL_QUESTIONS = questions.questions.length;
  
  var DATA_NAMESPACE = "questionnaire";
  var nickname = localStorage.getItem('uname') || ''
  var user_id = localStorage.getItem('user_id') || ''
  var shouldGetBitly = false
  var content
  var apiUrl = '../api/v1/share.php'
  
  if (!user_id) {
    user_id = new Date().getTime()
    localStorage.setItem('user_id', user_id)
  }
  $('#nickname').val(nickname).on('change', function() {
    localStorage.setItem('uname', $(this).val())
  })

  $('#showResult').on('click', function() {
    shouldGetBitly = true
    //location.hash = '#/results'
    location.href='result.html#/results'
  })

  function getPercentage(number) {
    return Math.round( ( number / 30 ) * 100 );
  }
  function getPercentageProgress(number) {
    var percentTage = Math.round( ( number / 30 ) * 100 )
      , percentPrev = Math.round( ( number / 30 ) * 10 )
      , percentNext = 10 - percentPrev
      , str = ''
    
    for (var i=0; i<percentPrev; i++) {
      str += '■'
    }
    for (var i=percentPrev; i<10; i++) {
      str += '□'
    }
    str += ' ' + percentTage + '%'
    return str
  }
  
  function getTitle(metric) {
    var degree = {
      e: '외향적',
      i: '내성적',
      n: '직관적',
      s: '현실주의',
      f: '감각주의',
      t: '이성적사고',
      p: '자기주장형',
      j: '신중형'
    };
    return degree[metric]
  }

  function getPercentages(metrics) {
    var percentages = [];
    for (var metric in metrics) {
      if (metrics.hasOwnProperty(metric)) {
        percentages.push( {
          title: getTitle(metric),
          percentage: getPercentage(metrics[metric])
        });
      }
    }
    
    return percentages;
  }
  
  function toggleToolbarControls(shouldShow) {
    var $controls = $(".toolbar-controls");
    if (shouldShow) {
      $controls.show();
    } else {
      $controls.hide();
    }
  }
  
  function getCurrentLetterIndex(index, letter) {
    var degree = {
      e: 0,
      i: 10,
      n: 30,
      s: 20,
      f: 50,
      t: 40,
      p: 70,
      j: 60
    };
    
    degree = degree[letter];
    
    return parseFloat(index) - degree;
  }
  
  function setQuestionHash(id) {
    hasher.setHash("questions/"+id);
  }
  
  function getStringResults(metrics) {
    var map = {
      e: '외향적', //"Extraversion",
      i: '내성적', //"Introversion",
      n: '직관적', //"Intuition",
      s: '현실주의', //"Sensing",
      f: '감각주의', //"Feeling",
      t: '이성적사고', //"Thinking",
      p: '자기주장형', //"Perception",
      j: '신중형' //"Judging"
    };
    
    var result = "";
    
    for (var metric in metrics) {
      if (metrics.hasOwnProperty(metric)) {
        //result += map[metric] +": "+ getPercentage( metrics[metric] ) +"%0D%0A";
        result += map[metric] +": "+ getPercentageProgress( metrics[metric] ) +"\n";
      }
    }
    
    return result;
  }
  
  function showDescription(type, flag) {
    return description[type][flag]
  }

  function initShare(metricsJson, type, nickname) {
    // if (localStorage.getItem('shouldSaveMbti')) {
    //   localStorage.setItem('shouldSaveMbti', 'Y')
    //   location.href = 'result.html#/results'
    //   return;
    // }
    var settings = {
      "url": apiUrl,
      "method": "POST",
      "data": {
        flag: 'insert_mbti',
        uname: nickname,
        user_id: user_id,
        metrics: metricsJson,
        type: type,
        lang: 'ko'
      },
    };
    shouldGetBitly = false

    if (location.pathname.indexOf('question.html') != -1) {
      $.ajax(settings).done(function (res) {
        var result = JSON.parse(res)
        localStorage.setItem('shouldSaveMbti', 'Y')
        localStorage.setItem('mbtiResult', result)
        localStorage.setItem('mbti', type)
        location.href = 'result.html#/results'
        shareMyUrl(result)
      });
    }
  }

  function shareMyUrl(result) {
    setTimeout(function() {
      localStorage.removeItem('shouldSaveMbti')
      //result = JSON.parse(result)
      if (!result) {
        return
      }
      var shortUrl = 'https://gaeyou.com/mbti/ko/?metric=' + result
      var resultString = content.nickname + '님의 MBTI 성격유형은 ' + content.type + '\n'
      var title = content.nickname + '님의 MBTI 결과입니다.'
      //console.log(content.nickname, content.type)
      $('[data-url]').attr('data-url', shortUrl)
      $('[data-title]').attr('data-title', resultString + content.results)
      $('[data-caption]').attr('data-caption', title)
      $('[data-subject]').attr('data-subject', title)
      $('[data-twitter]').attr('data-title', resultString + content.results.substring(0, 101) + '...\n' + shortUrl)
      
      window.Sharer.init();

      $('[data-sharer-extend]').on('click', function() {
        var sharer = $(this).attr('data-sharer-extend')
        if (!Kakao.isInitialized()) {
          Kakao.init('eaed55751e121f59b09594ba64fa7558')
        }
        var DefaultFeedSettings = {
          objectType: 'feed',
          content: {
            title: title,
            description: resultString + content.results,
            imageUrl:'',
            link: {
              mobileWebUrl: shortUrl,
              androidExecParams: '',
            },
          },
          social: {},
          buttons: [
            {
              title: '웹으로 이동',
              link: {
                mobileWebUrl: shortUrl,
              },
            },
          ],
          success: function(response) {
            console.log(response);
          },
          fail: function(error) {
            console.log(error);
          }
        }
        if (sharer == 'kakaostory') {
          Kakao.Story.share({
            url: shortUrl,
            text: resultString + content.results + '\n' + shortUrl
          });
        } else if (sharer == 'kakaotalk') {
          Kakao.Link.sendDefault(DefaultFeedSettings);
        }
      })
    }, 500)
  }

  function shareUrl() {
    setTimeout(function() {
      var resultString = content.nickname + '님의 MBTI 성격유형은 ' + content.type + '\n'
      var title = content.nickname + '님의 MBTI 결과입니다.'
      //console.log(content.nickname, content.type)
      $('[data-url]').attr('data-url', 'https://gaeyou.com/mbti/ko/')
      $('[data-title]').attr('data-title', resultString + content.results)
      $('[data-caption]').attr('data-caption', title)
      $('[data-subject]').attr('data-subject', title)
      $('[data-twitter]').attr('data-title', resultString + content.results.substring(0, 102) + '...\n' + 'https://gaeyou.com/mbti/ko/')
      
      window.Sharer.init();

      $('[data-sharer-extend]').on('click', function() {
        var sharer = $(this).attr('data-sharer-extend')
        if (!Kakao.isInitialized()) {
          Kakao.init('eaed55751e121f59b09594ba64fa7558')
        }
        var DefaultFeedSettings = {
          objectType: 'feed',
          content: {
            title: title,
            description: resultString + content.results,
            imageUrl:'',
            link: {
              mobileWebUrl: 'https://gaeyou.com/mbti/ko/',
              androidExecParams: '',
            },
          },
          social: {},
          buttons: [
            {
              title: '웹으로 이동',
              link: {
                mobileWebUrl: 'https://gaeyou.com/mbti/ko/',
              },
            },
          ],
          success: function(response) {
            console.log(response);
          },
          fail: function(error) {
            console.log(error);
          }
        }
        if (sharer == 'kakaostory') {
          Kakao.Story.share({
            url: 'https://gaeyou.com/mbti/ko/',
            text: resultString + content.results + '\n' + 'https://gaeyou.com/mbti/ko/'
          });
        } else if (sharer == 'kakaotalk') {
          Kakao.Link.sendDefault(DefaultFeedSettings);
        }
      })
    }, 500)
  }
//{"e":[1,2,2,null,2,null,2,2,null,2],"i":[null,2,null,2,null,2,0,2,null,1],"n":[null,1,null,2,null,2,null,2,2,null],"s":[null,1,null,1,null,1,null,1,null,1],"f":[2,2,null,1,null,0,null,2,null,2],"t":[2,null,2,null,2,null,2,null,1,null],"p":[2,1,1,null,1,null,1,null,2,null],"j":[null,2,null,2,null,1,1,2,1,null]}
  function getType(data) {
    var type = "";
    if (data.e > data.i) {
      type += "e";
    } else {
      type += "i";
    }
    
    if (data.n > data.s) {
      type += "n";
    } else {
      type += "s";
    }
    
    if (data.t > data.f) {
      type += "t";
    } else {
      type += "f";
    }
    
    if (data.j > data.p) {
      type += "j";
    } else {
      type += "p";
    }
    
    return type.toUpperCase();
  }

  var Q = function() {
    // TODO use hasher and crossroads
    var metric = location.search.indexOf('?metric=')
    if (metric == 0) {
      var settings = {
        "url": apiUrl,
        "method": "POST",
        "data": {
          flag: 'get_mbti',
          idx: location.search.replace('?metric=', '')
        },
      };
      shouldGetBitly = false

      $.ajax(settings).done(function (res) {
        var result = JSON.parse(res)[0]
        location.href = '?metrics=' + result.metrics + '&uname=' + result.uname + '&view=' + result.view
      });
      return
    }

    // facebook에서 옴
    // https://gaeyou.com/mbti/ko_/result.html?fbclid=IwAR2KzscZqPn5O4YcSBkAVa41v6TQk7zm5rU2FSkBjnRTN1RHwlsp54i8aPk
    // https://gaeyou.com/mbti/ko_/result.html#/results
    if (location.pathname.indexOf('result.html') != -1) {
      if (location.hash != '#/results') {
        return location.href = './'
      }
    }
    var url = window.location.href;
    var index = url.lastIndexOf("?metrics=");
    var that = this;
    var savedData = localStorage.getItem(DATA_NAMESPACE);
    
    this.itemCount = 0;
    
    this.$currentSlide = [];
    
    this.counter = {
      current: $("#count-current"), 
      total: $("#count-total"),
      wrapper: $("#counter")
    };
        
    this.counter.total.text(TOTAL_QUESTIONS);
    
    // TODO Use crossroads to route this.
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (index > 0) {
      var data = window.location.href.substring(index+9, window.location.href.length);
      params = data.split('&')
      data = params[0].replace(/%22/g, '"').replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%5B/g, '[').replace(/%5D/g, ']')
      data = JSON.parse(data);
      this.userMetrics = data;
      if (params[1]) {
        this.userName = decodeURIComponent(params[1].replace('uname=', '').replace('uname1=', '').replace('#/results', ''))
      }
      if (params[2]) {
        this.view = numberWithCommas(decodeURIComponent(params[2].replace('view=', '').replace('#/results', '')))
      }
      this.finish();
    } else if (savedData) {
      this.userMetrics = JSON.parse(savedData);
    } else {
      this.resetMetrics();
    }
    
    var timer = setTimeout(function() {
      window.scrollTo( 0, 1 );
    }, 50);
    
    if (location.hash != '') {
      this.createQuestionnaire(function() {
        that.addRoutes();
      });
    }
    
    this.addEvents();
    
  };
  
  Q.prototype.createQuestionnaire = function(callback) {
    var panel = document.createElement("section");
    var $panel = this.$panel = $(panel);
    var that = this;
    
    $(document.body).append(panel);
        
    utils.render(questions, "assets/partials/question-card.html", function(compiledHTML) {
      $panel.append(compiledHTML);
      that.$questions = $panel.find(".panel");
      
      if (callback) {
        callback();
      }
    });
  };
  
  Q.prototype.addRoutes = function() {
    var that = this;
    
    crossroads.addRoute('/questions/{id}', function(id){
      if ( (this.itemCount - 1) === id) {
        that.prev();
      } else if ( (this.itemCount + 1) === id) {
        that.next();
      } else {
        that.goToQuestion(id);
      }
    });
    
    crossroads.addRoute("", function() {
      toggleToolbarControls(false);

      that.goToSection($("#introduction"));
    });
    
    crossroads.addRoute("results", function() {
      toggleToolbarControls(false);
      that.finish();
    });
    
    //setup hasher
    function parseHash(newHash, oldHash){
      crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); // parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change
  };
  
  Q.prototype.resetMetrics = function() {
    var that = this;
    
    localStorage.removeItem(DATA_NAMESPACE);
    
    this.itemCount = 0;
    
    this.userMetrics = {};
  
    ["e", "i", "n", "s", "f", "t", "p", "j"].forEach(function(letter) {
      that.userMetrics[letter] = [null,null,null,null,null,null,null,null,null,null];
    });
  };
  
  Q.prototype.addEvents = function() {
    var that = this;
    var $body = $("body");
    
    $body.on(endEvent, ".panel li", function() {
      var $this = $(this);
      var letterType = that.$currentSlide.attr("data-type");
      
      var letterArrayIndex = getCurrentLetterIndex(  that.$currentSlide.index(), letterType  );

      that.userMetrics[letterType][letterArrayIndex] = $this.index();
      
      // TODO: Should do this via an event
      that.save();
      
      $this.siblings().removeClass("highlighted");
      
      $this.addClass("highlighted");
      
      var timer = setTimeout(function() {
        if (that.itemCount === that.$panel.children().length) {
          that.finish();
        } else {
          that.next();
        }
      }, 300);
    });
        
    $body.on(endEvent, "#start", function() {
      var nickname = localStorage.getItem('uname') || $('#nickname').val()
    
      if (!nickname) {
        return alert('이름을 입력하세요.')
      }
      location.href='question.html#/questions/0'
      //that.start();
    });
    
    $(window).bind("unload", function() {
      that.removeEvents();
    });
    
    $(".out").live("webkitTransitionEnd", function() {
      $(this).css("display", "none");
    });
    $(".in").live("webkitTransitionEnd", function() {
      $(this).css("display", "block");
    });
    
    $body.on(endEvent, "#mockResults", function() {
      that.mockResults();
    });
    
    $body.on(endEvent, "#startOver", function() {
      location.href='./'
      /*
      that.resetMetrics();
      $(".s-*").attr("class", "");
      that.$questions.find(".highlighted").removeClass("highlighted");
      hasher.setHash("");
      that.goToSection($("#introduction"));
      */
    });
  };
  
  Q.prototype.removeEvents = function() {
    $("body").off(endEvent);
  };
  
  Q.prototype.start = function(callback) {
    var that = this;
    toggleToolbarControls(true);

    $('.progress.step').css('visibility', 'visible')
    
    setQuestionHash(this.itemCount);
    
    return this.goToSection(this.$panel);
  };
  
  Q.prototype.goToQuestion = function(number) {
    var letter, currentPoint, currentQuestionIndex;

    if (TOTAL_QUESTIONS <= (parseFloat(number))) {
      shouldGetBitly = true
      return this.finish();
    }
    this.itemCount = number;
    if (this.$currentSection !== this.$panel) {
      this.start();
    }
    this.transition(this.$questions.eq(number), this.$currentSlide);

    // To highlight an already chosen answer
    if (this.$currentSlide.length) {
      letter = this.$currentSlide.attr("data-type");
      
      currentQuestionIndex = getCurrentLetterIndex(number, letter);
      currentPoint = this.userMetrics[ letter ][ currentQuestionIndex ];
  
      if (currentPoint !== null && typeof currentPoint !== "undefined") {      
        var $questions = this.$currentSlide.find(".form li");
        $questions.eq(currentPoint).addClass("highlighted");
      }
    }
  };
  
  Q.prototype.next = function() {        
    var $outgoing = this.$currentSlide,
        $incoming = $outgoing.next();
    
    if (TOTAL_QUESTIONS === this.itemCount+1) {
      shouldGetBitly = true
      return this.finish();
    }
    
    this.itemCount++;
    
    setQuestionHash(this.itemCount);
    
  //  this.transition($incoming, $outgoing);
  };
  
  Q.prototype.previous = function() {    
    var $outgoing = this.$currentSlide,
        $incoming = $outgoing.prev();
    
    if (this.itemCount > 0) {
      this.itemCount--;
    }
    
    if (!$incoming.length) {
      toggleToolbarControls(false);
      this.goToSection($("#introduction"));
    } else {
      setQuestionHash(this.itemCount);
    }

  //  this.transition($incoming, $outgoing, "reverse");
  };
  
  /* Change Questions */
  Q.prototype.transition = function($incoming, $outgoing, direction) {
    var outClass = "s-out";
    var inClass = (direction === "reverse") ? "s-in-reverse" : "s-in";
    
    /*  TODO: Use events instead  */
    this.updateCounter();
    
    $incoming.addClass("slide-current");
    
    if ($outgoing && $outgoing.length && $outgoing[0] !== $incoming[0]) {
      $outgoing.removeClass("slide-current");
      $outgoing.find("h2").fadeOut();
      slide($outgoing, outClass);
    }

    $incoming.find("h2").fadeIn();


    slide($incoming, inClass);
        
    this.$currentSlide = $incoming;
  };
  var shareFinish = true
  Q.prototype.finish = function() {
    var that = this;
    var computedMetrics = [];
    $('.progress.step').css('visibility', 'hidden')
    // TODO Move out into a helper
    
    if (location.hash.indexOf('#/questions/') == 0) {
      localStorage.setItem('shouldSaveMbti', 'Y')
    }
    for (var letter in this.userMetrics) {
      var letterArray = this.userMetrics[letter];
      var totalPoints = 0;
      
      
      letterArray.forEach(function(point) {
        if (point !== null) {
          totalPoints += parseFloat(point);
        }
      });
      
      computedMetrics[letter] = totalPoints;
    }
    
    //console.log('finish')
    var percentages = getPercentages(computedMetrics);
    var type = getType(computedMetrics);
    var typeString = categoryName[type]
    var stringResults = getStringResults(computedMetrics);
    var metricsJson = JSON.stringify(this.userMetrics);
    var nickname = this.userName || localStorage.getItem('uname')
    var viewCount = this.view
    var mbtiType = showDescription(type, 'type')
    var description = showDescription(type, 'description')
    //var people = showDescription(type, 'people')
    
    var settings = {
        "url": apiUrl,
        "method": "POST",
        "data": {
            flag: 'get_people_list',
            type: type
        },
    };
    $.ajax(settings).done(function (res) {
      var res = JSON.parse(res)
      console.log(res)
       toggleToolbarControls(false);

        content = {
          percentages: percentages,
          mbtiType: mbtiType,
          results: stringResults,
          metricsJson: metricsJson,
          nickname: nickname,
          type: type,
          typeString: typeString,
          viewCount: viewCount,
          mbtiType: mbtiType,
          description: description,
          people: res
        };
        
        hasher.setHash("results");
        //localStorage.setItem('mbti', type)
        utils.render(content, "assets/partials/final-card.html", function(compiledHTML) {
          setTimeout(function() {
            $('section.out').remove()
            $('.question-ads').remove()
          }, 100)
          var $final = that.$final;
          var $html = $(compiledHTML);
          
          if ($final && $final.length) {
            $final.html( $html.children() );
          } else {
            that.$final = $html;
            $(document.body).append(that.$final);
          }
          
          that.goToSection(that.$final);
        });
        if (shouldGetBitly || localStorage.getItem('mbtiResult')) {
          if (shareFinish) {
            initShare(metricsJson, type, nickname)
            shareFinish = false
          }
        } else {
          shareUrl()
        }
        if (location.hash == '#/results') {
          $('section.out').remove()
          shareMyUrl(localStorage.getItem('mbtiResult'))
        }
        //showDescription() 
    });
  };
  
  // This creates arrays of 10 digits between 0-3 for each of the letters
  Q.prototype.mockResults = function() {
    "einsftpj".split("").forEach(function(letter) {
      var count = 0;
      var score = [];
      while (count < 10) {
        score.unshift(Math.ceil(Math.random() * 3) );
        count++;
      }
      
      this.userMetric[letter] = score;
    });
    
    this.finish();
  };
  
  Q.prototype.updateCounter = function() {
    var current = parseFloat(this.itemCount)+1
       ,percent = Math.floor(current/80 * 100)
    this.counter.current.text(current);
    $('.progress-bar').css('width', percent+'%').text('')
    if (percent > 4) {
      $('.progress-bar').text(percent+'%')
    }
  };
  
  Q.prototype.goToSection = function($section) {
    $("body > section").addClass("out").removeClass("in");
    $section.show().addClass("in").removeClass("out");
    this.$currentSection = $section;
  };
  
  Q.prototype.save = function() {
    localStorage.setItem( DATA_NAMESPACE, JSON.stringify( this.userMetrics ) );
  };
  
  return window.q = new Q();

});