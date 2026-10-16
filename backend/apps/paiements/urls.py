from rest_framework.routers import DefaultRouter

from .views import PaiementViewSet

router = DefaultRouter()
router.include_root_view = False
router.include_format_suffixes = False
router.register("paiements", PaiementViewSet, basename="paiement")

urlpatterns = router.urls
