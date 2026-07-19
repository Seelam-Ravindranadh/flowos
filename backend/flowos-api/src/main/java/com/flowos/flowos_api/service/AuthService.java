package com.flowos.flowos_api.service;


import com.flowos.flowos_api.dto.SignupRequest;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;



    public String signup(SignupRequest request){


        if(userRepository.existsByEmail(request.getEmail())){

            return "Email already registered";

        }


        User user = new User();

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setEmail(request.getEmail());


        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );


        user.setRole(request.getRole());


        userRepository.save(user);


        return "User registered successfully";

    }

}