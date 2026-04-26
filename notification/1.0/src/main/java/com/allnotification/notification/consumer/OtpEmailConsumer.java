package com.allnotification.notification.consumer;

import com.allnotification.notification.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OtpEmailConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "otp-email-topic", groupId = "notification-group")
    public void consumeOtp(String message) {
        try {
            System.out.println("Kafka (OTP Topic) se string data mila: " + message);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(message);
            String email = node.get("email").asText();
            String otp = node.get("otp").asText();
            notificationService.sendOtpNotification(email, otp);
            System.out.println("OTP Email successfully sent to: " + email);
        } catch (Exception e) {
            System.err.println("OTP Topic error: " + e.getMessage());
        }
    }

    @KafkaListener(topics = "forgot-password-otp-topic", groupId = "notification-group")
    public void consumeForgotOtp(String message) {
        try {
            System.out.println("Kafka (Forgot Password Topic) se string data mila: " + message);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(message);
            String email = node.get("email").asText();
            String otp = node.get("otp").asText();
            notificationService.sendOtpNotification(email, otp);
            System.out.println("Forgot Password OTP successfully sent to: " + email);
        } catch (Exception e) {
            System.err.println("Forgot Password Topic error: " + e.getMessage());
        }
    }
}