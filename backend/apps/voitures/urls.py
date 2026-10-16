from rest_framework.routers import DefaultRouter

from .views import VoitureViewSet

router = DefaultRouter()
router.include_root_view = False
router.include_format_suffixes = False
router.register("voitures", VoitureViewSet, basename="voiture")

urlpatterns = router.urls
