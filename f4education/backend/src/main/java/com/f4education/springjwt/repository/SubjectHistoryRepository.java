package com.f4education.springjwt.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.SubjectHistory;

@Repository
public interface SubjectHistoryRepository extends JpaRepository<SubjectHistory, Integer> {
//	@Query("SELECT sh.modifyDate FROM SubjectHistory sh WHERE sh.action = "
//			+ ":action AND sh.subject.subjectId = :subjectId")
//	Date findCreateDateByActionAndSubjectId(String action, Integer subjectId);
}
