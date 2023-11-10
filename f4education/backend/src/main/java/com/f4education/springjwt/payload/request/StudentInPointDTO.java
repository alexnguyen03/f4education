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
    private Float quizzPoint;
    @JsonProperty("averagePoint")
    private Float averagePoint;
    @JsonProperty("attendancePoint")
    private Float attendancePoint;
    @JsonProperty("exercisePoint")
    private Float exercisePoint;

}
