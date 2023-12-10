package com.f4education.springjwt.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentInPointDTO {
    @JsonProperty("pointId")
    private Integer pointId;
    @JsonProperty("studentId")
    private String studentId;
    @JsonProperty("quizzPoint")
    private Double quizzPoint;
    @JsonProperty("averagePoint")
    private Double averagePoint;
    @JsonProperty("attendancePoint")
    private Double attendancePoint;
    @JsonProperty("exercisePoint")
    private Double exercisePoint;

}
