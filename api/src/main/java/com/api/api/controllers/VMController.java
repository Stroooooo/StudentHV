package com.api.api.controllers;

import com.api.api.model.TeamModel;
import com.api.api.services.VMService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vm")
@CrossOrigin(origins = "*")
public class VMController {
    
    private final VMService vmService;
    
    public VMController(VMService vmService) {
        this.vmService = vmService;
    }

    @GetMapping("/teams")
    public ResponseEntity<List<List<String>>> getTeams() {
        List<List<String>> teams = vmService.getTeams();

        return ResponseEntity.status(HttpStatus.OK).body(teams);
    }
    
    @GetMapping("/{server}")
    public ResponseEntity<String> getAllVMs(
        @PathVariable String server, 
        Authentication authentication, 
        HttpServletRequest request
    ) {
        String isAdminStr = (String) request.getAttribute("isAdmin");
        Boolean isAdmin = "true".equals(isAdminStr);
        String username = (String) request.getAttribute("username");

        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getAllVMs(server);

                if (isAdmin) {
                    return ResponseEntity.ok(result);
                } else {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode vms = mapper.readTree(result);

                    List<JsonNode> filteredVMs = new ArrayList<>();

                    if (vms.isArray()) {
                        for (JsonNode vm : vms) {
                            String vmName = vm.get("Name").asText();

                            String[] parts = vmName.split(" ");
                            if (parts.length > 3) {
                                String vmOwner = parts[0];
                                
                                if (vmOwner.equalsIgnoreCase(username)) {
                                    filteredVMs.add(vm);
                                }
                            }
                        }
                    }

                    return  ResponseEntity.ok(
                        mapper.writeValueAsString(filteredVMs)
                    );
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }

    @GetMapping("/{server}/networks")
    public ResponseEntity<String> getVirtualNetworks(@PathVariable String server, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getVirtualNetworks(server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @PostMapping("/{server}")
    public ResponseEntity<String> createVM(
        @PathVariable String server, 
        @RequestBody Map<String, Object> vmConfig, 
        Authentication authentication,
        HttpServletRequest request
    ) {
        String isAdminStr = (String) request.getAttribute("isAdmin");
        Boolean isAdmin = "true".equals(isAdminStr);

        if (authentication.isAuthenticated()) {
            try {
                String vmName = (String) vmConfig.get("name");
                long memorySizeGB = ((Number) vmConfig.getOrDefault("memoryGB", 4)).longValue();
                int processorCount = ((Number) vmConfig.getOrDefault("processors", 2)).intValue();

                if (!isAdmin && (processorCount > 2 || memorySizeGB > 4)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"error\": \"UNAUTHORIZED\"}");
                }

                String isoPath = (String) vmConfig.get("isoPath");
                String networkSwitchName = (String) vmConfig.get("networkSwitch");
                
                if (vmName == null || vmName.trim().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"error\": \"VM name is required\"}");
                }
                
                String result = vmService.createVM(vmName, memorySizeGB, processorCount, isoPath, networkSwitchName, server);
                return ResponseEntity.status(HttpStatus.CREATED).body(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }

    @GetMapping("/{server}/{vmName}/status")
    public ResponseEntity<String> getVMStatus(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getVMStatus(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @PostMapping("/{server}/{vmName}/start")
    public ResponseEntity<String> startVM(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.startVM(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @PostMapping("/{server}/{vmName}/stop")
    public ResponseEntity<String> stopVM(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.stopVM(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @PostMapping("/{server}/{vmName}/restart")
    public ResponseEntity<String> restartVM(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.restartVM(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @GetMapping("/{server}/{vmName}")
    public ResponseEntity<String> getVM(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getVM(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
    
    @DeleteMapping("/{server}/{vmName}")
    public ResponseEntity<String> deleteVM(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                vmService.deleteVM(vmName, server);
                return ResponseEntity.ok("{\"message\": \"VM deleted successfully\"}");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }

    @GetMapping("/{server}/isos")
    public ResponseEntity<String> getAvailableISOs(@PathVariable String server, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getAvailableISOs(server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }

    @GetMapping("/{server}/{vmName}/ip")
    public ResponseEntity<String> getVMIP(@PathVariable String server, @PathVariable String vmName, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            try {
                String result = vmService.getVMIPAddress(vmName, server);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("{\"error\": \"" + e.getMessage() + "\"}");
            }            
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + "UNAUTHORIZED" + "\"}");
        }
    }
}