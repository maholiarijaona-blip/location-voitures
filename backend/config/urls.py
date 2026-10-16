from django.contrib import admin
from django.urls import include, path

from apps.dashboard.views import DashboardStatsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.comptes.urls")),
    path("api/dashboard/stats/", DashboardStatsView.as_view()),
    path("api/", include("apps.voitures.urls")),
    path("api/", include("apps.clients.urls")),
    path("api/", include("apps.locations.urls")),
    path("api/", include("apps.paiements.urls")),
]
