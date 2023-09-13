package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Time;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sessionshistory")
public class SessionsHistory implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "session_history_id")
	private Integer sessionHistoryId;
	@Column(name = "session_name")
	private String sessionName;
	@Column(name = "start_time")
	private Time startTime;
	@Column(name = "end_time")
	private Time endTime;
	@Column(name = "admin_id")
	private String adminId;
	@ManyToOne
	@JoinColumn(name = "session_id")
	private Sessions sessions;
	@Column(name = "modify_date")
	private Date modifyDate;
	@Column(name = "action")
	private String action;

	@Override
	public String toString() {
		return ", sessionName='" + sessionName + '\'' +
				", startTime=" + startTime +
				", endTime=" + endTime + '}';
	}
}
