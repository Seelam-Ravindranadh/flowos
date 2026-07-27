import com.flowos.flowos_api.dto.LoginRequest;
import com.flowos.flowos_api.dto.LoginResponse;
import com.flowos.flowos_api.dto.RegisterRequest;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import com.flowos.flowos_api.security.JwtService;
import com.flowos.flowos_api.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {

        user = TestDataFactory.createUser();

        registerRequest = TestDataFactory.registerRequest();

        loginRequest = TestDataFactory.loginRequest();
    }

    @Test
    void register_ShouldRegisterSuccessfully() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        String response = authService.register(registerRequest);

        assertEquals("User Registered Successfully", response);

        verify(passwordEncoder).encode(registerRequest.getPassword());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ShouldReturnMessage() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(true);

        String response = authService.register(registerRequest);

        assertEquals("Email already registered", response);

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldReturnLoginResponse() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token");

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(user.getFirstName(), response.getFirstName());
        assertEquals(user.getLastName(), response.getLastName());
        assertEquals(user.getRole(), response.getRole());

        verify(jwtService).generateToken(user);
    }

    @Test
    void login_InvalidEmail_ShouldThrowException() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("Invalid Email", exception.getMessage());
    }

    @Test
    void login_InvalidPassword_ShouldThrowException() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login(loginRequest));

        assertEquals("Invalid Password", exception.getMessage());

        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void password_ShouldBeEncodedDuringRegistration() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        authService.register(registerRequest);

        verify(passwordEncoder, times(1))
                .encode(registerRequest.getPassword());
    }

    @Test
    void jwt_ShouldBeGeneratedAfterSuccessfulLogin() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token");

        authService.login(loginRequest);

        verify(jwtService, times(1))
                .generateToken(user);
    }

    @Test
    void findByEmail_ShouldBeCalledOnce() {

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token");

        authService.login(loginRequest);

        verify(userRepository, times(1))
                .findByEmail(loginRequest.getEmail());
    }
}