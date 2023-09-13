package com.f4education.springjwt.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.f4education.springjwt.models.ClassHistory;

public interface ClassHistoryRepository extends JpaRepository<ClassHistory, Integer> {
    @Query("SELECT c FROM ClassHistory c WHERE c.classes.classId = ?1")
    List<ClassHistory> findByClassId(Integer classId);
}
