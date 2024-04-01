package com.jaga.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jaga.backend.chat.ChatMessage;
import com.jaga.backend.chat.MessageType;
import com.jaga.backend.data.service.JwtService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            System.out.println("User Token: " + userToken);
        }


        if (!userToken.split("-")[0].equals("guest") && !userToken.isEmpty()) {

            if (jwtService.validateToken(userToken)) {
                // token is valid

                String username = String.valueOf(jwtService.extractAllClaims(userToken));
                System.out.println("User connected : " + username);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                System.out.println("Guest connected : " + username);
            } else {
                // token is invalid
                System.out.println("Invalid token");
                throw new RuntimeException("Invalid token");
            }
        } else {
            // token is invalid
            System.out.println("Guest connected");
        }


        /*if(token.split("-")[0].equals("guest")){
            //TODO access only to /auth/*




            System.out.println("Guest connected");
        }

        // /auth

        if (!token.isEmpty() && jwtService.validateToken(token)) {
            // token is valid
            System.out.println("User connected : " + token);
            String username = String.valueOf(jwtService.extractAllClaims(token));

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
            System.out.println("User connected : " + username);
        } else {
            // token is invalid
            System.out.println("Invalid token");
            throw new RuntimeException("Invalid token");
        }*/
        //guest-wdijwoidjaw

        System.out.println("Connected");
        System.out.println("Event message : " + event.getMessage() + "//// " + "Event user : " + event.getUser());

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
            System.out.println("User Disconnected : " + username);
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .name(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }

    }
}
