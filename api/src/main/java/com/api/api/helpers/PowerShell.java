package com.api.api.helpers;

import io.cloudsoft.winrm4j.client.WinRmClientContext;
import io.cloudsoft.winrm4j.winrm.WinRmTool;
import io.cloudsoft.winrm4j.winrm.WinRmToolResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.api.api.config.TeamConfig;
import com.api.api.model.TeamModel;

import java.util.regex.Pattern;
import java.util.List;
import java.util.Optional;

@Component
public class PowerShell {

    @Value("${winrm.port}")
    private int port;

    private static final Pattern DANGEROUS_CHARS = Pattern.compile("[;&|`$()<>'\"]");
    private static final List<String> BLOCKED_COMMANDS = List.of(
        "invoke-expression", "iex", "invoke-command", "icm",
        "invoke-webrequest", "iwr", "curl", "wget",
        "start-process", "saps", "downloadstring", "downloadfile",
        "encodedcommand", "enc", "invoke-item", "ii"
    );

    private final TeamConfig teamConfig;

    public PowerShell(TeamConfig teamConfig) {
        this.teamConfig = teamConfig;
    }

    public Boolean validatePowershell(String command) {
        if (command == null || command.trim().isEmpty()) {
            return true;
        }

        String lowercaseCommand = command.toLowerCase();

        if (DANGEROUS_CHARS.matcher(lowercaseCommand).find()) {
            return true;
        }

        for (String blocked : BLOCKED_COMMANDS) {
            if (lowercaseCommand.contains(blocked)) {
                return true;
            }
        }
        
        if (lowercaseCommand.matches(".*\\.(downloadstring|downloadfile).*")) {
            return true;
        }

        return false;
    }
    
    public String runPowerShell(String command, String server) {
        Optional<TeamModel> teams = teamConfig.getOneTeam(server);

        if (!teams.isPresent()) {
            return "Error could not find server";
        }

        TeamModel team = teams.get();

        WinRmClientContext context = WinRmClientContext.newInstance();

        WinRmTool winRmTool = WinRmTool.Builder.builder(team.getServerAddress(), team.getServerUsername(), team.getServerPassword())
                    .port(port)
                    .useHttps(false)
                    .authenticationScheme("Basic")
                    .context(context)
                    .build();

        try {
            System.out.println("Executing: " + command);
            
            WinRmToolResponse response = winRmTool.executePs(command);
            
            if (response.getStdErr() != null && !response.getStdErr().isEmpty()) {
                System.err.println("Error: " + response.getStdErr());
            }
            
            return response.getStdOut();                
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}