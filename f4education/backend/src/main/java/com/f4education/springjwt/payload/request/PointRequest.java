package com.f4education.springjwt.payload.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointRequest {
    @JsonProperty("classId")
    private Integer classId;
    @JsonProperty("listPointOfStudent")
    private List<StudentInPointDTO> listPointOfStudent;
}
