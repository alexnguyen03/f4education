package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Subject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private Integer courseId;

    private String courseName;

    private Float coursePrice;

    private String courseDuration;

    private String courseDescription;

    private Integer numberSession;

    private Subject subject;

    @Override
    public String toString() {
        return "CourseDTO{" +
                "courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                '}';
    }
}