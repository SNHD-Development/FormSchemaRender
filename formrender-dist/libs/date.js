/**
 * Copyright (c)2005-2009 Matt Kruse (javascripttoolbox.com)
 *
 * Dual licensed under the MIT and GPL licenses.
 * This basically means you can use this code however you want for
 * free, but don't claim to have written it yourself!
 * Donations always accepted: http://www.JavascriptToolbox.com/donate/
 *
 * Please do not link to the .js files on javascripttoolbox.com from
 * your site. Copy the files locally to your server instead.
 *
 */

Date.$VERSION=1.02,Date.LZ=function(e){return(e<0||e>9?"":"0")+e},Date.monthNames=new Array("January","February","March","April","May","June","July","August","September","October","November","December"),Date.monthAbbreviations=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),Date.dayNames=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),Date.dayAbbreviations=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat"),Date.preferAmericanFormat=!0,Date.prototype.getFullYear||(Date.prototype.getFullYear=function(){var e=this.getYear();return e<1900?e+1900:e}),Date.parseString=function(e,t){if(void 0===t||null==t||""==t){for(var n=new Array("y-M-d","MMM d, y","MMM d,y","y-MMM-d","d-MMM-y","MMM d","MMM-d","d-MMM"),r=new Array("M/d/y","M-d-y","M.d.y","M/d","M-d"),i=new Array("d/M/y","d-M-y","d.M.y","d/M","d-M"),a=new Array(n,Date.preferAmericanFormat?r:i,Date.preferAmericanFormat?i:r),s=0;s<a.length;s++)for(var l=a[s],u=0;u<l.length;u++){var h=Date.parseString(e,l[u]);if(null!=h)return h}return null}this.isInteger=function(e){for(var t=0;t<e.length;t++)if(-1=="1234567890".indexOf(e.charAt(t)))return!1;return!0},this.getInt=function(e,t,n,r){for(var i=r;i>=n;i--){var a=e.substring(t,t+i);if(a.length<n)return null;if(this.isInteger(a))return a}return null},e+="",t+="";for(var o,g,y=0,f=0,M="",D="",d=(new Date).getFullYear(),m=1,c=1,b=0,p=0,A=0,v="";f<t.length;){for(M=t.charAt(f),D="";t.charAt(f)==M&&f<t.length;)D+=t.charAt(f++);if("yyyy"==D||"yy"==D||"y"==D){if("yyyy"==D&&(o=4,g=4),"yy"==D&&(o=2,g=2),"y"==D&&(o=2,g=4),null==(d=this.getInt(e,y,o,g)))return null;y+=d.length,2==d.length&&(d=d>70?d-0+1900:d-0+2e3)}else if("MMM"==D||"NNN"==D){m=0;for(var w="MMM"==D?Date.monthNames.concat(Date.monthAbbreviations):Date.monthAbbreviations,s=0;s<w.length;s++){var N=w[s];if(e.substring(y,y+N.length).toLowerCase()==N.toLowerCase()){m=s%12+1,y+=N.length;break}}if(m<1||m>12)return null}else if("EE"==D||"E"==D)for(var w="EE"==D?Date.dayNames:Date.dayAbbreviations,s=0;s<w.length;s++){var T=w[s];if(e.substring(y,y+T.length).toLowerCase()==T.toLowerCase()){y+=T.length;break}}else if("MM"==D||"M"==D){if(null==(m=this.getInt(e,y,D.length,2))||m<1||m>12)return null;y+=m.length}else if("dd"==D||"d"==D){if(null==(c=this.getInt(e,y,D.length,2))||c<1||c>31)return null;y+=c.length}else if("hh"==D||"h"==D){if(null==(b=this.getInt(e,y,D.length,2))||b<1||b>12)return null;y+=b.length}else if("HH"==D||"H"==D){if(null==(b=this.getInt(e,y,D.length,2))||b<0||b>23)return null;y+=b.length}else if("KK"==D||"K"==D){if(null==(b=this.getInt(e,y,D.length,2))||b<0||b>11)return null;y+=b.length,b++}else if("kk"==D||"k"==D){if(null==(b=this.getInt(e,y,D.length,2))||b<1||b>24)return null;y+=b.length,b--}else if("mm"==D||"m"==D){if(null==(p=this.getInt(e,y,D.length,2))||p<0||p>59)return null;y+=p.length}else if("ss"==D||"s"==D){if(null==(A=this.getInt(e,y,D.length,2))||A<0||A>59)return null;y+=A.length}else if("a"==D){if("am"==e.substring(y,y+2).toLowerCase())v="AM";else{if("pm"!=e.substring(y,y+2).toLowerCase())return null;v="PM"}y+=2}else{if(e.substring(y,y+D.length)!=D)return null;y+=D.length}}if(y!=e.length)return null;if(2==m)if(d%4==0&&d%100!=0||d%400==0){if(c>29)return null}else if(c>28)return null;return(4==m||6==m||9==m||11==m)&&c>30?null:(b<12&&"PM"==v?b=b-0+12:b>11&&"AM"==v&&(b-=12),new Date(d,m-1,c,b,p,A))},Date.isValid=function(e,t){return null!=Date.parseString(e,t)},Date.prototype.isBefore=function(e){return null!=e&&this.getTime()<e.getTime()},Date.prototype.isAfter=function(e){return null!=e&&this.getTime()>e.getTime()},Date.prototype.equals=function(e){return null!=e&&this.getTime()==e.getTime()},Date.prototype.equalsIgnoreTime=function(e){if(null==e)return!1;var t=new Date(this.getTime()).clearTime(),n=new Date(e.getTime()).clearTime();return t.getTime()==n.getTime()},Date.prototype.format=function(e){e+="";var t,n="",r=0,i="",a="",s=this.getYear()+"",l=this.getMonth()+1,u=this.getDate(),h=this.getDay(),t=this.getHours(),o=this.getMinutes(),g=this.getSeconds(),y=new Object;for(s.length<4&&(s=""+(+s+1900)),y.y=""+s,y.yyyy=s,y.yy=s.substring(2,4),y.M=l,y.MM=Date.LZ(l),y.MMM=Date.monthNames[l-1],y.NNN=Date.monthAbbreviations[l-1],y.d=u,y.dd=Date.LZ(u),y.E=Date.dayAbbreviations[h],y.EE=Date.dayNames[h],y.H=t,y.HH=Date.LZ(t),y.h=0==t?12:t>12?t-12:t,y.hh=Date.LZ(y.h),y.K=y.h-1,y.k=y.H+1,y.KK=Date.LZ(y.K),y.kk=Date.LZ(y.k),y.a=t>11?"PM":"AM",y.m=o,y.mm=Date.LZ(o),y.s=g,y.ss=Date.LZ(g);r<e.length;){for(i=e.charAt(r),a="";e.charAt(r)==i&&r<e.length;)a+=e.charAt(r++);void 0!==y[a]?n+=y[a]:n+=a}return n},Date.prototype.getDayName=function(){return Date.dayNames[this.getDay()]},Date.prototype.getDayAbbreviation=function(){return Date.dayAbbreviations[this.getDay()]},Date.prototype.getMonthName=function(){return Date.monthNames[this.getMonth()]},Date.prototype.getMonthAbbreviation=function(){return Date.monthAbbreviations[this.getMonth()]},Date.prototype.clearTime=function(){return this.setHours(0),this.setMinutes(0),this.setSeconds(0),this.setMilliseconds(0),this},Date.prototype.add=function(e,t){if(void 0===e||null==e||void 0===t||null==t)return this;if(t=+t,"y"==e)this.setFullYear(this.getFullYear()+t);else if("M"==e)this.setMonth(this.getMonth()+t);else if("d"==e)this.setDate(this.getDate()+t);else if("w"==e)for(var n=t>0?1:-1;0!=t;){for(this.add("d",n);0==this.getDay()||6==this.getDay();)this.add("d",n);t-=n}else"h"==e?this.setHours(this.getHours()+t):"m"==e?this.setMinutes(this.getMinutes()+t):"s"==e&&this.setSeconds(this.getSeconds()+t);return this};