from rest_framework import viewsets

from core.permissions import IsAdmin

from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAdmin]
    search_fields = ["nom", "prenom", "email", "telephone", "numero_permis"]
    ordering_fields = ["nom", "prenom", "email", "created_at"]
    ordering = ["nom", "prenom"]
