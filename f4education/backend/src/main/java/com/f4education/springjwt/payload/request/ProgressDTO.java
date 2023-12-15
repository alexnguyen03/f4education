package com.f4education.springjwt.payload.request;

import java.util.List;

import com.f4education.springjwt.models.Attendance;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProgressDTO {
    Student student;
    Integer soBuoiVang = 0;
    Integer tongSoBuoi = 0;

    public ProgressDTO(RegisterCourse registerCourse) {

        try {
            this.student = registerCourse.getStudent();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            this.tongSoBuoi = registerCourse.getClasses().getSchedules().size();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            int vang = 0;
            List<Attendance> attendances = registerCourse.getStudent().getAttendances();
            if (!attendances.isEmpty()) {
                for (Attendance attendance : attendances) {
                    if (attendance.getStudent().getStudentId() == registerCourse.getStudent().getStudentId()) {
                        vang++;
                    }
                }
            }
            this.soBuoiVang = vang;
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
