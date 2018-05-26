#define CONFIG_PAGE "HTTP/1.0 200 OK\r\nContent-Type: text/html;charset=utf-8\r\n\r\n\
<html>\
<head>\
<title>Config</title>\
<meta charset='utf-8' />\
<meta name='viewport' content='width=device-width, initial-scale=1.0'>\
</head>\
<body>\
<h1>Config</h1>\
<div id='config'>\
<script>\
if(window.location.search.substr(1) != ''){\
document.getElementById('config').display = 'none';\
document.body.innerHTML ='<h1>Config</h1>The new settings have been sent to the device...';\
setTimeout(\"location.href = '/'\",10000);\
}\
</script>\
<h2>STA Settings</h2>\
<form>\
<table>\
<tr>\
<td>SSID:</td>\
<td><input type='text' name='ssid' value='%s'/></td>\
</tr>\
<tr>\
<td>Password:</td>\
<td><input type='text' name='password' value='%s'/></td>\
</tr>\
<tr>\
<td></td>\
<td><input type='submit' value='Connect'/></td>\
</tr>\
</table>\
</form>\
<h2>AP Settings</h2>\
<form>\
<table>\
<tr>\
<td>SSID:</td>\
<td><input type='text' name='ap_ssid' value='%s'/></td>\
</tr>\
<tr>\
<td>Password:</td>\
<td><input type='text' name='ap_password' value='%s'/></td>\
</tr>\
<tr>\
<td>Security:</td>\
<td>\
 <select name='ap_open'>\
 <option value='open'%s>Open</option>\
 <option value='wpa2'%s>WPA2</option>\
</select>\
</td>\
</tr>\
<tr>\
<td>Subnet:</td>\
<td><input type='text' name='network' value='%d.%d.%d.%d'/></td>\
</tr>\
<tr>\
<td></td>\
<td><input type='submit' value='Set' /></td>\
</tr>\
</table>\
<small>\
<i>Password: </i>min. 8 chars<br />\
</small>\
</form>\
\
<h2>MQTT Config</h2>\
<form>\
<table>\
<tr>\
<td>MQTT status:</td>\
<td>%s</td>\
</tr>\
<tr>\
<td>MQTT host:</td>\
<td><input type='text' name='mqtt_host' value='%s'/></td>\
</tr>\
<tr>\
<td>MQTT port:</td>\
<td><input type='text' name='mqtt_port' value='%u'/></td>\
</tr>\
<tr>\
<td></td>\
<td><input type='submit' value='Set'/></td>\
</tr>\
</table>\
</form>\
<form>\
<input type='submit' name='doreconncect' value='Reconnect MQTT'/>\
</form>\
<br/>\
\
<h2>Lock Config</h2>\
<form>\
<table>\
<tr>\
<td>Lock Device:</td>\
<td><input type='checkbox' name='lock' value='l'></td>\
</tr>\
<tr>\
<td></td>\
<td><input type='submit' name='dolock' value='Lock'/></td>\
</tr>\
</table>\
</form>\
\
<h2>Device Management</h2>\
<form>\
<table>\
<tr>\
<td>Reset Device:</td>\
<td><input type='submit' name='reset' value='Restart'/></td>\
</tr>\
</table>\
</form>\
</div>\
<script>\
var forms=document.querySelectorAll('form');\
for(var i=0;i<forms.length;i++) forms[i].onsubmit=req;\
function req(e){\
e.preventDefault();\
var ds=this.querySelectorAll('[name]');\
var data=[];\
for(var i=0;i<ds.length;i++){\
var d=ds[i];\
if(~['checkbox','radio'].indexOf(d.type.toLowerCase()) && !d.checked) continue;\
data.push(encodeURIComponent(d.getAttribute('name'))+'='+encodeURIComponent(d.value.replace(/\\s+/g, '\\x25\\x32\\x30')));\
}\
if(data.length<1) return alert('No params');\
data=data.join('&');\
var xhr=new XMLHttpRequest();\
xhr.open('GET','?'+data,true);\
xhr.onreadystatechange=function (){\
if(xhr.readyState==XMLHttpRequest.DONE&&xhr.status==200){\
alert('OK');\
}\
};\
xhr.send();\
}\
</script>\
</body>\
</html>\
"

#define LOCK_PAGE "HTTP/1.0 200 OK\r\nContent-Type: text/html;charset=utf-8\r\n\r\n\
<html>\
<head>\
<title>Locked</title>\
<meta charset='utf-8' />\
</head>\
<body>\
<h1>Config</h1>\
<div id='config'>\
<script>\
if (window.location.search.substr(1) != '')\
{\
document.getElementById('config').display = 'none';\
document.body.innerHTML ='<h1>Config</h1>Unlock request has been sent to the device...';\
setTimeout(\"location.href = '/'\",1000);\
}\
</script>\
<h2>Config Locked</h2>\
<form autocomplete='off' action='' method='GET'>\
<table>\
<tr>\
<td>Password:</td>\
<td><input type='password' name='unlock_password'/></td>\
</tr>\
<tr>\
<td></td>\
<td><input type='submit' value='Unlock'/></td>\
</tr>\
</table>\
<small>\
<i>Default: STA password to unlock<br />\
</small>\
</form>\
</div>\
</body>\
</html>\
"
