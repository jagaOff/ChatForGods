package com.jaga.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jaga.backend.data.dto.ErrorDto;
import com.jaga.backend.data.dto.MessageDto;
import com.jaga.backend.data.dto.UserDto;
import com.jaga.backend.data.entity.User;
import com.jaga.backend.data.service.MessageSendingService;
import com.jaga.backend.data.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Controller
@RequiredArgsConstructor
@MessageMapping("/chatlist")
public class ChatListController {

    private final UserService userService;
    private final MessageSendingService messageSendingService;

    @MessageMapping("/search")
    @Transactional
    public void search(@Payload MessageDto message) throws Exception{

        String input = message.message();

        if (input == null || input.isEmpty()) {
            messageSendingService.sendError(new ErrorDto("Input is empty", "/topic/"+message.destination(), 400));
            return;
        }

        System.out.println("Searching for users with input: " + input);
        List<User> users = userService.searchUsers(input);
        System.out.println("Found users: " + users.toString());
        List<UserDto> userDtos = users.stream().map(user -> new UserDto(user.getUsername())).toList();
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(userDtos);

        messageSendingService.sendMessage( new MessageDto(json,"/topic/"+message.destination(), 200 ));

    }
}
