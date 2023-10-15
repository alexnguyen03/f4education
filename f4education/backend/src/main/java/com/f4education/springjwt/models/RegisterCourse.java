package com.f4education.springjwt.models;

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
@Table(name = "Registercourse")
public class RegisterCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "register_course_id")
    private Integer registerCourseId;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "course_price")
    private Float coursePrice;

    @Column(name = "course_duration")
    private Integer courseDuration;

    @Column(name = "course_description")
    private String courseDescription;

    @Column(name = "registration_date")
    private Date registrationDate;

    @Column(name = "number_session")
    private Integer numberSession;

    private String status;

    private String image;

    @OneToMany(mappedBy = "registerCourse")
    @JsonIgnore
    List<Certificate> certificate;

    @OneToMany(mappedBy = "registerCourse")
    @JsonIgnore
    List<Evaluate> evaluates;

    @OneToMany(mappedBy = "registerCourse")
    @JsonIgnore
    List<Point> points;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnore
    Student student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnore
    Course course;

    @ManyToOne
    @JoinColumn(name = "class_id")
    @JsonIgnore
    Classes classes;

    @Override
    public String toString() {
        return "RegisterCourse{" +
                "registerCourseId=" + registerCourseId +
                ", coursePrice=" + coursePrice +
                ", courseDuration='" + courseDuration + '\'' +
                ", registrationDate=" + registrationDate +
                ", numberSession=" + numberSession +
                ", status='" + status + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}
