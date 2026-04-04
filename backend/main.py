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
import requests
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

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

# initialize ollama
OLLAMA_BASE_URL = "http://localhost:11434/api/generate"

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


"""
Request Schema:
{
    prompt: string,
    conversation: string[],
    user_background: {
        monthlyBills: string[],
        transactions: string[],
        monthlyIncome: float,
        creditScore: int,
    },
}

Return Schema:
{
    response: string,
}
"""
class AI_Conversation_Request(BaseModel):
    prompt: str
    conversation: list = Field(default_factory=list)
    user_background: dict = Field(default_factory=dict)


@app.post("/api/ai_conversation")
async def ai_conversation(data: AI_Conversation_Request):

    # parse parameters for information
    final_conversation = ""
    for (i, line) in enumerate(data.conversation):
        final_conversation += "Client: " if i % 2 == 1 else "Advisor: "
        final_conversation += (line + '\n')
    model = "llama3"

    print(data.user_background)

    final_prompt = f"""
You are currently a chatbot used for financial advice. On each one of your responses, give no more than 50 words. The shorter, the better. Below is the information of the person you are advising.
Spending will be in the format $-amount
Saving will be in the format $amount
{str(data.user_background)}

Here is the current conversation:
{final_conversation}

Next prompt from the user: {data.prompt}

If the user does not ask a question, ask what their plans are or how you can help them.
Remove any words that are unnecessary and remove styling using characters including newline. Write everything in paragraph form.
"""

    # build payload using components
    payload = {
        "model": model,
        "prompt": final_prompt,
        "stream": False,
    }

    # call the model
    try:
        response = requests.post(OLLAMA_BASE_URL, json=payload)
        response.raise_for_status()

        result = response.json()
        return {"response": result.get("response")}
    except requests.exceptions.ConnectionError:
        return {"error": "Failed to connect to Ollama. Is it running on localhost:11434?"}
    except Exception as e:
        return {"error": str(e)}

"""
Request Schema:
{
    history: { name: string, amount: float }[],
}

Response Schema:
{
    chart: { label: string, percentage: int },
    advice: { response: string },
}
"""

class AI_Generate_Spending_Summary(BaseModel):
    history: list = Field(default_factory=list)

@app.post("/api/generate_spending_summary")
async def generate_spending_summary(data: AI_Generate_Spending_Summary):

    model = "llama3"
    prompt = f"""
Categorize the spending history into the following labels:

Labels:
Housing: Rent or mortgage, property taxes, maintenance, and HOA fees. 
Utilities: Electricity, gas, water, internet, and phone bills. 
Food: Groceries, meal kits, and occasional dining out. 
Transportation: Fuel, public transit, vehicle maintenance, and registration fees.
Debt: Minimum payments for credit cards, student loans, and auto loans. 
Insurance: Health, auto, life, and home or renters insurance.
Medical: Out-of-pocket costs, prescriptions, and dental or vision care.

History:
{data.history}

Following that, give some advice on how to cut down on costs.

Give your response EXACTLY in the following valid JSON format and nothing more. Make sure to use double quotes for all keys and string values.
The keys can only be Housing, Utilities, Food, Transportation, Debt, Insurance, or Medical. If the percentage is less than 5%, do not return it.
{{"chart": [{{"label": "Housing", "percentage": 15}}], "advice": {{"response": "string"}}}}
"""
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    print(data.history)

    try:
        response = requests.post(OLLAMA_BASE_URL, json=payload)
        response.raise_for_status()

        result = response.json()
        parsed_response = result.get("response", "{}")

        parsed_json = json.loads(parsed_response)

        chart = parsed_json.get("chart")
        advice_dict = parsed_json.get("advice", {})

        advice_text = advice_dict.get("response", "No advice provided.")

        return {"chart": chart, "advice": advice_text}
    except requests.exceptions.ConnectionError:
        return {"error": "Failed to connect to Ollama. Is it running on localhost:11434?"}
    except Exception as e:
        return {"error": str(e)}

"""
Request Schema:
{
    history: { name: string, date: string, amount: float }[],
}

Response Schema:
{
    charges: { name: string, amount: number, nextChargeDate: string, isLeak: boolean }[],
}
"""
class AI_Recurring_Changes(BaseModel):
    history: list = Field(default_factory=list)

@app.post("/api/generate_recurring_charges")
async def generate_spending_summary(data: AI_Recurring_Changes):
    model = "llama3"
    prompt = f"""
Use the transaction history and generate the charges that are recurring.

The transaction history will be given in the following format.
{{ "history": [{{ "name": "string", "amount": 1.23 }}] }}

History:
{data.history}

Give your response EXACTLY in the following valid JSON format and nothing more. Make sure to use double quotes for all keys and string values.
{{"chart": [{{ "name": "string", "amount": 12.34, "nextChargeDate": "2026-04-10", "isLeak": false }}]}}
"""
    
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post(OLLAMA_BASE_URL, json=payload)
        response.raise_for_status()

        result = response.json()
        parsed_response = result.get("response", "{}")
        print(prompt)

        parsed_json = json.loads(parsed_response)

        chart = parsed_json.get("chart")

        return {"chart": chart }
    except requests.exceptions.ConnectionError:
        return {"error": "Failed to connect to Ollama. Is it running on localhost:11434?"}
    except Exception as e:
        return {"error": str(e)}

class AI_Transaction_Data(BaseModel):
    history: int = Field(default=5)



if __name__ == "__main__":
    import uvicorn
    print("Server starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
