import os
import json
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest

# load vars
load_dotenv()

app = FastAPI()

# enable CORS (Cross-Origin Resource Sharing)
# allows port 5173 connection to this API (port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize plaid
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': os.getenv('PLAID_CLIENT_ID'),
        'secret': os.getenv('PLAID_SECRET'),
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# simple JSON-backed store for connected banks
DATA_PATH = Path(__file__).resolve().parent / "connected_banks.json"
def load_banks():
    try:
        if not DATA_PATH.exists():
            return []
        with DATA_PATH.open('r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_banks(banks):
    try:
        with DATA_PATH.open('w', encoding='utf-8') as f:
            json.dump(banks, f, indent=2)
    except Exception:
        pass

# route to create link token
@app.post("/api/create_link_token")
async def create_link_token():
    try:
        request = LinkTokenCreateRequest(
            products=[Products("auth"), Products("transactions")],
            client_name="WalletWatch",
            country_codes=[CountryCode("US")],
            language="en",
            user=LinkTokenCreateRequestUser(client_user_id="unique-user-id-001")
        )
        response = client.link_token_create(request)
        return response.to_dict() # This returns the link_token to react
    except plaid.ApiException as e:
        return {"error": str(e)}


@app.post("/api/exchange_public_token")
async def exchange_public_token(req: Request):
    body = await req.json()
    public_token = body.get('public_token')
    if not public_token:
        return {"error": "missing public_token"}

    try:
        exchange_req = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_resp = client.item_public_token_exchange(exchange_req)
        exchange_obj = exchange_resp.to_dict()
        access_token = exchange_obj.get('access_token')
        item_id = exchange_obj.get('item_id')

        # fetch accounts for the item
        acct_req = AccountsGetRequest(access_token=access_token)
        acct_resp = client.accounts_get(acct_req)
        accounts_obj = acct_resp.to_dict()

        # persist minimal info
        banks = load_banks()
        banks.append({
            "item_id": item_id,
            "access_token": access_token,
            "accounts": accounts_obj.get('accounts', [])
        })
        save_banks(banks)

        return {"status": "ok", "item_id": item_id, "accounts": accounts_obj}
    except plaid.ApiException as e:
        return {"error": str(e)}


@app.get("/api/connected_banks")
async def get_connected_banks():
    return load_banks()


if __name__ == "__main__":
    import uvicorn
    print("Server starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
