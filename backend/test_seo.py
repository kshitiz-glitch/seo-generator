import requests

res = requests.post(
    "http://127.0.0.1:8000/api/v1/generate-seo",
    data={
        "url": "https://www.cnbc.com/2025/07/22/telegram-crypto-wallet-us.html",
        "language": "English",
        "tone": "Professional",
        "length": 150
    }
)

print("Status Code:", res.status_code)
print("Response:", res.json())
