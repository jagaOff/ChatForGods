package com.jaga.backend.controllers;

import com.jaga.backend.data.dto.RegisterDto;
import com.jaga.backend.data.entity.User;
import com.jaga.backend.data.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;

@Controller
@AllArgsConstructor
@RestController
@MessageMapping("/auth")
public class AuthController {

    private final UserService userService;

    @MessageMapping("/register")
    @SendTo("/topic/auth")
    @Transactional
    public void registerUser(@Payload RegisterDto registerDto) throws Exception {
        char[] password = registerDto.password().toCharArray();
        User user = new User(registerDto.username(), password, new HashSet<>(), false);

        userService.registerUser(user);

        System.out.println("User registered: " + user.toString());
    }

    @MessageMapping("/login")
    @SendTo("/topic/auth")
    @Transactional
    public void loginUser(@Payload RegisterDto registerDto) throws Exception {
        char[] password = registerDto.password().toCharArray();

       User user = userService.loginUser(registerDto.username(), password);

        System.out.println("User logged in: " + user.toString());

    }



}
