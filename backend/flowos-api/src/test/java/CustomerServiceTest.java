import com.flowos.flowos_api.dto.CreateCustomerRequest;
import com.flowos.flowos_api.dto.CustomerResponse;
import com.flowos.flowos_api.dto.UpdateCustomerRequest;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CustomerRepository;
import com.flowos.flowos_api.service.CustomerService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer customer;
    private CreateCustomerRequest createRequest;
    private UpdateCustomerRequest updateRequest;

    @BeforeEach
    void setUp() {

        customer = TestDataFactory.createCustomer();

        createRequest = TestDataFactory.createCustomerRequest();

        updateRequest = TestDataFactory.updateCustomerRequest();
    }

    @Test
    void createCustomer_ShouldReturnCreatedCustomer() {

        when(customerRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(false);

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        CustomerResponse response =
                customerService.createCustomer(createRequest);

        assertNotNull(response);
        assertEquals(customer.getCustomerName(), response.getCustomerName());
        assertEquals(customer.getEmail(), response.getEmail());

        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void getCustomerById_ShouldReturnCustomer() {

        when(customerRepository.findById(1L))
                .thenReturn(Optional.of(customer));

        CustomerResponse response =
                customerService.getCustomer(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("John Smith", response.getCustomerName());
    }

    @Test
    void getCustomerById_ShouldThrowException() {

        when(customerRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> customerService.getCustomer(1L));
    }

    @Test
    void getAllCustomers_ShouldReturnList() {

        when(customerRepository.findAll())
                .thenReturn(List.of(customer));

        List<CustomerResponse> customers =
                customerService.getAllCustomers();

        assertEquals(1, customers.size());
        assertEquals("John Smith",
                customers.get(0).getCustomerName());
    }

    @Test
    void updateCustomer_ShouldUpdateCustomer() {

        when(customerRepository.findById(1L))
                .thenReturn(Optional.of(customer));

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        CustomerResponse response =
                customerService.updateCustomer(1L, updateRequest);

        assertNotNull(response);

        verify(customerRepository)
                .save(any(Customer.class));
    }

    @Test
    void deleteCustomer_ShouldDeleteSuccessfully() {

        when(customerRepository.findById(1L))
                .thenReturn(Optional.of(customer));

        doNothing().when(customerRepository)
                .delete(customer);

        customerService.deleteCustomer(1L);

        verify(customerRepository).delete(customer);
    }

    @Test
    void deleteCustomer_ShouldThrowException() {

        when(customerRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> customerService.deleteCustomer(1L));
    }

    @Test
    void createCustomer_DuplicateEmail_ShouldThrowException() {

        when(customerRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> customerService.createCustomer(createRequest));

        verify(customerRepository, never())
                .save(any(Customer.class));
    }

    @Test
    void getAllCustomers_ShouldReturnEmptyList() {

        when(customerRepository.findAll())
                .thenReturn(List.of());

        List<CustomerResponse> customers =
                customerService.getAllCustomers();

        assertTrue(customers.isEmpty());
    }

    @Test
    void repositorySave_ShouldBeCalledOnce() {

        when(customerRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(false);

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        customerService.createCustomer(createRequest);

        verify(customerRepository, times(1))
                .save(any(Customer.class));
    }
}