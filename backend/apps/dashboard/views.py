from rest_framework.response import Response
from rest_framework.views import APIView

from apps.locations.models import Location
from apps.locations.serializers import LocationSerializer
from apps.locations.services import LocationService

from .services import DashboardService


class DashboardStatsView(APIView):
    def get(self, request):
        LocationService.synchroniser_tout()
        user = request.user
        if user.is_staff:
            data = DashboardService.stats_admin()
            locations = Location.objects.all()
        else:
            profil = getattr(user, "client_profile", None)
            data = DashboardService.stats_client(profil)
            locations = Location.objects.filter(client=profil) if profil else Location.objects.none()
        dernieres = (
            locations.select_related("client", "voiture")
            .prefetch_related("paiements")
            .order_by("-created_at")[:6]
        )
        data["dernieres_locations"] = LocationSerializer(dernieres, many=True).data
        return Response(data)
