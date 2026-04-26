package com.examportal.authservice.service;

import com.examportal.authservice.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final long OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_RESEND_LIMIT = 3;

    public void generateAndSendOtp(String email, User user) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set("pending:user:" + email, userJson, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("REDIS ERROR DETAILS: " + e.getClass().getName() + " - " + e.getMessage());
            if (e.getCause() != null) {
                System.out.println("REDIS ROOT CAUSE: " + e.getCause().getMessage());
            }
            throw new RuntimeException("User data save karne mein error: " + e.getMessage());
        }
        generateOtp(email, "otp:", "otp:resend:count:", "otp-email-topic");
    }

    public void generateAndSendForgotPasswordOtp(String email) {
        generateOtp(email, "forgot:otp:", "forgot:otp:resend:count:", "forgot-password-otp-topic");
    }

    public boolean verifyOtp(String email, String otp) {
        return verifyOtpInternal(email, otp, "otp:");
    }

    public User getPendingUser(String email) {
        try {
            String userJson = redisTemplate.opsForValue().get("pending:user:" + email);
            if (userJson == null) throw new RuntimeException("Registration expired. Please register again.");
            User user = objectMapper.readValue(userJson, User.class);
            redisTemplate.delete("pending:user:" + email);
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("User data load karne mein error: " + e.getMessage());
        }
    }

    public boolean verifyForgotOtp(String email, String otp) {
        String otpKey = "forgot:otp:" + email;
        String savedOtp = redisTemplate.opsForValue().get(otpKey);
        if (savedOtp == null) throw new RuntimeException("OTP expired. Please request a new one.");
        if (!savedOtp.equals(otp)) throw new RuntimeException("Invalid OTP.");
        return true;
    }

    public void deleteForgotOtp(String email) {
        redisTemplate.delete("forgot:otp:" + email);
        redisTemplate.delete("forgot:otp:resend:count:" + email);
    }

    private void generateOtp(String email, String otpPrefix, String resendPrefix, String topic) {
        String resendKey = resendPrefix + email;
        String resendCount = redisTemplate.opsForValue().get(resendKey);

        if (resendCount != null && Integer.parseInt(resendCount) >= MAX_RESEND_LIMIT) {
            throw new RuntimeException("OTP resend limit exceeded. Try after 1 hour.");
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        System.out.println("==========================================");
        System.out.println("   OTP: " + otp + " [" + otpPrefix + "]");
        System.out.println("==========================================");

        redisTemplate.opsForValue().set(otpPrefix + email, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);

        if (resendCount == null) {
            redisTemplate.opsForValue().set(resendKey, "1", 1, TimeUnit.HOURS);
        } else {
            redisTemplate.opsForValue().increment(resendKey);
        }

        String message = "{\"email\":\"" + email + "\",\"otp\":\"" + otp + "\"}";
        try {
            kafkaTemplate.send(topic, message);
        } catch (Exception e) {
            System.out.println("DEBUG: Kafka fail: " + e.getMessage());
        }
    }

    private boolean verifyOtpInternal(String email, String otp, String prefix) {
        String otpKey = prefix + email;
        String savedOtp = redisTemplate.opsForValue().get(otpKey);
        if (savedOtp == null) throw new RuntimeException("OTP expired. Please request a new one.");
        if (!savedOtp.equals(otp)) throw new RuntimeException("Invalid OTP.");
        redisTemplate.delete(otpKey);
        return true;
    }
}
