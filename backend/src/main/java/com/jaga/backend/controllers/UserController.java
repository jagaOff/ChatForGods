package com.jaga.backend.controllers;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@Controller
@AllArgsConstructor
@RestController
@MessageMapping("/user")
public class UserController {

    @MessageMapping("/getUsername")
    @SendTo("/topic/user")
    @Transactional
    public void registerUser(@Payload String userToken) throws Exception {
        //TODO check user token and return username if valid else return error

    }

}
