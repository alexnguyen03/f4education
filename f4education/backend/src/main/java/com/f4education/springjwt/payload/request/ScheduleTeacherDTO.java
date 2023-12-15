package com.f4education.springjwt.payload.request;

import java.sql.Time;
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
    private Date date;
    private String classRoomName;
    private Integer classId;

    private String courseName;

    private String sessionName;
    private String time;
    private Boolean isPractice;

    public ScheduleTeacherDTO(Schedule schedule) {
        this.date = schedule.getStudyDate();
        this.isPractice = schedule.getIsPractice();
        try {
            this.classId = schedule.getClasses().getClassId();
            this.classRoomName = schedule.getClassRoom().getClassroomName();
        } catch (Exception e) {
            this.classId = null;
            this.classRoomName = null;
        }

        try {
            this.courseName = schedule.getClasses().getRegisterCourses().get(0).getCourse().getCourseName();
        } catch (Exception e) {
            this.courseName = null;
        }

        try {
            this.sessionName = schedule.getSessions().getSessionName();
            this.time = timeToString(schedule.getSessions().getStartTime()) + " - "
                    + timeToString(schedule.getSessions().getEndTime());
        } catch (Exception e) {
            this.sessionName = null;
            this.time = null;
        }
    }

    private String timeToString(Time time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm"); // Định dạng bạn muốn, ví dụ "HH:mm:ss"
        return formatter.format(time.toLocalTime());
    }
}
