from django.db import models

class ConsultaDesperdicio(models.Model):
    productos_input = models.TextField()
    sugerencias_ia = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consulta {self.id} - {self.creado_en}"
