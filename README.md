# Registro de Vales QR

Sistema para escanear un código QR desde el celular y registrar el viaje de una
persona (fecha, dirección de origen, dirección de destino y empresa), guardando
todo automáticamente en Google Sheets — una pestaña (planilla) por empresa,
ordenada por fecha, nombre y direcciones.

## Archivos

- `index.html` — página que se abre desde el celular: escanea el QR, autocompleta
  nombre/empresa, y pide fecha + las dos direcciones.
- `generar-qr.html` — genera los códigos QR de cada persona (individual o en lote)
  para imprimir y entregar/pegar.
- `apps-script/Code.gs` — script que recibe los datos y los guarda en Google Sheets.

## Instalación (una sola vez)

### 1. Crear la Google Sheet
1. Andá a [sheets.google.com](https://sheets.google.com) y creá una hoja nueva,
   por ejemplo "Registro Vales QR".

### 2. Pegar el script
1. En esa hoja: **Extensiones > Apps Script**.
2. Borrá el contenido de `Code.gs` que aparece por defecto y pegá el contenido
   de `apps-script/Code.gs` de este proyecto.
3. Guardá el proyecto (ícono de disquete).

### 3. Publicar el script como aplicación web
1. Arriba a la derecha, botón **Implementar > Nueva implementación**.
2. Tipo: **Aplicación web**.
3. "Ejecutar como": **Yo (tu cuenta)**.
4. "Quién tiene acceso": **Cualquier usuario**.
5. Hacé clic en **Implementar** y autorizá los permisos que pida Google.
6. Copiá la **URL de la aplicación web** (termina en `/exec`).

### 4. Conectar la página con el script
1. Abrí `index.html` con un editor de texto.
2. Buscá la línea:
   ```js
   const APPS_SCRIPT_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
   ```
3. Reemplazá el texto entre comillas por la URL que copiaste en el paso anterior.

### 5. Publicar la página para usarla desde el celular
La cámara del celular solo funciona en páginas con **HTTPS**, así que hay que
subir `index.html` y `generar-qr.html` a un hosting. La forma más simple y
gratuita:

1. Andá a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastrá la carpeta `Vales qr` completa (o al menos los dos archivos `.html`).
3. Netlify te da una URL pública (ej. `https://tu-sitio.netlify.app`).
4. Abrí esa URL desde el navegador del celular.

(También podés usar GitHub Pages, Vercel, o cualquier hosting propio si ya
tenés uno.)

## Uso diario

1. **Generar los QR de las personas** (una sola vez por persona, o cuando cambie
   de empresa): abrí `generar-qr.html`, cargá nombre y empresa (o pegá una lista
   con formato `Nombre,Empresa`, una por línea), generá los QR e imprimilos.
2. **Registrar un viaje**: desde el celular, abrí `index.html`, escaneá el QR de
   la persona, completá la fecha/hora (se autocompleta con la actual, se puede
   editar), la dirección donde se encontraba y la dirección a la que se dirige,
   y tocá "Guardar registro".
3. Los datos quedan en la Google Sheet, en una pestaña por empresa, ordenados
   automáticamente por fecha, nombre y direcciones.

## Descargar el Excel final

En la Google Sheet: **Archivo > Descargar > Microsoft Excel (.xlsx)**.
Se descarga un solo archivo Excel donde cada empresa está en su propia pestaña.

## Notas

- Si una persona no tiene empresa cargada en su QR, sus registros van a la
  pestaña "Sin Empresa".
- El orden dentro de cada pestaña se recalcula automáticamente cada vez que se
  agrega un registro nuevo.
- Podés compartir el mismo `index.html` (URL de Netlify) entre varios celulares;
  todos escriben a la misma Google Sheet.
