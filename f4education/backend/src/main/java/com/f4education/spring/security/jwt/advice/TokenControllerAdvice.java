package com.f4education.spring.security.jwt.advice;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TokenControllerAdvice {

    // @ExceptionHandler(value = TokenRefreshException.class)
    // @ResponseStatus(HttpStatus.FORBIDDEN)
    // public Error handleTokenRefreshException(TokenRefreshException ex, WebRequest
    // request) {
    // return new Error(
    // HttpStatus.FORBIDDEN.value(),
    // new Date(),
    // ex.getMessage(),
    // request.getDescription(false));
    // }
}