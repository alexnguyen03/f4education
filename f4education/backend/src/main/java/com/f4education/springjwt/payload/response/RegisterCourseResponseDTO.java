package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCourseResponseDTO {
    private Integer registerCourseId;

    private Date registrationDate;

    private Integer numberSession;

    private String status;

    private String courseName;

    private String courseDescription;

    private Integer courseDuration;

    private Float coursePrice;

    private String image;

    private String studentName;

    private Date startDate;

    private Date endDate;

    private String studentId;

    private Integer courseId;
}
