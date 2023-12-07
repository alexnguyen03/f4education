package com.f4education.springjwt.controllers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.ERole;
import com.f4education.springjwt.models.RefreshToken;
import com.f4education.springjwt.models.Role;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.LoginRequest;
import com.f4education.springjwt.payload.request.SignupRequest;
import com.f4education.springjwt.payload.request.TokenRefreshRequest;
import com.f4education.springjwt.payload.response.JwtResponse;
import com.f4education.springjwt.payload.response.MessageResponse;
import com.f4education.springjwt.payload.response.TokenRefreshResponse;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.RoleRepository;
import com.f4education.springjwt.repository.UserRepository;
import com.f4education.springjwt.security.jwt.JwtUtils;
import com.f4education.springjwt.security.services.RefreshTokenServiceImpl;
import com.f4education.springjwt.security.services.UserDetailsImpl;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;
  @Autowired
  RefreshTokenServiceImpl refreshTokenService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String jwt = jwtUtils.generateJwtToken(userDetails);
    List<String> roles = userDetails.getAuthorities()
        .stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());
    RefreshToken refreshToken = refreshTokenService.findByUserId(userDetails.getId()).orElse(null);
    if (refreshToken == null) {
      refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
    }

    return ResponseEntity.ok(new JwtResponse(
        jwt,
        userDetails.getId(),
        userDetails.getUsername(),
        userDetails.getFullName(),
        userDetails.getEmail(),
        roles,
        refreshToken.getToken(),
        userDetails.getImageName()));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {

        switch (role) {
          case "admin":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);

            break;
          case "teacher":
            Role teaRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(teaRole);

            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
    if (request.equals("")) {
      return ResponseEntity.badRequest().body("Refresh token is not valid");
    }
    String requestRefreshToken = request.getRefreshToken();

    return refreshTokenService.findByToken(requestRefreshToken)
        .map(refreshTokenService::verifyExpiration)
        .map(RefreshToken::getUser)
        .map(user -> {
          String token = jwtUtils.generateTokenFromUsername(user.getUsername());
          return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
        }).orElse(ResponseEntity.notFound().build());

  }

  @PostMapping("/signout/{id}")
  public ResponseEntity<?> logoutUser(@PathVariable Long id) {
    // UserDetailsImpl userDetails = (UserDetailsImpl)
    // SecurityContextHolder.getContext().getAuthentication()
    // .getPrincipal();
    // Long userId = userDetails.getId();
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    refreshTokenService.deleteByUserId(id);
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
  }

  @GetMapping("/{email}")
  public ResponseEntity<?> getRoleByEmail(@PathVariable("email") String email) {

    User foundUser = userRepository.findByEmail(email);
    if (foundUser == null) {
      return ResponseEntity.notFound().build();
    }

    String jwt = jwtUtils.generateJwtToken(foundUser);
    List<String> roles = foundUser.getRoles().stream()
        .map(item -> item.getName().name())
        .collect(Collectors.toList());
    UserDetailsImpl userDetails = UserDetailsImpl.build(foundUser);
    RefreshToken refreshToken = refreshTokenService.findByUserId(foundUser.getId()).orElse(null);
    if (refreshToken == null) {
      refreshToken = refreshTokenService.createRefreshToken(foundUser.getId());
    }
    return ResponseEntity.ok(new JwtResponse(jwt,
        foundUser.getId(),
        foundUser.getUsername(),
        foundUser.getEmail(),
        jwt, roles,
        refreshToken.getToken(),
        userDetails.getImageName()));

  }

}