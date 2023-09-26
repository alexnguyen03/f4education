package com.f4education.springjwt.payload.response;

import java.util.List;

public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String email;
  private String fullName;
  private List<String> roles;
  private String refreshToken;

  public JwtResponse(String accessToken, Long id, String username, String fullName, String email, List<String> roles,
      String refreshToken) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.fullName = fullName;
    this.email = email;
    this.roles = roles;
    this.refreshToken = refreshToken;
  }

  public String getRefreshToken() {
    return this.refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.token = refreshToken;
  }

  public String getAccessToken() {
    return token;
  }

  public void setAccessToken(String accessToken) {
    this.token = accessToken;
  }

  public String getTokenType() {
    return type;
  }

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public List<String> getRoles() {
    return roles;
  }
}
