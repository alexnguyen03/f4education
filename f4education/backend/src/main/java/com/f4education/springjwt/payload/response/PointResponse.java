package com.f4education.springjwt.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointResponse {
    private Integer classId;
    private List<PointDTO> listPointsOfStudent;
}
