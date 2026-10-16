from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Voiture(models.Model):
    class Statut(models.TextChoices):
        DISPONIBLE = "disponible", "Disponible"
        LOUEE = "louee", "Louée"
        MAINTENANCE = "maintenance", "En maintenance"

    marque = models.CharField(max_length=60)
    modele = models.CharField("modèle", max_length=60)
    immatriculation = models.CharField(max_length=20, unique=True)
    annee = models.PositiveSmallIntegerField(
        "année", validators=[MinValueValidator(1990), MaxValueValidator(2100)]
    )
    couleur = models.CharField(max_length=30, blank=True, default="")
    prix_jour = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(1)]
    )
    statut = models.CharField(max_length=15, choices=Statut.choices, default=Statut.DISPONIBLE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "voiture"
        ordering = ["marque", "modele"]

    def __str__(self):
        return f"{self.marque} {self.modele} ({self.immatriculation})"
