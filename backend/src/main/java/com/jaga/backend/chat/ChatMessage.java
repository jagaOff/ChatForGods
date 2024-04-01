package com.jaga.backend.chat;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    // message content

    private String name;
    private String message;
    private String date;
    private String time;


    private MessageType type; // message type -> for example JOIN, LEAVE

}