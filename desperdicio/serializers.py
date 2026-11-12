from rest_framework import serializers
from .models import ConsultaDesperdicio

class ConsultaDesperdicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaDesperdicio
        fields = ['id', 'productos_input', 'sugerencias_ia', 'creado_en']
