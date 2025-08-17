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

type Action = "forgotPassword" | "Register" | "verifyCode" | "generateCerticate" | "ScheduleReminder" | "Subscribe" | "NewCourse";

const mailer = async (userInfo: UserInfo, action: Action, courseInfo?: CourseInfo): Promise<void> => {
    console.log('Sending email...', userInfo, action);
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
        case "forgotPassword":
            subject = "Forgot password";
            emailTo = userInfo.email;
            composition = `
                <p>
                    Dear user, the password reset window is limited to two hours. Click 
                    <a href="http://localhost:3000/resetpassword/${userInfo.token}">here</a>
                    to reset your password.
                </p>`;
            break;
        case "Register":
            subject = "Sign UP";
            emailTo = userInfo.email;
            composition = `
                <p>
                    Dear ${userInfo.firstName}, thank you for registering. We are glad to have you as a member.
                </p>`;
            break;
        case "verifyCode":
            subject = "verification code";
            emailTo = userInfo.email;
            composition = `
                <p>
                    Dear ${userInfo.firstName}, your verification code is ${userInfo.verificationCode}.
                    it will expire in Ten(10) minutes.
                </p>`;
            break;
        case "generateCerticate":
            subject = "Certificate of Completion";
            emailTo = userInfo.email;
            composition = `
                <p>Dear ${userInfo.firstName} ${userInfo.lastName},</p>
                <p>We are pleased to inform you that your Certificate has been approved and is attached to this email.</p>
                
                <p>Best Regards,</p>`;

            const pdfBuffer = userInfo.certificate;
            attachments.push({
                filename: 'Certificate.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            });
            break;
        case "ScheduleReminder":
            subject = "Upcoming Schedule Reminder";
            emailTo = userInfo.email;
            composition = `
                <p>Dear ${userInfo.firstName},</p>
                <p>This is a reminder for your upcoming schedule:</p>
                <p>${userInfo.scheduleDetails}</p>
                <p>Make sure to be prepared for it.</p>
                <p>Best regards,</p>`;
            break;
        case "Subscribe":
            subject = "Welcome to ElevAIte - Subscription Confirmed!";
            emailTo = userInfo.email;
            const username1 = userInfo.email && userInfo.email.split("@")[0];
            composition = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb; text-align: center;">Welcome to ElevAIte!</h2>
                    <p>Dear ${username1},</p>
                    <p>Thank you for subscribing to ElevAIte! 🎉</p>
                    <p>You will now receive email notifications whenever we upload new courses to our platform. Stay tuned for:</p>
                    <ul style="margin: 20px 0; padding-left: 20px;">
                        <li>🎯 New course announcements</li>
                        <li>📚 Course updates and improvements</li>
                        <li>🏆 Special offers and promotions</li>
                        <li>💡 Learning tips and resources</li>
                    </ul>
                    <p>We're excited to be part of your learning journey!</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/explore-course" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Browse Courses</a>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 30px;">
                        If you wish to unsubscribe at any time, <a href="http://localhost:4000/api/sub/unsubscribe/${userInfo.email}">click here</a>.
                    </p>
                    <p>Best regards,<br/>The ElevAIte Team</p>
                </div>`;
            break;
        case "NewCourse":
            subject = `New Course Available: ${courseInfo?.courseTitle}`;
            emailTo = userInfo.email;
            const username = userInfo.email && userInfo.email.split("@")[0];
            composition = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb; text-align: center;">📚 New Course Alert!</h2>
                    <p>Dear ${username},</p>
                    <p>We're excited to announce a new course has been added to ElevAIte!</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin: 0 0 10px 0;">${courseInfo?.courseTitle}</h3>
                        <p style="color: #475569; margin: 0;">${courseInfo?.courseDescription}</p>
                    </div>
                    
                    <p>Ready to expand your knowledge? This course is now available on our platform!</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/explore-course}" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                           View Course
                        </a>
                        <a href="http://localhost:3000/explore-course" 
                           style="background-color: #64748b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                           Browse All Courses
                        </a>
                    </div>
                    
                    <p>Happy learning!</p>
                    <p style="font-size: 12px; color: #666; margin-top: 30px;">
                        Don't want to receive these notifications? <a href="http://localhost:4000/api/sub/unsubscribe/${userInfo.email}">Unsubscribe here</a>.
                    </p>
                    <p>Best regards,<br/>The Elevate Team</p>
                </div>`;
            break;
        default:
            throw new Error("Invalid action");
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
        console.log('Email sent successfully to:', emailTo);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default mailer;