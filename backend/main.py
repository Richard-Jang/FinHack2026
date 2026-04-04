import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

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

if __name__ == "__main__":
    import uvicorn
    print("Server starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)