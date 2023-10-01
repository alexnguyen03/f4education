package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Answer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionRequestDTO {
    private Integer subjectId;

    private Integer courseId;

    private String adminId;
}