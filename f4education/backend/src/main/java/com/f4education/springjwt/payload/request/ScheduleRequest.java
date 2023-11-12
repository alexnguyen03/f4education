package com.f4education.springjwt.payload.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ScheduleRequest {
    @JsonProperty("classId")
    private Integer classId;
    @JsonProperty("classroomId")
    private Integer classroomId;
    @JsonProperty("adminId")
    private String adminId;
    @JsonProperty("sessionId")
    private Integer sessionId;
    @JsonProperty("listSchedule")
    private List<ScheduleDTO> listSchedule;
}
