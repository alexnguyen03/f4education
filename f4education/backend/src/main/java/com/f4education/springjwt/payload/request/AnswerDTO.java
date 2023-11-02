package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    private Integer answerId;

    private String answerContent;
 
    private Boolean isCorrect;

    private Integer questionDetailId;
}