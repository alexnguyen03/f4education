package com.f4education.springjwt.payload.response;

import java.util.Date;
import java.util.List;

import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;

public class ClassDetailDTO {
    private Integer classId;
    private String className;
    private Date startDate;
    private Date endDate;
    private Integer maximumQuantity;
    private String status;
    private List<Student> students;
    private String teacherName;

}
