package com.f4education.springjwt.payload.request;

import java.sql.Time;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {
	@JsonProperty("scheduleId")
	private Integer scheduleId;

	@JsonProperty("studyDate")
	private Date studyDate;

	@JsonProperty("startTime")
	private Time startTime;

	@JsonProperty("endTime")
	private Time endTime;
	@JsonProperty("content")
	private String content;

	@JsonProperty("isPractice")
	private Boolean isPractice;

}
