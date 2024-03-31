package com.jaga.backend.chat;

import com.jaga.backend.entity.Chat;
import com.jaga.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/chats")
public class ChatController {


    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestParam Long user1Id, @RequestParam Long user2Id) {
//        Chat chat = chatService.createChat(user1Id, user2Id);
//        return new ResponseEntity<>(chat, HttpStatus.CREATED);
        return new ResponseEntity<>(null);
    }


    // end point for sending message
    // each time a message is sent to /app/chat.sendMessage, the sendMessage() method is called
    // the message is then broadcast to all subscribers of /topic/public
    @MessageMapping("/chat.sendMessage") // listens to chats/chat.sendMessage
    @SendTo("/topic/public")

    public void sendMessage(@Payload String message) {
        System.out.println("Message sent: " + message);
    }
/*    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

        System.out.println("Message sent: " + chatMessage.getContent());
        return chatMessage;
    }*/

    // Add username to the chatMessage
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    // todo передавать server.address вместо undefined



}
