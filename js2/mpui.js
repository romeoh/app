(function(x,c,e,f){var m="ontouchstart"in e||!1,p=m?"touchmove":"mousemove",q=m?"touchend":"mouseup";Mui=function(a){return new Mui.fn.init(a)};Mui.fn=Mui.prototype={init:function(a){e.isMobile||(e.isMobile="pc"!==Mui.browser().device);if(!a)return this;if("string"===typeof a)return this.selector=c.querySelectorAll(a),Mui.selector=a,Mui.that=this,this;if("object"===typeof a)return this.selector=c.querySelectorAll(a.nodeName),Mui.that=this,this},addClass:function(a){selector=this.selector;for(var b=
0;b<selector.length;b++)if(""!=a){if(!selector[b].classList){selector[b].className=selector[b].className+" "+a;break}selector[b].classList.add(a)}return this},removeClass:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)if(""!=a){if(!selector[b].classList){selector[b].className=selector[b].className.replace(a,"");break}selector[b].classList.remove(a)}return this},toggleClass:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)""!=a&&selector[b].classList.toggle(a);
return this},hasClass:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)if(""!=a)return selector[b].classList?selector[b].classList.contains(a):"-1"==selector[b].className.indexOf(a)?!1:!0},css:function(a,b){var d=this.selector,c="",c="";if(b===f){if("clientWidth"==a)return d[0].clientWidth;if("clientHeight"==a)return d[0].clientHeight;if("x"==a)return d=document.defaultView.getComputedStyle(d[0],null).webkitTransform,d=d.substr(7,d.length-8).split(", ")[4],d==f?d="0px":d+="px",
d;if("y"==a)return d=document.defaultView.getComputedStyle(d[0],null).webkitTransform,d=d.substr(7,d.length-8).split(", ")[5],d==f?d="0px":d+="px",d;style=document.defaultView.getComputedStyle(d[0],null);return e.style[a]}for(var g=0;g<d.length;g++){if("scale"==a){c=" scale("+b+") ";d[g].style.webkitTransform=c;break}if("rotate"==a){c=" rotate("+b+") ";d[g].style.webkitTransform+=c;break}"x"==a&&(d[g].style.webkitTransform="translate3d("+b+", 0,0)");"y"==a&&(d[g].style.webkitTransform="translate3d(0, "+
b+", 0)");d[g].style[a]=b}return this},attr:function(a,b){selector=this.selector;if(b==f)return"checked"==a?selector[0].checked:selector[0].getAttribute(a);for(var d=0;d<selector.length;d++)"boolean"==typeof b?eval("selector[i]."+a+" = "+b):"checked"==a?selector[d].checked=b:selector[d].setAttribute(a,b);return this},removeAttr:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)selector[b].removeAttribute(a);return this},val:function(a){selector=this.selector;if(a==f)return selector[0].value;
for(var b=0;b<selector.length;b++)selector[b].value=a;return this},data:function(a,b){selector=this.selector;if(b==f)return selector[0].getAttribute("data-"+a);if("object"===typeof b)for(var d=0;d<selector.length;d++)selector[d].setAttribute("data-"+a,JSON.stringify(b));else if("string"===typeof b||"number"===typeof b)for(d=0;d<selector.length;d++)selector[d].setAttribute("data-"+a,b);return this},html:function(a){selector=this.selector;if(a==f)return selector[0].innerHTML;for(var b=0;b<selector.length;b++)selector[b].innerHTML=
a;return this},text:function(a){selector=this.selector;if(a==f)return selector[0].textContent;for(var b=0;b<selector.length;b++)selector[b].textContent=a;return this},animate:function(a,b){var d="",c=a.time||"1s",g=a.delay||"0s",f=b||null,e=this.selector,t;mpui.browser();for(var r=a.x||this.css("x"),s=a.y||this.css("y"),m=a.z||this.css("z"),p=a.scale||"",q=a.rotate||"",w=""!=a.x?!0:""!=a.y?!0:""!=a.z?!0:""!=a.scale?!0:""!=a.rotate?!0:!1,n=0;n<e.length;n++){for(var u in a){var v=a[u];switch(u){case "scale":p=
" scale("+v+") ";break;case "rotate":q=" rotate("+v+") ";break;case "time":case "delay":break;default:d+=u+":"+v+"; "}}f&&(this.selector[n].callback=f);"static"==document.defaultView.getComputedStyle(this.selector[n],null).position&&(this.selector[n].style.position="relative");d+="-webkit-transition:all "+c+" ease "+g+"; ";w&&(""==r?r=0:r,""==s?s=0:s,""==m?m=0:m,d+="-webkit-transform:translate3d("+r+", "+s+", 0) "+p+q);e[n].style.cssText+=d;e[n].addEventListener("webkitTransitionEnd",this.transEnd=
function(a){t||(t=a,t.currentTarget.style.webkitTransition="",""!==f&&(id="id"+Math.floor(1E9*Math.random())||"",a.currentTarget.setAttribute("data-id",id),f&&(eval(f)(a,M('[data-id="'+id+'"]')),delete a.currentTarget.callback),a.target.removeAttribute("data-id")))},!1)}return this},animateStop:function(){for(var a=this.selector,b=0;b<a.length;b++)a[b].style.webkitTransition="",(callback=a[b].callback)&&eval(callback)(f,a[b].getAttribute("data-id")),a[b].removeEventListener("webkitTransitionEnd",
this.transEnd,!1)},click:function(a,b){selector=this.selector;bubble=b||!1;for(var d=0;d<selector.length;d++)selector[d].that=this,selector[d].bubble=bubble,selector[d].callback||(selector[d].callback=[]),selector[d].callback.push(a),"pc"==M.browser().device?selector[d].addEventListener("mousedown",Mui.prototype.clickHandler,bubble):selector[d].addEventListener("touchstart",Mui.prototype.clickHandler,bubble);return this},clickHandler:function(a){var b;switch(a.type){case "mousedown":case "touchstart":"pc"==
M.browser().device?(a.currentTarget.addEventListener("mouseup",Mui.prototype.clickHandler,a.currentTarget.bubble),a.currentTarget.addEventListener("mousemove",Mui.prototype.clickHandler,a.currentTarget.bubble)):(a.currentTarget.addEventListener("touchend",Mui.prototype.clickHandler,a.currentTarget.bubble),a.currentTarget.addEventListener("touchmove",Mui.prototype.clickHandler,a.currentTarget.bubble));b="id"+Math.floor(1E9*Math.random())||"";a.currentTarget.setAttribute("data-click-event-id",b);this.muiSelector=
'[data-click-event-id="'+b+'"]';this.start=[];"pc"==M.browser().device?this.start=[a.pageX,a.pageY]:this.start=[a.touches[0].pageX,a.touches[0].pageY];break;case "mousemove":case "touchmove":"pc"==M.browser().device?a.currentTarget.removeEventListener("mouseup",Mui.prototype.clickHandler,a.currentTarget.bubble):a.currentTarget.removeEventListener("touchend",Mui.prototype.clickHandler,a.currentTarget.bubble);break;case "mouseup":case "touchend":"pc"==M.browser().device?a.currentTarget.removeEventListener("mouseup",
Mui.prototype.clickHandler,a.currentTarget.bubble):a.currentTarget.removeEventListener("touchend",Mui.prototype.clickHandler,a.currentTarget.bubble);this.end=[];try{this.end=[a.touches[0].pageX,a.touches[0].pageY]}catch(d){this.end=[a.pageX,a.pageY]}eval(a.currentTarget.callback[0])(a,Mui(this.muiSelector));a.currentTarget.removeAttribute("data-click-event-id")}},on:function(a,b,d){var c=this.selector;d=d||!1;for(var g,e=0;e<c.length;e++)c[e].getAttribute("data-eventid")==f&&(g="id"+Math.floor(1E9*
Math.random())||"",c[e].setAttribute("data-eventid",g)),c[e].addEventListener(a,ids=function(a){eval(b)(a,M('[data-eventid="'+a.currentTarget.getAttribute("data-eventid")+'"]'))},d),Mui.eventListener[g]==f&&(Mui.eventListener[g]={}),Mui.eventListener[g][a]=[],Mui.eventListener[g][a].push(ids,d);return this},off:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)Mui.eventListener[selector[b].getAttribute("data-eventid")]!=f&&(selector[b].removeEventListener(a,Mui.eventListener[selector[b].getAttribute("data-eventid")][a][0],
Mui.eventListener[selector[b].getAttribute("data-eventid")][a][1]),delete Mui.eventListener[selector[b].getAttribute("data-eventid")],selector[b].removeAttribute("data-eventid"));return this},focus:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)selector[b].focus(),a&&eval(a)();return this},blur:function(a){selector=this.selector;for(var b=0;b<selector.length;b++)selector[b].blur(),a&&eval(a)();return this},children:function(){for(var a=this.selector[0].childNodes,b="",d=0;d<
a.length;d++)"1"==a[d].nodeType&&(b=b+", "+Mui.selector+" "+a[d].nodeName);b=b.replace(",","");return Mui(b)},parent:function(){return Mui.prototype.traversal(this.selector[0].parentNode)},first:function(){return Mui.prototype.traversal(this.selector[0].firstElementChild)},next:function(){return Mui.prototype.traversal(this.selector[0].nextElementSibling)},last:function(){return Mui.prototype.traversal(this.selector[0].lastElementChild)},prev:function(){return Mui.prototype.traversal(this.selector[0].previousElementSibling)},
find:function(a){this.selector=this.selector[0].querySelectorAll(a);Mui.selector=a;Mui.that=this;return this},traversal:function(a){return""==a.id?(id="id"+Math.floor(1E9*Math.random())||"",a.setAttribute("data-traversalid",id),setTimeout(function(){a.removeAttribute("data-traversalid")},0),Mui('[data-traversalid="'+id+'"]')):Mui("#"+a.id)},append:function(a,b){var d=Mui(Mui.selector);c.createElement(a);d.selector[0].appendChild(Mui.prototype.createElement(a,b));return this},prepend:function(a,b){var d=
Mui(Mui.selector);c.createElement(a);d.selector[0].insertBefore(Mui.prototype.createElement(a,b),d.selector[0].childNodes[0]);return this},before:function(a,b){var d=Mui(Mui.selector),h=d.selector[0].parentElement;c.createElement(a);h.insertBefore(Mui.prototype.createElement(a,b),d.selector[0]);return this},after:function(a,b){var d=Mui(Mui.selector);d.selector[0].parentElement.insertBefore(Mui.prototype.createElement(a,b),d.selector[0].nextSibling);return this},insertAfter:function(a){Mui(Mui.selector).selector[0].parentElement.insertBefore(c.querySelector(Mui.selector),
c.querySelector(a).nextSibling);return this},insertBefore:function(a){Mui(Mui.selector).selector[0].parentElement.insertBefore(c.querySelector(Mui.selector),c.querySelector(a));return this},createElement:function(a,b){var d=c.createElement(a),h;for(h in b)"text"==h?(text=c.createTextNode(b[h]),d.appendChild(text)):0==h.indexOf("data")?d.dataset[h.replace("data-","")]=b[h]:d[h]=b[h];return d},remove:function(){for(var a=Mui(Mui.selector),b=this.selector,a=a.selector[0].parentNode,d=0;d<b.length;d++)a.removeChild(b[d]);
return this},drag:function(a){var b=this.selector;c.dragOption||(c.dragOption={});a||(a={});a=a.handler==f?b:c.querySelectorAll(a.handler);Mui.dragInit.mpSelector=this;e.isMobile?a[0].addEventListener("touchstart",Mui.dragInit,!1):a[0].addEventListener("mousedown",Mui.dragInit,!1);a[0].dragOption=this.drag.arguments[0];a[0].dragOption.target=this.selector;return this},stopDrag:function(){var a=this.selector;e.isMobile?a[0].removeEventListener("touchstart",Mui.dragInit,!1):a[0].removeEventListener("mousedown",
Mui.dragInit,!1);return this}};Mui.eventListener={};Mui.dragInit=function(a){if(a)var b=m?a.touches[0]:a,d=Mui.dragInit.mpSelector;switch(a.type){case "mousedown":case "touchstart":c.dragOption={};a.currentTarget.dragOption||(a.currentTarget.dragOption={});c.dragOption.vertical=a.currentTarget.dragOption.vertical==f?!0:a.currentTarget.dragOption.vertical;c.dragOption.horizon=a.currentTarget.dragOption.horizon==f?!0:a.currentTarget.dragOption.horizon;c.dragOption.scale=a.currentTarget.dragOption.scale==
f?1:a.currentTarget.dragOption.scale;c.dragOption.opacity=a.currentTarget.dragOption.opacity==f?1:a.currentTarget.dragOption.opacity;c.dragOption.css=a.currentTarget.dragOption.css==f?null:a.currentTarget.dragOption.css;c.dragOption.oneway=a.currentTarget.dragOption.oneway==f?!1:a.currentTarget.dragOption.oneway;c.dragOption.left=a.currentTarget.dragOption.left==f?null:a.currentTarget.dragOption.left;c.dragOption.right=a.currentTarget.dragOption.right==f?null:a.currentTarget.dragOption.right;c.dragOption.top=
a.currentTarget.dragOption.top==f?null:a.currentTarget.dragOption.top;c.dragOption.bottom=a.currentTarget.dragOption.bottom==f?null:a.currentTarget.dragOption.bottom;c.dragOption.onStart=a.currentTarget.dragOption.onStart==f?null:a.currentTarget.dragOption.onStart;c.dragOption.onMove=a.currentTarget.dragOption.onMove==f?null:a.currentTarget.dragOption.onMove;c.dragOption.onEnd=a.currentTarget.dragOption.onEnd==f?null:a.currentTarget.dragOption.onEnd;c.dragOption.onCancel=a.currentTarget.dragOption.onCancel==
f?null:a.currentTarget.dragOption.onCancel;Mui.dragInit.target=a.currentTarget.dragOption.target[0];d.length=0;d[0]=Mui.dragInit.target;d.selector=[];d.selector[0]=Mui.dragInit.target;Mui.dragInit.startPos=[];Mui.dragInit.endPos=[];Mui.dragInit.lastPos=[];Mui.dragInit.centerPos=[];Mui.dragInit.firstDirection=null;"static"==d.css("position")&&d.css("position","relative");c.addEventListener(p,Mui.dragInit,!1);c.addEventListener(q,Mui.dragInit,!1);Mui.dragInit.startPos[1]=[b.pageX,b.pageY];Mui.dragInit.startPos[0]=
[parseFloat(d.css("x"))||0,parseFloat(d.css("y"))||0];Mui.dragInit.centerPos[0]=[Mui.dragInit.startPos[0][0]-Mui.dragInit.startPos[1][0]];Mui.dragInit.centerPos[1]=[Mui.dragInit.startPos[0][1]-Mui.dragInit.startPos[1][1]];e.direction=0;e.updown=0;e.startX=Mui.dragInit.startPos[1][0];e.startY=Mui.dragInit.startPos[1][1];1!=c.dragOption.scale&&d.css("scale",c.dragOption.scale);1!=c.dragOption.opacity&&d.css("opacity",c.dragOption.opacity);c.dragOption.css&&d.addClass(c.dragOption.css);c.dragOption.onStart&&
eval(c.dragOption.onStart)(b,d);break;case "mousemove":case "touchmove":var h="",g="";Mui.dragInit.lastPos[1]=Mui.dragInit.endPos[1]!=f?Mui.dragInit.endPos[1]:0;Mui.dragInit.endPos[0]=[parseFloat(d.css("x"))||0,parseFloat(d.css("y"))||0];Mui.dragInit.endPos[1]=[b.pageX,b.pageY];Mui.dragInit.posDirection=Mui.dragInit.endPos[1][0]-Mui.dragInit.lastPos[1][0];Mui.dragInit.posUpdown=Mui.dragInit.endPos[1][1]-Mui.dragInit.lastPos[1][1];e.direction=0<Mui.dragInit.posDirection?1:0>Mui.dragInit.posDirection?
-1:0;e.updown=0<Mui.dragInit.posUpdown?1:0>Mui.dragInit.posUpdown?-1:0;e.distanceX=Mui.dragInit.endPos[1][0]-Mui.dragInit.startPos[1][0];e.distanceY=Mui.dragInit.endPos[1][1]-Mui.dragInit.startPos[1][1];Mui.dragInit.firstDirection||(Math.abs(Mui.dragInit.endPos[1][1]-Mui.dragInit.startPos[1][1])>Math.abs(Mui.dragInit.endPos[1][0]-Mui.dragInit.startPos[1][0])?Mui.dragInit.firstDirection="horizon":Mui.dragInit.firstDirection="vertical",c.dragOption.vertical&&c.dragOption.horizon&&!c.dragOption.oneway&&
(Mui.dragInit.firstDirection="all"));if(c.dragOption.oneway)if("vertical"==Mui.dragInit.firstDirection)a.preventDefault(),b=parseFloat(b.pageX)+parseFloat(Mui.dragInit.centerPos[0]),c.dragOption.left&&c.dragOption.right?parseFloat(c.dragOption.left)<b&&parseFloat(c.dragOption.right)>b&&(h=b+"px"):c.dragOption.left?parseFloat(c.dragOption.left)<b&&(h=b+"px"):c.dragOption.right?parseFloat(c.dragOption.right)>b&&(h=b+"px"):h=b+"px";else{if("horizon"==Mui.dragInit.firstDirection){a.preventDefault();var k=
parseFloat(b.pageY)+parseFloat(Mui.dragInit.centerPos[1]);c.dragOption.top&&c.dragOption.bottom?parseFloat(c.dragOption.top)<k&&parseFloat(c.dragOption.bottom)>k&&(g=k+"px"):c.dragOption.top?parseFloat(c.dragOption.top)<k&&(g=k+"px"):c.dragOption.bottom?parseFloat(c.dragOption.bottom)>k&&(g=k+"px"):g=k+"px"}}else c.dragOption.vertical&&("vertical"==Mui.dragInit.firstDirection?(Mui.dragEnd(a),g=d.css("y")):(a.preventDefault(),k=parseFloat(b.pageY)+parseFloat(Mui.dragInit.centerPos[1]),c.dragOption.top&&
c.dragOption.bottom?parseFloat(c.dragOption.top)<k&&parseFloat(c.dragOption.bottom)>k?g=k+"px":parseFloat(c.dragOption.top)>k?g=c.dragOption.top:parseFloat(c.dragOption.bottom)<k&&(g=c.dragOption.bottom):c.dragOption.top?parseFloat(c.dragOption.top)<k&&(g=k+"px"):c.dragOption.bottom?parseFloat(c.dragOption.bottom)>k&&(g=k+"px"):g=k+"px")),c.dragOption.horizon&&("horizon"==Mui.dragInit.firstDirection?(Mui.dragEnd(a),h=d.css("x")):(a.preventDefault(),b=parseFloat(b.pageX)+parseFloat(Mui.dragInit.centerPos[0]),
c.dragOption.left&&c.dragOption.right?parseFloat(c.dragOption.left)<b&&parseFloat(c.dragOption.right)>b?h=b+"px":parseFloat(c.dragOption.left)>b?h=c.dragOption.left:parseFloat(c.dragOption.right)<b&&(h=c.dragOption.right):c.dragOption.left?parseFloat(c.dragOption.left)<b&&(h=b+"px"):c.dragOption.right?parseFloat(c.dragOption.right)>b&&(h=b+"px"):h=b+"px"));h||(h=d.css("x"));g||(g=d.css("y"));Mui.dragInit.target.style.webkitTransform="translate3d("+h+", "+g+", 0)";c.dragOption.onMove&&eval(c.dragOption.onMove)(a,
d);break;case "mouseup":case "touchend":e.isMobile?(c.removeEventListener("touchmove",Mui.dragInit,!1),c.removeEventListener("touchend",Mui.dragInit,!1)):(c.removeEventListener("mousemove",Mui.dragInit,!1),c.removeEventListener("mouseup",Mui.dragInit,!1)),1!=c.dragOption.scale&&d.css("scale",1),1!=c.dragOption.opacity&&d.css("opacity",1),1!=c.dragOption.css&&d.removeClass(c.dragOption.css),0==Mui.dragInit.endPos.length?(e.direction=0,e.updown=0):("vertical"==Mui.dragInit.firstDirection?e.updown=0:
0<Mui.dragInit.endPos[1][1]-Mui.dragInit.startPos[1][1]?e.updown=1:0>Mui.dragInit.endPos[1][1]-Mui.dragInit.startPos[1][1]&&(e.updown=-1),"horizon"==Mui.dragInit.firstDirection?e.direction=0:0<Mui.dragInit.endPos[1][0]-Mui.dragInit.startPos[1][0]?e.direction=-1:0>Mui.dragInit.endPos[1][0]-Mui.dragInit.startPos[1][0]&&(e.direction=1)),"undefined"!=typeof Mui.dragInit.endPos[1]?(e.distanceX=Mui.dragInit.endPos[1][0]-Mui.dragInit.startPos[1][0],e.distanceY=Mui.dragInit.endPos[1][1]-Mui.dragInit.startPos[1][1]):
(e.distanceX=0,e.distanceY=0),c.dragOption.onEnd&&eval(c.dragOption.onEnd)(a,d)}};Mui.dragEnd=function(a){c.removeEventListener(p,Mui.dragInit,!1);c.removeEventListener(q,Mui.dragInit,!1);1!=c.dragOption.scale&&scroller.css("scale",1);1!=c.dragOption.opacity&&scroller.css("opacity",1);c.dragOption.css&&scroller.removeClass(c.dragOption.css);c.dragOption.onCancel&&eval(c.dragOption.onCancel)(a,scroller)};Mui.ajax=function(a){var b=new XMLHttpRequest,d=a.url||"",c=a.async||!1,e=a.type||"GET",f=a.beforeSend||
null,l=a.complete||null,m=a.success||null;f&&eval(f)();b.open(e,d,c);b.onreadystatechange=function(){4==b.readyState&&(eval(m)(b.responseText),l&&eval(l)())};b.send();return this};Mui.done=function(){return this};Mui.browser=function(){var a=navigator.userAgent,b=/chrome/gi.test(a)?"chrome":/safari/gi.test(a)?"safari":/simulator/gi.test(a)?"ios simulator":/presto/gi.test(a)?"opera":/firefox/gi.test(a)?"firefox":/triden/gi.test(a)?"ie":"other",d=/iphone|ipad|ipod|android/gi.test(a)?"mobile":"pc",c=
/iphone|ipad|ipod/gi.test(a)?"ios":/android/gi.test(a)?"android":/mac/gi.test(a)?"macOS":/windows/gi.test(a)?"Windows":"other",e=/presto/gi.test(a)?"-o-":/webkit/gi.test(a)?"-webkit-":/firefox/gi.test(a)?"-moz-":/triden/gi.test(a)?"-ms-":"",k,l;switch(b){case "opera":case "safari":try{browserVer=a.match(/version\/([0-9.]+)/ig).toString().split("/")[1]}catch(m){browserVer=f}break;case "chrome":browserVer=a.match(/chrome\/([0-9.]+)/ig).toString().split("/")[1];break;case "firefox":browserVer=a.match(/firefox\/([0-9.]+)/ig).toString().split("/")[1];
break;case "ie":browserVer=a.match(/MSIE ([0-9.]+)/ig).toString().split(" ")[1];break;default:browserVer=f}if("android"==c)switch(k=a.match(/android ([0-9.]+)/ig).toString().split(" ")[1],k){case "1.0":l="applepie";break;case "1.1":l="bananabread";break;case "1.5":l="cupcake";break;case "1.6":l="donut";break;case "2.0":case "2.0.1":case "2.1":l="eclair";break;case "2.2":case "2.2.1":case "2.2.2":l="Froyo";break;case "2.3":case "2.3.2":case "2.3.3":case "2.3.4":case "2.3.5":case "2.3.6":case "2.3.7":l=
"gingerbread";break;case "3.0":case "3.1":case "3.2":l="honeycomb";break;case "4.0":case "4.0.1":case "4.0.2":case "4.0.3":case "4.0.4":l="icecreamsandwich";break;case "4.1":l="jellybean";break;default:l=f}return{device:d,os:c,browser:b,browserVer:browserVer,androidName:l,androidVersion:k,prefix:e}};Mui.screen=function(){return{width:e.innerWidth,height:e.innerHeight}};Mui.json=function(a,b){return 0==b?JSON.stringify(a):1==b?""!=a?JSON.parse(a):{}:"object"===typeof a?JSON.stringify(a):""!=a?JSON.parse(a):
{}};Mui.version=function(){console.log("Morpheus UI 0.1.2")};Mui.trim=function(a){return a.replace(/^\s+|\s+$/g,"")};Mui.leftTrim=function(a){return a.replace(/^\s+/,"")};Mui.rightTrim=function(a){return a.replace(/\s+$/,"")};Mui.isNumber=function(a){return!isNaN(parseFloat(a))&&isFinite(a)};camelize=function(a){return a.replace(/(?:^|[-_])(\w)/g,function(a,d){return d?d.toUpperCase():""})};decamelize=function(a){return a.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()};Mui.toCurrency=function(a){if(0!==
a&&isNaN(a))return"";if(0===a)return 0;if(""===a)return"";a=""+a;var b,d=a.split(".")[1];Mui.isNumber(a.substr(0,1))||(b=a.substr(0,1),a=parseFloat(a.replace(b,"")));amountArray=String(a).split(".");a=[];for(var c,e=amountArray[0].length;0<e;)c=Math.max(e-3,0),a.unshift(amountArray[0].slice(c,e)),e=c;amountArray[0]=a.join(",");b!=f&&(amountArray[0]=b+amountArray[0]);d!=f&&(amountArray[0]=amountArray[0]+"."+d);return amountArray[0]};Mui.toNumber=function(a){for(var b=[],d=[],c=0;c<a.toString().length;c++)b[c]=
a.toString().substr(c,1),","==b[c]&&b.splice(c),"."==b[c]&&b.splice(c),b[c]!=f&&d.push(b[c]);return d.join("")};Mui.format=function(a,b){for(var c="",e=0,f=0;f<b.length;f++)"0"==b.substr(f,1)?(c+=a.substr(e,1),e++):c+=b.substr(f,1);return c};Mui.scroll=function(a,b){if(1==arguments.length)e.scrollTo(e.pageXOffset,a);else if(2==arguments.length)e.scrollTo(b,a);else if(0==arguments.length)return{y:e.pageYOffset,x:e.pageXOffset}};Mui.getUrl=function(){return c.URL.split("/html/")[1].split("?")[0]};Mui.storage=
function(a,b){if(b==f)return localStorage.getItem(a);localStorage.setItem(a,b)};Mui.getParameter=function(a){address=location.href;if(-1!=address.indexOf("?"))for(parameters=address.slice(address.indexOf("?")+1,address.length).split("&");0<parameters.length;)return key=parameters[0].split("=")[0],key==a?decodeURIComponent(parameters[0].split("=")[1]):f;else return f};Mui.dynamicDate=function(a,b){var c;c=Math.round((new Date(a.replace(/\-/g,"/"))).getTime()/1E3);seconds=(b===f?Math.round((new Date).getTime()/
1E3):Math.round((new Date(b.replace(/\-/g,"/"))).getTime()/1E3))-c;minutes=Math.floor(seconds/60);hours=Math.floor(minutes/60);days=Math.floor(hours/24);monthes=Math.floor(days/30);year=Math.floor(days/365);return isNaN(seconds)?a.split(" ")[0]:0>seconds?(console.error("\ud604\uc7ac\ub0a0\uc9dc\ub294 \uae30\uc900\ub0a0\uc9dc\ubcf4\ub2e4 \ube60\ub97c\uc218 \uc5c6\uc2b5\ub2c8\ub2e4."),""):5>=seconds?"\ubc29\uae08\uc804":60>seconds?seconds+"\ucd08\uc804":60>minutes?minutes+"\ubd84\uc804":24>hours?hours+
"\uc2dc\uac04\uc804":30>days?days+"\uc77c\uc804":365>days?monthes+"\uac1c\uc6d4\uc804":year+"\ub144\uc804"};Mui.extend=function(a,b){};Mui.fn.init.prototype=Mui.fn;e.mpui=e.M=Mui})(this,document,window);