package com.examintel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    private String subject;
    private String text;
    private String type; // Multiple Choice, Open Ended, Numeric
    private String difficulty; // Easy, Medium, Hard
    private List<String> options;
    private String correctAnswer;
    private int usageCount;
}
