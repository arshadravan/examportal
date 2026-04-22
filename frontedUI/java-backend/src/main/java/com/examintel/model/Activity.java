package com.examintel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    private String type;
    private String description;
    private String timestamp;
    private String user;
}
