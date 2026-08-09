from django.contrib import admin
from events.models import Event, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "date", "price", "is_active")
    list_filter = ("category", "is_active", "date")
    search_fields = ("title", "description")
