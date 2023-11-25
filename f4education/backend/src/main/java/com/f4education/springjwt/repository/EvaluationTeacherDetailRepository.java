package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.EvaluationTeacherDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationTeacherDetailRepository extends JpaRepository<EvaluationTeacherDetail, Integer> {

}
