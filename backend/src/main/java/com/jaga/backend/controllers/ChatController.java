package com.jaga.backend.controllers;

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

@Controller
@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessageSendingOperations messageTemplate;


    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestParam Long user1Id, @RequestParam Long user2Id) {
        return new ResponseEntity<>(null);
    }


    // end point for sending message
    // each time a message is sent to /app/chat.sendMessage, the sendMessage() method is called
    // the message is then broadcast to all subscribers of /topic/public
    @MessageMapping("/chat.sendMessage") // listens to chats/chat.sendMessage
    @SendTo("/topic/public")
    public void sendMessage(@Payload ChatMessage message) {

        System.out.println("Message sent: " + message.toString());
        var msg = ChatMessage.builder()
                .type(MessageType.CHAT)
                .name("Server")
                .build();

    }

    // Add username to the chatMessage
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getName());
        return chatMessage;
    }

}
