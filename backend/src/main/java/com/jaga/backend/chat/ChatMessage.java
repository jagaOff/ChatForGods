package com.jaga.backend.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    // message content

    private String content;
    private String sender;
    private MessageType type;

}
