import{s as c,j as e,t as d}from"./noteState.CxiVbVoC.js";import{r as s}from"./index.DhYZZe0J.js";function a(){const[i,r]=s.useState(!0),[o,n]=s.useState(!1);return s.useEffect(()=>{const t=()=>{n(window.innerWidth<760)};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),s.useEffect(()=>c(l=>{r(l)}),[]),o?e.jsx("button",{onClick:d,className:"sidenote-toggle",title:`${i?"Hide":"Show"} all sidenotes`,children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:i?e.jsxs(e.Fragment,{children:[e.jsx("circle",{cx:"12",cy:"12",r:"8"}),e.jsx("text",{x:"12",y:"15",textAnchor:"middle",fill:"currentColor",stroke:"none",style:{fontSize:"10px",fontWeight:"bold"},children:"1"})]}):e.jsxs(e.Fragment,{children:[e.jsx("circle",{cx:"12",cy:"12",r:"8",strokeDasharray:"4 4"}),e.jsx("text",{x:"12",y:"15",textAnchor:"middle",fill:"currentColor",stroke:"none",style:{fontSize:"10px",fontWeight:"bold"},children:"1"})]})})}):null}export{a as default};
