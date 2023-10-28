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
@Table(name = "QuestionDetail")
public class QuestionDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_detail_id")
    private Integer questionDetailId;

    @Column(name = "question_title")
    private String questionTitle;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "levels")
    private String levels;

//    @OneToMany(mappedBy = "questionDetail")
//    @JsonIgnore
//    List<QuestionHistory> questionHistory;

    @OneToMany(mappedBy = "questionDetail")
    @JsonIgnore
    List<Answer> answer;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    Question question;

    @Override
    public String toString() {
        return "QuestionDetail{" +
                "questionDetailId=" + questionDetailId +
                ", questionTitle='" + questionTitle + '\'' +
                ", createDate=" + createDate +
                ", levels='" + levels + '\'' +
                '}';
    }
}
