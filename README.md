<div align="center">

<img src=".github/assets/banner.svg" alt="HRMS Client — people, payroll and permissions in one place" width="100%"/>

<br/>

<a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 17"/></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.4"/></a>
<a href="https://rxjs.dev"><img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS 7.8"/></a>
<a href="https://tabler.io/icons"><img src="https://img.shields.io/badge/Tabler_Icons-3-0f766e?style=for-the-badge&logo=tabler&logoColor=white" alt="Tabler Icons"/></a>
<img src="https://img.shields.io/badge/Auth-JWT-071a3d?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT auth"/>

<p>
  <a href="#-quick-start"><b>Quick start</b></a> ·
  <a href="#-features"><b>Features</b></a> ·
  <a href="#-who-sees-what"><b>Roles</b></a> ·
  <a href="#-how-a-request-travels"><b>Architecture</b></a> ·
  <a href="#-project-structure"><b>Structure</b></a>
</p>

</div>

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## ✨ Overview

**HRMS Client** is the Angular 17 frontend for an HR management system. It gives **Admins**, **HR staff**, and **Employees** a single, role‑aware dashboard for people, departments, compensation, and payroll — with lazy‑loaded feature areas, guarded routes, and a shared layout shell that keeps everything consistent.

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## 🚀 Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>👥 People</h3>
      Employee directory with create / edit forms and department management.
    </td>
    <td width="33%" valign="top">
      <h3>💰 Compensation</h3>
      Salary records, full <b>revision history</b>, bonuses, and deductions.
    </td>
    <td width="33%" valign="top">
      <h3>🧾 Payroll</h3>
      Payroll runs built from salary, bonus, and deduction data.
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <h3>🔐 Access control</h3>
      <code>authGuard</code> + <code>roleGuard</code> on every protected route, and a sidebar that only shows what you can open.
    </td>
    <td width="33%" valign="top">
      <h3>🔄 Silent refresh</h3>
      JWTs attach automatically; a <code>401</code> triggers one refresh‑token retry before logging out.
    </td>
    <td width="33%" valign="top">
      <h3>🧩 Shared shell</h3>
      Header, sidebar, layout, and toast notifications reused across every feature.
    </td>
  </tr>
</table>

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## 🔑 Who sees what

| Area | Route | 👑 Admin | 🧑‍💼 HR | 👤 Employee |
| :-- | :-- | :-: | :-: | :-: |
| Dashboard | `/dashboard` | ✅ | ✅ | ✅ *(own data)* |
| Employees | `/employees` | ✅ | ✅ | — |
| Departments | `/departments` | ✅ | ✅ | — |
| Salary & revisions | `/salary`, `/salary/revisions` | ✅ | ✅ | — |
| Deductions | `/deductions` | ✅ | ✅ | — |
| Bonuses | `/bonuses` | ✅ | ✅ | — |
| Payroll | `/payroll` | ✅ | ✅ | — |
| Auth & Users | `/users` | ✅ | — | — |

> [!TIP]
> Role rules live in two places: `data.roles` in [`app.routes.ts`](src/app/app.routes.ts) and the nav items in [`sidebar.component.ts`](src/app/shared/components/sidebar/sidebar.component.ts). Change both together.

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## 🔁 How a request travels

<img src=".github/assets/request-flow.svg" alt="Request flow diagram" width="100%"/>

- **`authInterceptor`** attaches `Authorization: Bearer <token>` (skipping `/auth/login` and `/auth/refresh`). On a `401` it tries the refresh token once, retries the original request, and clears the session if that fails.
- **`apiCaseInterceptor`** converts every response body's keys to camelCase, so templates bind to `employee.firstName` even when the API returns `FirstName`.
- **Session state** (`accessToken`, `refreshToken`, `role`, `userId`, `username`) is kept in `localStorage` and read by guards, interceptors, and the layout.

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## ⚡ Quick start

<p>
  <a href="https://skillicons.dev"><img src="https://skillicons.dev/icons?i=nodejs,npm,angular,ts,sass,vscode" alt="Toolchain"/></a>
</p>

**Prerequisites:** Node.js 18+, npm, and the HRMS API running at `https://localhost:44368`.

```bash
# 1 · clone
git clone https://github.com/ahasan-ullah/HRMS-Client.git
cd HRMS-Client

# 2 · install
npm install

# 3 · run (proxies /api → https://localhost:44368)
npm start
```

Then open **http://localhost:4200** and sign in. 🎉

> [!NOTE]
> The backend URL lives in [`proxy.conf.json`](proxy.conf.json). Point `target` somewhere else if your API runs on a different host or port.

### 📜 Scripts

| Command | What it does |
| :-- | :-- |
| `npm start` | Dev server on `:4200` with the API proxy enabled |
| `npm run build` | Production build into `dist/` |
| `npm run watch` | Rebuild on change (development configuration) |
| `npm test` | Unit tests with Jasmine + Karma |

<img src=".github/assets/divider.svg" width="100%" alt=""/>

## 📁 Project structure

```text
src/
├── app/
│   ├── core/                 # app-wide plumbing
│   │   ├── guards/           # authGuard, roleGuard
│   │   ├── interceptors/     # authInterceptor, apiCaseInterceptor
│   │   ├── models/           # typed DTOs per domain
│   │   └── services/         # one HTTP service per API area
│   ├── features/             # lazy-loaded routes
│   │   ├── auth/             #   login
│   │   ├── dashboard/        #   role-aware overview
│   │   ├── employees/        #   list + form
│   │   ├── departments/
│   │   ├── salary/           #   list + revision history
│   │   ├── bonuses/
│   │   ├── deductions/
│   │   ├── payroll/
│   │   └── users/            #   Admin only
│   └── shared/
│       ├── components/       # header, sidebar, layout, toast-container
│       ├── services/         # toast.service
│       └── styles/           # _ui.scss design tokens
└── environments/             # apiUrl per build configuration
```

<details>
<summary><b>🔌 Backend endpoints this client expects</b></summary>
<br/>

The client calls the API under `/api` for these areas:

`auth` · `users` · `employees` · `departments` · `salary` · `payroll` · `bonuses` · `deductions` · `dashboard`

If the API contract changes, update the matching service and model in [`src/app/core/`](src/app/core).

</details>

<details>
<summary><b>🎨 Design tokens</b></summary>
<br/>

Shared colors and typography are defined once in [`_ui.scss`](src/app/shared/styles/_ui.scss):

| Token | Value | |
| :-- | :-- | :-: |
| `--navy` | `#071a3d` | ![](https://img.shields.io/badge/-%20%20%20%20-071a3d?style=flat-square) |
| `--blue` | `#416fb5` | ![](https://img.shields.io/badge/-%20%20%20%20-416fb5?style=flat-square) |
| `--accent` | `#0f766e` | ![](https://img.shields.io/badge/-%20%20%20%20-0f766e?style=flat-square) |
| `--success` | `#0f9f6e` | ![](https://img.shields.io/badge/-%20%20%20%20-0f9f6e?style=flat-square) |
| `--warning` | `#b7791f` | ![](https://img.shields.io/badge/-%20%20%20%20-b7791f?style=flat-square) |
| `--danger` | `#dc2626` | ![](https://img.shields.io/badge/-%20%20%20%20-dc2626?style=flat-square) |

</details>

<details>
<summary><b>🌍 Environments</b></summary>
<br/>

| File | Used by |
| :-- | :-- |
| [`environment.ts`](src/environments/environment.ts) | `ng serve`, development builds |
| [`environment.production.ts`](src/environments/environment.production.ts) | `ng build` (production) |

> [!IMPORTANT]
> `environment.production.ts` still has a placeholder `apiUrl` (`https://your-production-api.com/api`). Set the real API URL before you deploy.

</details>

<br/>

<div align="center">

**Built with Angular & ☕**

<a href="#top">⬆ Back to top</a>

<img src=".github/assets/footer.svg" alt="" width="100%"/>

</div>
