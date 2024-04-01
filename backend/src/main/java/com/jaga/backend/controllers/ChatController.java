package com.jaga.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jaga.backend.chat.ChatMessage;
import com.jaga.backend.chat.MessageType;
import com.jaga.backend.data.entity.Chat;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;

@Controller
@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessageSendingOperations messageTemplate;

    private ArrayList<ChatMessage> chats = new ArrayList<>();


    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestParam Long user1Id, @RequestParam Long user2Id) {
        return new ResponseEntity<>(null);
    }


    // end point for sending message
    // each time a message is sent to /app/chat.sendMessage, the sendMessage() method is called
    // the message is then broadcast to all subscribers of /topic/public
    @MessageMapping("/chat.sendMessage") // listens to chats/chat.sendMessage
    @SendTo("/topic/public")
    public void sendMessage(@Payload ChatMessage message) throws Exception{

        chats.add(message);

        ObjectMapper mapper = new ObjectMapper();


        messageTemplate.convertAndSend("/topic/public", mapper.writeValueAsString(chats));
    }

    // Add username to the chatMessage
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getName());
        return chatMessage;
    }

}
