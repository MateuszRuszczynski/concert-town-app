from django.contrib import admin
from events.models import Event, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "starts_at", "price", "is_active")
    list_filter = ("category", "is_active", "starts_at")
    search_fields = ("title", "description")
