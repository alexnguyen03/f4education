package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

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

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "create_date")
    private Date createDate;

    @OneToMany(mappedBy = "question")
    List<QuestionDetail> questionDetail;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    Admin admin;

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", subjectName='" + subjectName + '\'' +
                ", courseName='" + courseName + '\'' +
                ", createDate=" + createDate +
                '}';
    }
}
