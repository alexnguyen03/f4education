package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Answer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

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