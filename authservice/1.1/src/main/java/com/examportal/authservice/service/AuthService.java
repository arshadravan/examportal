package com.examportal.authservice.service;

import com.examportal.authservice.dto.AuthRequest;
import com.examportal.authservice.dto.AuthResponse;
import com.examportal.authservice.entity.User;
import com.examportal.authservice.repository.UserRepository;
import com.examportal.authservice.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final OtpService otpService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        userRepository.save(user);
        otpService.generateAndSendOtp(user.getEmail());
        return "Registration successful. Please verify your email with the OTP sent.";
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("Email not verified. Please verify OTP first.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        UserDetails userDetails = loadUserByUsername(user.getUsername());
        String token = jwtUtils.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    // ✅ Step 1 — Email check karo, OTP bhejo
    public String forgotPassword(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email."));

        otpService.generateAndSendForgotPasswordOtp(email);
        return "OTP sent to your email.";
    }

    // ✅ Step 2 — OTP verify karo
    public String verifyForgotOtp(String email, String otp) {
        otpService.verifyForgotOtp(email, otp);
        return "OTP verified. You can now reset your password.";
    }

    // ✅ Step 3 — Password reset karo
    public String resetPassword(String email, String otp, String newPassword) {
        // Dobara OTP verify — security ke liye
        otpService.verifyForgotOtp(email, otp);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // OTP Redis se clean karo
        otpService.deleteForgotOtp(email);

        return "Password reset successful. Please login.";
    }
}