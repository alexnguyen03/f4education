package com.f4education.springjwt.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseHistoryDTO {
    private Integer courseHistoryId;
    private Integer courseId;
    private String subjectName;
    private String adminName;
    private String courseName;
    private Float coursePrice;
    private Integer courseDuration;
    private String courseDescription;
    private String image;
    private String action;
    private Date modifyDate;

}
