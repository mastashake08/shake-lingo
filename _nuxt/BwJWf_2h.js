import{r as t,i as o}from"./BuXMyZD4.js";const c=()=>{const e=t([]),n=()=>{const a=speechSynthesis.getVoices();e.value=a.map(s=>({code:s.lang,name:`${s.name} (${s.lang})`}))};return o(()=>{n(),e.value.length||(speechSynthesis.onvoiceschanged=n)}),{languages:e}};export{c as u};