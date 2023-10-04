package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThoiLuongRange {
	private Integer minThoiLuong;
	private Integer maxThoiLuong;
}
