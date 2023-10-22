package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnore
    Subject subject;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
    Course course;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    Admin admin;

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", createDate=" + createDate +
                ", status=" + status +
                '}';
    }
}
