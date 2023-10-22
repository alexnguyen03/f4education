package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Answer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailDTO {
    private Integer questionDetailId;

    private String questionTitle;

    private Date createDate;

    private Integer questionId;

    private List<Answer> answers;
}