package com.f4education.springjwt.payload.response;

import java.sql.Time;

import com.f4education.springjwt.models.Admin;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class SessionsDTO {
    private Integer sessionId;
    private String sessionName;
    private Time startTime;
    private Time endTime;
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}
