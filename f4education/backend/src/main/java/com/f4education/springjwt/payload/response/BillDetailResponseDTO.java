package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Course;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillDetailResponseDTO {
    private Integer billDetailId;
    private Double totalPrice;
    private Course course;
}
