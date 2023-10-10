package com.f4education.springjwt.payload.request;

import java.io.Serializable;

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
    Integer role;
    Serializable info = null;

    public AccountDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getEmail();
        this.email = user.getEmail();
        this.role = user.getAccount_role().get(0).getRole().getId();
        try {
            if (role == 1) {

                this.info = (Serializable) user.getStudents().get(0);
            } else {
                if (role == 2) {
                    this.info = (Serializable) user.getTeachers().get(0);
                } else {
                    this.info = (Serializable) user.getAdmins().get(0);
                }
            }
        } catch (Exception e) {
        }
        System.out.println();
    }
}
