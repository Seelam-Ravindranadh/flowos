import com.flowos.flowos_api.dto.CreateInvoiceRequest;
import com.flowos.flowos_api.dto.InvoiceResponse;
import com.flowos.flowos_api.dto.UpdateInvoiceRequest;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.CustomerRepository;
import com.flowos.flowos_api.repository.InvoiceRepository;
import com.flowos.flowos_api.repository.VendorRepository;
import com.flowos.flowos_api.service.InvoiceService;

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
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private Invoice invoice;
    private Customer customer;
    private Vendor vendor;
    private CreateInvoiceRequest createRequest;
    private UpdateInvoiceRequest updateRequest;

    @BeforeEach
    void setUp() {

        customer = TestDataFactory.createCustomer();

        vendor = TestDataFactory.createVendor();

        invoice = TestDataFactory.createInvoice();

        createRequest = TestDataFactory.createInvoiceRequest();

        updateRequest = TestDataFactory.updateInvoiceRequest();
    }

    @Test
    void createInvoice_ShouldReturnInvoice() {

        when(customerRepository.findById(createRequest.getCustomerId()))
                .thenReturn(Optional.of(customer));

        when(vendorRepository.findById(createRequest.getVendorId()))
                .thenReturn(Optional.of(vendor));

        when(invoiceRepository.existsByInvoiceNumber(createRequest.getInvoiceNumber()))
                .thenReturn(false);

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(invoice);

        InvoiceResponse response =
                invoiceService.createInvoice(createRequest);

        assertNotNull(response);
        assertEquals(invoice.getInvoiceNumber(),
                response.getInvoiceNumber());

        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void createInvoice_DuplicateInvoice_ShouldThrowException() {

        when(invoiceRepository.existsByInvoiceNumber(createRequest.getInvoiceNumber()))
                .thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> invoiceService.createInvoice(createRequest));

        verify(invoiceRepository, never()).save(any());
    }

    @Test
    void createInvoice_CustomerNotFound_ShouldThrowException() {

        when(customerRepository.findById(createRequest.getCustomerId()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> invoiceService.createInvoice(createRequest));
    }

    @Test
    void createInvoice_VendorNotFound_ShouldThrowException() {

        when(customerRepository.findById(createRequest.getCustomerId()))
                .thenReturn(Optional.of(customer));

        when(vendorRepository.findById(createRequest.getVendorId()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> invoiceService.createInvoice(createRequest));
    }

    @Test
    void getInvoiceById_ShouldReturnInvoice() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.of(invoice));

        InvoiceResponse response =
                invoiceService.getInvoice(1L);

        assertNotNull(response);
        assertEquals("INV-1001",
                response.getInvoiceNumber());
    }

    @Test
    void getInvoiceById_ShouldThrowException() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> invoiceService.getInvoice(1L));
    }

    @Test
    void getAllInvoices_ShouldReturnInvoices() {

        when(invoiceRepository.findAll())
                .thenReturn(List.of(invoice));

        List<InvoiceResponse> invoices =
                invoiceService.getAllInvoices();

        assertEquals(1, invoices.size());
    }

    @Test
    void getAllInvoices_ShouldReturnEmptyList() {

        when(invoiceRepository.findAll())
                .thenReturn(List.of());

        List<InvoiceResponse> invoices =
                invoiceService.getAllInvoices();

        assertTrue(invoices.isEmpty());
    }

    @Test
    void updateInvoice_ShouldUpdateSuccessfully() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.of(invoice));

        when(customerRepository.findById(updateRequest.getCustomerId()))
                .thenReturn(Optional.of(customer));

        when(vendorRepository.findById(updateRequest.getVendorId()))
                .thenReturn(Optional.of(vendor));

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(invoice);

        InvoiceResponse response =
                invoiceService.updateInvoice(1L, updateRequest);

        assertNotNull(response);

        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void updateInvoice_NotFound_ShouldThrowException() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> invoiceService.updateInvoice(1L, updateRequest));
    }

    @Test
    void deleteInvoice_ShouldDeleteSuccessfully() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.of(invoice));

        doNothing().when(invoiceRepository).delete(invoice);

        invoiceService.deleteInvoice(1L);

        verify(invoiceRepository).delete(invoice);
    }

    @Test
    void deleteInvoice_NotFound_ShouldThrowException() {

        when(invoiceRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> invoiceService.deleteInvoice(1L));
    }

    @Test
    void repositorySave_ShouldBeCalledOnce() {

        when(customerRepository.findById(createRequest.getCustomerId()))
                .thenReturn(Optional.of(customer));

        when(vendorRepository.findById(createRequest.getVendorId()))
                .thenReturn(Optional.of(vendor));

        when(invoiceRepository.existsByInvoiceNumber(createRequest.getInvoiceNumber()))
                .thenReturn(false);

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(invoice);

        invoiceService.createInvoice(createRequest);

        verify(invoiceRepository, times(1))
                .save(any(Invoice.class));
    }
}