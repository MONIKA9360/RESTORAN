const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_gmail_app_password_here') {
    console.log('⚠️  Email credentials not configured. Using console logging instead.');
    return null;
  }
  
  // For Gmail SMTP (requires app password)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'monikam11g1@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation to customer
const sendCustomerConfirmation = async (booking) => {
  const transporter = createTransporter();
  
  // If no transporter (no email config), just log
  if (!transporter) {
    console.log('📧 [CUSTOMER EMAIL] Would send to:', booking.guest_email);
    console.log('📧 [CUSTOMER EMAIL] Subject: 🍽️ Booking Confirmation - Restoran');
    console.log('📧 [CUSTOMER EMAIL] Booking Details:', {
      name: booking.guest_name,
      date: booking.booking_date,
      time: booking.booking_time,
      party_size: booking.party_size
    });
    return Promise.resolve();
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'monikam11g1@gmail.com',
    to: booking.guest_email,
    subject: '🍽️ Booking Confirmation - Restoran',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FEA116; color: white; padding: 20px; text-align: center;">
          <h1>🍽️ Restoran</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h3>Dear ${booking.guest_name},</h3>
          <p>Thank you for choosing Restoran! Your table booking has been confirmed.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Booking Details:</h4>
            <p><strong>📅 Date:</strong> ${booking.booking_date}</p>
            <p><strong>🕐 Time:</strong> ${booking.booking_time}</p>
            <p><strong>👥 Party Size:</strong> ${booking.party_size} ${booking.party_size === 1 ? 'person' : 'people'}</p>
            <p><strong>📧 Email:</strong> ${booking.guest_email}</p>
            ${booking.guest_phone ? `<p><strong>📱 Phone:</strong> ${booking.guest_phone}</p>` : ''}
            ${booking.table_id ? `<p><strong>🪑 Table:</strong> Table ${booking.table_id}</p>` : ''}
            ${booking.special_requests ? `<p><strong>📝 Special Requests:</strong> ${booking.special_requests}</p>` : ''}
          </div>
          
          <p>We look forward to serving you! If you need to make any changes, please contact us.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>📍 Address:</strong> 20/41, Kaaliannan extension, Gobi</p>
            <p><strong>📞 Contact:</strong> monikam11g1@gmail.com</p>
          </div>
        </div>
        
        <div style="background: #0F172B; color: white; padding: 15px; text-align: center;">
          <p>Thank you for choosing Restoran!</p>
          <p style="font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Send booking notification to restaurant
const sendRestaurantNotification = async (booking) => {
  const transporter = createTransporter();
  
  // If no transporter (no email config), just log
  if (!transporter) {
    console.log('📧 [RESTAURANT EMAIL] Would send to: monikam11g1@gmail.com');
    console.log('📧 [RESTAURANT EMAIL] Subject: 🔔 New Booking Received - Restoran');
    console.log('📧 [RESTAURANT EMAIL] Customer:', booking.guest_name, '(' + booking.guest_email + ')');
    console.log('📧 [RESTAURANT EMAIL] Date/Time:', booking.booking_date, booking.booking_time);
    console.log('📧 [RESTAURANT EMAIL] Party Size:', booking.party_size);
    return Promise.resolve();
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'monikam11g1@gmail.com',
    to: 'monikam11g1@gmail.com',
    subject: '🔔 New Booking Received - Restoran',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FEA116; color: white; padding: 20px; text-align: center;">
          <h1>🍽️ Restoran</h1>
          <h2>New Booking Received</h2>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h3>New booking details:</h3>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Customer Information:</h4>
            <p><strong>👤 Name:</strong> ${booking.guest_name}</p>
            <p><strong>📧 Email:</strong> ${booking.guest_email}</p>
            ${booking.guest_phone ? `<p><strong>📱 Phone:</strong> ${booking.guest_phone}</p>` : ''}
            
            <h4>Booking Information:</h4>
            <p><strong>📅 Date:</strong> ${booking.booking_date}</p>
            <p><strong>🕐 Time:</strong> ${booking.booking_time}</p>
            <p><strong>👥 Party Size:</strong> ${booking.party_size} ${booking.party_size === 1 ? 'person' : 'people'}</p>
            ${booking.table_id ? `<p><strong>🪑 Table:</strong> Table ${booking.table_id}</p>` : '<p><strong>🪑 Table:</strong> Auto-assigned</p>'}
            ${booking.special_requests ? `<p><strong>📝 Special Requests:</strong> ${booking.special_requests}</p>` : ''}
            
            <p><strong>📊 Status:</strong> ${booking.status || 'Pending'}</p>
            <p><strong>🆔 Booking ID:</strong> ${booking.id}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #FEA116;">
            <p><strong>Action Required:</strong> Please confirm this booking and prepare for the guest arrival.</p>
          </div>
        </div>
        
        <div style="background: #0F172B; color: white; padding: 15px; text-align: center;">
          <p>Restoran Management System</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Main function to send both emails
const sendBookingEmails = async (booking) => {
  try {
    console.log('📧 Sending booking emails...');
    
    // Send confirmation to customer
    await sendCustomerConfirmation(booking);
    console.log('✅ Customer confirmation email sent to:', booking.guest_email);
    
    // Send notification to restaurant
    await sendRestaurantNotification(booking);
    console.log('✅ Restaurant notification email sent to: monikam11g1@gmail.com');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Send contact form notification to restaurant
const sendContactEmail = async (contactMessage) => {
  const transporter = createTransporter();
  
  // If no transporter (no email config), just log
  if (!transporter) {
    console.log('📧 [CONTACT EMAIL] Would send to: monikam11g1@gmail.com');
    console.log('📧 [CONTACT EMAIL] Subject: 🔔 New Contact Message - Restoran');
    console.log('📧 [CONTACT EMAIL] From:', contactMessage.name, '(' + contactMessage.email + ')');
    console.log('📧 [CONTACT EMAIL] Subject:', contactMessage.subject);
    console.log('📧 [CONTACT EMAIL] Message:', contactMessage.message);
    return Promise.resolve();
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'monikam11g1@gmail.com',
    to: 'monikam11g1@gmail.com',
    subject: '🔔 New Contact Message - Restoran',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FEA116; color: white; padding: 20px; text-align: center;">
          <h1>🍽️ Restoran</h1>
          <h2>New Contact Message</h2>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h3>New message from your website:</h3>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>Contact Information:</h4>
            <p><strong>👤 Name:</strong> ${contactMessage.name}</p>
            <p><strong>📧 Email:</strong> ${contactMessage.email}</p>
            ${contactMessage.subject ? `<p><strong>📝 Subject:</strong> ${contactMessage.subject}</p>` : ''}
            
            <h4>Message:</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #FEA116;">
              <p>${contactMessage.message}</p>
            </div>
            
            <p><strong>📅 Received:</strong> ${new Date(contactMessage.created_at).toLocaleString()}</p>
            <p><strong>🆔 Message ID:</strong> ${contactMessage.id}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #FEA116;">
            <p><strong>Action Required:</strong> Please respond to this customer inquiry.</p>
          </div>
        </div>
        
        <div style="background: #0F172B; color: white; padding: 15px; text-align: center;">
          <p>Restoran Contact Management System</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingEmails,
  sendCustomerConfirmation,
  sendRestaurantNotification,
  sendContactEmail
};