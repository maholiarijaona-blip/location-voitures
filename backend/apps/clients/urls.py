from rest_framework.routers import DefaultRouter

from .views import ClientViewSet

router = DefaultRouter()
router.include_root_view = False
router.include_format_suffixes = False
router.register("clients", ClientViewSet, basename="client")

urlpatterns = router.urls
