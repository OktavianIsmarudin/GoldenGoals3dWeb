/* Golden Goals Cinematic — five scroll scenes and a procedural study room. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),canvas=$('#experience-canvas'),lab=$('#explore');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const announce=text=>{$('#scene-status').textContent=text;};
let paused=reduced.matches,material='studio',selection=-1;
let dragging=false,moved=false,lastX=0,lastY=0,startX=0,startY=0,velocity=0;
let time=0,lastTime=0,width=1,height=1,dpr=1,inView=true,raf=0,contextLost=false;
let sceneReady=false,activeChapter=-1;
let reducedPreference=reduced.matches;
const current={yaw:-.2,pitch:.06,explode:0,zoom:1,px:0,py:0,room:0,logoScale:1,logoY:0,cameraX:0,cameraY:0};
const target={...current};
const identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function translation(x,y,z){const m=identity();m[12]=x;m[13]=y;m[14]=z;return m;}
function rotationX(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;}
function rotationY(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m;}
function rotationZ(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m;}
function scaling(v){const m=identity();m[0]=m[5]=m[10]=v;return m;}
function perspective(aspect){const f=1/Math.tan(.66/2),m=new Float32Array(16),near=.1,far=40;m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=2*far*near/(near-far);return m;}
function lookAt(eye,center){
 const normalize=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);};
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const z=normalize(eye.map((v,i)=>v-center[i])),x=normalize(cross([0,1,0],z)),y=cross(z,x),m=identity();
 for(let i=0;i<3;i++){m[i*4]=x[i];m[i*4+1]=y[i];m[i*4+2]=z[i];}
 m[12]=-x.reduce((sum,v,i)=>sum+v*eye[i],0);m[13]=-y.reduce((sum,v,i)=>sum+v*eye[i],0);m[14]=-z.reduce((sum,v,i)=>sum+v*eye[i],0);return m;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
let gl;
try{gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:true,premultipliedAlpha:false});}catch{}
const fallback=message=>{lab.classList.remove('webgl-ready');$('#fallback-message').textContent=message;$('#renderer-label').textContent='STATIC PREVIEW';lab.querySelectorAll('.control-dock button,.control-dock input').forEach(e=>e.disabled=true);};

// Page interactions work independently of WebGL support.
if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-reveal');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');observer.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
}
function pageScroll(){
  const length=document.documentElement.scrollHeight-innerHeight;
  $('.scroll-progress').style.width=`${length>0?scrollY/length*100:0}%`;
  const steps=[...document.querySelectorAll('[data-step]')];
  const anchors=steps.map(e=>e.getBoundingClientRect().top+scrollY);
  const position=scrollY+innerHeight*.12;
  let index=0;while(index<anchors.length-1&&position>=anchors[index+1])index++;
  const next=Math.min(index+1,anchors.length-1);
  const raw=next===index?0:clamp((position-anchors[index])/(anchors[next]-anchors[index]),0,1);
  const t=raw*raw*(3-2*raw);
  const poses=[
   {yaw:-.2,pitch:.06,explode:0,zoom:1,room:0,logoScale:1,logoY:0,cameraX:0,cameraY:0},
   {yaw:2.6,pitch:.12,explode:.12,zoom:1.15,room:0,logoScale:1.1,logoY:0,cameraX:0,cameraY:0},
   {yaw:6.15,pitch:.02,explode:0,zoom:.9,room:1,logoScale:.68,logoY:-.35,cameraX:1.5,cameraY:1.25},
   {yaw:7.1,pitch:-.08,explode:.7,zoom:.94,room:1,logoScale:.72,logoY:-.1,cameraX:-1.2,cameraY:1.55},
   {yaw:12.38,pitch:.04,explode:0,zoom:1.03,room:0,logoScale:1.05,logoY:0,cameraX:0,cameraY:0}
  ];
  const from=poses[index],to=poses[next];
  for(const key of Object.keys(poses[0]))target[key]=reduced.matches?poses[0][key]:lerp(from[key],to[key],t);
  const chapter=raw>.52?next:index;
  if(chapter!==activeChapter){
    activeChapter=chapter;document.body.dataset.chapter=chapter;
    document.querySelectorAll('.chapter-marker').forEach(e=>{const active=Number(e.dataset.chapter)===chapter;e.classList.toggle('active',active);if(active)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current');});
  }
  document.documentElement.style.setProperty('--room-progress',target.room.toFixed(3));
  if(sceneReady){updateSliders();ensureFrame();}
}
addEventListener('scroll',pageScroll,{passive:true});pageScroll();
if(matchMedia('(hover:hover)').matches&&!reduced.matches)document.querySelectorAll('.learning-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-3px)`;});
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
});
let focusFallback=false,previousFocus=null;
function syncFullscreen(){const active=!!document.fullscreenElement||focusFallback;$('#fullscreen').textContent=active?'×':'⛶';$('#fullscreen').setAttribute('aria-label',active?'Keluar layar penuh':'Buka layar penuh');$('#fullscreen').setAttribute('aria-pressed',String(active));if(gl)resize();}
function exitFocus(){focusFallback=false;lab.classList.remove('focus-mode');document.body.style.overflow='';syncFullscreen();previousFocus?.focus({preventScroll:true});}
$('#fullscreen').addEventListener('click',async()=>{
  if(focusFallback){exitFocus();return;}
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  previousFocus=document.activeElement;
  try{if(!lab.requestFullscreen)throw Error('Fullscreen unsupported');await lab.requestFullscreen();canvas.focus({preventScroll:true});}
  catch{focusFallback=true;lab.classList.add('focus-mode');document.body.style.overflow='hidden';syncFullscreen();canvas.focus({preventScroll:true});}
});
addEventListener('keydown',e=>{
  if(e.key==='Escape'&&focusFallback)exitFocus();
  if(e.key==='Tab'&&focusFallback){const items=[...lab.querySelectorAll('button:not(:disabled),input:not(:disabled),canvas')],first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
document.addEventListener('fullscreenchange',syncFullscreen);
if(!gl||!window.GoldenLogoMeshes){fallback('Browser ini belum mendukung WebGL. Simbol tetap ditampilkan; coba browser dengan akselerasi grafis aktif.');return;}

const vertexSource=`
attribute vec3 aPosition;attribute vec3 aNormal;
uniform mat4 uModel;uniform mat4 uVP;
varying vec3 vWorld;varying vec3 vNormal;
void main(){vec4 world=uModel*vec4(aPosition,1.0);vWorld=world.xyz;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uVP*world;}`;
const fragmentSource=`
precision mediump float;
uniform vec3 uColor;uniform vec3 uCamera;uniform float uMode;uniform float uHighlight;uniform float uFade;uniform float uPick;uniform float uId;uniform float uWire;uniform float uRoom;
varying vec3 vWorld;varying vec3 vNormal;
void main(){
 if(uPick>0.5){gl_FragColor=vec4(uId/255.0,0.0,0.0,1.0);return;}
 if(uWire>0.5){gl_FragColor=vec4(mix(uColor,vec3(1.0),.3)*uFade,1.0);return;}
 vec3 N=normalize(vNormal);if(!gl_FrontFacing)N=-N;
 vec3 V=normalize(uCamera-vWorld),L=normalize(vec3(-3.0,4.5,6.0)-vWorld),H=normalize(V+L);
 float diff=max(dot(N,L),0.0),rim=pow(1.0-max(dot(N,V),0.0),3.0);
 float spec=pow(max(dot(N,H),0.0),mix(48.0,110.0,uMode));
 vec3 R=reflect(-V,N);
 float band=pow(max(0.0,sin(R.y*5.0+R.x*2.5)),14.0);
 vec3 env=mix(vec3(.11,.16,.23),vec3(.85,.91,1.0),smoothstep(-.35,.8,R.y));
 vec3 base=uColor*(.30+diff*.75)+vec3(1.0,.94,.80)*spec*.35+vec3(.28,.48,.74)*rim*.25;
 if(uMode>.5)base=mix(base,env*uColor*.75+env*.28+vec3(band*.5)+vec3(spec*.6),.72);
 base+=uColor*uHighlight*.22+vec3(1.0,.79,.4)*rim*uHighlight*.4;
 if(uMode>1.5)base=uColor*.12+base*.10;
 if(uRoom>.5){
  float ambient=.56+max(dot(N,normalize(vec3(-.6,.8,.6))),0.0)*.42;
  base=uColor*ambient+vec3(1.0,.9,.66)*spec*.06;
  if(uRoom>1.5&&uRoom<2.5){float grain=sin(vWorld.x*42.0+sin(vWorld.z*8.0)*2.0)*.035;base*=.94+grain;}
  if(uRoom>2.5)base=uColor*1.12;
  float shadow=exp(-length(vWorld.xz)*1.6)*.25*max(N.y,0.0);base*=1.0-shadow;
 }
 base*=uFade;
 gl_FragColor=vec4(pow(base,vec3(.87)),1.0);
}`;
const particleVertex=`attribute vec3 aPosition;uniform mat4 uVP;uniform float uDpr;void main(){gl_Position=uVP*vec4(aPosition,1.0);gl_PointSize=uDpr*(2.2+sin(aPosition.x*13.0)*.9);}`;
const particleFragment=`precision mediump float;void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(.9,.75,.46,(1.0-r*2.0)*.48);}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
function program(vertex,fragment){const p=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));gl.deleteShader(vs);gl.deleteShader(fs);return p;}
function buffer(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;}
let mainProgram,pointProgram,meshes,pointBuffer;
try{
  mainProgram=program(vertexSource,fragmentSource);pointProgram=program(particleVertex,particleFragment);
  meshes=[...window.GoldenLogoMeshes,...(window.GoldenRoomMeshes||[])].map(m=>({...m,vertices:buffer(m.positions),normalsBuffer:buffer(m.normals),lines:buffer(m.edges),count:m.positions.length/3,lineCount:m.edges.length/3}));
  pointBuffer=gl.createBuffer();
}catch(error){console.error('Golden Goals WebGL:',error);fallback('Pengalaman 3D tidak dapat diaktifkan pada perangkat ini. Simbol tetap tersedia.');return;}
const locations={};
for(const name of ['uModel','uVP','uColor','uCamera','uMode','uHighlight','uFade','uPick','uId','uWire','uRoom'])locations[name]=gl.getUniformLocation(mainProgram,name);
const pos=gl.getAttribLocation(mainProgram,'aPosition'),normal=gl.getAttribLocation(mainProgram,'aNormal');
const pointLoc={position:gl.getAttribLocation(pointProgram,'aPosition'),vp:gl.getUniformLocation(pointProgram,'uVP'),dpr:gl.getUniformLocation(pointProgram,'uDpr')};
const seeds=Array.from({length:matchMedia('(max-width:760px)').matches?75:140},(_,i)=>({x:Math.sin(i*127.1)*3.8,y:Math.sin(i*311.7)*2.7,z:-2.3-(Math.sin(i*73.3)+1)*1.2}));
const particleData=new Float32Array(seeds.length*3);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
lab.classList.add('webgl-ready');$('#renderer-label').textContent='CINEMATIC WEBGL';
function resize(){const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);ensureFrame();}
new ResizeObserver(resize).observe(canvas);resize();
if('IntersectionObserver' in window)new IntersectionObserver(e=>{inView=e[0].isIntersecting;if(inView)ensureFrame();}).observe(lab);
const details=[
 ['01 / BLUE','A little courage.','Figur biru · putar untuk melihat ketebalan dan bevel.'],
 ['02 / RED','A little more energy.','Figur merah · bagian yang terpisah dari figur biru.'],
 ['03 / BLUE','A different perspective.','Kepala figur biru · bagian dari komposisi logo.'],
 ['04 / RED','Room for possibility.','Kepala figur merah · lihat dari sudut yang baru.'],
 ['05 / GOLD','Keep your dream in sight.','Bintang utama · warna emas khas Golden Goals.'],
 ['06 / GOLD','Small steps count.','Bintang kiri · satu detail dari keseluruhan bentuk.'],
 ['07 / GOLD','Your next chapter.','Bintang kanan · eksplorasi tanpa batas.']
];
function selectPart(index){selection=index===selection?-1:index;const d=details[selection]||['01—07','One dream. Many possibilities.','Dua figur. Tiga bintang. Satu langkah ke depan.'];$('#part-number').textContent=d[0];$('#part-title').textContent=d[1];$('#part-description').textContent=d[2];announce(selection<0?'Semua bagian logo ditampilkan':d[2]);ensureFrame();}
function models(){
  const spin=paused?0:Math.sin(time*.45)*.19;
  const group=multiply(rotationY(current.yaw+spin+current.px*.2),rotationX(current.pitch+current.py*.11));
  return meshes.map((mesh,i)=>{
    if(mesh.environment){const [x,y,z]=mesh.center;return multiply(translation(x,y-(1-current.room)*14,z),rotationY(mesh.rotation||0));}
    const [x,y,z]=mesh.center,e=current.explode;
    const tx=x*(1+e*.65),ty=y*(1+e*.6)+(paused?0:Math.sin(time*.8+i*.7)*.025),tz=z+e*((i%3-1)*.6);
    let local=multiply(translation(tx,ty,tz),rotationY(e*Math.sin(i*2)*.35));
    local=multiply(local,rotationZ(e*Math.cos(i)*.12));
    local=multiply(local,scaling(selection===i?1.065:1));
    const logo=multiply(translation(0,current.logoY,0),multiply(scaling(current.logoScale),group));
    return multiply(logo,local);
  });
}
function draw(pick=false){
  if(contextLost)return;
  gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const mobile=width/height<.85;
  const distance=(5.8+current.explode*.9+(mobile?3.0:0))/current.zoom;
  const eye=[current.cameraX,current.cameraY,distance];
  const vp=multiply(perspective(width/height),lookAt(eye,[0,-current.room*.35,0]));
  const modelMatrices=models();
  if(!pick){
    for(let i=0;i<seeds.length;i++){const s=seeds[i];particleData[i*3]=s.x+Math.sin(time*.08+i)*.12;particleData[i*3+1]=s.y+Math.cos(time*.1+i)*.12;particleData[i*3+2]=s.z;}
    gl.useProgram(pointProgram);gl.bindBuffer(gl.ARRAY_BUFFER,pointBuffer);gl.bufferData(gl.ARRAY_BUFFER,particleData,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(pointLoc.position);gl.vertexAttribPointer(pointLoc.position,3,gl.FLOAT,false,0,0);gl.uniformMatrix4fv(pointLoc.vp,false,vp);gl.uniform1f(pointLoc.dpr,dpr);gl.enable(gl.BLEND);gl.depthMask(false);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.drawArrays(gl.POINTS,0,seeds.length);gl.depthMask(true);gl.disable(gl.BLEND);
  }
  gl.useProgram(mainProgram);gl.uniformMatrix4fv(locations.uVP,false,vp);gl.uniform3fv(locations.uCamera,eye);gl.uniform1f(locations.uPick,pick?1:0);
  if(pick)gl.disable(gl.DITHER);else gl.enable(gl.DITHER);
  for(let i=0;i<meshes.length;i++){
    const m=meshes[i];if(m.environment&&current.room<.015)continue;
    gl.uniform1f(locations.uRoom,m.environment?(m.surface||0)+1:0);gl.uniform1f(locations.uMode,m.environment?0:material==='chrome'?1:material==='wire'?2:0);
    gl.uniformMatrix4fv(locations.uModel,false,modelMatrices[i]);gl.uniform3fv(locations.uColor,m.color);gl.uniform1f(locations.uId,m.environment?0:i+1);gl.uniform1f(locations.uHighlight,selection===i?1:0);gl.uniform1f(locations.uFade,m.environment||selection<0||selection===i?1:.38);gl.uniform1f(locations.uWire,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,m.vertices);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,m.normalsBuffer);gl.enableVertexAttribArray(normal);gl.vertexAttribPointer(normal,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,m.count);
    if(material==='wire'&&!pick&&!m.environment){gl.uniform1f(locations.uWire,1);gl.bindBuffer(gl.ARRAY_BUFFER,m.lines);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);gl.disableVertexAttribArray(normal);gl.vertexAttrib3f(normal,0,0,1);gl.drawArrays(gl.LINES,0,m.lineCount);}
  }
}
function pickAt(clientX,clientY){const rect=canvas.getBoundingClientRect(),pixel=new Uint8Array(4);draw(true);gl.readPixels(clamp(Math.floor((clientX-rect.left)*dpr),0,canvas.width-1),clamp(Math.floor((rect.bottom-clientY)*dpr),0,canvas.height-1),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);selectPart(pixel[0]>0&&pixel[0]<=7?pixel[0]-1:-1);draw();}
function updateSliders(){const e=Math.round(target.explode*100),z=Math.round(target.zoom*100);$('#explode').value=e;$('#explode-value').textContent=`${e}%`;$('#zoom').value=z;$('#zoom-value').textContent=`${z}%`;}
function reset(){target.px=target.py=0;velocity=0;selectPart(-1);pageScroll();announce('Posisi logo dikembalikan ke bagian cerita saat ini.');ensureFrame();}
function syncPause(){const b=$('#pause');b.textContent=paused?'▶':'Ⅱ';b.setAttribute('aria-label',paused?'Mulai animasi':'Jeda animasi');b.setAttribute('aria-pressed',String(paused));}
$('#pause').addEventListener('click',()=>{paused=!paused;velocity=0;syncPause();ensureFrame();});
$('#reset').addEventListener('click',reset);
$('#explode').addEventListener('input',e=>{target.explode=Number(e.target.value)/100;updateSliders();ensureFrame();});
$('#zoom').addEventListener('input',e=>{target.zoom=Number(e.target.value)/100;updateSliders();ensureFrame();});
document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{material=button.dataset.material;document.querySelectorAll('[data-material]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});announce(`Material ${button.textContent} aktif.`);ensureFrame();}));
$('#try-explode')?.addEventListener('click',()=>{target.explode=1;updateSliders();ensureFrame();});
canvas.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;dragging=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;velocity=0;canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{
  if(dragging){const dx=e.clientX-lastX,dy=e.clientY-lastY;target.yaw+=dx*.007;target.pitch=clamp(target.pitch+dy*.006,-1.1,1.1);velocity=dx*.13;lastX=e.clientX;lastY=e.clientY;if(Math.hypot(e.clientX-startX,e.clientY-startY)>5)moved=true;}
  else if(e.pointerType!=='touch'&&!reduced.matches){const r=canvas.getBoundingClientRect();target.px=(e.clientX-r.left)/r.width-.5;target.py=(e.clientY-r.top)/r.height-.5;}
  ensureFrame();
});
canvas.addEventListener('pointerleave',()=>{target.px=target.py=0;ensureFrame();});
canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(!moved)pickAt(e.clientX,e.clientY);if(paused||reduced.matches)velocity=0;});
for(const event of ['pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{dragging=false;velocity=0;});
canvas.addEventListener('keydown',e=>{
  const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-',' ','x','X','r','R'];if(!keys.includes(e.key))return;e.preventDefault();
  if(e.key==='ArrowLeft')target.yaw-=.16;if(e.key==='ArrowRight')target.yaw+=.16;if(e.key==='ArrowUp')target.pitch=clamp(target.pitch-.12,-1.1,1.1);if(e.key==='ArrowDown')target.pitch=clamp(target.pitch+.12,-1.1,1.1);
  if(e.key==='+'||e.key==='=')target.zoom=clamp(target.zoom+.05,.75,1.35);if(e.key==='-')target.zoom=clamp(target.zoom-.05,.75,1.35);
  if(e.key===' '){paused=!paused;syncPause();}if(e.key.toLowerCase()==='x')target.explode=target.explode>.5?0:1;if(e.key.toLowerCase()==='r')reset();updateSliders();ensureFrame();
});
$('#snapshot').addEventListener('click',()=>{
  draw();const output=document.createElement('canvas');output.width=canvas.width;output.height=canvas.height;const c=output.getContext('2d');c.fillStyle='#151410';c.fillRect(0,0,output.width,output.height);c.drawImage(canvas,0,0);
  output.toBlob(blob=>{if(!blob){announce('Gambar belum dapat disimpan.');return;}const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='golden-goals-3d.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Gambar logo 3D disimpan sebagai PNG.');},'image/png');
});
function ensureFrame(){if(!raf&&!contextLost&&!document.hidden)raf=requestAnimationFrame(frame);}
function frame(now){
  raf=0;const dt=Math.min((now-lastTime)/1000||.016,.04);lastTime=now;
  syncReducedMotion();
  if(document.hidden||!inView||contextLost)return;
  if(!paused&&!reduced.matches){time+=dt;if(!dragging){target.yaw+=velocity*dt;velocity*=Math.exp(-dt*5);}}
  let unsettled=false;const ease=reduced.matches?1:1-Math.exp(-dt*9);
  for(const key in current){current[key]=lerp(current[key],target[key],ease);if(Math.abs(current[key]-target[key])>.0001)unsettled=true;}
  draw();if(!paused||unsettled||dragging)ensureFrame();
}
function syncReducedMotion(){const preference=reduced.matches;if(preference===reducedPreference)return;reducedPreference=preference;paused=preference;velocity=0;syncPause();pageScroll();ensureFrame();}
reduced.addEventListener('change',syncReducedMotion);
document.addEventListener('visibilitychange',()=>{lastTime=performance.now();if(!document.hidden)ensureFrame();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;$('#renderer-label').textContent='GRAPHICS PAUSED';announce('Koneksi grafis terputus. Muat ulang halaman untuk memulai kembali.');});
canvas.addEventListener('webglcontextrestored',()=>{location.reload();});
addEventListener('resize',()=>{resize();ensureFrame();},{passive:true});
sceneReady=true;syncPause();pageScroll();draw();ensureFrame();
})();
