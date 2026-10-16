from decimal import Decimal

from django.db import models


class Location(models.Model):
    class Statut(models.TextChoices):
        EN_COURS = "en_cours", "En cours"
        TERMINEE = "terminee", "Terminée"
        ANNULEE = "annulee", "Annulée"

    client = models.ForeignKey(
        "clients.Client", on_delete=models.PROTECT, related_name="locations"
    )
    voiture = models.ForeignKey(
        "voitures.Voiture", on_delete=models.PROTECT, related_name="locations"
    )
    date_debut = models.DateField("date de début")
    date_fin = models.DateField("date de fin")
    date_retour = models.DateField("date de retour", null=True, blank=True)
    prix_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(max_length=15, choices=Statut.choices, default=Statut.EN_COURS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "location"
        ordering = ["-date_debut", "-id"]

    def __str__(self):
        return f"Location #{self.pk} - {self.client} - {self.voiture}"

    @property
    def nb_jours(self):
        return (self.date_fin - self.date_debut).days + 1

    @property
    def montant_paye(self):
        return sum((p.montant for p in self.paiements.all()), Decimal("0"))

    @property
    def reste_a_payer(self):
        return self.prix_total - self.montant_paye
