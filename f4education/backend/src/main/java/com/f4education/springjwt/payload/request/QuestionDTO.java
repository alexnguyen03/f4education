package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Answer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Integer questionId;

    private String subjectName;

    private String courseName;

    private String questionTitle;

    private List<Answer> answer;

    private String adminName;
}