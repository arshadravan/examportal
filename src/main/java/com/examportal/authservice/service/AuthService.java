package com.examportal.authservice.service;

import com.examportal.authservice.dto.AuthRequest;
import com.examportal.authservice.dto.AuthResponse;
import com.examportal.authservice.entity.User;
import com.examportal.authservice.repository.UserRepository;
import com.examportal.authservice.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    public AuthResponse register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        UserDetails userDetails = loadUserByUsername(savedUser.getUsername());
        String token = jwtUtils.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .role(savedUser.getRole())
                .phoneNumber(savedUser.getPhoneNumber())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // In a real app, you'd use AuthenticationManager here.
        // For simplicity, we'll do it manually.
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            UserDetails userDetails = loadUserByUsername(user.getUsername());
            String token = jwtUtils.generateToken(userDetails);

            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .role(user.getRole())
                    .phoneNumber(user.getPhoneNumber())
                    .build();
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
