package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.Vendor;
import com.flowos.flowos_api.enums.VendorCategory;
import com.flowos.flowos_api.enums.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Vendor> findByVendorNameContainingIgnoreCase(String vendorName);

    List<Vendor> findByStatus(VendorStatus status);

    List<Vendor> findByCategory(VendorCategory category);
}