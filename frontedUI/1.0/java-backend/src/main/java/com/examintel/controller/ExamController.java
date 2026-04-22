package com.examintel.controller;

import com.examintel.model.Exam;
import com.examintel.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examRepository.save(exam);
    }

    @GetMapping("/status/{status}")
    public List<Exam> getExamsByStatus(@PathVariable String status) {
        return examRepository.findByStatus(status);
    }

    @DeleteMapping("/{id}")
    public void deleteExam(@PathVariable String id) {
        examRepository.deleteById(id);
    }
}
