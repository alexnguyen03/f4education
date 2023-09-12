package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTORequest {
    private Integer questionId;

    private Integer subjectId;

    private Integer courseId;

    private String questionTitle;

    private String adminId;
}