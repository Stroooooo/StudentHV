package com.api.api.config;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.api.api.model.TeamModel;

@Configuration
@ConfigurationProperties(prefix = "app")
public class TeamConfig {
    private List<TeamModel> teams = new ArrayList<>();

    public List<TeamModel> getTeams() {
        return teams;
    }

    public List<List<String>> getTeamsSafe() {
        return teams.stream()
                .map(item -> List.of(item.getServerName(), item.getServerAddress()))
                .collect(Collectors.toList());
    }

    public void setTeams(List<TeamModel> teams) {
        this.teams = teams;
    }

    public Optional<TeamModel> getOneTeam(String teamName) {
        return teams.stream().filter(team -> team.getServerName().equals(teamName)).findFirst();
    }
}
