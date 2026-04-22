package com.examintel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "results")
public class Result {
    @Id
    private String id;
    private String examId;
    private String studentId;
    private String studentName;
    private double score;
    private String status; // Passed, Failed
    private String completionDate;
    private List<String> studentAnswers;
}
