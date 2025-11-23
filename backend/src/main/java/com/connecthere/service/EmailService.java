package com.connecthere.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("ConnectHere – Email Verification Code");
        msg.setText(
            "Hi,\n\n" +
            "Your ConnectHere verification code is: " + code + "\n\n" +
            "It will expire in 10 minutes.\n\n" +
            "Thanks,\n" +
            "ConnectHere Team"
        );

        mailSender.send(msg);
        System.out.println("📧 Sent OTP " + code + " to " + toEmail);
    }
}
