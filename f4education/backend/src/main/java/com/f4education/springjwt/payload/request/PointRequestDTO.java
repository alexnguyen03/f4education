package com.f4education.springjwt.payload.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PointRequestDTO implements Serializable {
	private Integer pointId;
	private Float averagePoint;
	private Float attendancePoint;
	private Float exercisePoint;
	private Float quizzPoint;
}
