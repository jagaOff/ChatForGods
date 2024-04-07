package com.jaga.backend.controllers;

import com.jaga.backend.data.dto.AuthDto;
import com.jaga.backend.data.dto.ErrorDto;
import com.jaga.backend.data.dto.LoginSuccessDto;
import com.jaga.backend.data.dto.MessageDto;
import com.jaga.backend.data.entity.User;
import com.jaga.backend.data.service.JwtService;
import com.jaga.backend.data.service.MessageSendingService;
import com.jaga.backend.data.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

@Controller
@AllArgsConstructor
@RestController
@MessageMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final MessageSendingService messageSendingService;


    @MessageMapping("/register")
    @Transactional
    public void registerUser(@Payload AuthDto authDto) throws Exception {

        char[] password = authDto.password().toCharArray();
        User user = userService.registerUser(new User(authDto.username(), password, new HashSet<>(), false), authDto.token());

        if(user == null) {
            return;
        }

        var loginSuccessDto = new LoginSuccessDto(jwtService.createToken(user), user.getUsername(), user.isAdmin(), "/topic/auth/" + authDto.token(), HttpStatus.OK.value());
        messageSendingService.sendLoginMessage(loginSuccessDto);
    }

    @MessageMapping("/login")
    @Transactional
    public void loginUser(@Payload AuthDto authDto) throws Exception {
        char[] password = authDto.password().toCharArray();

        User user = userService.loginUser(authDto.username(), password, authDto.token());

        if (user == null) {
            return;
        }

        var loginSuccessDto = new LoginSuccessDto(jwtService.createToken(user), user.getUsername(), user.isAdmin(), "/topic/auth/" + authDto.token(), HttpStatus.OK.value());
        messageSendingService.sendLoginMessage(loginSuccessDto);
    }

    @MessageMapping("/JWT")
    @Transactional
    public void checkJWT(@Payload String token) {
        token = token.replace("\"", "");
        try {
            if (!jwtService.validateToken(token)) {
                Claims claims = jwtService.extractAllClaims(token);
                if (claims.get("username") != null) {
                    Optional<User> user = userService.getUserByUsername(claims.get("username").toString());
                    messageSendingService.sendMessage(new MessageDto(jwtService.createToken(user.get()), "/topic/" + token, HttpStatus.OK.value()));
                }
                messageSendingService.sendError(new ErrorDto("Invalid token", "/topic/" + token, HttpStatus.UNAUTHORIZED.value()));
            }
        } catch (Exception e) {
            try {
                messageSendingService.sendError(new ErrorDto("Invalid token", "/topic/" + token, HttpStatus.UNAUTHORIZED.value()));
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }
}
