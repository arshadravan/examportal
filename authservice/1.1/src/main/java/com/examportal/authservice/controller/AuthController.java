package com.examportal.authservice.controller;
import com.examportal.authservice.dto.AuthRequest;
import com.examportal.authservice.dto.AuthResponse;
import com.examportal.authservice.entity.User;
import com.examportal.authservice.repository.UserRepository;
import com.examportal.authservice.service.AuthService;
import com.examportal.authservice.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        otpService.verifyOtp(email, otp);

        // Redis se user lo aur DB mein save karo
        User user = otpService.getPendingUser(email);
        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified! Ab login kar sakte ho.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        // User Redis se lo
        User user = otpService.getPendingUser(email);
        otpService.generateAndSendOtp(email, user);
        return ResponseEntity.ok("Naya OTP bhej diya: " + email);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ✅ Step 1 — Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(authService.forgotPassword(request.get("email")));
    }

    // ✅ Step 2 — Verify Forgot OTP
    @PostMapping("/verify-forgot-otp")
    public ResponseEntity<String> verifyForgotOtp(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(
                authService.verifyForgotOtp(request.get("email"), request.get("otp"))
        );
    }

    // ✅ Step 3 — Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(
                authService.resetPassword(
                        request.get("email"),
                        request.get("otp"),
                        request.get("newPassword")
                )
        );
    }
}
