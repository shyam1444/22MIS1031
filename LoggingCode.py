import requests

url = ""

payload = {
    "email": "shyam.venkatraman2022@vitstudent.ac.in",  
    "name": "Shyam",          
    "rollNo": "22MIS1031 ",
    "accessCode": "",
    "clientID": "",
    "clientSecret": ""
}

response = requests.post(url, json=payload)
data = response.json()

print("\n" + "=" * 60)

if "access_token" in data:
    print("TOKEN TYPE :", data.get("token_type"))
    print("ACCESS TOKEN :")
    print(data.get("access_token"))
    print("\nEXPIRES IN :", data.get("expires_in"))
else:
    print("ERROR :", data)

print("=" * 60)