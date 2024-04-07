package com.jaga.backend.data.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserDto(
        @JsonProperty("username")
        String username

) {
}
