package com.f4education.springjwt.payload.request;

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

	@JsonProperty("resourcesName")
	private String resourcesName;

	@JsonProperty("link")
	private String link;

	@Override
	public String toString() {
		return "ResourceRequest [courseId=" + courseId + ", adminId=" + adminId + ", resourcesName=" + resourcesName
				+ ", link=" + link + "]";
	}
}
