package com.flowos.flowos_api.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "Ravi@1998";

        String encoded =
                encoder.encode(password);

        System.out.println("Encoded password:");
        System.out.println(encoded);

        System.out.println(
                "Matches: " +
                        encoder.matches(password, encoded)
        );
    }
}