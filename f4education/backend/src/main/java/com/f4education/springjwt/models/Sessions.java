package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Time;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sessions")
public class Sessions implements Serializable {
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
	@JsonIgnore
	@OneToMany(mappedBy = "sessions")
	private List<SessionsHistory> sessionsHistorys;
	@JsonIgnore
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
