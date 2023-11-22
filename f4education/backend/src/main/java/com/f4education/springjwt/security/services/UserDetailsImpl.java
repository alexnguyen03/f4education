package com.f4education.springjwt.security.services;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.f4education.springjwt.models.Role;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {
  private static final long serialVersionUID = 1L;
  @Autowired
  private static AdminServiceImpl adminService;
  @Autowired
  private static TeacherServiceImpl teacherService;
  @Autowired
  private static StudentServiceImpl studentService;
  private Long id;

  private String username;

  private String email;

  private String fullName;
  private String imageName;

  @JsonIgnore
  private String password;

  private Collection<? extends GrantedAuthority> authorities;

  public UserDetailsImpl(Long id, String username, String email, String password, String fullName,
      Collection<? extends GrantedAuthority> authorities, String imageName) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.authorities = authorities;
    this.imageName = imageName;
  }

  public static UserDetailsImpl build(User user) {
    List<GrantedAuthority> authorities = user.getRoles().stream()
        .map(role -> {

          return new SimpleGrantedAuthority(role.getName().name());
        })
        .collect(Collectors.toList());
    // String r = authorities.get(0).getAuthority(); // role
    String fullName = "";
    String imageName = "";

    if (authorities.get(0).toString().equalsIgnoreCase("ROLE_ADMIN")) {
      fullName = user.getAdmins().get(0).getFullname();
      imageName = user.getAdmins().get(0).getImage();
    } else if (authorities.get(0).toString().equalsIgnoreCase("ROLE_TEACHER")) {
      fullName = user.getTeachers().get(0).getFullname();
      imageName = user.getTeachers().get(0).getImage();
    } else {
      fullName = user.getStudents().get(0).getFullname();
      imageName = user.getStudents().get(0).getImage();

    }

    // cho doi lai type admin_id roi them phan nay vao
    /*
     * if (r.equals("ROLE_ADMIN")) {
     * fullName = adminService.getAdminById(user.getUsername()).getFullname();
     * } else if (r == "ROLE_TEACHER") {
     * fullName = teacherService.findByUserId(user.getUsername()).getFullname();
     * } else {
     * fullName = studentService.findByUserId(user.getUsername()).getFullname();
     * }
     */

    return new UserDetailsImpl(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getPassword(),
        fullName,
        authorities,
        imageName);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getImageName() {
    return imageName;
  }

  public String getFullName() {
    return fullName;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    // return email;// nếu lấy email làm username để đăng nhập
    return username;// nếu nhập username để đăng nhập
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    UserDetailsImpl user = (UserDetailsImpl) o;
    return Objects.equals(id, user.id);
  }
}
