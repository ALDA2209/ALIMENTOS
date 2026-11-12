import json
import re
import time
from google import genai
from google.genai import errors
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ConsultaDesperdicio
from .serializers import ConsultaDesperdicioSerializer

client = genai.Client(api_key=settings.GEMINI_API_KEY)

MAX_REINTENTOS = 3
ESPERA_SEGUNDOS = 5


def limpiar_json(texto):
    texto = texto.strip()
    texto = re.sub(r'^```json\s*', '', texto)
    texto = re.sub(r'^```\s*', '', texto)
    texto = re.sub(r'```\s*$', '', texto)
    return texto.strip()


class GenerarSugerenciasView(APIView):
    def post(self, request):
        productos = request.data.get('productos', '')
        if not productos:
            return Response(
                {'error': 'Debes enviar la lista de productos.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        prompt = (
            "Eres un asistente que ayuda a reducir el desperdicio de alimentos. "
            "Responde UNICAMENTE con un JSON valido, sin texto adicional y sin bloques de codigo, "
            "con esta estructura exacta: "
            '{"prioridad": ["item en orden de consumo", ...], '
            '"recetas": [{"item": "nombre", "receta": "sugerencia breve"}], '
            '"alertas": ["alerta urgente", ...]}. '
            f"Inventario:\n{productos}"
        )

        texto_respuesta = None
        ultimo_error = None

        for intento in range(MAX_REINTENTOS):
            try:
                respuesta = client.models.generate_content(
                    model='gemini-3.8-flash',
                    contents=prompt
                )
                texto_respuesta = respuesta.text
                break
            except errors.ServerError as e:
                ultimo_error = str(e)
                if intento < MAX_REINTENTOS - 1:
                    time.sleep(ESPERA_SEGUNDOS)

        if texto_respuesta is None:
            return Response(
                {'error': f'Gemini no esta disponible ahora mismo: {ultimo_error}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            datos = json.loads(limpiar_json(texto_respuesta))
        except json.JSONDecodeError:
            datos = {'prioridad': [], 'recetas': [], 'alertas': []}

        consulta = ConsultaDesperdicio.objects.create(
            productos_input=productos,
            sugerencias_ia=texto_respuesta
        )

        return Response(
            {
                'id': consulta.id,
                'prioridad': datos.get('prioridad', []),
                'recetas': datos.get('recetas', []),
                'alertas': datos.get('alertas', []),
            },
            status=status.HTTP_201_CREATED
        )

    def get(self, request):
        consultas = ConsultaDesperdicio.objects.all().order_by('-creado_en')[:20]
        serializer = ConsultaDesperdicioSerializer(consultas, many=True)
        return Response(serializer.data)
