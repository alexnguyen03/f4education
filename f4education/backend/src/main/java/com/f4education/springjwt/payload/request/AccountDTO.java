package com.f4education.springjwt.payload.request;

import java.util.List;

import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.models.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    Long id;
    String username;
    String password;
    String email;
    Boolean status;
    Integer roles = 1;

    Teacher teacher;
    Admin admin;
    Student student;

    // Serializable info = null;
    public AccountDTO(User user) {
        this.id = user.getId();
        this.status = user.getStatus();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        try {
            this.roles = user.getAccount_role().get(0).getRole().getId();
        } catch (Exception e) {
            System.out.println(e);
        }

        if (this.roles == 1) {
            try {
                this.student = user.getStudents().get(0);
            } catch (Exception e) {
                Student info = new Student();
                this.student = info;
            }
        } else {
            if (this.roles == 2) {
                try {
                    this.teacher = user.getTeachers().get(0);
                } catch (Exception e) {
                    Teacher info = new Teacher();
                    this.teacher = info;
                }
            } else {
                try {
                    this.admin = user.getAdmins().get(0);
                } catch (Exception e) {
                    Admin info = new Admin();
                    this.admin = info;
                }
            }
        }

    }
}
