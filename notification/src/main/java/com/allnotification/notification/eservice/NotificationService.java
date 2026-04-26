package com.allnotification.notification.service;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendOtpNotification(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@mocktest4u.com");
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Tumhara OTP hai: " + otp + "\nYeh 10 minute mein expire ho jayega.");
        mailSender.send(message);
    }
}