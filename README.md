# SpendWise

SpendWise is a small full-stack personal finance tracker built for the CS3301 CIE-2 assignment. It demonstrates React components, props, state, hooks, forms, routing, a responsive interface, and communication with an Express REST API.

## Features

- Dashboard with current-month income, expenses, balance, savings rate, and budget status
- Create, view, edit, and delete income and expense records
- Search and category filters for transaction lists
- Category-spending summary and analytics
- Controlled forms with required-field and positive-amount validation
- Responsive navigation and reusable transaction components
- A class component (`BudgetSummaryCard`) alongside functional React components

The backend uses an in-memory JavaScript data store. Sample transactions are created for the current month, but any changes are lost when the server restarts. This project does not use a database or implement authentication.

## Run locally

Prerequisites: Node.js 18 or newer and npm.

Install dependencies:

```powershell
npm install --prefix backend
npm install --prefix frontend
```

Open two terminals in the project folder. Start the backend in the first:

```powershell
npm run server
```

Start the frontend in the second:

```powershell
npm run client
```

Open the Vite URL shown in the frontend terminal (normally <http://localhost:5173>). The API runs at <http://localhost:5000>.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/expenses` | List expenses; optional `category` and `search` query parameters |
| `POST` | `/api/expenses` | Add an expense |
| `PUT` | `/api/expenses/:id` | Update an expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |
| `GET` | `/api/income` | List income; optional `category` and `search` query parameters |
| `POST` | `/api/income` | Add income |
| `PUT` | `/api/income/:id` | Update income |
| `DELETE` | `/api/income/:id` | Delete income |
| `GET` | `/api/dashboard/summary` | Return current-month totals, budget status, recent transactions, and category breakdown |

## Easy walkthrough

1. `App.jsx` declares the page routes; `Layout.jsx` keeps the navigation around the selected page.
2. A page uses `useState` for its values and `useEffect` to load data when the page or filters change.
3. The page calls a small Axios function in `frontend/src/services/api.js`.
4. An Express route passes the request to its controller.
5. The controller validates or filters the in-memory arrays and returns JSON.
6. React renders the response. Callbacks passed as props connect shared components such as `TransactionItem` and the transaction forms back to the page.

`BudgetSummaryCard` is the class-component example. It receives totals as props and stores only its expand/collapse and rotating-tip UI state.

## Rubric checklist

| Criterion | Where to demonstrate it |
| --- | --- |
| Components and architecture | `frontend/src/components/` and `frontend/src/pages/` |
| Props and parent-child communication | `Dashboard.jsx`, `TransactionItem.jsx`, and transaction forms |
| State, hooks, and events | Page filters, modal state, and data-fetching effects |
| Forms and validation | Add and edit transaction modals |
| Client-side routing | `frontend/src/App.jsx` and the sidebar |
| Responsive design | Tailwind responsive classes in the layout and pages |
| Express API | `backend/server.js`, `backend/routes/`, and `backend/controllers/` |
| Integration and demonstration | Run both servers and add, search, edit, and delete a transaction |
| Project enhancements | Keyword search added to category filtering; simplified current-month summary |

For the report, use screenshots captured from this final version of the app: dashboard, transaction form, filtering, analytics, edit flow, and a narrow/mobile layout. Refresh screenshots if totals or visible controls differ from the current implementation.

## Verification

```powershell
npm run test
npm run build
npm run lint --prefix frontend
```

The backend tests cover transaction validation and CRUD controller behavior, filters, and current-month calculations. The frontend build checks that the React application compiles.

## Reference and changes

The project was developed with reference to [HexagonDigitalServices/ExpenseTracker](https://github.com/HexagonDigitalServices/ExpenseTracker). The current public reference already includes monthly calculations and category/time-frame filtering, so SpendWise should not describe those concepts as wholly original. The clearest additional change is keyword search across transaction fields; the monthly summary is a simpler adaptation of a concept also present in the reference. SpendWise also has its own interface, `BudgetSummaryCard` class component, in-memory store, and form/API validation.

There is no reliable single percentage for “how much code was used”: the answer depends on the exact reference revision and which files are compared. The reference is credited here; in the viva, describe it as a learning/structural reference and explain the SpendWise-specific work rather than claiming an unsupported percentage.
