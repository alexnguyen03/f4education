package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class ExaminationDTO {
    private Integer examId;
    private Integer questionId;
    private Integer classId;
    private Date finishDate;

}
