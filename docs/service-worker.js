if(!self.define){let i,t={};const e=(e,o)=>(e=new URL(e+".js",o).href,t[e]||new Promise((t=>{if("document"in self){const i=document.createElement("script");i.src=e,i.onload=t,document.head.appendChild(i)}else i=e,importScripts(e),t()})).then((()=>{let i=t[e];if(!i)throw new Error(`Module ${e} didn’t register its module`);return i})));self.define=(o,s)=>{const n=i||("document"in self?document.currentScript.src:"")||location.href;if(t[n])return;let d={};const h=i=>e(i,n),r={module:{uri:n},exports:d,require:h};t[n]=Promise.all(o.map((i=>r[i]||h(i)))).then((i=>(s(...i),d)))}}define(["./workbox-42903d94"],(function(i){"use strict";self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"https://tno.github.io/hei/../dist/app.d.ts",revision:"e43499c0051fe9451d0cbc999f0cb7b3"},{url:"https://tno.github.io/hei/../dist/assets/images.d.ts",revision:"893bce14e9ed13680e8239a612687c90"},{url:"https://tno.github.io/hei/../dist/components/about-page.d.ts",revision:"57bc9fa04c2c2656ee46f6dddd900bff"},{url:"https://tno.github.io/hei/../dist/components/comparison-page.d.ts",revision:"6868c6c396b572c6cd3e83880c264ef6"},{url:"https://tno.github.io/hei/../dist/components/home-page.d.ts",revision:"e0b27a5786e7052f6dde1bc660d0db3e"},{url:"https://tno.github.io/hei/../dist/components/index.d.ts",revision:"acfce5e45a698ecae6c22170f5796065"},{url:"https://tno.github.io/hei/../dist/components/intervention-overview-page.d.ts",revision:"017d0867ff7d1e3035fcd58b8e0ab45e"},{url:"https://tno.github.io/hei/../dist/components/intervention-page.d.ts",revision:"5e264bcdf32922c40eef4ba36f0bba80"},{url:"https://tno.github.io/hei/../dist/components/layout.d.ts",revision:"d4aae8ce7c95a6d584ec87229c53e3ec"},{url:"https://tno.github.io/hei/../dist/components/settings-page.d.ts",revision:"10f33875b54b1aed3857db0e648dbb83"},{url:"https://tno.github.io/hei/../dist/components/side-nav.d.ts",revision:"f5abb9afa503f020043e14b799c1cca3"},{url:"https://tno.github.io/hei/../dist/components/taxonomy-page.d.ts",revision:"1892d7f4e1375a5daf332da193f82bd6"},{url:"https://tno.github.io/hei/../dist/components/ui/index.d.ts",revision:"15c8d234187335e264d6479e4ca2b0cc"},{url:"https://tno.github.io/hei/../dist/components/ui/preloader.d.ts",revision:"46ddae7970a8bf030c66db56016c16e2"},{url:"https://tno.github.io/hei/../dist/components/ui/text-input-with-clear.d.ts",revision:"b26a522afc78a2e5604092f782905ea7"},{url:"https://tno.github.io/hei/../dist/models/dashboard.d.ts",revision:"4a8d3b0540ee97f9f586e43ecbbe6061"},{url:"https://tno.github.io/hei/../dist/models/data-model.d.ts",revision:"d5e1549513128a62cb5dea66db48f0d3"},{url:"https://tno.github.io/hei/../dist/models/index.d.ts",revision:"e24148c1e816ec4a75d1800945301cf6"},{url:"https://tno.github.io/hei/../dist/models/search-filter.d.ts",revision:"ba2203d36e6b425d6eb03e301bd52ff6"},{url:"https://tno.github.io/hei/../dist/services/index.d.ts",revision:"109920173d045133b753ac6288352bd3"},{url:"https://tno.github.io/hei/../dist/services/meiosis.d.ts",revision:"7e5e244ddf2d2813f1b8f4708a8998f6"},{url:"https://tno.github.io/hei/../dist/services/register-service-worker.d.ts",revision:"7e532391bffe0626eea165136f354be8"},{url:"https://tno.github.io/hei/../dist/services/routing-service.d.ts",revision:"6b3231e7e2e2126d6469397c29322ec7"},{url:"https://tno.github.io/hei/../dist/utils/index.d.ts",revision:"d747cdc4d2932f56d3c6e7ec32781b59"},{url:"https://tno.github.io/hei/../dist/utils/local-ldb.d.ts",revision:"ad688fb11b765b4566ae66180d58d0a4"},{url:"https://tno.github.io/hei/0c35d18bf06992036b69.woff2",revision:null},{url:"https://tno.github.io/hei/0dd34d8173d8eabed924.svg",revision:null},{url:"https://tno.github.io/hei/219aa9140e099e6c72ed.woff2",revision:null},{url:"https://tno.github.io/hei/3a4004a46a653d4b2166.woff",revision:null},{url:"https://tno.github.io/hei/3baa5b8f3469222b822d.woff",revision:null},{url:"https://tno.github.io/hei/4d73cb90e394b34b7670.woff",revision:null},{url:"https://tno.github.io/hei/4ef4218c522f1eb6b5b1.woff2",revision:null},{url:"https://tno.github.io/hei/5d681e2edae8c60630db.woff",revision:null},{url:"https://tno.github.io/hei/682f370b71a2168f21f2.jpg",revision:null},{url:"https://tno.github.io/hei/6f420cf17cc0d7676fad.woff2",revision:null},{url:"https://tno.github.io/hei/b08b9fdad985ae5003ec.webp",revision:null},{url:"https://tno.github.io/hei/c380809fd3677d7d6903.woff2",revision:null},{url:"https://tno.github.io/hei/daa9f69cfe2d801887aa.webp",revision:null},{url:"https://tno.github.io/hei/ebcbb1571881e2c73825.webp",revision:null},{url:"https://tno.github.io/hei/f882956fd323fd322f31.woff",revision:null},{url:"https://tno.github.io/hei/favicon.ico",revision:"30bc2776317141c872644f745869cc39"},{url:"https://tno.github.io/hei/index.html",revision:"f6fd2f891d258c577fe53fb1a7783cae"},{url:"https://tno.github.io/hei/main.bundle.js",revision:"d9d2b1d87635ddeb8e0732734028acd4"},{url:"https://tno.github.io/hei/main.css",revision:"13815b57f8233c3e3954783ce7d81d17"}],{})}));
//# sourceMappingURL=service-worker.js.map
