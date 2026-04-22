package com.examportal.userservice.service;

import com.examportal.userservice.dto.UserEvent;
import com.examportal.userservice.entity.UserProfile;
import com.examportal.userservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final UserProfileRepository userProfileRepository;

    @KafkaListener(topics = "user-registration", groupId = "user-group")
    public void consumeUserRegistrationEvent(UserEvent event) {
        System.out.println("Received User Registration Event: " + event);

        UserProfile profile = UserProfile.builder()
                .username(event.getUsername())
                .email(event.getEmail())
                .phoneNumber(event.getPhoneNumber())
                .role(event.getRole())
                .build();

        userProfileRepository.save(profile);
        System.out.println("User Profile saved in userservice database.");
    }
}
