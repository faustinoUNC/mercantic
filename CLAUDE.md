# CLAUDE.md — Instrucciones del proyecto

## Regla obligatoria al entregar cambios

Siempre que se realicen varios cambios en una misma sesión, al finalizar indicar al usuario **cómo probar y ver cada cambio**, con formato claro:

```
### Cómo probar

**[Nombre del cambio]**
- Dónde ir: /ruta o sección del panel
- Qué hacer: pasos concretos para verificarlo
- Qué debería verse: resultado esperado

**[Siguiente cambio]**
- ...
```

Ejemplo real:
> **Select de provincias en checkout**
> - Ir a https://mercantic.vercel.app/checkout
> - Agregar un producto al carrito y avanzar al paso "Tus Datos"
> - El campo Provincia debe ser un desplegable con las 24 provincias argentinas

Esto aplica siempre, sin que el usuario lo pida explícitamente.
