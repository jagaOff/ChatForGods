package com.jaga.backend.config;

import com.jaga.backend.data.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {



    private final JwtService jwtService;


    public WebSecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws").permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }



    /*@Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // Отключаем CSRF защиту, если используется JWT и не нужно защищаться от CSRF атак в вашем случае
                .csrf().disable()
                // Устанавливаем сессию как stateless, так как мы используем токены
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // Задаём запросы, которые требуют аутентификации
                .authorizeRequests()
                .antMatchers("/app/auth/**").authenticated() // Защищаем пути под /app/auth/
                .anyRequest().permitAll() // Остальные пути доступны для всех
                .and()
                // Добавляем наш фильтр перед фильтром UsernamePasswordAuthenticationFilter
                .addFilterBefore(new JwtTokenFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        // Возможно, вам понадобится настроить CORS, если ваше API используется с разных доменов
    }*/




//    /app/auth/* - required authentication

}
