package com.pqc.security.monitoring.config;

import com.pqc.security.monitoring.security.InternalApiKeyFilter;
import com.pqc.security.monitoring.security.JwtAuthenticationFilter;
import com.pqc.security.monitoring.security.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            InternalApiKeyFilter internalApiKeyFilter,
            RestAuthenticationEntryPoint authenticationEntryPoint) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(authenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/events/internal").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(internalApiKeyFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
