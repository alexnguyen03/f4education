package com.f4education.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationTeacherResponse {
    private String title;
    private Integer voteCount;
    private Integer value;
}
