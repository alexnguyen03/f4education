package com.f4education.springjwt.security.jwt.message;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ErrorMessage {
    private int HttpCode;
    private Date date;
    private String message;
    private String description;

}
