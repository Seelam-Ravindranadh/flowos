package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.TrafficRequest;
import com.flowos.flowos_api.dto.TrafficResponse;
import com.flowos.flowos_api.service.TrafficService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
@RequiredArgsConstructor
public class TrafficController {

    private final TrafficService trafficService;

    // GET all traffic
    @GetMapping
    public ResponseEntity<List<TrafficResponse>> getAllTraffic() {
        return ResponseEntity.ok(trafficService.getAllTraffic());
    }

    // GET by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<TrafficResponse>> getByLocation(
            @PathVariable String location) {
        return ResponseEntity.ok(
                trafficService.getByLocation(location));
    }

    // GET by congestion level
    @GetMapping("/congestion/{level}")
    public ResponseEntity<List<TrafficResponse>> getByCongestion(
            @PathVariable String level) {
        return ResponseEntity.ok(
                trafficService.getByCongestion(level));
    }

    // POST add traffic data
    @PostMapping
    public ResponseEntity<TrafficResponse> addTraffic(
            @RequestBody TrafficRequest request) {
        return ResponseEntity.ok(
                trafficService.addTrafficData(request));
    }
}
