# AU-RGMS Easy File Guide

This guide maps every visible website feature to a clearly named source file. Use the **Quick Search** table during a demonstration or exam.

## Project folders

```text
au-rgms/
├─ index.html                 Website entry point and file loading order
├─ frontend/                  Pages, UI components, navigation, styles, and AI chat UI
├─ database/                  Supabase login connection and browser database actions
├─ api/                       Secure Vercel backend endpoints
├─ assets/                    Website images such as the AU logo
├─ forms/                     Official downloadable PDF forms
├─ documentation/             Project guides
├─ .env.example               Required environment-variable names (no secrets)
└─ vercel.json                Hosting and browser security configuration
```

## Quick Search: website feature to file

| If the teacher asks about… | Open/search this file |
| --- | --- |
| Login page, grant chooser, header, sidebar, navigation, page routing | `frontend/website-login-layout-and-navigation.jsx` |
| Shared buttons, icons, badges, modal, timeline, date picker, file preview | `frontend/shared-website-parts.jsx` |
| Researcher dashboard, AU-R1, AU-R3, AU-R4 forms, reports, payments | `frontend/researcher-pages.jsx` |
| Dean screening and Faculty Committee review pages | `frontend/dean-and-faculty-review-pages.jsx` |
| RASSC/IRAS review, expert, president, contract, Finance/OFM workflow | `frontend/rassc-iras-ofm-workflow-pages.jsx` |
| Role dashboards, queues, histories, admin user-management UI | `frontend/role-dashboards.jsx` |
| Forms & Templates page | `frontend/forms-and-templates-page.jsx` |
| Roles, sidebar menus, statuses, grant types, journal options | `frontend/roles-menus-and-status-data.js` |
| Main website layout, colors, cards, tables, forms, print design | `frontend/website-layout-and-design.css` |
| Researcher AI chat panel and role-scoped AI context | `frontend/researcher-ai-assistant.jsx` |
| AI panel design | `frontend/ai-assistant-design.css` |
| Supabase connection, sign in, sign out, session, current profile | `database/login-and-database-connection.js` |
| Application, document, review, payment, report, notification, admin database actions | `database/website-database-actions.js` |
| AU AI/Gemini backend response | `api/ai-chat-response.js` |
| Admin create, edit, and delete user backend | `api/admin-user-management.js` |
| Script/CSS loading order | `index.html` |
| Vercel security headers | `vercel.json` |
| Required environment variable names | `.env.example` |

## Frontend files

| File | Main responsibility |
| --- | --- |
| `frontend/website-login-layout-and-navigation.jsx` | Login, grant-system chooser, header, sidebar, notifications, page router, and application shell. |
| `frontend/shared-website-parts.jsx` | Reusable UI pieces used across every role. |
| `frontend/researcher-pages.jsx` | Researcher-facing AU-R1, AU-R3, and AU-R4 screens and their application details. |
| `frontend/dean-and-faculty-review-pages.jsx` | Dean and Faculty Committee queues, reviews, comments, and decisions. |
| `frontend/rassc-iras-ofm-workflow-pages.jsx` | RASSC/IRAS verification, expert/president steps, Finance approval, and report workflow. |
| `frontend/role-dashboards.jsx` | Dashboards and management pages for non-researcher roles, including Admin. |
| `frontend/forms-and-templates-page.jsx` | Official forms list and download actions. |
| `frontend/roles-menus-and-status-data.js` | Shared roles, menus, status labels, grant configuration, and option lists. |
| `frontend/website-layout-and-design.css` | Main visual system and responsive/print layout. |
| `frontend/researcher-ai-assistant.jsx` | AI Assistant shown in the researcher sections. |
| `frontend/ai-assistant-design.css` | AI Assistant visual styling. |

## Backend/API files

The folder must stay named `api/` because Vercel uses that name to publish server functions automatically.

| Endpoint | Methods | File | Purpose |
| --- | --- | --- | --- |
| `/api/ai-chat-response` | `POST` | `api/ai-chat-response.js` | Validates requests, applies AU-RGMS rules and role scope, calls Gemini securely, and returns an AU AI reply. |
| `/api/admin-user-management` | `POST`, `PATCH`, `DELETE` | `api/admin-user-management.js` | Admin-only account creation, editing, deletion, validation, and protected demo-account handling. |

Backend secrets are read from Vercel environment variables. They must never be placed in frontend files or committed to GitHub.

## Database files

| File | Main responsibility |
| --- | --- |
| `database/login-and-database-connection.js` | Creates the Supabase browser client and manages authentication/session/profile operations. |
| `database/website-database-actions.js` | Contains browser-side database calls for applications, uploads, queues, reviews, reports, payments, notifications, and admin actions. |

## Other folders

| Folder | Contents |
| --- | --- |
| `assets/` | AU logo and future website images. |
| `forms/` | AU-R1 contract, submission, progress-report, and final-report PDF templates. |
| `documentation/` | This project map and future technical documentation. |

## Fast exam searches

Use GitHub's **Go to file** box for filenames, or search inside the project with:

```powershell
# Find AU-R4 form code
rg -n "AU-R4|ResearcherR4" frontend/researcher-pages.jsx

# Find Dean and Committee comment/review code
rg -n "comment|review|decision" frontend/dean-and-faculty-review-pages.jsx

# Find Finance/payment workflow
rg -n "Finance|payment|phase" frontend/rassc-iras-ofm-workflow-pages.jsx database/website-database-actions.js

# Find Admin user-management backend
rg -n "POST|PATCH|DELETE|validateProfile" api/admin-user-management.js

# Find AI rules and API call
rg -n "AU-R1|AU-R3|AU-R4|Gemini" api/ai-chat-response.js
```

## မြန်မာအတိုချုံး

- Website မျက်နှာပြင်နှင့် page များကို `frontend/` ထဲတွင်ရှာပါ။
- Login နှင့် Supabase ချိတ်ဆက်မှုကို `database/login-and-database-connection.js` တွင်ရှာပါ။
- Application၊ review၊ payment database လုပ်ဆောင်ချက်များကို `database/website-database-actions.js` တွင်ရှာပါ။
- Backend API များကို `api/` ထဲတွင်ရှာပါ။
- AU AI backend ကို `api/ai-chat-response.js` တွင်ရှာပါ။
- Admin user create/edit/delete ကို `api/admin-user-management.js` တွင်ရှာပါ။
