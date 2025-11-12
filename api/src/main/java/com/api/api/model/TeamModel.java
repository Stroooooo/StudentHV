package com.api.api.model;

public class TeamModel {
    private String serverName;
    private String serverAddress;
    private String serverUsername;
    private String serverPassword;

    public TeamModel(
        String serverName,
        String serverAddress,
        String serverUsername,
        String serverPassword
    ) {
        this.serverName = serverName;
        this.serverAddress = serverAddress;
        this.serverUsername = serverUsername;
        this.serverPassword = serverPassword;
    }

    public String getServerName() {
        return this.serverName;
    }

    public String getServerAddress() {
        return this.serverAddress;
    }

    public String getServerUsername() {
        return this.serverUsername;
    }

    public String getServerPassword() {
        return this.serverPassword;
    }

    public void setServerName(String name) {
        this.serverName = name;
    }

    public void setServerAddress(String address) {
        this.serverAddress = address;
    }

    public void setServerUsername(String username) {
        this.serverUsername = username;
    }

    public void setServerPassword(String password) {
        this.serverPassword = password;
    }
}
