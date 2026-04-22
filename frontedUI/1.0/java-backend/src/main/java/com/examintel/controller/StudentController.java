package com.examintel.controller;

import com.examintel.model.Result;
import com.examintel.model.Exam;
import com.examintel.repository.ResultRepository;
import com.examintel.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ExamRepository examRepository;

    @GetMapping("/{id}/portal")
    public Map<String, Object> getStudentPortal(@PathVariable String id) {
        Map<String, Object> data = new HashMap<>();
        data.put("upcomingExams", examRepository.findByStatus("Scheduled"));
        data.put("recentResults", resultRepository.findByStudentId(id));
        return data;
    }

    @PostMapping("/submit-exam")
    public Result submitExam(@RequestBody Result result) {
        return resultRepository.save(result);
    }
}
