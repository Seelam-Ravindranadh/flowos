package com.flowos.flowos_api.service;

import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User save(User user) {
        return repository.save(user);
    }

}