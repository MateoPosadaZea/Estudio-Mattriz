# DNS de mattriz.com en Hostinger (respaldo antes del cutover)

Copia de los registros tal como estaban en Hostinger el 2026-09-26, antes de mover los nameservers
a Cloudflare. Sirve para comparar lo que importe Cloudflare y para volver atrás si hace falta.

Nameservers originales: `ns1.dns-parking.com`, `ns2.dns-parking.com`.

| Tipo  | Nombre                        | Prioridad | Contenido                                   | TTL   | Para qué |
|-------|-------------------------------|-----------|---------------------------------------------|-------|----------|
| MX    | @                             | 1         | `SMTP.GOOGLE.COM`                           | 14400 | Correo (Google Workspace). **No tocar.** |
| TXT   | @                             |           | `v=spf1 include:_spf.google.com ~all`       | 14400 | SPF. **No tocar.** |
| TXT   | google._domainkey             |           | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtAy/4LkKNDKinvHpcq35E8UYjD7nAylZQsiElLMefv1w8NGz+gTa+CY8Xw09Yfv3pVdLwF9IMKe1L/L2Bcn0wXF/KFq5akJ2Rb9KFlczDirrZtHQhOEtYRq9tjMk1kOgYjlVaXcqb0YMEtc6FkuhDWgPeYqRCnkyiUnNbNc3EfZ9J41ahSd/20Wj1efyb6agPJTeHR5PhqsBLAh9ZnLPna5OfF6rqgd12TQ288QjZ63ux0RbgX9bLCCiXUWvqYMyEe+Z06ldfYpsHIXKd3co+2H9EwBdL63fz2GHHh6TtMWepgvcIheJo/X710mexEwJq4HZy1ho2Ch9M237clVZJwIDAQAB` | 3600 | DKIM de Google. **No tocar; copiar exacto.** |
| TXT   | _dmarc                        |           | `v=DMARC1; p=none; adkim=s; aspf=s`         | 14400 | DMARC. **No tocar.** |
| ALIAS | @                             |           | `mattriz.com.cdn.hstgr.net`                 | 300   | Sitio WordPress (CDN de Hostinger). Se cambia al Worker en el cutover. |
| CNAME | www                           |           | `www.mattriz.com.cdn.hstgr.net`             | 300   | Sitio WordPress. Pasa a redirigir a mattriz.com. |
| A     | ftp                           |           | `185.214.127.162`                           | 1800  | Servidor de Hostinger (FTP / WordPress). |
| CNAME | hostingermail-a._domainkey    |           | `hostingermail-a.dkim.mail.hostinger.com`   | 300   | Correo de Hostinger (sin uso con Google; se conserva). |
| CNAME | hostingermail-b._domainkey    |           | `hostingermail-b.dkim.mail.hostinger.com`   | 300   | Ídem. |
| CNAME | hostingermail-c._domainkey    |           | `hostingermail-c.dkim.mail.hostinger.com`   | 300   | Ídem. |
| CNAME | autodiscover                  |           | `autodiscover.mail.hostinger.com`           | 300   | Ídem. |
| CNAME | autoconfig                    |           | `autoconfig.mail.hostinger.com`             | 300   | Ídem. |

## Al importar en Cloudflare

- Todos los registros en **DNS only** (nube gris) hasta el cutover.
- El `ALIAS @` de Hostinger en Cloudflare es un `CNAME @` (Cloudflare lo aplana).
- Verificar que el DKIM de Google quede completo (Cloudflare a veces lo parte en dos cadenas; está bien
  si al unirlas queda idéntico).

## Cambio de nameservers (2026-09-26)

- Registros revisados en Cloudflare: 12, todos en DNS only. El `ALIAS @` quedó como
  `CNAME @ → mattriz.com.cdn.hstgr.net` (se borraron los A/AAAA que importó Cloudflare).
- Nameservers de Cloudflare puestos en Hostinger: `casey.ns.cloudflare.com`, `gail.ns.cloudflare.com`.
- El dominio sigue registrado en Hostinger (la renovación se paga allá). Al cancelar el hosting,
  no cancelar el dominio.
- Para volver atrás: en Hostinger, poner de nuevo `ns1.dns-parking.com` y `ns2.dns-parking.com`.

## Cutover (2026-09-26)

- `mattriz.com` es un Custom domain del Worker `mattriz-studio` (se borró el `CNAME @` a Hostinger).
- `www` (CNAME a Hostinger, ahora con proxy) + Redirect Rule 301 `https://www.mattriz.com/*` →
  `https://mattriz.com/${1}`, conservando la query string.
- Redirect Rule 301 `http://mattriz.com/*` → `https://mattriz.com/${1}` (Always Use HTTPS no alcanzaba
  al dominio del Worker).
- Correo (MX, SPF, DKIM, DMARC) sin cambios.
- Para volver atrás: quitar el Custom domain del Worker y crear de nuevo
  `CNAME @ → mattriz.com.cdn.hstgr.net` (DNS only). El hosting de Hostinger se mantiene 30 días.
