# AU-RGMS file names guide

ဒီ folder ထဲက file name တွေကို website ရဲ့ ဘယ်နေရာနဲ့ဆိုင်တယ်ဆိုတာ မြင်တာနဲ့သိနိုင်အောင် အောက်ပါအတိုင်း အမည်ပေးထားပါတယ်။

| File | Website နေရာ / အလုပ် |
| --- | --- |
| `index.html` | Website စတင်ရာ။ Hosting ကြောင့် ဒီအမည်ကို မပြောင်းရပါ။ |
| `website-login-layout-and-navigation.jsx` | Login, header, sidebar, page navigation နှင့် main app |
| `shared-website-parts.jsx` | Button, badge, modal, timeline စသည့် website နေရာအများစုသုံး UI |
| `researcher-pages.jsx` | Researcher dashboard, application, report နှင့် payment pages |
| `dean-and-faculty-review-pages.jsx` | Dean/Faculty screening, review နှင့် approval pages |
| `rassc-iras-ofm-workflow-pages.jsx` | RASSC, IRAS နှင့် OFM workflow pages |
| `role-dashboards.jsx` | Dean, Committee, RASSC, Expert, President, OFM နှင့် Admin dashboards |
| `forms-and-templates-page.jsx` | Forms & Templates page |
| `roles-menus-and-status-data.js` | Roles, sidebar menus, grant systems နှင့် status definitions |
| `login-and-database-connection.js` | Supabase connection, login session နှင့် user profile |
| `website-database-actions.js` | Applications, reviews, payments, reports နှင့် database actions |
| `website-layout-and-design.css` | Website တစ်ခုလုံး၏ layout, colours နှင့် responsive design |
| `draggable-ai-assistant.jsx` | ရွှေ့နိုင်သော AI Assistant button နှင့် chat window |
| `ai-assistant-design.css` | AI Assistant ရဲ့ design |
| `api/ai-response.js` | Gemini AI response ပေးသော server API |
| `api/admin-create-user.js` | Admin မှ user account ဖန်တီးသော server API |
| `assets/au-logo.png` | AU logo |
| `forms/` | Download လုပ်နိုင်သော official PDF forms |
| `vercel.json` | Vercel hosting နှင့် security settings။ ဒီအမည်ကို မပြောင်းရပါ။ |
| `.env.example` | Secret settings အမည်နမူနာ။ ဒီ file ထဲတွင် တကယ့် secret မထည့်ရပါ။ |

## အမည်ဟောင်း → အမည်သစ်

| အမည်ဟောင်း | အမည်သစ် |
| --- | --- |
| `app.jsx` | `website-login-layout-and-navigation.jsx` |
| `components.jsx` | `shared-website-parts.jsx` |
| `researcher.jsx` | `researcher-pages.jsx` |
| `faculty.jsx` | `dean-and-faculty-review-pages.jsx` |
| `iras.jsx` | `rassc-iras-ofm-workflow-pages.jsx` |
| `dashboards.jsx` | `role-dashboards.jsx` |
| `forms.jsx` | `forms-and-templates-page.jsx` |
| `data.js` | `roles-menus-and-status-data.js` |
| `supabase.js` | `login-and-database-connection.js` |
| `db.js` | `website-database-actions.js` |
| `styles.css` | `website-layout-and-design.css` |
| `ai-chat.jsx` | `draggable-ai-assistant.jsx` |
| `ai-chat.css` | `ai-assistant-design.css` |
| `api/chat.js` | `api/ai-response.js` |
| `api/admin-user.js` | `api/admin-create-user.js` |
