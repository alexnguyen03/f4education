package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.TeacherHistoryDTO;

public interface TeacherHistoryService {
    List<TeacherHistoryDTO> getAllTeacherHistorysDTO();

    List<TeacherHistoryDTO> getTeacherHistoryDTOByID(String teacherHistoryId);

    TeacherHistoryDTO createTeacherHistory(TeacherHistoryDTO teacherHistoryDTO);
}
