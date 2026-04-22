package com.examintel.controller;

import com.examintel.model.User;
import com.examintel.repository.UserRepository;
import com.examintel.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public Map<String, String> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        User user = userRepository.findByEmail(loginRequest.get("email"))
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (encoder.matches(loginRequest.get("password"), user.getPassword())) {
            String jwt = jwtUtils.generateJwtToken(user.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", user.getRole());
            response.put("name", user.getName());
            return response;
        } else {
            throw new RuntimeException("Error: Invalid credentials.");
        }
    }

    @PostMapping("/signup")
    public User registerUser(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}
