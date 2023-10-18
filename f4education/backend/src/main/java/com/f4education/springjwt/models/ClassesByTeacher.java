package com.f4education.springjwt.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassesByTeacher {

    RegisterCourse registerCourse;
    Classes classes;
    Teacher teacher;

}
