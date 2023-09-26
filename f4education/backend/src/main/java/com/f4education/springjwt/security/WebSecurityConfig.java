package com.f4education.springjwt.security;

import com.f4education.springjwt.security.jwt.AuthEntryPointJwt;
import com.f4education.springjwt.security.jwt.AuthTokenFilter;
import com.f4education.springjwt.security.services.UserDetailsServiceImpl;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.RememberMeAuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices.RememberMeTokenAlgorithm;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {

	@Value("${f4education.app.jwtSecret}")
	private String key;
	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	// @Autowired
	// RememberMeServices rememberMeServices;

	// @Autowired
	// private PersistentTokenRepository persistentTokenRepository;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	// @Override
	// public void configure(AuthenticationManagerBuilder
	// authenticationManagerBuilder) throws Exception {
	// authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	// }

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}

	// @Bean
	// @Override
	// public AuthenticationManager authenticationManagerBean() throws Exception {
	// return super.authenticationManagerBean();
	// }

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// @Override
	// protected void configure(HttpSecurity http) throws Exception {
	// http.cors().and().csrf().disable()
	// .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
	// .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
	// .authorizeRequests().antMatchers("/api/auth/**").permitAll()
	// .antMatchers("/api/test/**").permitAll()
	// .anyRequest().authenticated();
	//
	// http.addFilterBefore(authenticationJwtTokenFilter(),
	// UsernamePasswordAuthenticationFilter.class);
	// }

	// config to rememmber user
	// @Bean
	// RememberMeServices rememberMeServices() {
	// RememberMeTokenAlgorithm encodingAlgorithm = RememberMeTokenAlgorithm;
	// TokenBasedRememberMeServices rememberMe = new
	// TokenBasedRememberMeServices(key, userDetailsService,
	// encodingAlgorithm);
	// rememberMe.setMatchingAlgorithm(RememberMeTokenAlgorithm.MD5);
	// return rememberMe;
	// }

	// @Bean
	// RememberMeAuthenticationFilter rememberMeFilter() {
	// RememberMeAuthenticationFilter rememberMeFilter = new
	// RememberMeAuthenticationFilter(
	// authenticationManager,
	// rememberMeServices());
	// return rememberMeFilter;
	// }

	@Bean
	TokenBasedRememberMeServices rememberMeServices() {
		TokenBasedRememberMeServices rememberMeServices = new TokenBasedRememberMeServices(key, userDetailsService,
				RememberMeTokenAlgorithm.MD5);

		return rememberMeServices;
	}

	// @Bean
	// RememberMeAuthenticationProvider rememberMeAuthenticationProvider() {
	// RememberMeAuthenticationProvider rememberMeAuthenticationProvider = new
	// RememberMeAuthenticationProvider(key);
	// return rememberMeAuthenticationProvider;
	// }
	@Bean
	public PersistentTokenRepository persistentTokenRepository(DataSource dataSource) {
		JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
		tokenRepository.setDataSource(dataSource);
		return tokenRepository;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
				.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(
						auth -> auth
								.requestMatchers(
										"/api/auth/**",
										"/api/subjects/**",
										"/api/classs/**",
										"/api/classhistory/**",
										"/api/classroom/**",
										"/api/classroomhistory/**",
										"/api/sessions-history/**",
										"/api/resource/**",
										"/img/**")
								.permitAll()
								.requestMatchers(
										"/api/test/**",
										"/api/subjects/**",
										"/api/classs/**",
										"/api/courses-history/**",
										"/api/subjectHistory/**",
										"/api/courses/**",
										"/api/classroom/**",
										"/api/sessions/**",
										"/api/classhistory/**",
										"/api/teachers/**",
										"/api/sessions-history/**",
										"/api/resource/**",
										"/api/questions/**",
										"/api/answers/**",

										"/img/**")
								.permitAll().anyRequest().authenticated());
		;

		http.authenticationProvider(authenticationProvider());

		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
