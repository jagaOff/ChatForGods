package com.jaga.backend.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;

public record MessageDto(
        @JsonProperty("message")
        String message,
        @JsonProperty("destination")
        String destination,
        @JsonProperty("status")
        int status

) {
}
