package com.jaga.backend.adminComponent;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageSendingService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessage(String message, String destination) {
        messagingTemplate.convertAndSend(destination, message); // или chatMessage, если используете объект сообщения
    }

}
