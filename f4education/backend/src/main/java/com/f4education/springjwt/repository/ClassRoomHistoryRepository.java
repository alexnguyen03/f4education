package com.f4education.springjwt.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.f4education.springjwt.models.ClassRoomHistory;

public interface ClassRoomHistoryRepository extends JpaRepository<ClassRoomHistory, Integer> {
    @Query("SELECT c FROM ClassRoomHistory c WHERE c.classRoom.classroomId = ?1")
    List<ClassRoomHistory> findByClassRoomId(Integer classroomId);
}
