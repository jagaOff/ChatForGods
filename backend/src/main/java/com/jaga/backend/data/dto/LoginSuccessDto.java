package com.jaga.backend.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;

public record LoginSuccessDto (
        @JsonProperty("token")
        String token,
        @JsonProperty("username")
        String username,
        @JsonProperty("isAdmin")
        Boolean isAdmin,
        @JsonIgnore String destination,
        @JsonProperty("status") int status
) {


}
