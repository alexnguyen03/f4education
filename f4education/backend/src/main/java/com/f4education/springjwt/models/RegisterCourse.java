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

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Registercourse")
public class RegisterCourse implements Serializable {
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

    @JsonIgnore
    @OneToMany(mappedBy = "registerCourse")
    List<Certificate> certificate;

    @JsonIgnore
    @OneToMany(mappedBy = "registerCourse")
    List<Evaluate> evaluates;

    @JsonIgnore
    @OneToMany(mappedBy = "registerCourse")
    List<Point> points;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "student_id")
    Student student;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "course_id")
    Course course;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "class_id")
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
