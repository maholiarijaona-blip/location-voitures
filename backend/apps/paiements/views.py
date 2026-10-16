from rest_framework import viewsets

from core.permissions import IsStaffOrReadOnly

from .models import Paiement
from .serializers import PaiementSerializer


class PaiementViewSet(viewsets.ModelViewSet):
    serializer_class = PaiementSerializer
    permission_classes = [IsStaffOrReadOnly]
    filterset_fields = ["mode", "location"]
    search_fields = [
        "location__client__nom", "location__client__prenom", "location__voiture__immatriculation",
    ]
    ordering_fields = ["montant", "date_paiement", "created_at"]
    ordering = ["-date_paiement", "-id"]

    def get_queryset(self):
        queryset = Paiement.objects.select_related(
            "location", "location__client", "location__voiture"
        ).prefetch_related("location__paiements")
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(location__client__user=self.request.user)
