package com.examportal.authservice.service;

import com.examportal.authservice.dto.UserEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, UserEvent> kafkaTemplate;
    private static final String TOPIC = "user-registration";

    public void sendUserRegistrationEvent(UserEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
