# Email Setup Instructions

## Current Status
✅ Email service is set up and working with console logging
⚠️ To send real emails, you need to configure Gmail App Password

## To Enable Real Email Sending:

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Turn on 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account → Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "Restoran Booking System"
5. Copy the generated 16-character password

### Step 3: Update Environment Variables
1. Open `restaurant-fullstack/server/.env`
2. Replace `your_gmail_app_password_here` with your actual app password:
   ```
   EMAIL_PASS=your_16_character_app_password
   ```

### Step 4: Restart Server
```bash
cd restaurant-fullstack/server
npm run dev
```

## Current Behavior (Without App Password)
- ✅ Booking works perfectly
- ✅ Success message shows
- ✅ Email details logged to server console
- ❌ No actual emails sent

## After Setup (With App Password)
- ✅ Real emails sent to customer
- ✅ Real emails sent to monikam11g1@gmail.com
- ✅ Beautiful HTML email templates
- ✅ Booking confirmations and notifications

## Test the System
1. Make a booking on the website
2. Check server console for email logs
3. After setup, check both email addresses for real emails

## Email Templates Include:
- 🍽️ Restaurant branding
- 📅 Booking details
- 👥 Party information
- 📧 Contact information
- 🎨 Professional HTML design