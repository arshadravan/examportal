package com.examintel.repository;

import com.examintel.model.Result;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResultRepository extends MongoRepository<Result, String> {
    List<Result> findByStudentId(String studentId);
    List<Result> findByExamId(String examId);
}
