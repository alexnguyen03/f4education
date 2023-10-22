package com.f4education.springjwt.payload.response;

import java.sql.Time;
import java.util.Date;

import com.f4education.springjwt.models.Sessions;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionsHistoryDTO {
    private Integer sessionHistoryId;
    private String sessionName;
    private Time startTime;
    private Time endTime;
    private String adminName;
    private Sessions sessions;
    private Date modifyDate;
    private String action;

    public SessionsHistoryDTO(Integer sessionHistoryId, String sessionName, String adminName, Time startTime,
            Time endTime, Date modifyDate, String action) {
        this.sessionHistoryId = sessionHistoryId;
        this.sessionName = sessionName;
        this.adminName = adminName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.modifyDate = modifyDate;
        this.action = action;
    }
}
