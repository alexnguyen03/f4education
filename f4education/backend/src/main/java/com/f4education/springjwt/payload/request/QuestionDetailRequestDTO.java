package com.f4education.springjwt.payload.request;

import java.util.List;

import com.f4education.springjwt.models.Answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailRequestDTO {
    private Integer questionDetailId;

    private Integer subjectId;

    private Integer courseId;

    private String adminId;
}