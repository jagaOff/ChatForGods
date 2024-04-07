package com.jaga.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jaga.backend.chat.ChatMessage;
import com.jaga.backend.chat.MessageType;
import com.jaga.backend.data.dto.ErrorDto;
import com.jaga.backend.data.dto.MessageDto;
import com.jaga.backend.data.entity.User;
import com.jaga.backend.data.service.JwtService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final JwtService jwtService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {

        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) event.getMessage().getHeaders().get("nativeHeaders");
        List<String> userTokens = nativeHeaders.get("user_token");
        String userToken = null;
        if (userTokens != null && !userTokens.isEmpty()) {
            userToken = userTokens.get(0);
        }


        // authorized user
        if (userToken.split("-")[0].equals("guest") && !userToken.isEmpty()) {
//            String username = String.valueOf(jwtService.extractAllClaims(userToken));
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(null, new ArrayList<>());
            System.out.println("Guest connected");
        }

        var chatMessage = ChatMessage.builder()
                .type(MessageType.JOIN)
                .name("Server")
                .message("New user joined")
                .build();
        var headers = new HashMap<String, Object>();
        headers.put("username", "Server");
        messageTemplate.convertAndSend("/topic/public", chatMessage, headers);

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        System.out.println("Disconnected");

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .name(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }

    }
}
