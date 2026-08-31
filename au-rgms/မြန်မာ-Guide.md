# AU-RGMS မြန်မာဖိုင်လမ်းညွှန်

ဒီ folder ထဲက code file တစ်ခုချင်းစီဟာ website ရဲ့ ဘယ်နေရာနဲ့ဆိုင်သလဲ၊ ဘာအတွက်အသုံးပြုသလဲဆိုတာ အောက်မှာရှင်းပြထားပါတယ်။

| Code file name | Website နေရာ / အလုပ် |
| --- | --- |
| `index.html` | Website စတင်ရာ။ လိုအပ်သော CSS၊ JavaScript နှင့် React files အားလုံးကို အစဉ်လိုက်ခေါ်ပေးသည်။ |
| `website-login-layout-and-navigation.jsx` | Login၊ header၊ sidebar၊ page navigation နှင့် main application |
| `shared-website-parts.jsx` | Button၊ badge၊ modal၊ timeline စသည့် website နေရာအများစုတွင် ပြန်သုံးသော UI အစိတ်အပိုင်းများ |
| `researcher-pages.jsx` | Researcher dashboard၊ application၊ report နှင့် payment စာမျက်နှာများ |
| `dean-and-faculty-review-pages.jsx` | Dean/Faculty screening၊ review နှင့် approval စာမျက်နှာများ |
| `rassc-iras-ofm-workflow-pages.jsx` | RASSC၊ IRAS နှင့် OFM လုပ်ငန်းစဉ် စာမျက်နှာများ |
| `role-dashboards.jsx` | Dean၊ Committee၊ RASSC၊ Expert၊ President၊ OFM နှင့် Admin dashboard များ |
| `forms-and-templates-page.jsx` | Forms & Templates စာမျက်နှာ |
| `roles-menus-and-status-data.js` | User roles၊ sidebar menus၊ grant systems နှင့် application status သတ်မှတ်ချက်များ |
| `login-and-database-connection.js` | Supabase ချိတ်ဆက်မှု၊ login session နှင့် user profile |
| `website-database-actions.js` | Applications၊ reviews၊ payments၊ reports နှင့် database လုပ်ဆောင်ချက်များ |
| `website-layout-and-design.css` | Website တစ်ခုလုံး၏ layout၊ အရောင်၊ စာလုံး၊ component design နှင့် responsive design |
| `draggable-ai-assistant.jsx` | ရွှေ့နိုင်သော AI Assistant button နှင့် chat window |
| `ai-assistant-design.css` | AI Assistant button နှင့် chat window ရဲ့ design |
| `api/ai-response.js` | Gemini AI မှ အဖြေယူပြီး website သို့ ပြန်ပေးသော server API |
| `api/admin-create-user.js` | Admin မှ user account အသစ်ဖန်တီးပေးသော server API |
| `assets/au-logo.png` | Website header နှင့် login တွင်သုံးသော AU logo |
| `forms/` | Download လုပ်နိုင်သော official PDF forms များ |
| `vercel.json` | Vercel hosting နှင့် website security settings |
| `.env.example` | API key နှင့် database setting အမည်များအတွက် နမူနာ file |

## File တစ်ခုချင်းစီထဲမှာ ဘာတွေရေးထားသလဲ

| Code file name | File ထဲမှာရေးထားသော အဓိကအကြောင်းအရာများ |
| --- | --- |
| `index.html` | Website title၊ fonts၊ React/Babel/Supabase libraries၊ `root` နှင့် `ai-root` နေရာများ၊ project files အားလုံးကို load လုပ်သည့်အစီအစဉ် |
| `website-login-layout-and-navigation.jsx` | Login form၊ grant system ရွေးချယ်မှု၊ role သတ်မှတ်မှု၊ header၊ sidebar menu၊ notification၊ hash route အလိုက် page ပြောင်းပေးသော `PageRouter` နှင့် main `App` |
| `shared-website-parts.jsx` | Icon၊ AU Logo၊ Badge၊ Avatar၊ Toast၊ Modal၊ Confirm Modal၊ File Preview၊ Timeline၊ Statistics Card၊ Notification Panel၊ Page Header နှင့် Date Picker components |
| `researcher-pages.jsx` | Researcher Dashboard၊ AU-R1/AU-R3/AU-R4 application forms၊ My Applications၊ application detail၊ progress report၊ final report၊ payment status၊ publication grant နှင့် reimbursement pages |
| `dean-and-faculty-review-pages.jsx` | Dean dashboard၊ incoming application စိစစ်မှု၊ checklist၊ R3/R4 review detail၊ Faculty Committee review၊ dean approval နှင့် signing functions |
| `rassc-iras-ofm-workflow-pages.jsx` | Application လက်ခံမှု၊ expert ခန့်ခြင်း၊ expert review၊ president approval၊ contract၊ payment၊ report၊ publication grant နှင့် reimbursement workflow |
| `role-dashboards.jsx` | Dean၊ Committee၊ RASSC၊ Expert၊ President၊ OFM နှင့် Admin အတွက် dashboard cards၊ queues၊ history၊ analytics၊ user management၊ journal management၊ audit နှင့် settings pages |
| `forms-and-templates-page.jsx` | Official forms စာရင်း၊ form အကြောင်းအရာ၊ PDF ဖွင့်ခြင်းနှင့် download ခလုတ်များ |
| `roles-menus-and-status-data.js` | Grant system စာရင်း၊ user roles၊ role တစ်ခုချင်းစီ၏ sidebar menu၊ application status label/color နှင့် default system data |
| `login-and-database-connection.js` | Supabase project ချိတ်ဆက်မှု၊ sign in၊ sign out၊ session ရယူမှု၊ login ပြုလုပ်ထားသော user profile ရယူမှုနှင့် authentication state |
| `website-database-actions.js` | Application create/read/update၊ file upload၊ queues၊ reviews၊ expert assignment၊ approval၊ contracts၊ payments၊ reports၊ notifications၊ statistics၊ profiles၊ journal tiers၊ audit log နှင့် admin actions |
| `website-layout-and-design.css` | AU အနီ/ရွှေရောင် theme၊ header/sidebar၊ cards၊ tables၊ forms၊ buttons၊ modal၊ dashboard layout၊ mobile/tablet responsive rules နှင့် animations |
| `draggable-ai-assistant.jsx` | AI button ဖွင့်/ပိတ်ခြင်း၊ mouse/touch ဖြင့် နေရာရွှေ့ခြင်း၊ နောက်ဆုံးနေရာမှတ်ထားခြင်း၊ user role အလိုက် context ပြင်ဆင်ခြင်း၊ message ပို့/လက်ခံခြင်းနှင့် chat history |
| `ai-assistant-design.css` | Floating AI button၊ chat panel၊ message bubbles၊ typing indicator၊ drag လုပ်နေချိန်ပုံစံနှင့် mobile screen design |
| `api/ai-response.js` | User message စစ်ဆေးမှု၊ role context နှင့် system prompt တည်ဆောက်မှု၊ Gemini API ခေါ်မှု၊ error handling နှင့် AI response ပြန်ပေးမှု |
| `api/admin-create-user.js` | Admin token စစ်ဆေးမှု၊ admin role ဟုတ်/မဟုတ်စစ်မှု၊ Supabase Auth user ဖန်တီးမှုနှင့် profile table ထဲ user information သိမ်းခြင်း |
| `assets/au-logo.png` | Assumption University logo ပုံ file |
| `forms/` | Research grant contract၊ submission form၊ progress report နှင့် final report PDF files |
| `vercel.json` | Browser security headers၊ Content Security Policy နှင့် Vercel deployment configuration |
| `.env.example` | Gemini API key နှင့် လိုအပ်နိုင်သော environment variable names နမူနာ။ တကယ့် secret value မထည့်ထားပါ။ |
