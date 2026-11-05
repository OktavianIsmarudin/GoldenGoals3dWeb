/* A procedural study desk: geometry only, no downloaded room photographs. */
(()=>{
const meshes=[];
function mesh(positions,normals,center,color,surface=0,rotation=0){
  const edges=[];for(let i=0;i<positions.length;i+=9){const a=positions.slice(i,i+3),b=positions.slice(i+3,i+6),c=positions.slice(i+6,i+9);edges.push(...a,...b,...b,...c,...c,...a);}
  meshes.push({id:meshes.length+7,positions,normals,edges,center,color:color.map(v=>v/255),environment:true,surface,rotation});
}
function box(center,size,color,surface=0,rotation=0){
 const positions=[],normals=[];
 const faces=[[[0,0,1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[0,0,-1],[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],[[1,0,0],[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],[[-1,0,0],[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[0,1,0],[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],[[0,-1,0],[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]];
 for(const [normal,...corners] of faces)for(const i of [0,1,2,0,2,3]){positions.push(...corners[i].map((v,j)=>v*size[j]/2));normals.push(...normal);}
 mesh(positions,normals,center,color,surface,rotation);
}
function cylinder(center,radius,height,color){
 const p=[],n=[];
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2,b=(i+1)/32*Math.PI*2,A=[Math.cos(a)*radius,0,Math.sin(a)*radius],B=[Math.cos(b)*radius,0,Math.sin(b)*radius];
  for(const sign of [-1,1]){const points=sign>0?[[0,height/2,0],[B[0],height/2,B[2]],[A[0],height/2,A[2]]]:[[0,-height/2,0],[A[0],-height/2,A[2]],[B[0],-height/2,B[2]]];for(const point of points){p.push(...point);n.push(0,sign,0);}}
  for(const [point,y,angle] of [[A,-1,a],[B,-1,b],[B,1,b],[A,-1,a],[B,1,b],[A,1,a]]){p.push(point[0],y*height/2,point[2]);n.push(Math.cos(angle),0,Math.sin(angle));}
 }
 mesh(p,n,center,color);
}
// Room envelope and a large timber work surface.
box([0,-2.1,-1],[15,.2,12],[90,86,73],1);
box([0,1.7,-4.1],[15,8,.18],[211,201,176]);
box([6.7,1.7,-1],[.15,8,7],[173,164,140]);
box([0,-1.69,-.35],[9.4,.22,4.5],[167,112,65],1);
for(const x of [-4.1,4.1])box([x,-2.45,-.2],[.18,1.5,3.5],[58,60,52]);
// A sage desk mat and low round plinth under the hovering emblem.
box([0,-1.565,0],[3.6,.028,2.8],[69,100,88]);
for(let i=-7;i<=7;i++)box([i*.22,-1.546,0],[.006,.004,2.7],[107,130,111]);
cylinder([0,-1.49,.08],1.13,.12,[222,210,174]);
cylinder([0,-1.419,.08],1.04,.025,[57,71,59]);
// Books, loose paper, pencil, a cup and a small plant.
box([2.8,-1.5,.2],[1.5,.14,1.1],[225,216,188],0,-.16);
box([2.8,-1.41,.2],[1.55,.04,1.15],[51,83,123],0,-.16);
box([2.8,-1.56,.2],[1.55,.035,1.15],[51,83,123],0,-.16);
box([2.8,-1.38,.2],[.045,.008,1.15],[227,187,87],0,-.16);
box([-2.5,-1.53,.35],[1.45,.04,1.05],[236,229,204],0,.15);
for(let i=0;i<6;i++)box([-2.5,-1.505,.04+i*.12],[1.1,.006,.012],[174,177,156],0,.15);
box([-1.9,-1.48,1.03],[1.1,.045,.045],[235,174,44],0,.45);
cylinder([-3.45,-1.29,-1.05],.25,.55,[222,217,193]);
for(let i=0;i<3;i++)box([-3.52+i*.07,-.83,-1.05],[.025,.65,.025],[56+i*22,63+i*12,58]);
cylinder([3.7,-1.3,-1.35],.32,.55,[162,110,80]);
for(let i=0;i<7;i++){const a=i/7*Math.PI*2;box([3.7+Math.cos(a)*.18,-.75,-1.35+Math.sin(a)*.18],[.12,.72,.1],[63+i*5,98+i*4,58],0,a);}
// Window light and a shelf on the back wall.
box([-3.3,1.35,-3.95],[3.4,2.65,.12],[89,99,82]);
for(const x of [-4.12,-2.48])for(const y of [.72,1.98])box([x,y,-3.86],[1.51,1.13,.04],[242,226,181],2);
box([2.6,.7,-3.65],[3.8,.12,.8],[144,107,67],1);
for(let i=0;i<5;i++)box([1.25+i*.26,1.14,-3.6],[.19,.78,.43],[[86,102,85],[182,135,69],[211,201,167],[64,87,119],[157,87,63]][i]);
box([3.45,1.16,-3.7],[.75,.8,.08],[211,196,150]);
box([3.45,1.16,-3.64],[.57,.62,.03],[59,78,68]);
window.GoldenRoomMeshes=meshes;
})();
