package com.f4education.springjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationTeacherDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_teacher_detail_id")
    private Integer evaluationTeacherDetailId;

    private String title;

    private Integer value;

    @ManyToOne
    @JoinColumn(name = "evaluation_teacher_id")
    private EvaluationTeacher evaluationTeacher;

    public EvaluationTeacherDetail(String title, Integer value) {
        this.title = title;
        this.value = value;
    }

    public EvaluationTeacherDetail(EvaluationTeacher evaluationTeacher) {

        this.evaluationTeacher = evaluationTeacher;
    }

}
