package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailDTO {
    private Integer courseDetailId;
    
    private String lessionTitle;
    
    private String lessionContent;
    
    private Date createDate;

    private Integer courseId;
}
