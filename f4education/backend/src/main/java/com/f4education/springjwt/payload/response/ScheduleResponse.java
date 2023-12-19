package com.f4education.springjwt.payload.response;

import java.sql.Time;
import java.util.List;

import com.f4education.springjwt.payload.request.ScheduleDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private Integer classId;
    private Integer sessionId;
    private Integer classroomId;
    private String className;
    private TeacherDTO teacher;

    private List<ScheduleDTO> listSchedules;
    private String sessionName;
    private String classroomName;

}
