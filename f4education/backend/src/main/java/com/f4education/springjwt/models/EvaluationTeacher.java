package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "evaluationteacher")
public class EvaluationTeacher implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Integer evaluationId;

    @Column(name = "complete_date")
    private Date completeDate;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
    @JsonIgnore
    @OneToMany(mappedBy = "evaluationTeacher")
    private List<EvaluationTeacherDetail> evaluationTeacherDetails;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "class_id")
    private Classes classes;

}
