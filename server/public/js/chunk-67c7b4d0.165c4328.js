(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-67c7b4d0"],{"0bfb":function(t,e,n){"use strict";var r=n("cb7c");t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},"2e08":function(t,e,n){var r=n("9def"),i=n("9744"),s=n("be13");t.exports=function(t,e,n,a){var u=String(s(t)),o=u.length,c=void 0===n?" ":String(n),f=r(e);if(f<=o||""==c)return u;var h=f-o,d=i.call(c,Math.ceil(h/c.length));return d.length>h&&(d=d.slice(0,h)),a?d+u:u+d}},3846:function(t,e,n){n("9e1e")&&"g"!=/./g.flags&&n("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:n("0bfb")})},"5a0c":function(t,e,n){!function(e,n){t.exports=n()}(0,(function(){"use strict";var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",a="month",u="quarter",o="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,h=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:h,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+h(r,2,"0")+":"+h(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,a),i=e-r<0,s=t.clone().add(n+(i?-1:1),a);return Number(-(n+(e-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:a,y:o,w:s,d:i,D:"date",h:r,m:n,s:e,ms:t,Q:u}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},l={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m="en",g={};g[m]=l;var v=function(t){return t instanceof y},p=function(t,e,n){var r;if(!t)return m;if("string"==typeof t)g[t]&&(r=t),e&&(g[t]=e,r=t);else{var i=t.name;g[i]=t,r=i}return!n&&r&&(m=r),r||!n&&m},$=function(t,e){if(v(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new y(n)},b=d;b.l=p,b.i=v,b.w=function(t,e){return $(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var y=function(){function h(t){this.$L=this.$L||p(t.locale,null,!0),this.parse(t)}var d=h.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(c);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return b},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=$(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return $(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<$(t)},d.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",o)},d.month=function(t){return this.$g(t,"$M",a)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,u){var c=this,f=!!b.u(u)||u,h=b.p(t),d=function(t,e){var n=b.w(c.$u?Date.UTC(c.$y,e,t):new Date(c.$y,e,t),c);return f?n:n.endOf(i)},l=function(t,e){return b.w(c.toDate()[t].apply(c.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(e)),c)},m=this.$W,g=this.$M,v=this.$D,p="set"+(this.$u?"UTC":"");switch(h){case o:return f?d(1,0):d(31,11);case a:return f?d(1,g):d(0,g+1);case s:var $=this.$locale().weekStart||0,y=(m<$?m+7:m)-$;return d(f?v-y:v+(6-y),g);case i:case"date":return l(p+"Hours",0);case r:return l(p+"Minutes",1);case n:return l(p+"Seconds",2);case e:return l(p+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,u){var c,f=b.p(s),h="set"+(this.$u?"UTC":""),d=(c={},c[i]=h+"Date",c.date=h+"Date",c[a]=h+"Month",c[o]=h+"FullYear",c[r]=h+"Hours",c[n]=h+"Minutes",c[e]=h+"Seconds",c[t]=h+"Milliseconds",c)[f],l=f===i?this.$D+(u-this.$W):u;if(f===a||f===o){var m=this.clone().set("date",1);m.$d[d](l),m.init(),this.$d=m.set("date",Math.min(this.$D,m.daysInMonth())).toDate()}else d&&this.$d[d](l);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[b.p(t)]()},d.add=function(t,u){var c,f=this;t=Number(t);var h=b.p(u),d=function(e){var n=$(f);return b.w(n.date(n.date()+Math.round(e*t)),f)};if(h===a)return this.set(a,this.$M+t);if(h===o)return this.set(o,this.$y+t);if(h===i)return d(1);if(h===s)return d(7);var l=(c={},c[n]=6e4,c[r]=36e5,c[e]=1e3,c)[h]||1,m=this.$d.getTime()+t*l;return b.w(m,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=b.z(this),i=this.$locale(),s=this.$H,a=this.$m,u=this.$M,o=i.weekdays,c=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return b.s(s%12||12,t,"0")},l=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:u+1,MM:b.s(u+1,2,"0"),MMM:h(i.monthsShort,u,c,3),MMMM:h(c,u),D:this.$D,DD:b.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:b.s(s,2,"0"),h:d(1),hh:d(2),a:l(s,a,!0),A:l(s,a,!1),m:String(a),mm:b.s(a,2,"0"),s:String(this.$s),ss:b.s(this.$s,2,"0"),SSS:b.s(this.$ms,3,"0"),Z:r};return n.replace(f,(function(t,e){return e||m[t]||r.replace(":","")}))},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,c,f){var h,d=b.p(c),l=$(t),m=6e4*(l.utcOffset()-this.utcOffset()),g=this-l,v=b.m(this,l);return v=(h={},h[o]=v/12,h[a]=v,h[u]=v/3,h[s]=(g-m)/6048e5,h[i]=(g-m)/864e5,h[r]=g/36e5,h[n]=g/6e4,h[e]=g/1e3,h)[d]||g,f?v:b.a(v)},d.daysInMonth=function(){return this.endOf(a).$D},d.$locale=function(){return g[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=p(t,e,!0);return r&&(n.$L=r),n},d.clone=function(){return b.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},h}();return $.prototype=y.prototype,$.extend=function(t,e){return t(e,y,$),$},$.locale=p,$.isDayjs=v,$.unix=function(t){return $(1e3*t)},$.en=g[m],$.Ls=g,$}))},"6ae4":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[!t.processing||t.processing&&t.notStart?n("ul",[n("li",[t._v("student name: "+t._s(t.userName))]),n("li",[t._v("course name: "+t._s(t.exam.courseName))]),n("li",[t._v("begin time: "+t._s(t.dateFormat(t.exam.beginTime)))]),n("li",[t._v("end time: "+t._s(t.dateFormat(t.exam.endTime)))]),n("li",[t._v("duration: "+t._s(t.exam.duration))]),"cancled"===t.exam.status?n("li",[t._v("Exam Cancled")]):"nostart"===t.exam.status?n("li",[t._v("\n      Exam not start\n    ")]):"ended"===t.exam.status?n("li",[t._v("\n      Exam ended, your score: "+t._s(t.exam.score)+"\n    ")]):n("li",[t._v("Exam will start "+t._s(t.timeFormat(t.startTiming)))])]):n("div",[n("div",[t._v("Exam will end "+t._s(t.timeFormat(t.endTiming)))]),n("div",[n("Button",{attrs:{type:"primary"},on:{click:t.submit}},[t._v("Submit")])],1),t._l(t.exam.questions,(function(e,r){return n("div",{key:r,staticClass:"question"},[n("div",{staticClass:"index"},[t._v(t._s(r+1)+".")]),n("div",{staticClass:"article"},[n("div",{staticClass:"desc"},[t._v(t._s(e.article))]),"multiple"===e.type?n("div",[n("CheckboxGroup",{model:{value:e.answer,callback:function(n){t.$set(e,"answer",n)},expression:"question.answer"}},t._l(e.options,(function(t,e){return n("Checkbox",{key:r+"-"+e,attrs:{label:t+""}})})),1)],1):n("div",[n("RadioGroup",{model:{value:e.answer,callback:function(n){t.$set(e,"answer",n)},expression:"question.answer"}},t._l(e.options,(function(t,e){return n("Radio",{key:r+"-"+e,attrs:{label:t+""}})})),1)],1)])])}))],2)])},i=[],s=(n("8e6e"),n("ac6a"),n("456d"),n("96cf"),n("1da1")),a=(n("6b54"),n("f576"),n("ade3")),u=n("2f62"),o=n("5a0c"),c=n.n(o);function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function h(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){Object(a["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var d={name:"exam",computed:{exam:function(){return this.$store.state.app.exam||{}},processing:function(){return"processing"===this.exam.status},userName:function(){return this.$store.getters.userName}},data:function(){return{notStart:!1,notEnd:!1,timer:null,startTiming:0,endTiming:0}},methods:h(h({},Object(u["b"])(["getExamById","examSubmit"])),{},{dateFormat:function(t){return t?c()(t).format("YYYY-MM-DD HH:mm:ss"):""},timeFormat:function(t){return Math.floor(t/60).toString().padStart(2,"0")+":"+(t%60).toString().padStart(2,"0")},submit:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,n,r,i,s,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.exam._id,n=this.exam.questions.map((function(t){return{_id:t._id,answer:t.answer}})),t.next=4,this.examSubmit({examId:e,answers:n});case 4:r=t.sent,i=r.data,s=i.score,i.errorList,a=r.success,a?this.$Message.success({content:"success to submit, your score is: ".concat(s),onClose:function(){window.location.reload()}}):this.$Message.error("submit fail");case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),countDown:function(){var t=this;this.endTiming=c()(this.exam.endTime).diff(c()(),"second"),this.timer=setInterval((function(){t.endTiming--,t.endTiming<=0&&(clearInterval(t.timer),t.timer=null,t.notEnd=!1,t.submit())}),1e3)}}),mounted:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,n=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.$route.params.examId,t.next=3,this.getExamById({examId:e});case 3:this.notStart=this.processing&&c()().isBefore(c()(this.exam.beginTime)),this.notEnd=this.processing&&c()().isBefore(c()(this.exam.endTime)),this.notStart&&(this.startTiming=c()(this.exam.beginTime).diff(c()(),"second"),this.timer=setInterval((function(){n.startTiming--,n.startTiming<=0&&(clearInterval(n.timer),n.timer=null,n.notStart=!1,n.notEnd=!0,n.countDown())}),1e3)),this.notEnd&&this.countDown();case 7:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}()},l=d,m=(n("8f85"),n("2877")),g=Object(m["a"])(l,r,i,!1,null,"eff00af0",null);e["default"]=g.exports},"6b54":function(t,e,n){"use strict";n("3846");var r=n("cb7c"),i=n("0bfb"),s=n("9e1e"),a="toString",u=/./[a],o=function(t){n("2aba")(RegExp.prototype,a,t,!0)};n("79e5")((function(){return"/a/b"!=u.call({source:"a",flags:"b"})}))?o((function(){var t=r(this);return"/".concat(t.source,"/","flags"in t?t.flags:!s&&t instanceof RegExp?i.call(t):void 0)})):u.name!=a&&o((function(){return u.call(this)}))},"8f85":function(t,e,n){"use strict";var r=n("958c"),i=n.n(r);i.a},"958c":function(t,e,n){},9744:function(t,e,n){"use strict";var r=n("4588"),i=n("be13");t.exports=function(t){var e=String(i(this)),n="",s=r(t);if(s<0||s==1/0)throw RangeError("Count can't be negative");for(;s>0;(s>>>=1)&&(e+=e))1&s&&(n+=e);return n}},f576:function(t,e,n){"use strict";var r=n("5ca1"),i=n("2e08"),s=n("a25f"),a=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(s);r(r.P+r.F*a,"String",{padStart:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0,!0)}})}}]);