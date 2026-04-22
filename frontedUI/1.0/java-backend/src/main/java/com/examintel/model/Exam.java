package com.examintel.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "exams")
public class Exam {
    @Id
    private String id;
    private String name;
    private String subject;
    private String status; // Live, Scheduled, Completed, Draft
    private int participantsCount;
    private String startTime;
    private int duration;
    private String date;
    private List<String> questionIds;
}
