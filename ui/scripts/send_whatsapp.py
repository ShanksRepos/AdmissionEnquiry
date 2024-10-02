# scripts/send_whatsapp.py
import sys
import pywhatkit as pwk

def send_message(contact, message):
    pwk.sendwhatmsg_instantly(contact, message, 30)  # Send message instantly with a 30-second wait time

if __name__ == "__main__":
    contact = sys.argv[1]
    message = sys.argv[2]
    send_message(contact, message)
