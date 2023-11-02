package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Class")
public class Classes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "class_name")
    private String className;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "maximum_quantity")
    private Integer maximumQuantity;

    private String status;

    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<ClassHistory> classHistories;

    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<Comment> comments;

    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<Schedule> schedules;

    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<Task> tasks;

    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<RegisterCourse> registerCourses;
    
    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<QuizResult> quizResults;
    
    @OneToMany(mappedBy = "classes")
    @JsonIgnore
    List<Examination> examinations;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    Admin admin;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnore
    Teacher teacher;
}
