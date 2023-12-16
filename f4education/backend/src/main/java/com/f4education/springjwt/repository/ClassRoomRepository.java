package com.f4education.springjwt.repository;

import java.util.Date;
import java.util.List;

import org.antlr.v4.runtime.atn.SemanticContext.AND;
import org.checkerframework.checker.units.qual.s;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.ClassRoom;
import com.f4education.springjwt.models.Sessions;

@Repository
public interface ClassRoomRepository extends JpaRepository<ClassRoom, Integer> {

    // @Query("SELECT s.classRoom FROM Schedule s WHERE s.sessions.sessionId <>
    // :sessionId")
    // public List<ClassRoom> getAllClassRoomsNotEqualSessionId(Integer sessionId);
    @Query("SELECT s.classRoom FROM Schedule s WHERE s.sessions.sessionId <> :sessionId")
    public List<ClassRoom> getAllClassRoomsNotEqualSessionId(Integer sessionId);

    // @Query("SELECT cr.classroomId, cr.classroomName, ss.sessionId, ss.sessionName
    // " +
    // "FROM ClassRoom cr, Sessions ss " +
    // "WHERE ss.sessionId NOT IN (" +
    // "SELECT DISTINCT sch.sessions.sessionId " +
    // "FROM Schedule sch " +
    // "WHERE sch.studyDate = :ngayBatDau) " +
    // "OR cr.classroomId NOT IN (" +
    // "SELECT DISTINCT sch.classRoom.classroomId " +
    // "FROM Schedule sch " +
    // "WHERE sch.studyDate = :ngayBatDau) " +
    // "GROUP BY cr.classroomId, cr.classroomName, ss.sessionId, ss.sessionName ")
    // List<Object[]> findAvailableRoomsByDate(@Param("ngayBatDau") Date
    // ngayBatDau);

    @Query(value = "SELECT  c.classroom_id,c.classroom_name, s.session_id, s.session_name " +
            "FROM  Sessions s CROSS JOIN  ClassRoom c " +
            "WHERE  c.status LIKE N'Hoạt động' AND  " +
            "NOT EXISTS ( " +
            "SELECT 1 FROM Schedule sc " +
            "WHERE  sc.session_id = s.session_id " +
            "AND sc.classroom_id = c.classroom_id " +
            "AND CAST(sc.study_date AS DATE) = CAST(?1 AS DATE) )", nativeQuery = true)
    List<Object[]> findAvailableRoomsByDate(@Param("startDate") Date startDate);
}
