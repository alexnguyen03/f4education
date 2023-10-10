package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.f4education.springjwt.models.TeacherHistory;
import com.f4education.springjwt.payload.request.TeacherHistoryDTO;

public interface TeacherHistoryRepository extends JpaRepository<TeacherHistory, Integer> {

    @Query("SELECT new com.f4education.springjwt.payload.request.TeacherHistoryDTO(o) FROM TeacherHistory o")
    List<TeacherHistoryDTO> getAllTeacherHistorysDTO();

    @Query("SELECT new com.f4education.springjwt.payload.request.TeacherHistoryDTO(o) FROM TeacherHistory o WHERE o.teacher.teacherId = ?1")
    List<TeacherHistoryDTO> getTeacherHistoryDTOByID(String teacherId);

}
