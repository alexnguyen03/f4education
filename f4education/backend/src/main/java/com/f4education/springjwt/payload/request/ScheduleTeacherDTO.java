package com.f4education.springjwt.payload.request;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import com.f4education.springjwt.models.Schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleTeacherDTO {
    private String date;
    private String classRoomName;
    private String className;
    private Integer classId;

    private String courseName;

    private String sessionName;
    private String startTime;
    private String endTime;
    private Boolean isPractice;

    public ScheduleTeacherDTO(Schedule schedule) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
            this.date = sdf.format(schedule.getStudyDate());

        } catch (Exception e) {
        }
        this.isPractice = schedule.getIsPractice();
        try {
            this.classId = schedule.getClasses().getClassId();
            this.classRoomName = schedule.getClassRoom().getClassroomName();
            this.className = schedule.getClasses().getClassName();
        } catch (Exception e) {
            this.classId = null;
            this.classRoomName = null;
            this.className = null;
        }

        try {
            this.courseName = schedule.getClasses().getRegisterCourses().get(0).getCourse().getCourseName();
        } catch (Exception e) {
            this.courseName = null;
        }

        try {
            this.sessionName = schedule.getSessions().getSessionName();
            this.startTime = timeToString(schedule.getSessions().getStartTime());
            this.endTime = timeToString(schedule.getSessions().getEndTime());
        } catch (Exception e) {
            this.sessionName = null;
            this.startTime = null;
            this.endTime = null;
        }
    }

    private String timeToString(Time time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm"); // Định dạng bạn muốn, ví dụ "HH:mm:ss"
        return formatter.format(time.toLocalTime());
    }
}
