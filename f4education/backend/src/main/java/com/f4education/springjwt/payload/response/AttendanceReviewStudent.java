package com.f4education.springjwt.payload.response;

import java.time.OffsetDateTime;
import java.util.Date;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Sessions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceReviewStudent {
	private Integer scheduleId;
	private Date studyDate;
	private Boolean isPratice;
	private Classes classes;
	private Sessions sessions;

}
