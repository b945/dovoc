# How to Configure Gmail SMTP for Order Notifications

The server uses Gmail's SMTP service to send emails (like order approvals). Since Google blocks "Less Secure Apps" for security, you need to use an **App Password**.

## Step 1: Enable 2-Step Verification
1. Go to your **Google Account** settings: [https://myaccount.google.com/](https://myaccount.google.com/)
2. Navigate to **Security** on the left menu.
3. Under "How you sign in to Google", turn on **2-Step Verification** if it isn't already enabled.

## Step 2: Generate an App Password
1. Once 2-Step Verification is on, go back to the **Security** page.
2. Search for **"App passwords"** in the top search bar (or look under "How you sign in to Google").
3. Create a new App Password:
   - **App name**: Enter "Dovoc Eco Life" (or any name).
   - Click **Create**.
4. Google will show you a **16-character password** (e.g., `abcd efgh ijkl mnop`).
   - **Copy this password.** (Remove the spaces).

## Step 3: Update Server Environment Variables
1. Open the file `server/.env` in your project.
2. Find the SMTP section and update it:

```properties
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
# Replace with your Gmail address
SMTP_USER=your-email@gmail.com
# Replace with the 16-character App Password you just copied
SMTP_PASS=abcdefghijklmnop
```

## Step 4: Restart Server
After saving the `.env` file, **restart your backend server** for the changes to take effect.
