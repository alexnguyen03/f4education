package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {
	@JsonProperty("courseId")
	private Integer courseId;

	@JsonProperty("adminId")
	private String adminId;
	
	@JsonProperty("resourcesId")
	private Integer resourcesId;

	@JsonProperty("link")
	private String link;
	
	@JsonProperty("createDate")
	private Date createDate;

	@Override
	public String toString() {
		return "ResourceRequest [courseId=" + courseId + ", adminId=" + adminId + ", resourcesId=" + resourcesId
				+ ", link=" + link + ", createDate=" + createDate + "]";
	}
}
