import com.flowos.flowos_api.dto.CreateVendorRequest;
import com.flowos.flowos_api.dto.UpdateVendorRequest;
import com.flowos.flowos_api.dto.VendorResponse;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.exception.ResourceNotFoundException;
import com.flowos.flowos_api.repository.VendorRepository;
import com.flowos.flowos_api.service.VendorService;

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
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private VendorService vendorService;

    private Vendor vendor;
    private CreateVendorRequest createRequest;
    private UpdateVendorRequest updateRequest;

    @BeforeEach
    void setUp() {

        vendor = TestDataFactory.createVendor();

        createRequest = TestDataFactory.createVendorRequest();

        updateRequest = TestDataFactory.updateVendorRequest();
    }

    @Test
    void createVendor_ShouldReturnCreatedVendor() {

        when(vendorRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(false);

        when(vendorRepository.save(any(Vendor.class)))
                .thenReturn(vendor);

        VendorResponse response =
                vendorService.createVendor(createRequest);

        assertNotNull(response);
        assertEquals(vendor.getVendorName(), response.getVendorName());
        assertEquals(vendor.getEmail(), response.getEmail());

        verify(vendorRepository).save(any(Vendor.class));
    }

    @Test
    void getVendorById_ShouldReturnVendor() {

        when(vendorRepository.findById(1L))
                .thenReturn(Optional.of(vendor));

        VendorResponse response =
                vendorService.getVendor(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ABC Technologies", response.getVendorName());
    }

    @Test
    void getVendorById_ShouldThrowException() {

        when(vendorRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> vendorService.getVendor(1L));
    }

    @Test
    void getAllVendors_ShouldReturnList() {

        when(vendorRepository.findAll())
                .thenReturn(List.of(vendor));

        List<VendorResponse> vendors =
                vendorService.getAllVendors();

        assertEquals(1, vendors.size());
        assertEquals("ABC Technologies",
                vendors.get(0).getVendorName());
    }

    @Test
    void updateVendor_ShouldUpdateVendor() {

        when(vendorRepository.findById(1L))
                .thenReturn(Optional.of(vendor));

        when(vendorRepository.save(any(Vendor.class)))
                .thenReturn(vendor);

        VendorResponse response =
                vendorService.updateVendor(1L, updateRequest);

        assertNotNull(response);

        verify(vendorRepository)
                .save(any(Vendor.class));
    }

    @Test
    void deleteVendor_ShouldDeleteSuccessfully() {

        when(vendorRepository.findById(1L))
                .thenReturn(Optional.of(vendor));

        doNothing().when(vendorRepository)
                .delete(vendor);

        vendorService.deleteVendor(1L);

        verify(vendorRepository).delete(vendor);
    }

    @Test
    void deleteVendor_ShouldThrowException() {

        when(vendorRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> vendorService.deleteVendor(1L));
    }

    @Test
    void createVendor_DuplicateEmail_ShouldThrowException() {

        when(vendorRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(true);

        assertThrows(RuntimeException.class,
                () -> vendorService.createVendor(createRequest));

        verify(vendorRepository, never())
                .save(any(Vendor.class));
    }

    @Test
    void getAllVendors_ShouldReturnEmptyList() {

        when(vendorRepository.findAll())
                .thenReturn(List.of());

        List<VendorResponse> vendors =
                vendorService.getAllVendors();

        assertTrue(vendors.isEmpty());
    }

    @Test
    void repositorySave_ShouldBeCalledOnce() {

        when(vendorRepository.existsByEmail(createRequest.getEmail()))
                .thenReturn(false);

        when(vendorRepository.save(any(Vendor.class)))
                .thenReturn(vendor);

        vendorService.createVendor(createRequest);

        verify(vendorRepository, times(1))
                .save(any(Vendor.class));
    }
}