package com.f4education.springjwt.models;

import java.sql.Time;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sessions")
public class Sessions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Integer sessionId;
    @Column(name = "session_name")
    private String sessionName;
    @Column(name = "start_time")
    private Time startTime;
    @Column(name = "end_time")
    private Time endTime;
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Override
    public String toString() {
        return "Session{" +
                "sessionId=" + sessionId +
                ", sessionName='" + sessionName + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime + '}';
    }
}
