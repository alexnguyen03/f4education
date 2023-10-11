package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.SubjectHistory;

@Repository
public interface SubjectHistoryRepository extends JpaRepository<SubjectHistory, Integer> {
	@Query("SELECT sh FROM SubjectHistory sh WHERE sh.subject.subjectId=:subjectId")
	List<SubjectHistory> findBySubjectId(Integer subjectId);
}
