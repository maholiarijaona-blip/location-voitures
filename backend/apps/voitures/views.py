from rest_framework import viewsets

from apps.locations.services import LocationService
from core.permissions import IsStaffOrReadOnly

from .models import Voiture
from .serializers import VoitureSerializer


class VoitureViewSet(viewsets.ModelViewSet):
    queryset = Voiture.objects.all()
    serializer_class = VoitureSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["statut"]
    search_fields = ["marque", "modele", "immatriculation", "couleur"]
    ordering_fields = ["marque", "modele", "annee", "prix_jour", "statut", "created_at"]
    ordering = ["marque", "modele"]

    def list(self, request, *args, **kwargs):
        LocationService.synchroniser_tout()
        return super().list(request, *args, **kwargs)
