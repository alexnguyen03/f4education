package com.f4education.springjwt.payload.request;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleCourseProgressDTO {
	private Integer scheduleId;

	private OffsetDateTime studyDate;

	private Integer classId;
}
