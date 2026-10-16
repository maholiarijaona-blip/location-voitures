from datetime import date

from django.core.validators import MinValueValidator
from django.db import models


class Paiement(models.Model):
    class Mode(models.TextChoices):
        ESPECES = "especes", "Espèces"
        CARTE = "carte", "Carte bancaire"
        MOBILE = "mobile_money", "Mobile money"
        VIREMENT = "virement", "Virement"

    location = models.ForeignKey(
        "locations.Location", on_delete=models.CASCADE, related_name="paiements"
    )
    montant = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(1)]
    )
    mode = models.CharField(max_length=15, choices=Mode.choices, default=Mode.ESPECES)
    date_paiement = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "paiement"
        ordering = ["-date_paiement", "-id"]

    def __str__(self):
        return f"Paiement #{self.pk} - {self.montant}"
