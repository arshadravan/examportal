package com.allnotification.notification.service; // अपना सही पैकेज नाम डालें

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService { // क्लास का नाम बदल कर NotificationService कर दिया

    private final JavaMailSender mailSender;

    public void sendOtpNotification(String email, String otp) { // मेथड का नाम अपडेट कर दिया
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Tumhara OTP hai: " + otp + "\nYeh 10 minute mein expire ho jayega.");
        mailSender.send(message);
    }
}
