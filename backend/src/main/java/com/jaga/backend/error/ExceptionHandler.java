package com.jaga.backend.error;


import com.jaga.backend.data.service.MessageSendingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RequiredArgsConstructor
public class ExceptionHandler  {

    private final MessageSendingService messageSendingService;

    public void handleException(String message, String description) {
        messageSendingService.sendMessage(message, description);
    }


}
