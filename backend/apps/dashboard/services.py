from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from apps.clients.models import Client
from apps.locations.models import Location
from apps.paiements.models import Paiement
from apps.voitures.models import Voiture


class DashboardService:
    @staticmethod
    def stats_admin():
        aujourdhui = timezone.localdate()
        total = Paiement.objects.aggregate(t=Sum("montant"))["t"] or Decimal("0")
        ce_mois = (
            Paiement.objects.filter(
                date_paiement__year=aujourdhui.year, date_paiement__month=aujourdhui.month
            ).aggregate(t=Sum("montant"))["t"]
            or Decimal("0")
        )
        return {
            "role": "admin",
            "total_voitures": Voiture.objects.count(),
            "voitures_disponibles": Voiture.objects.filter(statut=Voiture.Statut.DISPONIBLE).count(),
            "total_clients": Client.objects.count(),
            "locations_en_cours": Location.objects.filter(statut=Location.Statut.EN_COURS).count(),
            "revenus_ce_mois": float(ce_mois),
            "revenus_total": float(total),
        }

    @staticmethod
    def stats_client(client):
        if client is None:
            return {
                "role": "client",
                "mes_locations": 0,
                "locations_en_cours": 0,
                "total_paye": 0,
                "reste_a_payer": 0,
            }
        locations = Location.objects.filter(client=client)
        valides = locations.exclude(statut=Location.Statut.ANNULEE)
        total_du = valides.aggregate(t=Sum("prix_total"))["t"] or Decimal("0")
        paye = Paiement.objects.filter(location__in=valides).aggregate(t=Sum("montant"))["t"] or Decimal("0")
        return {
            "role": "client",
            "mes_locations": locations.count(),
            "locations_en_cours": locations.filter(statut=Location.Statut.EN_COURS).count(),
            "total_paye": float(paye),
            "reste_a_payer": float(total_du - paye),
        }
