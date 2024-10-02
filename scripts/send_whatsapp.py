# scripts/send_whatsapp.py
# import sys
# import pywhatkit as pwk

# def send_message(contact, message):
#     pwk.sendwhatmsg_instantly(contact, message,20,False,2)  # Send message instantly with a 20-second wait time

# if __name__ == "__main__":
#     contact = sys.argv[1]
#     message = sys.argv[2]
#     send_message(contact, message)

# scripts/send_whatsapp.py using mywhin api rapidapi
import sys
import json
import http.client
import logging

def send_message(contact, message, max_retries=3, retry_delay=5):
    conn = http.client.HTTPSConnection("mywhinlite.p.rapidapi.com", timeout=30)

    payload = json.dumps({
        "phone_number_or_group_id": contact,
        "is_group": False,
        "message": message
    })

    headers = {
        'x-rapidapi-key': "cdea89a689msh43598f10910e1bfp1215bdjsn722f0369f203",
        'x-rapidapi-host': "mywhinlite.p.rapidapi.com",
        'Content-Type': "application/json"
    }

    try:
        conn.request("POST", "/sendmsg", payload, headers)
        res = conn.getresponse()
        data = res.read()
        response = data.decode("utf-8")
        logging.info(f"Message sent successfully to {contact}. Response: {response}")
    except Exception as e:
        logging.error(f"Failed to send message to {contact}. Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python send_whatsapp.py <contact> <message>")
        sys.exit(1)
    logging.basicConfig(filename='send_whatsapp.log', level=logging.INFO, 
                        format='%(asctime)s:%(levelname)s:%(message)s')
    
    
    contact = sys.argv[1]
    message = sys.argv[2]
    logging.info(f"Contact: {contact}")
    logging.info(f"Message: {message}")
    send_message(contact, message)
