package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.TrafficRequest;
import com.flowos.flowos_api.dto.TrafficResponse;
import com.flowos.flowos_api.entity.TrafficData;
import com.flowos.flowos_api.repository.TrafficRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrafficService {

    private final TrafficRepository trafficRepository;

    // Get all traffic data
    public List<TrafficResponse> getAllTraffic() {
        return trafficRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get by location
    public List<TrafficResponse> getByLocation(String location) {
        return trafficRepository.findByLocation(location)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get by congestion level
    public List<TrafficResponse> getByCongestion(String level) {
        return trafficRepository.findByCongestionLevel(level)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add new traffic data
    public TrafficResponse addTrafficData(TrafficRequest request) {

        TrafficData data = new TrafficData();
        data.setLocation(request.getLocation());
        data.setRouteName(request.getRouteName());
        data.setLatitude(request.getLatitude());
        data.setLongitude(request.getLongitude());
        data.setCongestionLevel(request.getCongestionLevel());
        data.setAverageSpeed(request.getAverageSpeed());
        data.setVehicleCount(request.getVehicleCount());
        data.setRecordedAt(LocalDateTime.now());

        return mapToResponse(trafficRepository.save(data));
    }

    // Mapper
    private TrafficResponse mapToResponse(TrafficData data) {

        TrafficResponse response = new TrafficResponse();
        response.setId(data.getId());
        response.setLocation(data.getLocation());
        response.setRouteName(data.getRouteName());
        response.setLatitude(data.getLatitude());
        response.setLongitude(data.getLongitude());
        response.setCongestionLevel(data.getCongestionLevel());
        response.setAverageSpeed(data.getAverageSpeed());
        response.setVehicleCount(data.getVehicleCount());
        response.setRecordedAt(data.getRecordedAt());
        return response;
    }
}
