import com.flowos.flowos_api.dto.*;
import com.flowos.flowos_api.entity.Customer;
import com.flowos.flowos_api.entity.Invoice;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.CustomerStatus;
import com.flowos.flowos_api.enums.InvoiceStatus;
import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class TestDataFactory {

    private TestDataFactory() {
    }

    // =====================================================
    // CUSTOMER
    // =====================================================

    public static CreateCustomerRequest createCustomerRequest() {

        CreateCustomerRequest request = new CreateCustomerRequest();

        request.setCustomerName("John Smith");
        request.setEmail("john@gmail.com");
        request.setPhone("9876543210");
        request.setCompany("ABC Technologies");
        request.setAddress("Hyderabad");
        request.setGstNumber("29ABCDE1234F1Z5");

        return request;
    }

    public static UpdateCustomerRequest updateCustomerRequest() {

        UpdateCustomerRequest request = new UpdateCustomerRequest();

        request.setCustomerName("John Updated");
        request.setPhone("9876543210");
        request.setCompany("XYZ Technologies");
        request.setAddress("Bangalore");
        request.setGstNumber("29ABCDE1234F1Z5");
        request.setStatus(CustomerStatus.ACTIVE);

        return request;
    }

    public static Customer createCustomer() {

        Customer customer = new Customer();

        customer.setId(1L);
        customer.setCustomerName("John Smith");
        customer.setEmail("john@gmail.com");
        customer.setPhone("9876543210");
        customer.setCompany("ABC Technologies");
        customer.setAddress("Hyderabad");
        customer.setGstNumber("29ABCDE1234F1Z5");
        customer.setStatus(CustomerStatus.ACTIVE);
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        return customer;
    }

    // =====================================================
    // VENDOR
    // =====================================================

    public static CreateVendorRequest createVendorRequest() {

        CreateVendorRequest request = new CreateVendorRequest();

        request.setVendorName("ABC Technologies");
        request.setEmail("vendor@gmail.com");
        request.setPhone("9876543211");
        request.setCompany("ABC Technologies");
        request.setAddress("Hyderabad");
        request.setGstNumber("29ABCDE1234F1Z5");

        // Change SOFTWARE if your enum contains another value.
        request.setCategory(VendorCategory.SOFTWARE);

        return request;
    }

    public static UpdateVendorRequest updateVendorRequest() {

        UpdateVendorRequest request = new UpdateVendorRequest();

        request.setVendorName("Updated Vendor");
        request.setPhone("9876543211");
        request.setCompany("XYZ Pvt Ltd");
        request.setAddress("Chennai");
        request.setGstNumber("29ABCDE1234F1Z5");
        request.setCategory(VendorCategory.SOFTWARE);
        request.setStatus(VendorStatus.ACTIVE);

        return request;
    }

    public static Vendor createVendor() {

        Vendor vendor = new Vendor();

        vendor.setId(1L);
        vendor.setVendorName("ABC Technologies");
        vendor.setEmail("vendor@gmail.com");
        vendor.setPhone("9876543211");
        vendor.setCompany("ABC Technologies");
        vendor.setAddress("Hyderabad");
        vendor.setGstNumber("29ABCDE1234F1Z5");
        vendor.setCategory(VendorCategory.SOFTWARE);
        vendor.setStatus(VendorStatus.ACTIVE);
        vendor.setCreatedAt(LocalDateTime.now());
        vendor.setUpdatedAt(LocalDateTime.now());

        return vendor;
    }

    // =====================================================
    // INVOICE
    // =====================================================

    public static CreateInvoiceRequest createInvoiceRequest() {

        CreateInvoiceRequest request = new CreateInvoiceRequest();

        request.setInvoiceNumber("INV-1001");
        request.setCustomerId(1L);
        request.setVendorId(1L);
        request.setInvoiceDate(LocalDate.now());
        request.setDueDate(LocalDate.now().plusDays(30));
        request.setAmount(BigDecimal.valueOf(10000));
        request.setTax(BigDecimal.valueOf(1800));
        request.setNotes("Test Invoice");

        return request;
    }

    public static UpdateInvoiceRequest updateInvoiceRequest() {

        UpdateInvoiceRequest request = new UpdateInvoiceRequest();

        request.setInvoiceNumber("INV-1001");
        request.setCustomerId(1L);
        request.setVendorId(1L);
        request.setInvoiceDate(LocalDate.now());
        request.setDueDate(LocalDate.now().plusDays(30));
        request.setPaidDate(LocalDate.now());

        request.setAmount(BigDecimal.valueOf(10000));
        request.setTax(BigDecimal.valueOf(1800));
        request.setPaidAmount(BigDecimal.valueOf(5000));

        request.setStatus(InvoiceStatus.DRAFT);
        request.setNotes("Updated Invoice");

        return request;
    }

    public static Invoice createInvoice() {

        Invoice invoice = new Invoice();

        invoice.setId(1L);
        invoice.setInvoiceNumber("INV-1001");
        invoice.setCustomer(createCustomer());
        invoice.setVendor(createVendor());

        invoice.setInvoiceDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now().plusDays(30));

        invoice.setAmount(BigDecimal.valueOf(10000));
        invoice.setTax(BigDecimal.valueOf(1800));

        invoice.setTotalAmount(BigDecimal.valueOf(11800));
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setOutstandingAmount(BigDecimal.valueOf(11800));

        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setNotes("Test Invoice");

        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());

        return invoice;
    }

    // =====================================================
    // USER
    // =====================================================

    public static RegisterRequest registerRequest() {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Flow");
        request.setLastName("User");
        request.setEmail("user@gmail.com");
        request.setPassword("Password@123");
        request.setRole("USER");

        return request;
    }

    public static LoginRequest loginRequest() {

        LoginRequest request = new LoginRequest();

        request.setEmail("user@gmail.com");
        request.setPassword("Password@123");

        return request;
    }

    public static User createUser() {

        User user = new User();

        user.setId(1L);
        user.setFirstName("Flow");
        user.setLastName("User");
        user.setEmail("user@gmail.com");
        user.setPassword("$2a$10$encryptedPassword");
        user.setRole("USER");

        return user;
    }

    // =====================================================
    // CONSTANTS
    // =====================================================

    public static final Long CUSTOMER_ID = 1L;
    public static final Long VENDOR_ID = 1L;
    public static final Long INVOICE_ID = 1L;
    public static final Long USER_ID = 1L;

    public static final String CUSTOMER_EMAIL = "john@gmail.com";
    public static final String VENDOR_EMAIL = "vendor@gmail.com";
    public static final String USER_EMAIL = "user@gmail.com";
    public static final String PASSWORD = "Password@123";
    public static final String INVOICE_NUMBER = "INV-1001";
}