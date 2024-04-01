package com.jaga.backend.config;

import com.jaga.backend.chat.ChatMessage;
import com.jaga.backend.chat.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        System.out.println("Connected");

        var chatMessage = ChatMessage.builder()
                .type(MessageType.JOIN)
                .name("Server")
                .message("New user joined")
                .build();
        var headers = new HashMap<String,Object>();
        headers.put("username", "Server");
        messageTemplate.convertAndSend("/topic/public", chatMessage, headers);

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        System.out.println("Disconnected");

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            System.out.println("User Disconnected : " + username);
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .name(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }

    }



}
