package com.jaga.backend.data.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.jaga.backend.data.dto.ErrorDto;
import com.jaga.backend.data.dto.LoginSuccessDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

//https://stackoverflow.com/questions/45405332/websocket-authentication-and-authorization-in-spring

@Service
@RequiredArgsConstructor
public class MessageSendingService {

    private final SimpMessagingTemplate messagingTemplate;
    ObjectMapper mapper = new ObjectMapper();

    public void sendMessage(String message, String destination) {
        messagingTemplate.convertAndSend(destination, message); // или chatMessage, если используете объект сообщения
    }

    public void sendMessage(LoginSuccessDto loginSuccessDto) throws Exception{



        messagingTemplate.convertAndSend(loginSuccessDto.destination(), mapper.writeValueAsString(loginSuccessDto));
    }

    public void sendError(ErrorDto errorDto) throws Exception{

        messagingTemplate.convertAndSend(errorDto.destination(), mapper.writeValueAsString(errorDto));

        //TODO uncomment it after create users
//        messagingTemplate.convertAndSendToUser();
    }

}
