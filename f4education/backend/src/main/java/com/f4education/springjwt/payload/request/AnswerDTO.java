package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    private Integer answerId;

    private String text;

    private boolean isCorrect;

    private Integer questionId;
}