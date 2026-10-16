from rest_framework.routers import DefaultRouter

from .views import LocationViewSet

router = DefaultRouter()
router.include_root_view = False
router.include_format_suffixes = False
router.register("locations", LocationViewSet, basename="location")

urlpatterns = router.urls
