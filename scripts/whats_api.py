import requests

url = "https://mywhinlite.p.rapidapi.com/sendmsg"

payload = {
	"phone_number_or_group_id": "+918530888346",
	"is_group": False,
	"message": "Hello! This API works too! https://rapidapi.com/inutil-inutil-default/api/mywhinlite"
}
headers = {
	"x-rapidapi-key": "cdea89a689msh43598f10910e1bfp1215bdjsn722f0369f203",
	"x-rapidapi-host": "mywhinlite.p.rapidapi.com",
	"Content-Type": "application/json"
}

response = requests.post(url,json=payload,headers=headers)
print(url, payload,headers)

print(response.json())