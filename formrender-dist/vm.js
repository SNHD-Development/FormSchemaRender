define(["jquery","underscore","backbone","events"],function(e,t,n,r){var i={},s=function(e,t){t=t||!1,typeof i[e]!="undefined"&&(i[e].undelegateEvents(),typeof i[e].clean=="function"&&i[e].clean(),t&&typeof i[e].removeContent=="function"&&i[e].removeContent())},o=function(e,t,n,o){s(t);var u=new n(o);return i[t]=u,typeof e.children=="undefined"?(e.children={},e.children[t]=u):e.children[t]=u,r.trigger("viewCreated"),u},u=function(e,n){var r=Object.keys(e),i=r.length;while(i--){var s=r[i],o=s.toLowerCase();s!==o&&(e[o]=e[s],delete e[s]);if(typeof e[o]=="object"){if(o==="validation"||o.search(/^values-*/)!==-1)continue;if(typeof n!="undefined"&&(!t.isArray(n)&&o===n||t.isArray(n)&&t.indexOf(n,o)>-1))continue;this.toLower(e[o])}}},a=function(e){e.fields&&t.each(e.fields,function(n,r){var i=t.unescape(n);e.fields[r]=i.replace(/&#39;/g,"'")})},f=function(e,n){t.each(e,function(e){e.description&&e.languages&&e.languages[n]&&(e.description=e.languages[n]);switch(e.type.toLowerCase()){case"select":e["values-"+n]&&(e.values=e["values-"+n]),e.options&&typeof e.options.defaulttext=="object"&&(e.options.defaulttext=e.options.defaulttext[n])}})};return{create:o,remove:s,toLower:u,decodeHtml:a,changeLanguage:f}});