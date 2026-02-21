# 🛒 GESTIÓN DE PRODUCTOS 

Se crea un servidor que:
- Lee productos desde un archivo de texto
- Responde con JSON
- Solo acepta GET y POST
- Rechaza otros métodos con código 405

Y un cliente web que:
- Lista productos
- Ordena por nombre o precio
- Permite agregar nuevos productos

---

## 🛠️ TECNOLOGIAS

- Node.js 
- VS Code
- Navegador web

## 🌐 PROBAR EL SERVIDOR (CON EL NAVEGADOR)
http://localhost:3000/productos
## 🎨 USAR EL CLIENTE WEB
**Botón "LISTA DE ARTÍCULOS":**
- Carga todos los productos del servidor
- Los muestra con emojis 
**Botones de ordenamiento:**
- Ordenar por Nombre (A-Z)
- Ordenar por Precio (Menor a Mayor)
- Ordenar por Precio (Mayor a Menor)
**Formulario "AGREGAR NUEVO PRODUCTO":**
- Escribe nombre y precio
- Clic en "AGREGAR NUEVO PRODUCTO"
- Se agrega al archivo y recarga la lista

📁 gestion-productos/
├── 📄 productos.txt              ← Datos de productos
├── 📄 servidor-productos.js      ← Servidor Node.js
└── 📄 cliente-productos.html     ← Cliente web

================================================================
DESARROLLO DE APLICACIONES FULL STACK JAVASCRIPT TRAINEE V2.0

    ASTRID EVA PALOMINOS ESPINOZA 🚀
