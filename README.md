WalletWatch is a FinTech web application that flags recurring subscriptions and memberships to help users identify hidden expenses and manage their personal finances.

Tech stack: Python (Flask) backend, PostgreSQL (database), React (Vite) frontend, Plaid API, Fast API, Ollama (AI functionality).

Features include:
- Secure bank connection
- Transaction ingestion and storage
- Automatic detection of recurring payments.
- Smart alerts for potential "money leaks"
- Subscription tracking dashboard

How it works:
- Users connect their bank accounts.
- Transactions are fetched using Plaid API and stored in PostgreSQL.
- Backend analyzes patterns in transaction names, amounts and dates (frequency).
- Recurring payments are identified and stored.
- Alerts are generated for users to review in the dashboard.
- AI feature generates actionable insights to guide users through personal financial management. 
