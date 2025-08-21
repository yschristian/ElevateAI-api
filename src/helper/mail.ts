import nodemailer from 'nodemailer';
import { Options as SMTPTransportOptions } from 'nodemailer/lib/smtp-transport';
import { config } from '../config/config';

interface UserInfo {
  email: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  verificationCode?: string;
  emailToken?: string;
  certificate?: Buffer;
  scheduleDetails?: string;
}

interface CourseInfo {
  courseTitle?: string;
  courseDescription?: string;
  courseId?: string;
}

type Action =
  | 'forgotPassword'
  | 'Register'
  | 'verifyCode'
  | 'generateCerticate'
  | 'ScheduleReminder'
  | 'Subscribe'
  | 'NewCourse';

const mailer = async (userInfo: UserInfo, action: Action, courseInfo?: CourseInfo): Promise<void> => {
  // console.log('Sending email...', userInfo, action);
  const transportOptions: SMTPTransportOptions = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.sendMail.mail,
      pass: config.passMail.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  let subject: string;
  let emailTo: string;
  let composition: string;
  let attachments = [];

  switch (action) {
    case 'forgotPassword':
      subject = 'Forgot Password';
      emailTo = userInfo.email;
      const username12 = userInfo.email && userInfo.email.split('@')[0];

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${username12 || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              We received a request to reset your password. The password reset link is valid for the next <strong>2 hours</strong>. Please click the button below to proceed:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/resetpassword/${userInfo.token}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: 500; transition: background-color 0.3s;">
                Reset Your Password
              </a>
            </div>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              If you didn’t request this, please ignore this email or contact support if you have concerns.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:3000/unsubscribe" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    case 'Register':
      subject = 'Welcome to ElevAIte - Registration Successful!';
      emailTo = userInfo.email;
      const username = userInfo.email && userInfo.email.split('@')[0];

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Welcome to ElevAIte!</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${userInfo.firstName || username || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Thank you for registering with ElevAIte! We’re thrilled to have you on board. Get started by exploring our courses and unlocking your learning potential.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/explore-course" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: 500; transition: background-color 0.3s;">
                Explore Courses
              </a>
            </div>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:3000/unsubscribe" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    case 'verifyCode':
      subject = 'Email Verification Code';
      emailTo = userInfo.email;

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${userInfo.firstName || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Your verification code is: <strong>${userInfo.verificationCode}</strong>. This code will expire in <strong>10 minutes</strong>.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              Please enter this code on the verification page to complete your registration.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:3000/unsubscribe" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    case 'generateCerticate':
      subject = 'Certificate of Completion';
      emailTo = userInfo.email;

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Certificate of Completion</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${userInfo.firstName || ''} ${userInfo.lastName || ''},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Congratulations! We are pleased to inform you that your certificate has been approved. Please find it attached to this email.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:3000/unsubscribe" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;

      const pdfBuffer = userInfo.certificate;
      if (pdfBuffer) {
        attachments.push({
          filename: 'Certificate.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        });
      }
      break;

    case 'ScheduleReminder':
      subject = 'Upcoming Schedule Reminder';
      emailTo = userInfo.email;

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Upcoming Schedule Reminder</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${userInfo.firstName || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              This is a reminder for your upcoming schedule:
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px;">
              <p style="color: #475569; margin: 0;">${userInfo.scheduleDetails || 'Details not available'}</p>
            </div>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Please ensure you’re prepared and logged in on time.
            </p>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:3000/unsubscribe" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    case 'Subscribe':
      subject = 'Welcome to ElevAIte - Subscription Confirmed!';
      emailTo = userInfo.email;
      const username1 = userInfo.email && userInfo.email.split('@')[0];

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">Welcome to ElevAIte!</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${username1 || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Thank you for subscribing to ElevAIte! 🎉 You will now receive email notifications about new courses and updates.
            </p>
            <ul style="color: #475569; font-size: 16px; line-height: 1.5; margin: 20px 0; padding-left: 20px;">
              <li>🎯 New course announcements</li>
              <li>📚 Course updates and improvements</li>
              <li>🏆 Special offers and promotions</li>
              <li>💡 Learning tips and resources</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/explore-course" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: 500; transition: background-color 0.3s;">
                Explore Courses
              </a>
            </div>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:4000/api/sub/unsubscribe/${userInfo.email}" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    case 'NewCourse':
      subject = `New Course Available: ${courseInfo?.courseTitle}`;
      emailTo = userInfo.email;
      const courseUsername = userInfo.email && userInfo.email.split('@')[0];

      composition = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">ElevAIte</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 20px;">📚 New Course Alert!</h2>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hello ${courseUsername || 'User'},
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              We’re excited to announce a new course has been added to ElevAIte!
            </p>
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 500;">${courseInfo?.courseTitle || 'New Course'}</h3>
              <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.5;">${courseInfo?.courseDescription || 'Description not available'}</p>
            </div>
            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Ready to expand your knowledge? This course is now available!
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/course/${courseInfo?.courseId || 'explore-course'}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: 500; margin-right: 10px; transition: background-color 0.3s;">
                View Course
              </a>
              <a href="http://localhost:3000/explore-course" style="background-color: #64748b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: 500; transition: background-color 0.3s;">
                Browse All Courses
              </a>
            </div>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Best regards,<br/>
              <strong>The ElevAIte Team</strong>
            </p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666666;">
            © 2025 ElevAIte. All rights reserved.<br/>
            <a href="http://localhost:4000/api/sub/unsubscribe/${userInfo.email}" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
          </div>
        </div>`;
      break;

    default:
      throw new Error('Invalid action');
  }

  const mailOptions = {
    from: `ElevAIte <${config.sendMail.mail}>`,
    to: emailTo,
    subject,
    html: composition,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully to:', emailTo);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default mailer;