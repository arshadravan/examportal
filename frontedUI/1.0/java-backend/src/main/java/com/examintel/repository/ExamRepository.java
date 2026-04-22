package com.examintel.repository;

import com.examintel.model.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExamRepository extends MongoRepository<Exam, String> {
    List<Exam> findByStatus(String status);
    List<Exam> findBySubject(String subject);
}
