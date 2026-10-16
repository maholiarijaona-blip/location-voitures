from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdmin

from .models import Location
from .serializers import LocationSerializer
from .services import LocationService


class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    filterset_fields = ["statut", "client", "voiture"]
    search_fields = ["client__nom", "client__prenom", "voiture__marque", "voiture__modele", "voiture__immatriculation"]
    ordering_fields = ["date_debut", "date_fin", "prix_total", "statut", "created_at"]
    ordering = ["-date_debut", "-id"]

    def get_permissions(self):
        if self.action in ("list", "retrieve", "create"):
            return [IsAuthenticated()]
        return [IsAdmin()]

    def get_queryset(self):
        queryset = Location.objects.select_related("client", "voiture").prefetch_related("paiements")
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(client__user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not request.user.is_staff:
            profil = getattr(request.user, "client_profile", None)
            if profil is None:
                raise PermissionDenied("Aucun profil client associé à ce compte.")
            data["client"] = profil.pk
            data["statut"] = Location.Statut.EN_COURS
            data["date_retour"] = None
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def perform_destroy(self, instance):
        LocationService.supprimer(instance)

    @action(detail=True, methods=["post"])
    def terminer(self, request, pk=None):
        location = LocationService.terminer(self.get_object())
        return Response(self.get_serializer(location).data)
