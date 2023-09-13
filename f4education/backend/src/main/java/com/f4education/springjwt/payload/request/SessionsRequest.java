package com.f4education.springjwt.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionsRequest {
	@JsonProperty("sessionId")
	private Integer sessionId;

	@JsonProperty("sessionName")
	private String sessionName;
	@JsonFormat(pattern = "HH:m:ss")
	@JsonProperty("startTime")
	private Time startTime;

	@JsonFormat(pattern = "HH:mm:ss")
	@JsonProperty("endTime")
	private Time endTime;


	@JsonProperty("adminId")
	private String adminId;

	@Override
	public String toString() {
		return "SessionsRequest{" +
				"sessionId=" + sessionId +
				", sessionName='" + sessionName + '\'' +
				", startTime=" + startTime +
				", endTime=" + endTime +
				", adminId='" + adminId + '\'' +
				'}';
	}
}
