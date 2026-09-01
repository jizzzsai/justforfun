# AU-RGMS မြန်မာ File Guide

ဒီ file က website ရဲ့ အပိုင်းတစ်ခုချင်းစီကို ဘယ် code file ထဲမှာ အလွယ်တကူရှာရမလဲဆိုတာ မြန်မာလို ရှင်းပြထားတဲ့ လမ်းညွှန်ဖြစ်ပါတယ်။

## Project folder များ

| Folder / File | အဓိကအလုပ် |
| --- | --- |
| `index.html` | Website စတင်ရာနှင့် CSS၊ JavaScript၊ React files များ load လုပ်သည့်အစီအစဉ် |
| `frontend/` | Website စာမျက်နှာများ၊ UI components၊ navigation၊ design နှင့် AI chat |
| `database/` | Supabase login ချိတ်ဆက်မှုနှင့် database လုပ်ဆောင်ချက်များ |
| `api/` | Vercel ပေါ်တွင် run သော secure backend API များ |
| `assets/` | AU logo နှင့် website image များ |
| `forms/` | Download လုပ်နိုင်သော official PDF forms များ |
| `documentation/` | Project အကြောင်း ရှင်းပြထားသော documentation များ |
| `.env.example` | API key နှင့် database setting အမည်များအတွက် နမူနာ file |
| `vercel.json` | Vercel hosting နှင့် browser security settings |

## Frontend files

| Code file name | Website နေရာ / အလုပ် |
| --- | --- |
| `frontend/website-login-layout-and-navigation.jsx` | Login၊ grant system ရွေးချယ်မှု၊ header၊ sidebar၊ notification၊ page navigation နှင့် main application |
| `frontend/shared-website-parts.jsx` | Button၊ icon၊ badge၊ modal၊ timeline၊ date picker နှင့် file preview ကဲ့သို့ ပြန်သုံးသော UI အစိတ်အပိုင်းများ |
| `frontend/researcher-pages.jsx` | Researcher dashboard၊ AU-R1/AU-R3/AU-R4 application forms၊ reports၊ payment နှင့် application detail စာမျက်နှာများ |
| `frontend/dean-and-faculty-review-pages.jsx` | Dean screening၊ Faculty Committee review၊ comments နှင့် decision စာမျက်နှာများ |
| `frontend/rassc-iras-ofm-workflow-pages.jsx` | RASSC၊ IRAS၊ Finance/OFM review၊ approval၊ report နှင့် payment workflow |
| `frontend/role-dashboards.jsx` | Dean၊ Committee၊ RASSC/IRAS၊ Finance နှင့် Admin dashboard များ |
| `frontend/forms-and-templates-page.jsx` | Forms & Templates စာမျက်နှာနှင့် PDF download လုပ်ဆောင်ချက်များ |
| `frontend/roles-menus-and-status-data.js` | User roles၊ sidebar menus၊ grant systems၊ journal options နှင့် application status သတ်မှတ်ချက်များ |
| `frontend/website-layout-and-design.css` | Website layout၊ AU အနီ/ရွှေရောင် theme၊ cards၊ tables၊ forms၊ print နှင့် responsive design |
| `frontend/researcher-ai-assistant.jsx` | Researcher AU-R1/AU-R3/AU-R4 အတွက် AI Assistant chat |
| `frontend/ai-assistant-design.css` | AI Assistant button နှင့် chat window design |

## Database files

| Code file name | အဓိကအလုပ် |
| --- | --- |
| `database/login-and-database-connection.js` | Supabase ချိတ်ဆက်မှု၊ sign in၊ sign out၊ session နှင့် user profile |
| `database/website-database-actions.js` | Applications၊ documents၊ reviews၊ payments၊ reports၊ notifications နှင့် admin database actions |

## Backend API files

`api/` folder အမည်ကို မပြောင်းရပါ။ Vercel က ဒီ folder ထဲက files များကို server API အဖြစ် အလိုအလျောက်အသုံးပြုပါတယ်။

| API / Code file | အဓိကအလုပ် |
| --- | --- |
| `/api/ai-chat-response` — `api/ai-chat-response.js` | AU AI request စစ်ဆေးခြင်း၊ Gemini API ခေါ်ခြင်းနှင့် answer ပြန်ပေးခြင်း |
| `/api/admin-user-management` — `api/admin-user-management.js` | Admin မှ user account create၊ edit နှင့် delete ပြုလုပ်ခြင်း |

Backend secret key များကို frontend code သို့မဟုတ် GitHub ထဲ မထည့်ရပါ။ Vercel environment variables ထဲတွင်သာ သိမ်းရပါမယ်။

## Exam အတွက် အမြန်ရှာရန်

- Login၊ header သို့မဟုတ် sidebar ကိုမေးလျှင် `frontend/website-login-layout-and-navigation.jsx` ကိုရှာပါ။
- Researcher form သို့မဟုတ် report ကိုမေးလျှင် `frontend/researcher-pages.jsx` ကိုရှာပါ။
- Dean သို့မဟုတ် Committee review ကိုမေးလျှင် `frontend/dean-and-faculty-review-pages.jsx` ကိုရှာပါ။
- RASSC၊ IRAS သို့မဟုတ် Finance workflow ကိုမေးလျှင် `frontend/rassc-iras-ofm-workflow-pages.jsx` ကိုရှာပါ။
- Login/database connection ကိုမေးလျှင် `database/login-and-database-connection.js` ကိုရှာပါ။
- Application၊ payment သို့မဟုတ် report database action ကိုမေးလျှင် `database/website-database-actions.js` ကိုရှာပါ။
- AI backend ကိုမေးလျှင် `api/ai-chat-response.js` ကိုရှာပါ။
- Admin user management backend ကိုမေးလျှင် `api/admin-user-management.js` ကိုရှာပါ။

