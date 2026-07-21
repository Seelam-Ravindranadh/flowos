package com.flowos.flowos_api.security;

import com.flowos.flowos_api.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * Return User Entity
     */
    public User getUser() {
        return user;
    }

    /**
     * User Role
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
    }

    /**
     * Password
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * Username (Email)
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * Account Expired
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Account Locked
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Credentials Expired
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * User Enabled
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}