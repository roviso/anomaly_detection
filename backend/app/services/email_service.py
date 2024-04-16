import uuid
from fastapi import HTTPException, status
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Function to generate a unique token
def generate_unique_token():
    return str(uuid.uuid4())

# Function to send registration email
def send_registration_email(email, registration_link):
    # Use SendGrid API to send email (Replace SENDGRID_API_KEY with your actual API key)
    SENDGRID_API_KEY = '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'
    FROM_EMAIL = 'dominator2rule@gmail.com'

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=email,
        subject='Complete your registration',
        html_content=f'Click the following link to complete your registration: <a href="{registration_link}">{registration_link}</a>'
    )
    print(f"Sending Mail: {message}")
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        print(sg.api_key)
        response = sg.send(message)
        print(f"GOT RESPONSE : {response}")
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print("Error sending email:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error sending email")
