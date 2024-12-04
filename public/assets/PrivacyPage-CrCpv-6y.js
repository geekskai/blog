import{c as n,a as r,h as l,b as c,g as h,_ as p,o as y,x as m,y as f,z as i,B as a,Q as v,H as _,G as e}from"./index-CbtE8VIH.js";import{r as g,b,Q as w}from"./utils-AbNbp4xk.js";const k=n({name:"QToolbarTitle",props:{shrink:Boolean},setup(o,{slots:t}){const s=r(()=>"q-toolbar__title ellipsis"+(o.shrink===!0?" col-shrink":""));return()=>l("div",{class:s.value},c(t.default))}}),P=n({name:"QToolbar",props:{inset:Boolean},setup(o,{slots:t}){const s=r(()=>"q-toolbar row no-wrap items-center"+(o.inset===!0?" q-toolbar--inset":""));return()=>l("div",{class:s.value,role:"toolbar"},c(t.default))}}),I=n({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(o,{slots:t}){const s=r(()=>`q-card__section q-card__section--${o.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>l(o.tag,{class:s.value},c(t.default))}}),T={dark:{type:Boolean,default:null}};function S(o,t){return r(()=>o.dark===null?t.dark.isActive:o.dark)}const q=n({name:"QCard",props:{...T,tag:{type:String,default:"div"},square:Boolean,flat:Boolean,bordered:Boolean},setup(o,{slots:t}){const{proxy:{$q:s}}=h(),u=S(o,s),d=r(()=>"q-card"+(u.value===!0?" q-card--dark q-dark":"")+(o.bordered===!0?" q-card--bordered":"")+(o.square===!0?" q-card--square no-border-radius":"")+(o.flat===!0?" q-card--flat no-shadow":""));return()=>l(o.tag,{class:d.value},c(t.default))}}),C=e("p",null," Doodle Cricket app is available as a Free app. This SERVICE is provided at no cost and is intended for use as is. ",-1),B=e("p",null," This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service. ",-1),x=e("p",null," If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy. ",-1),Q=e("p",null," The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Doodle Cricket unless otherwise defined in this Privacy Policy. ",-1),z=e("p",null,[e("strong",null,"Information Collection and Use")],-1),D=e("p",null," For a better experience, while using our Service, I may require you to provide us with certain personally identifiable information. The information that I request will be retained on your device and is not collected by me in any way. ",-1),N=e("div",null,[e("p",null," The app does use third party services that may collect information used to identify you. "),e("p",null," Link to privacy policy of third party service providers used by the app "),e("ul",null,[e("li",null,[e("a",{href:"https://support.google.com/analytics/answer/2700409",target:"_blank"},"Google Analytics")]),e("li",null,[e("a",{href:"https://www.google.com/policies/privacy/",target:"_blank"},"Google Play Services")]),e("li",null,[e("a",{href:"https://support.google.com/admob/answer/6128543?hl=en",target:"_blank"},"AdMob")])])],-1),V=e("p",null,[e("strong",null,"Cookies")],-1),A=e("p",null," Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory. ",-1),G=e("p",null," This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service. ",-1),H=e("p",null,[e("strong",null,"Service Providers")],-1),E=e("p",null," I may employ third-party companies and individuals due to the following reasons: ",-1),F=e("ul",null,[e("li",null,"To facilitate our Service;"),e("li",null,"To provide the Service on our behalf;"),e("li",null,"To perform Service-related services; or"),e("li",null,"To assist us in analyzing how our Service is used.")],-1),L=e("p",null," I want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose. ",-1),M=e("p",null,[e("strong",null,"Security")],-1),U=e("p",null," I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security. ",-1),Y=e("p",null,[e("strong",null,"Links to Other Sites")],-1),$=e("p",null," This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. ",-1),O=e("p",null,[e("strong",null,"Children’s Privacy")],-1),R=e("p",null," I do not knowingly collect personally identifiable information from children under 13. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do necessary actions. ",-1),X=e("p",null,[e("strong",null,"Changes to This Privacy Policy")],-1),j=e("p",null," I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. ",-1),J=e("p",null,"This policy is effective as of 2020-05-05",-1),K=e("p",null,[e("strong",null,"Contact Us")],-1),W=e("p",null," If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at developer.asissuthar@gmail.com. ",-1),Z={__name:"PrivacyPage",setup(o){return y(()=>{g(b("c3BsYXNo"))}),(t,s)=>(m(),f(w,{padding:""},{default:i(()=>[a(P,{class:"text-primary"},{default:i(()=>[a(v,{flat:"",round:"",dense:"",icon:"arrow_back",to:{name:"index"}}),a(k,null,{default:i(()=>[_(" Privacy Policy ")]),_:1})]),_:1}),a(q,{flat:""},{default:i(()=>[a(I,null,{default:i(()=>[C,B,x,Q,z,D,N,V,A,G,H,E,F,L,M,U,Y,$,O,R,X,j,J,K,W]),_:1})]),_:1})]),_:1}))}},te=p(Z,[["__file","PrivacyPage.vue"]]);export{te as default};
