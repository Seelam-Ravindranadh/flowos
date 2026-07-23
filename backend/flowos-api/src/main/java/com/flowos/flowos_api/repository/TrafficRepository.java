package com.flowos.flowos_api.repository;

import com.flowos.flowos_api.entity.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrafficRepository
        extends JpaRepository<TrafficData, Long> {

    List<TrafficData> findByLocation(String location);

    List<TrafficData> findByCongestionLevel(String congestionLevel);

    List<TrafficData> findByRouteName(String routeName);
}