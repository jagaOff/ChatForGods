package com.jaga.backend.error;


import com.jaga.backend.data.service.MessageSendingService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ExceptionHandler  {

    private final MessageSendingService messageSendingService;

    public void handleException(String message, String description) {
        messageSendingService.sendMessage(message, description);
    }


}
