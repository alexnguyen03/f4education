package com.f4education.springjwt.repository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportEvaluationTeacher {
    private String title;
    private String teacherId;
    private Integer classId;
    private Integer voteCount;
    private Integer voteValue;

}
