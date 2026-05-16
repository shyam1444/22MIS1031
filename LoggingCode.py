import requests

url = "http://4.224.186.213/evaluation-service/auth"

payload = {
    "email": "shyam.venkatraman2022@vitstudent.ac.in",  
    "name": "Shyam",          
    "rollNo": "22MIS1031 ",
    "accessCode": "SfFuWg",
    "clientID": "4679c8ca-46db-473d-9f70-03e77c843253",
    "clientSecret": "GMFataKAHMPzWtnb"
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