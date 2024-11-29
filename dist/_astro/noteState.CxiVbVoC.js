import{r as c}from"./index.DhYZZe0J.js";var _={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y=c,b=Symbol.for("react.element"),m=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,g=y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,x={key:!0,ref:!0,__self:!0,__source:!0};function h(e,r,p){var t,s={},n=null,d=null;p!==void 0&&(n=""+p),r.key!==void 0&&(n=""+r.key),r.ref!==void 0&&(d=r.ref);for(t in r)a.call(r,t)&&!x.hasOwnProperty(t)&&(s[t]=r[t]);if(e&&e.defaultProps)for(t in r=e.defaultProps,r)s[t]===void 0&&(s[t]=r[t]);return{$$typeof:b,type:e,key:n,ref:d,props:s,_owner:g.current}}i.Fragment=m;i.jsx=h;i.jsxs=h;_.exports=i;var E=_.exports;let u=null,o=!0;const l=new Set,f=new Set,S=e=>(l.add(e),u!==null&&e(u),()=>{l.delete(e)}),O=e=>{u=e,l.forEach(r=>r(e))},R=e=>(f.add(e),e(o),()=>{f.delete(e)}),j=()=>{o=!o,f.forEach(e=>e(o))};export{S as a,O as b,E as j,R as s,j as t};
