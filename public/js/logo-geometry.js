/* Golden Goals native mesh data. No network dependencies. */
(()=>{'use strict';const faces=[],groups=[];const colors={blue:[49,104,178],red:[243,65,45],gold:[246,188,53]};
function cross(a,b,c){return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);}
function triangulate(polygon){
  const indices=polygon.map((_,i)=>i), triangles=[];
  const area=polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p.x*q.y-q.x*p.y;},0);
  if(area<0) indices.reverse();
  let guard=polygon.length*polygon.length;
  while(indices.length>3 && guard-- > 0){
    let found=false;
    for(let i=0;i<indices.length;i++){
      const a=indices[(i+indices.length-1)%indices.length],b=indices[i],c=indices[(i+1)%indices.length];
      if(cross(polygon[a],polygon[b],polygon[c])<=1e-8) continue;
      const occupied=indices.some(k=>k!==a&&k!==b&&k!==c&&cross(polygon[a],polygon[b],polygon[k])>=-1e-8&&cross(polygon[b],polygon[c],polygon[k])>=-1e-8&&cross(polygon[c],polygon[a],polygon[k])>=-1e-8);
      if(occupied) continue;
      triangles.push([a,b,c]);indices.splice(i,1);found=true;break;
    }
    if(!found) throw new Error('Logo silhouette could not be triangulated.');
  }
  if(indices.length===3) triangles.push([...indices]);
  return triangles;
}
function outline(start,curves){
  const result=[{x:start[0],y:start[1]}];let p=result[0];
  for(const [x1,y1,x2,y2,x3,y3] of curves){
    for(let i=1;i<=10;i++){
      const t=i/10,s=1-t;
      result.push({x:s*s*s*p.x+3*s*s*t*x1+3*s*t*t*x2+t*t*t*x3,y:s*s*s*p.y+3*s*s*t*y1+3*s*t*t*y2+t*t*t*y3});
    }
    p={x:x3,y:y3};
  }
  // The closed outline must not repeat its first vertex for ear clipping.
  const end=result[result.length-1];
  if(Math.hypot(end.x-result[0].x,end.y-result[0].y)<.001) result.pop();
  return result;
}
function extrude(points,color,depth=.14){
  const group=groups.length;groups.push({color});
  const polygon=points.map(p=>({x:(p.x-250)/150,y:(p.y-210)/150}));
  const area=polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p.x*q.y-q.x*p.y;},0);
  if(area<0) polygon.reverse();
  const center=polygon.reduce((c,p)=>({x:c.x+p.x/polygon.length,y:c.y+p.y/polygon.length}),{x:0,y:0});
  const rings=[{z:-depth,shrink:.97},{z:-depth*.65,shrink:1},{z:depth*.65,shrink:1},{z:depth,shrink:.97}].map(r=>polygon.map(p=>({x:center.x+(p.x-center.x)*r.shrink,y:center.y+(p.y-center.y)*r.shrink,z:r.z})));
  for(const [a,b,c] of triangulate(polygon)){
    faces.push({group,points:[rings[3][a],rings[3][b],rings[3][c]],color});
    faces.push({group,points:[rings[0][c],rings[0][b],rings[0][a]],color});
  }
  for(let layer=0;layer<3;layer++) for(let i=0;i<polygon.length;i++){
    const j=(i+1)%polygon.length;
    faces.push({group,points:[rings[layer][i],rings[layer][j],rings[layer+1][j],rings[layer+1][i]],color});
  }
}
// The two rising human figures, their heads, and three stars; no wordmark.
const blueBody=outline([211,139],[
  [208,171,197,190,169,207],[143,224,104,250,101,288],
  [99,304,103,303,111,294],[139,259,165,264,184,285],
  [209,314,172,365,166,391],[162,404,177,391,187,380],
  [218,348,242,317,248,280],[254,236,242,184,219,143],
  [215,136,213,135,211,139]
]);
extrude(blueBody,colors.blue);
extrude(blueBody.map(p=>({x:506-p.x,y:p.y})),colors.red);
function ellipse(cx,cy,rx,ry,rotation){
  return Array.from({length:48},(_,i)=>{const a=i/48*Math.PI*2,x=Math.cos(a)*rx,y=Math.sin(a)*ry;return {x:cx+x*Math.cos(rotation)-y*Math.sin(rotation),y:cy+x*Math.sin(rotation)+y*Math.cos(rotation)};});
}
extrude(ellipse(156,154,28,32,-.32),colors.blue,.17);
extrude(ellipse(349,154,28,32,.32),colors.red,.17);
function star(cx,cy,r,rotation=0){
  return Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5+rotation,rad=i%2?r*.49:r;return {x:cx+Math.cos(a)*rad,y:cy+Math.sin(a)*rad};});
}
extrude(star(253,72,51),colors.gold,.14);
extrude(star(95,329,29,-.24),colors.gold,.10);
extrude(star(410,329,29,.24),colors.gold,.10);


const meshes=groups.map((group,id)=>{
  const members=faces.filter(f=>f.group===id), all=members.flatMap(f=>f.points);
  const center=['x','y','z'].map(axis=>(Math.min(...all.map(p=>p[axis]))+Math.max(...all.map(p=>p[axis])))/2);
  center[1]=-center[1];
  const positions=[],normals=[],edges=[];
  const cv=p=>[p.x-center[0],-p.y-center[1],p.z-center[2]];
  for(const face of members){
    const pts=face.points.map(cv).reverse();
    const a=pts[0],b=pts[1],c=pts[2];
    const u=b.map((v,i)=>v-a[i]),v=c.map((q,i)=>q-a[i]);
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const len=Math.hypot(...n)||1;const normal=n.map(q=>q/len);
    for(let j=1;j<pts.length-1;j++){positions.push(...pts[0],...pts[j],...pts[j+1]);normals.push(...normal,...normal,...normal);}
    for(let j=0;j<pts.length;j++)edges.push(...pts[j],...pts[(j+1)%pts.length]);
  }
  return {id,center,color:group.color.map(c=>c/255),positions,normals,edges};
});
window.GoldenLogoMeshes=meshes;
})();
