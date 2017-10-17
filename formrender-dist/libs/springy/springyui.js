/**
Copyright (c) 2010 Dennis Hotson

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

define(["jquery"],function(t){function e(t,e,i,o,n){this.interval=t,this.layout=e,this.clear=i,this.drawEdge=o,this.drawNode=n,this.layout.graph.addGraphListener(this)}var i=function(){this.nodeSet={},this.nodes=[],this.edges=[],this.adjacency={},this.nextNodeId=0,this.nextEdgeId=0,this.eventListeners=[]},o=function(t,e){this.id=t,this.data=void 0!==e?e:{}},n=function(t,e,i,o){this.id=t,this.source=e,this.target=i,this.data=void 0!==o?o:{}};i.prototype.addNode=function(t){return void 0===this.nodeSet[t.id]&&this.nodes.push(t),this.nodeSet[t.id]=t,this.notify(),t},i.prototype.addEdge=function(t){var e=!1;return this.edges.forEach(function(i){t.id===i.id&&(e=!0)}),e||this.edges.push(t),void 0===this.adjacency[t.source.id]&&(this.adjacency[t.source.id]={}),void 0===this.adjacency[t.source.id][t.target.id]&&(this.adjacency[t.source.id][t.target.id]=[]),e=!1,this.adjacency[t.source.id][t.target.id].forEach(function(i){t.id===i.id&&(e=!0)}),e||this.adjacency[t.source.id][t.target.id].push(t),this.notify(),t},i.prototype.newNode=function(t){var e=new o(this.nextNodeId++,t);return this.addNode(e),e},i.prototype.newEdge=function(t,e,i){var o=new n(this.nextEdgeId++,t,e,i);return this.addEdge(o),o},i.prototype.getEdges=function(t,e){return void 0!==this.adjacency[t.id]&&void 0!==this.adjacency[t.id][e.id]?this.adjacency[t.id][e.id]:[]},i.prototype.removeNode=function(t){void 0!==this.nodeSet[t.id]&&delete this.nodeSet[t.id];for(var e=this.nodes.length-1;e>=0;e--)this.nodes[e].id===t.id&&this.nodes.splice(e,1);this.detachNode(t)},i.prototype.detachNode=function(t){this.edges.slice().forEach(function(e){e.source.id!==t.id&&e.target.id!==t.id||this.removeEdge(e)},this),this.notify()},i.prototype.removeEdge=function(t){for(var e=this.edges.length-1;e>=0;e--)this.edges[e].id===t.id&&this.edges.splice(e,1);for(var i in this.adjacency)for(var o in this.adjacency[i])for(var n=this.adjacency[i][o],r=n.length-1;r>=0;r--)this.adjacency[i][o][r].id===t.id&&this.adjacency[i][o].splice(r,1);this.notify()},i.prototype.merge=function(t){var e=[];t.nodes.forEach(function(t){e.push(this.addNode(new o(t.id,t.data)))},this),t.edges.forEach(function(t){var i=e[t.from],o=e[t.to],r=t.directed?r=t.type+"-"+i.id+"-"+o.id:i.id<o.id?t.type+"-"+i.id+"-"+o.id:t.type+"-"+o.id+"-"+i.id;this.addEdge(new n(r,i,o,t.data)).data.type=t.type},this)},i.prototype.filterNodes=function(t){this.nodes.slice().forEach(function(e){t(e)||this.removeNode(e)},this)},i.prototype.filterEdges=function(t){this.edges.slice().forEach(function(e){t(e)||this.removeEdge(e)},this)},i.prototype.addGraphListener=function(t){this.eventListeners.push(t)},i.prototype.notify=function(){this.eventListeners.forEach(function(t){t.graphChanged()})};var r={};r.ForceDirected=function(t,e,i,o){this.graph=t,this.stiffness=e,this.repulsion=i,this.damping=o,this.nodePoints={},this.edgeSprings={}},r.ForceDirected.prototype.point=function(t){if(void 0===this.nodePoints[t.id]){var e=void 0!==t.data.mass?t.data.mass:1;this.nodePoints[t.id]=new r.ForceDirected.Point(Vector.random(),e)}return this.nodePoints[t.id]},r.ForceDirected.prototype.spring=function(t){if(void 0===this.edgeSprings[t.id]){var e=void 0!==t.data.length?t.data.length:1,i=!1,o=this.graph.getEdges(t.source,t.target);if(o.forEach(function(t){!1===i&&void 0!==this.edgeSprings[t.id]&&(i=this.edgeSprings[t.id])},this),!1!==i)return new r.ForceDirected.Spring(i.point1,i.point2,0,0);this.graph.getEdges(t.target,t.source);if(o.forEach(function(t){!1===i&&void 0!==this.edgeSprings[t.id]&&(i=this.edgeSprings[t.id])},this),!1!==i)return new r.ForceDirected.Spring(i.point2,i.point1,0,0);this.edgeSprings[t.id]=new r.ForceDirected.Spring(this.point(t.source),this.point(t.target),e,this.stiffness)}return this.edgeSprings[t.id]},r.ForceDirected.prototype.eachNode=function(t){var e=this;this.graph.nodes.forEach(function(i){t.call(e,i,e.point(i))})},r.ForceDirected.prototype.eachEdge=function(t){var e=this;this.graph.edges.forEach(function(i){t.call(e,i,e.spring(i))})},r.ForceDirected.prototype.eachSpring=function(t){var e=this;this.graph.edges.forEach(function(i){t.call(e,e.spring(i))})},r.ForceDirected.prototype.applyCoulombsLaw=function(){this.eachNode(function(t,e){this.eachNode(function(t,i){if(e!==i){var o=e.p.subtract(i.p),n=o.magnitude()+.1,r=o.normalise();e.applyForce(r.multiply(this.repulsion).divide(n*n*.5)),i.applyForce(r.multiply(this.repulsion).divide(n*n*-.5))}})})},r.ForceDirected.prototype.applyHookesLaw=function(){this.eachSpring(function(t){var e=t.point2.p.subtract(t.point1.p),i=t.length-e.magnitude(),o=e.normalise();t.point1.applyForce(o.multiply(t.k*i*-.5)),t.point2.applyForce(o.multiply(t.k*i*.5))})},r.ForceDirected.prototype.attractToCentre=function(){this.eachNode(function(t,e){var i=e.p.multiply(-1);e.applyForce(i.multiply(this.repulsion/50))})},r.ForceDirected.prototype.updateVelocity=function(t){this.eachNode(function(e,i){i.v=i.v.add(i.a.multiply(t)).multiply(this.damping),i.a=new Vector(0,0)})},r.ForceDirected.prototype.updatePosition=function(t){this.eachNode(function(e,i){i.p=i.p.add(i.v.multiply(t))})},r.ForceDirected.prototype.totalEnergy=function(t){var e=0;return this.eachNode(function(t,i){var o=i.v.magnitude();e+=.5*i.m*o*o}),e};return r.requestAnimationFrame=function(t,e){return function(){return t.apply(e,arguments)}}(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,e){window.setTimeout(t,10)},window),r.ForceDirected.prototype.start=function(t,e,i){var o=this;this._started||(this._started=!0,r.requestAnimationFrame(function t(){o.applyCoulombsLaw(),o.applyHookesLaw(),o.attractToCentre(),o.updateVelocity(.03),o.updatePosition(.03),void 0!==e&&e(),o.totalEnergy()<.01?(o._started=!1,void 0!==i&&i()):r.requestAnimationFrame(t)}))},r.ForceDirected.prototype.nearest=function(t){var e={node:null,point:null,distance:null},i=this;return this.graph.nodes.forEach(function(o){var n=i.point(o),r=n.p.subtract(t).magnitude();(null===e.distance||r<e.distance)&&(e={node:o,point:n,distance:r})}),e},r.ForceDirected.prototype.getBoundingBox=function(){var t=new Vector(-2,-2),e=new Vector(2,2);this.eachNode(function(i,o){o.p.x<t.x&&(t.x=o.p.x),o.p.y<t.y&&(t.y=o.p.y),o.p.x>e.x&&(e.x=o.p.x),o.p.y>e.y&&(e.y=o.p.y)});var i=e.subtract(t).multiply(.07);return{bottomleft:t.subtract(i),topright:e.add(i)}},Vector=function(t,e){this.x=t,this.y=e},Vector.random=function(){return new Vector(10*(Math.random()-.5),10*(Math.random()-.5))},Vector.prototype.add=function(t){return new Vector(this.x+t.x,this.y+t.y)},Vector.prototype.subtract=function(t){return new Vector(this.x-t.x,this.y-t.y)},Vector.prototype.multiply=function(t){return new Vector(this.x*t,this.y*t)},Vector.prototype.divide=function(t){return new Vector(this.x/t||0,this.y/t||0)},Vector.prototype.magnitude=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},Vector.prototype.normal=function(){return new Vector(-this.y,this.x)},Vector.prototype.normalise=function(){return this.divide(this.magnitude())},r.ForceDirected.Point=function(t,e){this.p=t,this.m=e,this.v=new Vector(0,0),this.a=new Vector(0,0)},r.ForceDirected.Point.prototype.applyForce=function(t){this.a=this.a.add(t.divide(this.m))},r.ForceDirected.Spring=function(t,e,i,o){this.point1=t,this.point2=e,this.length=i,this.k=o},e.prototype.graphChanged=function(t){this.start()},e.prototype.start=function(){var t=this;this.layout.start(50,function(){t.clear(),t.layout.eachEdge(function(e,i){t.drawEdge(e,i.point1.p,i.point2.p)}),t.layout.eachNode(function(e,i){t.drawNode(e,i.p)})})},t.fn.springy=function(n){function d(t,e,i,o){var n=(o.y-i.y)*(e.x-t.x)-(o.x-i.x)*(e.y-t.y);if(0===n)return!1;var r=((o.x-i.x)*(t.y-i.y)-(o.y-i.y)*(t.x-i.x))/n,d=((e.x-t.x)*(t.y-i.y)-(e.y-t.y)*(t.x-i.x))/n;return!(r<0||r>1||d<0||d>1)&&new Vector(t.x+r*(e.x-t.x),t.y+r*(e.y-t.y))}function a(t,e,i,o,n){var r,a={x:i.x,y:i.y},s={x:i.x+o,y:i.y},c={x:i.x,y:i.y+n},h={x:i.x+o,y:i.y+n};return(r=d(t,e,a,s))?r:(r=d(t,e,s,h))?r:(r=d(t,e,h,c))?r:!!(r=d(t,e,c,a))&&r}var s=this.graph=n.graph||new i,c=n.stiffness||400,h=n.repulsion||400,p=n.damping||.5,u=this[0],l=u.getContext("2d"),f=this.layout=new r.ForceDirected(s,c,h,p),y=f.getBoundingBox(),g={bottomleft:new Vector(-2,-2),topright:new Vector(2,2)};r.requestAnimationFrame(function t(){g=f.getBoundingBox(),y={bottomleft:y.bottomleft.add(g.bottomleft.subtract(y.bottomleft).divide(10)),topright:y.topright.add(g.topright.subtract(y.topright).divide(10))},r.requestAnimationFrame(t)}),toScreen=function(t){var e=y.topright.subtract(y.bottomleft),i=t.subtract(y.bottomleft).divide(e.x).x*u.width,o=t.subtract(y.bottomleft).divide(e.y).y*u.height;return new Vector(i,o)},fromScreen=function(t){var e=y.topright.subtract(y.bottomleft),i=t.x/u.width*e.x+y.bottomleft.x,o=t.y/u.height*e.y+y.bottomleft.y;return new Vector(i,o)};var v=null,m=null,x=null;t(u).mousedown(function(e){t(".actions").hide();var i=t(this).offset(),o=fromScreen({x:e.pageX-i.left,y:e.pageY-i.top});v=m=x=f.nearest(o),null!==v.node&&(x.point.m=1e4),w.start()}),t(u).mousemove(function(e){var i=t(this).offset(),o=fromScreen({x:e.pageX-i.left,y:e.pageY-i.top});m=f.nearest(o),null!==x&&null!==x.node&&(x.point.p.x=o.x,x.point.p.y=o.y),w.start()}),t(window).bind("mouseup",function(t){x=null}),o.prototype.getWidth=function(){var t=void 0!==this.data.label?this.data.label:this.id;if(this._width&&this._width[t])return this._width[t];l.save(),l.font="16px Verdana, sans-serif";var e=l.measureText(t).width+10;return l.restore(),this._width||(this._width={}),this._width[t]=e,e},o.prototype.getHeight=function(){return 20};var w=new e(1,f,function(){l.clearRect(0,0,u.width,u.height)},function(t,e,i){for(var o=toScreen(e).x,n=toScreen(e).y,r=toScreen(i).x,d=toScreen(i).y,c=new Vector(r-o,d-n),h=c.normal().normalise(),p=s.getEdges(t.source,t.target),u=s.getEdges(t.target,t.source),f=p.length+u.length,y=0,g=0;g<p.length;g++)p[g].id===t.id&&(y=g);var v=h.multiply(-6*(f-1)/2+6*y),m=toScreen(e).add(v),x=toScreen(i).add(v),w=t.target.getWidth(),F=t.target.getHeight(),E=a(m,x,{x:r-w/2,y:d-F/2},w,F);E||(E=x);var S,b,V=void 0!==t.data.color?t.data.color:"#000000",D=void 0!==t.data.weight?t.data.weight:1;l.lineWidth=Math.max(2*D,.1),S=1+l.lineWidth,b=8;var N,j=void 0===t.data.directional||t.data.directional;N=j?E.subtract(c.normalise().multiply(.5*b)):x,l.strokeStyle=V,l.beginPath(),l.moveTo(m.x,m.y),l.lineTo(N.x,N.y),l.stroke(),j&&(l.save(),l.fillStyle=V,l.translate(E.x,E.y),l.rotate(Math.atan2(d-n,r-o)),l.beginPath(),l.moveTo(-b,S),l.lineTo(0,0),l.lineTo(-b,-S),l.lineTo(.8*-b,-0),l.closePath(),l.fill(),l.restore())},function(t,e){var i=toScreen(e);l.save();var o=t.getWidth();t.getHeight();l.clearRect(i.x-o/2,i.y-10,o,20),null!==v&&null!==m.node&&v.node.id===t.id?l.fillStyle="#FFFFE0":null!==m&&null!==m.node&&m.node.id===t.id?l.fillStyle="#EEEEEE":l.fillStyle="#FFFFFF",l.fillRect(i.x-o/2,i.y-10,o,20),l.textAlign="left",l.textBaseline="top",l.font="16px Verdana, sans-serif",l.fillStyle="#000000",l.font="16px Verdana, sans-serif";var n=void 0!==t.data.label?t.data.label:t.id;l.fillText(n,i.x-o/2+5,i.y-8),l.restore()});return w.start(),this},i});