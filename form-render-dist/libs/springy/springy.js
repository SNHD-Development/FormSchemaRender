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

define([],function(){function s(e,t,n,r,i){this.interval=e,this.layout=t,this.clear=n,this.drawEdge=r,this.drawNode=i,this.layout.graph.addGraphListener(this)}var e=function(){this.nodeSet={},this.nodes=[],this.edges=[],this.adjacency={},this.nextNodeId=0,this.nextEdgeId=0,this.eventListeners=[]},t=function(e,t){this.id=e,this.data=typeof t!="undefined"?t:{}},n=function(e,t,n,r){this.id=e,this.source=t,this.target=n,this.data=typeof r!="undefined"?r:{}};e.prototype.addNode=function(e){return typeof this.nodeSet[e.id]=="undefined"&&this.nodes.push(e),this.nodeSet[e.id]=e,this.notify(),e},e.prototype.addEdge=function(e){var t=!1;return this.edges.forEach(function(n){e.id===n.id&&(t=!0)}),t||this.edges.push(e),typeof this.adjacency[e.source.id]=="undefined"&&(this.adjacency[e.source.id]={}),typeof this.adjacency[e.source.id][e.target.id]=="undefined"&&(this.adjacency[e.source.id][e.target.id]=[]),t=!1,this.adjacency[e.source.id][e.target.id].forEach(function(n){e.id===n.id&&(t=!0)}),t||this.adjacency[e.source.id][e.target.id].push(e),this.notify(),e},e.prototype.newNode=function(e){var n=new t(this.nextNodeId++,e);return this.addNode(n),n},e.prototype.newEdge=function(e,t,r){var i=new n(this.nextEdgeId++,e,t,r);return this.addEdge(i),i},e.prototype.getEdges=function(e,t){return typeof this.adjacency[e.id]!="undefined"&&typeof this.adjacency[e.id][t.id]!="undefined"?this.adjacency[e.id][t.id]:[]},e.prototype.removeNode=function(e){typeof this.nodeSet[e.id]!="undefined"&&delete this.nodeSet[e.id];for(var t=this.nodes.length-1;t>=0;t--)this.nodes[t].id===e.id&&this.nodes.splice(t,1);this.detachNode(e)},e.prototype.detachNode=function(e){var t=this.edges.slice();t.forEach(function(t){(t.source.id===e.id||t.target.id===e.id)&&this.removeEdge(t)},this),this.notify()},e.prototype.removeEdge=function(e){for(var t=this.edges.length-1;t>=0;t--)this.edges[t].id===e.id&&this.edges.splice(t,1);for(var n in this.adjacency)for(var r in this.adjacency[n]){var i=this.adjacency[n][r];for(var s=i.length-1;s>=0;s--)this.adjacency[n][r][s].id===e.id&&this.adjacency[n][r].splice(s,1)}this.notify()},e.prototype.merge=function(e){var r=[];e.nodes.forEach(function(e){r.push(this.addNode(new t(e.id,e.data)))},this),e.edges.forEach(function(e){var t=r[e.from],i=r[e.to],s=e.directed?s=e.type+"-"+t.id+"-"+i.id:t.id<i.id?e.type+"-"+t.id+"-"+i.id:e.type+"-"+i.id+"-"+t.id,o=this.addEdge(new n(s,t,i,e.data));o.data.type=e.type},this)},e.prototype.filterNodes=function(e){var t=this.nodes.slice();t.forEach(function(t){e(t)||this.removeNode(t)},this)},e.prototype.filterEdges=function(e){var t=this.edges.slice();t.forEach(function(t){e(t)||this.removeEdge(t)},this)},e.prototype.addGraphListener=function(e){this.eventListeners.push(e)},e.prototype.notify=function(){this.eventListeners.forEach(function(e){e.graphChanged()})};var r={};r.ForceDirected=function(e,t,n,r){this.graph=e,this.stiffness=t,this.repulsion=n,this.damping=r,this.nodePoints={},this.edgeSprings={}},r.ForceDirected.prototype.point=function(e){if(typeof this.nodePoints[e.id]=="undefined"){var t=typeof e.data.mass!="undefined"?e.data.mass:1;this.nodePoints[e.id]=new r.ForceDirected.Point(Vector.random(),t)}return this.nodePoints[e.id]},r.ForceDirected.prototype.spring=function(e){if(typeof this.edgeSprings[e.id]=="undefined"){var t=typeof e.data.length!="undefined"?e.data.length:1,n=!1,i=this.graph.getEdges(e.source,e.target);i.forEach(function(e){n===!1&&typeof this.edgeSprings[e.id]!="undefined"&&(n=this.edgeSprings[e.id])},this);if(n!==!1)return new r.ForceDirected.Spring(n.point1,n.point2,0,0);var s=this.graph.getEdges(e.target,e.source);i.forEach(function(e){n===!1&&typeof this.edgeSprings[e.id]!="undefined"&&(n=this.edgeSprings[e.id])},this);if(n!==!1)return new r.ForceDirected.Spring(n.point2,n.point1,0,0);this.edgeSprings[e.id]=new r.ForceDirected.Spring(this.point(e.source),this.point(e.target),t,this.stiffness)}return this.edgeSprings[e.id]},r.ForceDirected.prototype.eachNode=function(e){var t=this;this.graph.nodes.forEach(function(n){e.call(t,n,t.point(n))})},r.ForceDirected.prototype.eachEdge=function(e){var t=this;this.graph.edges.forEach(function(n){e.call(t,n,t.spring(n))})},r.ForceDirected.prototype.eachSpring=function(e){var t=this;this.graph.edges.forEach(function(n){e.call(t,t.spring(n))})},r.ForceDirected.prototype.applyCoulombsLaw=function(){this.eachNode(function(e,t){this.eachNode(function(e,n){if(t!==n){var r=t.p.subtract(n.p),i=r.magnitude()+.1,s=r.normalise();t.applyForce(s.multiply(this.repulsion).divide(i*i*.5)),n.applyForce(s.multiply(this.repulsion).divide(i*i*-0.5))}})})},r.ForceDirected.prototype.applyHookesLaw=function(){this.eachSpring(function(e){var t=e.point2.p.subtract(e.point1.p),n=e.length-t.magnitude(),r=t.normalise();e.point1.applyForce(r.multiply(e.k*n*-0.5)),e.point2.applyForce(r.multiply(e.k*n*.5))})},r.ForceDirected.prototype.attractToCentre=function(){this.eachNode(function(e,t){var n=t.p.multiply(-1);t.applyForce(n.multiply(this.repulsion/50))})},r.ForceDirected.prototype.updateVelocity=function(e){this.eachNode(function(t,n){n.v=n.v.add(n.a.multiply(e)).multiply(this.damping),n.a=new Vector(0,0)})},r.ForceDirected.prototype.updatePosition=function(e){this.eachNode(function(t,n){n.p=n.p.add(n.v.multiply(e))})},r.ForceDirected.prototype.totalEnergy=function(e){var t=0;return this.eachNode(function(e,n){var r=n.v.magnitude();t+=.5*n.m*r*r}),t};var i=function(e,t){return function(){return e.apply(t,arguments)}};r.requestAnimationFrame=i(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,10)},window),r.ForceDirected.prototype.start=function(e,t,n){var i=this;if(this._started)return;this._started=!0,r.requestAnimationFrame(function s(){i.applyCoulombsLaw(),i.applyHookesLaw(),i.attractToCentre(),i.updateVelocity(.03),i.updatePosition(.03),typeof t!="undefined"&&t(),i.totalEnergy()<.01?(i._started=!1,typeof n!="undefined"&&n()):r.requestAnimationFrame(s)})},r.ForceDirected.prototype.nearest=function(e){var t={node:null,point:null,distance:null},n=this;return this.graph.nodes.forEach(function(r){var i=n.point(r),s=i.p.subtract(e).magnitude();if(t.distance===null||s<t.distance)t={node:r,point:i,distance:s}}),t},r.ForceDirected.prototype.getBoundingBox=function(){var e=new Vector(-2,-2),t=new Vector(2,2);this.eachNode(function(n,r){r.p.x<e.x&&(e.x=r.p.x),r.p.y<e.y&&(e.y=r.p.y),r.p.x>t.x&&(t.x=r.p.x),r.p.y>t.y&&(t.y=r.p.y)});var n=t.subtract(e).multiply(.07);return{bottomleft:e.subtract(n),topright:t.add(n)}},Vector=function(e,t){this.x=e,this.y=t},Vector.random=function(){return new Vector(10*(Math.random()-.5),10*(Math.random()-.5))},Vector.prototype.add=function(e){return new Vector(this.x+e.x,this.y+e.y)},Vector.prototype.subtract=function(e){return new Vector(this.x-e.x,this.y-e.y)},Vector.prototype.multiply=function(e){return new Vector(this.x*e,this.y*e)},Vector.prototype.divide=function(e){return new Vector(this.x/e||0,this.y/e||0)},Vector.prototype.magnitude=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},Vector.prototype.normal=function(){return new Vector(-this.y,this.x)},Vector.prototype.normalise=function(){return this.divide(this.magnitude())},r.ForceDirected.Point=function(e,t){this.p=e,this.m=t,this.v=new Vector(0,0),this.a=new Vector(0,0)},r.ForceDirected.Point.prototype.applyForce=function(e){this.a=this.a.add(e.divide(this.m))},r.ForceDirected.Spring=function(e,t,n,r){this.point1=e,this.point2=t,this.length=n,this.k=r},s.prototype.graphChanged=function(e){this.start()},s.prototype.start=function(){var e=this;this.layout.start(50,function(){e.clear(),e.layout.eachEdge(function(t,n){e.drawEdge(t,n.point1.p,n.point2.p)}),e.layout.eachNode(function(t,n){e.drawNode(t,n.p)})})}});