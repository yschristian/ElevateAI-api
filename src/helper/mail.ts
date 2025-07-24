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

type Action = "forgotPassword" | "Register" | "verifyCode" | "generateCerticate" | "ScheduleReminder";

const mailer = async (userInfo: UserInfo, action: Action): Promise<void> => {
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
                <p>We are pleased to inform you that your Certificate has been approved and is attached to this email. This certificate confirms your compliance with data processing regulations.</p>
                <p>Thank you for your commitment to data protection standards.</p>
                
                <p>Best Regards,</p>`;

            const pdfBuffer = userInfo.certificate;
            attachments.push({
                filename: 'Certificate.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            });
            break
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

        default:
            throw new Error("Invalid action");
    }

    const mailOptions = {
        from: `DPO <${config.sendMail.mail}>`,
        to: emailTo,
        subject,
        html: composition,
        attachments,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default mailer;
