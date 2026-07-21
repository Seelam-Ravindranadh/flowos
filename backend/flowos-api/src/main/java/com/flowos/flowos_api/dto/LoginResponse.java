    package com.flowos.flowos_api.dto;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class LoginResponse {

        private String token;

        private String tokenType = "Bearer";

        private Long userId;

        private String firstName;

        private String lastName;

        private String email;

        private String role;
    }