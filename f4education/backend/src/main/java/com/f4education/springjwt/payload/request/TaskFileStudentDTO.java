package com.f4education.springjwt.payload.request;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskFileStudentDTO implements Serializable {
	private String id;
	private String name;
	private String size;
}
