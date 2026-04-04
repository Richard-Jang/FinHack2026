import requests
from collections import defaultdict
from datetime import datetime

# --- 1. DATA FETCHER ---
def fetch_raw_transactions(api_url, auth_token):
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status() 
        return response.json().get('transactions', [])
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")
        return []

# --- 2. THE PROCESSOR ---
class FinanceProcessor:
    def __init__(self, transactions):
        self.transactions = transactions

    def get_recent_transactions(self, limit=20):
        """Returns the most recent transactions for the main list."""
        # Sort by date descending
        sorted_tx = sorted(self.transactions, key=lambda x: x.get('date', ''), reverse=True)
        return sorted_tx[:limit]
   
    def identify_leaks(self):
        """
        Logic to find 'Leaks'. 
        Matches frontend: Potential Scams or Unused Subscriptions.
        """
        leaks = []
        for tx in self.transactions:
            name = tx.get("name", "").upper()
            # Example logic: Flag unknown web services or specific keywords
            if "UNKNOWN" in name or "WEB-SVC" in name:
                leaks.append({
                    "name": tx.get("name"),
                    "amount": tx.get("amount"),
                    "type": "Potential Scam",
                    "risk": "High",
                    "date": tx.get("date")
                })
            # Example: Flag gym memberships with no recent check-ins (logic placeholder)
            elif "FITNESS" in name:
                leaks.append({
                    "name": tx.get("name"),
                    "amount": tx.get("amount"),
                    "type": "Unused Subscription",
                    "risk": "Low",
                    "date": tx.get("date")
                })
        return leaks

    def get_subscriptions(self):
        """Filters transactions that look like recurring subscriptions."""
        subs = []
        # In a real app, you'd check for recurring flags from the Bank API
        keywords = ["Netflix", "Spotify", "Amazon Prime", "Hulu", "Disney+"]
        for tx in self.transactions:
            if any(key.lower() in tx.get("name", "").lower() for key in keywords):
                subs.append({
                    "name": tx.get("name"),
                    "amount": tx.get("amount"),
                    "status": "Active",
                    "nextBilling": "Calculating..." # Logic for next month
                })
        return subs

    def get_summary(self):
        """Calculates the top-level stats for the Dashboard cards."""
        total_outflow = sum(tx.get("amount", 0) for tx in self.transactions)
        leaks = self.identify_leaks()
        total_leak_amount = sum(l["amount"] for l in leaks)
        
        return {
            "monthly_outflow": total_outflow,
            "leak_count": len(leaks),
            "leak_total": total_leak_amount
        }

    def get_frequent_merchants(self, limit=20):
        """Returns merchants sorted by transaction frequency in recent transactions."""
        recent_tx = self.get_recent_transactions(limit)
        from collections import Counter
        merchant_counts = Counter(tx.get('name', '') for tx in recent_tx)
        # Sort by frequency descending, then by name ascending for ties
        sorted_merchants = sorted(merchant_counts.items(), key=lambda x: (-x[1], x[0]))
        return sorted_merchants

# --- 3. THE MAIN TERMINAL OUTPUT ---
def main():
    print(" Connecting to Finance API...")
    
    # Mocking the call - replace with your actual URL and Token
    # raw_data = fetch_raw_transactions("https://api.bank.com/v1/txns", "TOKEN")
    
    # Dummy data to demonstrate terminal output matching  React Mock
    mock_raw_data = [
        {"name": "Whole Foods", "amount": 142.50, "category": "Groceries", "date": "2026-04-02"},
        {"name": "Whole Foods", "amount": 142.50, "category": "Groceries", "date": "2026-04-02"},
        {"name": "Whole Foods", "amount": 142.50, "category": "Groceries", "date": "2026-04-02"},
        {"name": "Whole Foods", "amount": 142.50, "category": "Groceries", "date": "2026-04-02"},
        {"name": "UNKNOWN*WEB-SVC", "amount": 89.00, "category": "Service", "date": "2026-03-28"},
        {"name": "Netflix", "amount": 15.49, "category": "Entertainment", "date": "2026-03-15"},
        {"name": "Planet Fitness", "amount": 24.99, "category": "Health", "date": "2026-04-01"},
    ]

    processor = FinanceProcessor(mock_raw_data)
    summary = processor.get_summary()
    leaks = processor.identify_leaks()
    subs = processor.get_subscriptions()

    print("\n" + "="*40)
    print(" FINANCIAL DASHBOARD SUMMARY ")
    print("="*40)
    print(f" Monthly Outflow:   ${summary['monthly_outflow']:.2f}")
    print(f" Identified Leaks:  ${summary['leak_total']:.2f} ({summary['leak_count']} items)")
    print(f" Subscriptions:     {len(subs)} active")
    
    print("\n DETECTED LEAKS:")
    for l in leaks:
        print(f"  - {l['name']} (${l['amount']}) | Risk: {l['risk']}")

    print("\n FREQUENT TRANSACTIONS:")
    frequent_merchants = processor.get_frequent_merchants()
    for i, (merchant, count) in enumerate(frequent_merchants, 1):
        print(f"  {i}. {merchant} ({count} transactions)")
    

    print("\n RECENT TRANSACTIONS:")
    for tx in processor.get_recent_transactions():
        print(f"  {tx['date']} | {tx['name'][:15]:<15} | ${tx['amount']:.2f}")
    print("="*40)

if __name__ == "__main__":
    main()

