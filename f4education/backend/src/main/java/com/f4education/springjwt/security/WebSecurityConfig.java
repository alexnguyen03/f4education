package com.f4education.springjwt.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices.RememberMeTokenAlgorithm;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import com.f4education.springjwt.security.jwt.AuthEntryPointJwt;
import com.f4education.springjwt.security.jwt.AuthTokenFilter;
import com.f4education.springjwt.security.services.CustomOAuth2UserService;
import com.f4education.springjwt.security.services.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {

    @Autowired
    @Value("${f4education.app.jwtSecret}")
    private String key;
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth -> auth
                                .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/subjects/**",
                                        "/api/classes/**",
                                        "/api/classhistory/**",
                                        "/api/classroom/**",
                                        "/api/classroomhistory/**",
                                        "/api/sessions-history/**",
                                        "/api/resource/**",
                                        "/api/cart/**",
                                        "/api/bills/**",
                                        "api/bill-detail/**",
                                        "/api/payment-method/**",
                                        "/api/course/newest-courses",
                                        "/api/register-course/**",
                                        "/img/**")
                                .permitAll()
                                .requestMatchers(
                                        "/api/test/**",
                                        "/api/subjects/**",
                                        "/api/classs/**",
                                        "/api/courses-history/**",
                                        "/api/subject-history/**",
                                        "/api/courses/**",
                                        "/api/classroom/**",
                                        "/api/sessions/**",
                                        "/api/classhistory/**",
                                        "/api/teachers/**",
                                        "/api/students/**",
                                        "/api/sessions-history/**",
                                        "/api/resource/**",
                                        "/api/questions/**",
                                        "/api/question-detail/**",
                                        "/api/quizz-result/**",
                                        "/api/answers/**",
                                        "/api/cart/**",
                                        "/api/payment/**",
                                        "/api/bills",
                                        "/api/bill-detail/**",
                                        "/api/accounts/**",
                                        "/api/teachers-history/**",
                                        "/api/payment-method/**",
                                        "/api/course/newest-courses",
                                        "/api/register-course/**",
                                        "/api/accounts/**",
                                        "/api/schedule/**",
                                        "/api/exam/**")
                                .permitAll().anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}