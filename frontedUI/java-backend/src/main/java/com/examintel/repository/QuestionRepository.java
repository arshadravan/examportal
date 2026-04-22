package com.examintel.repository;

import com.examintel.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findBySubject(String subject);
    List<Question> findByDifficulty(String difficulty);
}
