if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const l=e=>i(e,t),d={module:{uri:t},exports:o,require:l};s[t]=Promise.all(n.map((e=>d[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-53tz1Z0m.css",revision:null},{url:"assets/index-BL7Ms1B0.js",revision:null},{url:"assets/qr-scanner-worker.min-D85Z9gVD.js",revision:null},{url:"index.html",revision:"fbc65d04eb7b44cecafefd16936d2c84"},{url:"registerSW.js",revision:"62c2b1630780d296dd814d88650ec004"},{url:"logo.png",revision:"446dbebd09891064df3992a859ec9c1b"},{url:"manifest.webmanifest",revision:"52f8e6926d69e879c732d2e09929b2bf"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));