
$name = Read-Host "Name for user?"
$pass = Read-Host "Password for user?" -AsSecureString

Set-Item wsman:/localhost/service/auth/basic -value $true
Set-Item wsman:/localhost/service/allowunencrypted -value $true
Restart-Service winrm -Force

$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
$plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

net user $name $plainPass /add
net localgroup administrators $name /add

[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
Remove-Variable plainPass