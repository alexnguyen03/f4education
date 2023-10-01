package com.f4education.springjwt.payload.response;

import java.util.Date;
import java.util.List;

import com.f4education.springjwt.models.Answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailResponseDTO {
    private Integer questionDetailId;

    private String subjectName;

    private String courseName;

    private String questionTitle;

    private Date createDate;

    private List<Answer> answer;

    private String adminName;
}