from django.urls import path
from .views import GenerarSugerenciasView

urlpatterns = [
    path('sugerencias/', GenerarSugerenciasView.as_view(), name='generar-sugerencias'),
]
