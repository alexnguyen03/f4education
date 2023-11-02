package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionClassroomDTO {
    private Integer classroomId;
    private String classroomName;
    private Integer sessionId;
    private String sessionName;
}
