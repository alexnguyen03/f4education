package com.f4education.springjwt.models;

import java.io.Serializable;
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

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "evaluationteacherdetail")
public class EvaluationTeacherDetail implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_teacher_detail_id")
    private Integer evaluationTeacherDetailId;
    private String title;
    private Integer value;
    @ManyToOne
    @JoinColumn(name = "evaluate_teacher_id")
    private EvaluationTeacher evaluationTeacher;

    public EvaluationTeacherDetail(String title, Integer value) {
        this.title = title;
        this.value = value;
    }

    public EvaluationTeacherDetail(EvaluationTeacher evaluationTeacher) {
        this.evaluationTeacher = evaluationTeacher;
    }
}
