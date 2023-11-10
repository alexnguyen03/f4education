package com.f4education.springjwt.payload.response;

import java.util.List;

import com.f4education.springjwt.models.DetailPoint;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointDTO {
    private Integer pointId;

    private Float averagePoint;

    private Float exercisePoint;

    private Float quizzPoint;

    private Float attendancePoint;

    private String studentName;

    private String studentId;

}
