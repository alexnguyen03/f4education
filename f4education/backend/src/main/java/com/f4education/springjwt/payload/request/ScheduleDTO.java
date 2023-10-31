package com.f4education.springjwt.payload.request;

import java.time.OffsetDateTime;
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
	private OffsetDateTime studyDate;

	@JsonProperty("content")
	private String content;

	@JsonProperty("isPractice")
	private Boolean isPractice;

}
