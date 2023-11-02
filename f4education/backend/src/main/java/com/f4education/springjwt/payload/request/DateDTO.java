package com.f4education.springjwt.payload.request;

import lombok.ToString;

@ToString
public class DateDTO {
    private String startDate;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

}
