package com.examintel.controller;

import com.examintel.model.Activity;
import com.examintel.model.Exam;
import com.examintel.model.User;
import com.examintel.repository.ExamRepository;
import com.examintel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalExams", examRepository.count());
        stats.put("totalStudents", userRepository.findByRole("STUDENT").size());
        stats.put("liveExams", examRepository.findByStatus("Live").size());
        return stats;
    }

    @GetMapping("/activity-feed")
    public List<Activity> getActivityFeed() {
        return mongoTemplate.findAll(Activity.class);
    }

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }
}
