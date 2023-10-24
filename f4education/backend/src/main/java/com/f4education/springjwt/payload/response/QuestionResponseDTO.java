package com.f4education.springjwt.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponseDTO {
    private Integer questionId;

    private String subjectName;

    private String courseName;

    private Date createDate;

    private String adminName;
}