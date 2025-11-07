# Configuration Guide

This document explains how to configure and prepare your environment for both the **API** and **Website** components of the StudentHV project.

---

## Project Structure

| Component | Description | Config File |
|------------|--------------|--------------|
| API | Spring Boot backend for managing authentication, Hyper-V integration, and directory services. | `api/src/main/resources/application.properties` |
| Website | Frontend (Next.js or React) client for interacting with the API. | `website/.env` |

---

## API Configuration

The API is built with Spring Boot.  
Configuration is handled via the `application.properties` file (copied from `application.example.properties`).

### Basic Setup
```properties
spring.application.name=api
```

---

### JWT Authentication
Used for user authentication and token signing.

```properties
jwt.secret=<LONG_RANDOM_STRING>
```

Use a long, unique secret and rotate it regularly.

---

### CORS (Cross-Origin Resource Sharing)
Define which frontend origins are allowed to access your API.

```properties
cores.authrized=http://localhost:3000,http://127.0.0.1:8080
```

For production:
```properties
cores.authrized=https://yourdomain.com
```

---

### WinRM (Windows Remote Management)

Used for communicating with Hyper-V servers remotely.

```properties
winrm.port=5985
```

Ensure WinRM is enabled on all Hyper-V servers.

Example PowerShell setup:
```powershell
Enable-PSRemoting -Force
Set-Item WSMan:\localhost\Service\AllowUnencrypted $true
Set-Item WSMan:\localhost\Service\Auth\Basic $true
```
a helper script is in /powershell/winrm_helper.ps1

The WinRM user must have permissions to run administrative PowerShell scripts that can create, delete, or manage VMs.

---

### Active Directory / LDAP

Used for authenticating users via AD.

```properties
ad.url=ldap://${AD_URL}
ad.domain=${AD_URL}
ad.dn=${AD_DN}
ad.adminGroup=${ADMIN_GROUP}
```

- `ad.url` — LDAP connection URL  
- `ad.domain` — Active Directory domain name  
- `ad.dn` — Distinguished Name (base DN)  
- `ad.adminGroup` — CN of the admin group (for example `cn=AdminGroup`)  

---

### Hyper-V Server Configuration

Define each Hyper-V server connection under `app.teams[n]`.

Example:
```properties
app.teams[0].serverName=SERVER1
app.teams[0].serverAddress=${SERVER1_HOST}
app.teams[0].serverUsername=${SERVER1_USERNAME}
app.teams[0].serverPassword=${SERVER1_PASSWORD}

app.teams[1].serverName=SERVER2
app.teams[1].serverAddress=${SERVER2_HOST}
app.teams[1].serverUsername=${SERVER2_USERNAME}
app.teams[1].serverPassword=${SERVER2_PASSWORD}
```

You can define multiple servers, such as `app.teams[2]`, `app.teams[3]`, and so on.

---

### Shared ISO Directory
Specifies the directory where ISO files are stored for Hyper-V use.

```properties
iso.directory=${ISO_DIRECTORY}
```

---

### Performance and Timeout Settings
Optional tuning parameters for Tomcat server threads and request timeouts.

```properties
spring.mvc.async.request-timeout=120000
server.tomcat.connection-timeout=120000
server.tomcat.threads.max=200
server.tomcat.threads.min-spare=10
```

---

## Website Configuration

Located in `website/.env.example`.  
Rename this file to `.env` and update values accordingly.

Example:
```bash
NEXT_PUBLIC_SERVER_URL="https://yourdomain.com/api/v1"
NEXT_PUBLIC_DOMAIN="yourdomain.com"

NEXT_PUBLIC_LOGIN_BACKGROUND_IMAGE="https://yourdomain.com/background.jpg"
NEXT_PUBLIC_LOGO_URL="https://github.com/Stroooooo/StudentHV/raw/main/assets/logo.png"
```

---

## Deployment Notes

1. Rename example files:
   - `application.example.properties` → `application.properties`
   - `.env.example` → `.env`

2. Set environment variables for all placeholders like `${SERVER1_HOST}`, `${AD_URL}`, etc.

3. Ensure WinRM access from your API server to all configured Hyper-V servers.

4. Secure credentials:
   - Never commit `.env` or `application.properties` with real secrets.
   - Use environment variables or a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)

---

## Security Checklist

- Rotate `jwt.secret` regularly  
- Restrict WinRM access to trusted IPs  
- Use HTTPS for all communications  
- Disable unencrypted WinRM when running in a secure network  
- Verify CORS domain settings for production  

---

**Documentation:**  
Further documentation can be found in the `/docs` directory.

**Author:**  
Struan
